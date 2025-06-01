# Nuxt Content SQLite Database Structure

## Overview

Nuxt Content automatically generates a SQLite database to store and manage content metadata and parsed content. The database is created in `.nuxt/content/sql_dump` and contains structured information about all content files in the project.

## Database Tables

### 1. `_content_info` Table

**Purpose**: Stores metadata about the content system and collection checksums.

**Structure**:
```sql
CREATE TABLE IF NOT EXISTS _content_info (
  id TEXT PRIMARY KEY,
  "ready" BOOLEAN,
  "structureVersion" VARCHAR,
  "version" VARCHAR,
  "__hash__" TEXT UNIQUE
);
```

**Fields**:
- `id`: Primary key, typically follows pattern `checksum_{collection_name}`
- `ready`: Boolean indicating if the collection is ready for queries
- `structureVersion`: Hash representing the current structure version
- `version`: Nuxt Content version (e.g., 'v3.5.0--rNFosQZcfY4CxkPJ1cZ9_PzMypXw5NFNNczFJtPSiKw')
- `__hash__`: Unique hash for change detection

**Example Data**:
```sql
INSERT INTO _content_info VALUES (
  'checksum_blog', 
  false, 
  'CHHEwqq6GE7sww62ji-kBIJxhSm2aTA4ONEzG3qAY_Q', 
  'v3.5.0--rNFosQZcfY4CxkPJ1cZ9_PzMypXw5NFNNczFJtPSiKw', 
  'h_5WSXYBIy1AB-2HZZ1BwdmtCRF1unU_hXvdnn2tD_4'
);
```

### 2. `_content_{collection}` Tables

**Purpose**: Stores the actual content data for each collection (e.g., `_content_blog` for blog posts).

**Structure** (using blog collection as example):
```sql
CREATE TABLE IF NOT EXISTS _content_blog (
  id TEXT PRIMARY KEY,
  "title" VARCHAR,
  "body" TEXT,
  "date" VARCHAR,
  "description" VARCHAR,
  "extension" VARCHAR,
  "lastModified" DATE,
  "meta" TEXT,
  "navigation" TEXT DEFAULT true,
  "path" VARCHAR,
  "readingTime" INT,
  "seo" TEXT DEFAULT '{}',
  "stem" VARCHAR,
  "tags" TEXT,
  "wordCount" INT,
  "__hash__" TEXT UNIQUE
);
```

## Field Definitions

### Core Content Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Primary key, typically the file path (e.g., 'blog/blog/fascinating-world-of-cats.md') |
| `title` | VARCHAR | Content title extracted from frontmatter or first heading |
| `body` | TEXT | Parsed content body in JSON format with AST structure |
| `date` | VARCHAR | Publication date from frontmatter |
| `description` | VARCHAR | Content description/excerpt |
| `extension` | VARCHAR | File extension (e.g., 'md', 'vue') |
| `lastModified` | DATE | File modification timestamp |
| `path` | VARCHAR | URL path for the content (e.g., '/blog/fascinating-world-of-cats') |
| `stem` | VARCHAR | File stem without extension |
| `__hash__` | TEXT | Unique hash for content change detection |

### Computed Fields

| Field | Type | Description |
|-------|------|-------------|
| `readingTime` | INT | Estimated reading time in minutes |
| `wordCount` | INT | Total word count of the content |

### Metadata Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `meta` | TEXT | '{}' | Additional metadata in JSON format |
| `navigation` | TEXT | true | Navigation visibility settings |
| `seo` | TEXT | '{}' | SEO metadata in JSON format |
| `tags` | TEXT | NULL | Content tags in JSON array format |

## Content Body Structure

The `body` field contains parsed content in a structured JSON format representing an Abstract Syntax Tree (AST). This includes:

### AST Structure
```json
{
  "type": "minimal",
  "value": [
    ["h1", {"id": "heading-id"}, "Heading Text"],
    ["p", {}, "Paragraph content with ", ["strong", {}, "bold text"]],
    ["ul", {}, [
      ["li", {}, "List item 1"],
      ["li", {}, "List item 2"]
    ]]
  ],
  "toc": {
    "title": "",
    "searchDepth": 2,
    "depth": 2,
    "links": [...]
  }
}
```

### Table of Contents (TOC)
The `toc` object contains:
- `title`: TOC title
- `searchDepth`: Maximum depth for search indexing
- `depth`: Maximum heading depth
- `links`: Array of heading links with hierarchy

## SEO Metadata Structure

The `seo` field contains SEO-specific metadata:
```json
{
  "title": "Page Title",
  "description": "Page description for meta tags"
}
```

## Tags Structure

Tags are stored as JSON arrays:
```json
["tag1", "tag2", "tag3"]
```

## Database Operations

### Content Refresh Process
1. `DROP TABLE IF EXISTS _content_{collection}` - Remove existing table
2. `CREATE TABLE IF NOT EXISTS _content_{collection}` - Recreate table structure
3. `INSERT INTO _content_{collection} VALUES (...)` - Insert all content records
4. `UPDATE _content_info SET ready = true WHERE id = 'checksum_{collection}'` - Mark as ready

### Change Detection
- Each content item has a `__hash__` field for change detection
- The `_content_info` table tracks overall collection changes
- Only modified content triggers database updates

## Performance Considerations

### Indexing
- Primary keys on `id` fields provide fast lookups
- Unique constraints on `__hash__` fields prevent duplicates

### Query Optimization
- Use `path` field for URL-based lookups
- Use `tags` field for category filtering
- Use `title`, `description` for search functionality

## Common Query Patterns

### Get Content by Path
```sql
SELECT * FROM _content_blog WHERE path = '/blog/my-post';
```

### Search Content
```sql
SELECT * FROM _content_blog 
WHERE title LIKE '%search%' 
   OR description LIKE '%search%' 
ORDER BY lastModified DESC;
```

### Get Content by Tags
```sql
SELECT * FROM _content_blog 
WHERE tags LIKE '%"target-tag"%';
```

### Get Recent Content
```sql
SELECT * FROM _content_blog 
ORDER BY date DESC 
LIMIT 10;
```

## Integration with Nuxt Content API

The database structure directly supports Nuxt Content's query API:

- `queryContent()` - Queries the appropriate collection table
- `findOne()` - Uses primary key or path lookups
- `where()` - Translates to SQL WHERE clauses
- `sort()` - Translates to SQL ORDER BY clauses
- `limit()` - Translates to SQL LIMIT clauses

## File Location

- **Database File**: `.nuxt/content/sql_dump`
- **Generated During**: Development and build processes
- **Regenerated When**: Content files change or structure updates

## Notes

- The database is automatically managed by Nuxt Content
- Manual modifications will be overwritten on next content refresh
- The structure may vary based on content frontmatter fields
- Custom frontmatter fields are typically stored in the `meta` JSON field 