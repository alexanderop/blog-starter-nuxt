import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'

interface SqliteQueryRequestBody {
  query: string
}

interface SqliteQuerySuccessResponse {
  data: Record<string, unknown>[]
}

interface SqliteQueryErrorResponse {
  error: string
}

type SqliteQueryResponse = SqliteQuerySuccessResponse | SqliteQueryErrorResponse

const NUXT_ROOT = process.cwd()
const DEFAULT_DB_PATH = path.join(NUXT_ROOT, '.data/content/contents.sqlite')
const DB_PATH_CONFIG = process.env.NUXT_CONTENT_DB_PATH || DEFAULT_DB_PATH

export default defineEventHandler(async (event): Promise<SqliteQueryResponse> => {
  if (process.env.NODE_ENV === 'production') {
    setResponseStatus(event, 403)
    return { error: 'This endpoint is disabled in production for security reasons unless properly secured.' }
  }

  const body = await readBody<SqliteQueryRequestBody>(event)
  const query = body.query

  if (!query) {
    setResponseStatus(event, 400)
    return { error: 'Query is required' }
  }

  if (!fs.existsSync(DB_PATH_CONFIG)) {
    setResponseStatus(event, 500)
    return { error: `Database file not found at ${DB_PATH_CONFIG}. Ensure Nuxt Content has initialized it by running the dev server first.` }
  }

  const dbResult = tryCatchSync(() => new Database(DB_PATH_CONFIG, { readonly: true }))
  
  if (dbResult.error) {
    console.error('Failed to open database:', dbResult.error)
    setResponseStatus(event, 500)
    return { error: 'Failed to open database: ' + dbResult.error.message }
  }

  const db = dbResult.data

  const queryResult = tryCatchSync(() => {
    const stmt = db.prepare(query)
    let data: Record<string, unknown>[] = []

    if (stmt.reader) {
      data = stmt.all() as Record<string, unknown>[]
    } else {
      const info = stmt.run()
      data = [{ changes: info.changes, lastInsertRowid: info.lastInsertRowid }]
    }

    return data
  })

  db.close()

  if (queryResult.error) {
    console.error('Query execution error:', queryResult.error)
    setResponseStatus(event, 400)
    return { error: queryResult.error.message }
  }

  return { data: queryResult.data }
}) 