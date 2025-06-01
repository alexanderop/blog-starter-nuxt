export interface SqliteQueryRequestBody {
  query: string
}

export interface SqliteQuerySuccessResponse {
  data: Record<string, unknown>[]
}

export interface SqliteQueryErrorResponse {
  error: string
}

export type SqliteQueryResponse = SqliteQuerySuccessResponse | SqliteQueryErrorResponse

export interface FetchError extends Error {
  data?: {
    message?: string
    data?: unknown
  }
} 