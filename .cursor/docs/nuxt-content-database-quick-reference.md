# Nuxt Content Database Quick Reference

## Table Overview

| Table | Purpose |
|-------|---------|
| `_content_info` | System metadata and collection status |
| `_content_{collection}` | Actual content data (e.g., `_content_blog`) |

## Key Fields Quick Reference

### Essential Content Fields
```sql
id              -- File path (e.g., 'blog/post.md')
title           -- Content title
body            -- Parsed content (JSON AST)
path            -- URL path (e.g., '/blog/post')
date            -- Publication date
description     -- Content excerpt
tags            -- Tags array (JSON)
```

### Computed Fields
```sql
readingTime     -- Minutes to read (INT)
wordCount       -- Total words (INT)
lastModified    -- File timestamp
```

### System Fields
```sql
extension       -- File extension ('md', 'vue')
stem            -- Filename without extension
meta            -- Custom frontmatter (JSON)
seo             -- SEO metadata (JSON)
navigation      -- Navigation settings
__hash__        -- Change detection hash
```

## Common Nuxt Content Queries → SQL Mapping

| Nuxt Content API | SQL Equivalent |
|------------------|----------------|
| `queryContent('blog')` | `SELECT * FROM _content_blog` |
| `.where({ title: 'My Post' })` | `WHERE title = 'My Post'` |
| `.sort({ date: -1 })` | `ORDER BY date DESC` |
| `.limit(5)` | `LIMIT 5` |
| `.find()` | Full query execution |
| `.findOne()` | `LIMIT 1` |

## JSON Field Structures

### Body (AST)
```json
{
  "type": "minimal",
  "value": [["h1", {"id": "title"}, "Title"]],
  "toc": { "links": [...] }
}
```

### Tags
```json
["vue", "nuxt", "development"]
```

### SEO
```json
{
  "title": "Page Title",
  "description": "Meta description"
}
```

## File Location
```
.nuxt/content/sql_dump
```

## Development Tips

1. **Database regenerates** on content changes
2. **Don't modify directly** - changes will be lost
3. **Use Nuxt Content API** instead of direct SQL
4. **Check `.nuxt/content/`** for database files
5. **Hash fields** are for internal change detection 