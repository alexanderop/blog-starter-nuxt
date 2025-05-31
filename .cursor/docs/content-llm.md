# Nuxt Content v3

Welcome to Nuxt Content v3, a major upgrade that brings enhanced performance and innovative features to your Nuxt projects. This latest iteration of our Git-based CMS is optimized for modern application development.

## What's New?

### Content Collections

Collections organize related items within your project, helping you manage large datasets more efficiently. Key benefits include:

- **Structured Data**: Configure database architecture and define collections in [`content.config.ts`](https://content.nuxt.com/docs/collections/define#defining-collections)
- **Type-safe Queries**: Direct TypeScript integration across all utilities
- **Automatic Validation**: Ensure data consistency across frontmatter fields and data files (json, yml...)
- **Advanced Query Builder**: Filter, sort, and paginate your collections with ease
- **Studio Integration**: Enhanced form generation and optimal editing experience through [Studio](https://content.nuxt.com/studio)

Learn more about [Content Collections](https://content.nuxt.com/docs/collections/define).

### Improved Performance

A significant challenge in v2 was the large bundle size needed for storing files, particularly affecting serverless deployments.

V3 addresses this by transitioning to SQL-based storage in production. This switch requires zero configuration, supporting development mode, static generation, server hosting, serverless and edge deployments.

::prose-note
The new database system enhances the way your data files are stored and structured, ensuring better performance and scalability. This update is entirely behind the scenes and does not affect the file types you can use in Content (`yml`, `json`, and `markdown` ).
::

Benefits include:

- **Optimized Queries**: SQL storage enables ultra-fast data retrieval
- **Universal Compatibility**: Our adapter-based system integrates SQL databases across all deployment modes ([server](https://content.nuxt.com/docs/deploy/server), [serverless](https://content.nuxt.com/docs/deploy/serverless) and [static](https://content.nuxt.com/docs/deploy/static)). We welcome community contributions for additional adapters.

### TypeScript Integration

The new collections system provides automatic TypeScript types for all your data. Every utility and API is strongly typed based on your collection definitions, ensuring robust type safety throughout development.

### Nuxt Studio Integration :badge[Soon]{color="neutral"}

[Nuxt Studio](https://content.nuxt.com/docs/studio/setup) and v3 are designed to complement each other perfectly.. The [studio module](https://github.com/nuxtlabs/studio-module){rel="nofollow"} is now integrated directly into Nuxt Content, creating an ideal environment where developers can focus on code while team members manage content through an intuitive interface.

---

We're excited for you to explore these new capabilities. Dive into our documentation to learn more about integrating the module and implementing best practices in your next project.

## Content V2 Migration

Learn how to migrate from Content v2 to v3 in the [migration guide](https://content.nuxt.com/docs/getting-started/migration).


# Installation

### Install the Package

Choose your preferred package manager to install Nuxt Content v3:

::code-group
```bash [pnpm]
pnpm add @nuxt/content
```

```bash [yarn]
yarn add @nuxt/content
```

```bash [npm]
npm install @nuxt/content
```

```bash [bun]
bun add @nuxt/content
```
::

### Register the Module

Add the Nuxt Content module to your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content']
})
```

### Automatic Setup

When starting a new Nuxt project with the `create-nuxt` CLI, you can simply select `@nuxt/content` from the interactive module selector. This will automatically install and register the module for you.

::code-group
```bash [npm]
npm create nuxt <project-name>
```

```bash [yarn]
yarn create nuxt <project-name>
```

```bash [pnpm]
pnpm create nuxt <project-name>
```

```bash [bun]
bun create nuxt <project-name>
```

```bash [deno]
deno -A npm:create-nuxt@latest <project-name>
```
::

### Create your First Collection

Create a `content.config.ts` file in your project root directory:

```ts [content.config.ts]
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    })
  }
})
```

This configuration creates a default `content` collection that processes all Markdown files located in the `content` folder of your project. You can customize the collection settings based on your needs.

::tip
The `type: page` means there is a 1-to-1 relationship between content files and pages on your site.
::

::note{to="https://content.nuxt.com/docs/collections/define"}
Learn more in our **Collections guide**.
::

### Create your First Markdown Page

Create a `content/index.md` file in your project root directory:

```md [content/index.md]
# My First Page

Here is some content.
```

Read more about writing [Markdown pages](https://content.nuxt.com/docs/files/markdown).

### Display your Page

Create a `pages/index.vue` file and display the page content:

```vue [pages/index.vue]
<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <ContentRenderer v-if="home" :value="home" />
  <div v-else>Home not found</div>
</template>
```

::note{icon="i-lucide-info"}
If you are installing Nuxt Content in a new Nuxt project and you didn't have `pages` directory, you also need to update the `app.vue` file to allow rendering the pages by adding the `NuxtPage` component. (If you already have some pages in your project, you are good to go.)

```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```
::

::tip{icon="i-lucide-rocket"}
That's it! You've now created your first Nuxt Content page.
::


# Configuration

To configure the content module and customize its behavior, you can use the `content` property in your `nuxt.config`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    // Options
  }
})
```

::note{to="https://github.com/nuxt-modules/mdc#configurations"}
In addition to configuring via `content.markdown`, you can use Markdown Components (MDC) to customize the rendering of Markdown elements with `mdc` property.
::

## `build`

Nuxt Content read and parse all the available contents at build time. This option gives you control over parsing contents.

### `markdown`

Configure markdown parser.

#### `toc`

::code-group
```ts [Default]
toc: {
  depth: 2,
  searchDepth: 2
}
```

```ts [Signature]
type Toc = {
  depth: number
  searchDepth: number
}
```
::

Control behavior of Table of Contents generation.

Value:

- `depth`: Maximum heading depth to include in the table of contents.
- `searchDepth`: Maximum depth of nested tags to search for heading.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        }
      }
    }
  }
})
```

#### `remarkPlugins`

::code-group
```ts [Default]
remarkPlugins: {}
```

```ts [Signature]
type RemarkPlugins = Record<string, false | MarkdownPlugin>
```
::

A list of [remark](https://github.com/remarkjs/remark){rel="nofollow"} plugins to use.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        // Object syntax can be used to override default options
        remarkPlugins: {
          // Override remark-emoji options
          'remark-emoji': {
            options: {
              emoticon: true
            }
          },
          // Disable remark-gfm
          'remark-gfm': false,
          // Add remark-oembed
          'remark-oembed': {
            // Options
          }
        },
      }
    }
  }
})
```

#### `rehypePlugins`

::code-group
```ts [Default]
rehypePlugins: {}
```

```ts [Signature]
type RehypePlugins = object
```
::

A list of [rehype](https://github.com/remarkjs/remark-rehype){rel="nofollow"} plugins to use.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        // Object syntax can be used to override default options
        rehypePlugins: {
          'rehype-figure': {

          }
        },
      }
    }
  }
})
```

#### `highlight`

::code-group
```ts [Default]
highlight: false
```

```ts [Signature]
type Highlight = false | object
```
::

Nuxt Content uses [Shiki](https://github.com/shikijs/shiki){rel="nofollow"} to provide syntax highlighting for [`ProsePre`](https://content.nuxt.com/docs/components/prose#prosepre) and [`ProseCode`](https://content.nuxt.com/docs/components/prose#prosecode).

| Option  | Type                                         | Description                                                                                                                      |
| ------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `theme` | `ShikiTheme` or `Record<string, ShikiTheme>` | The [color theme](https://github.com/shikijs/shiki/blob/main/docs/themes.md){rel="nofollow"} to use.                             |
| `langs` | `ShikiLang[]`                                | The [loaded languages](https://github.com/shikijs/shiki/blob/main/docs/languages.md){rel="nofollow"} available for highlighting. |

- `highlight.theme`

Theme can be specified by a single string but also supports an object with multiple themes.

This option is compatible with [Color Mode module](https://color-mode.nuxtjs.org/){rel="nofollow"}.

If you are using multiple themes, it's recommended to always have a `default` theme specified.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: 'github-light',
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai'
          }
        }
      }
    }
  }
})
```

- `highlight.langs`

By default, the module loads a couple of languages for syntax highlighting:

```ts [Default]
['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml']
```

If you plan to use code samples of other languages, you need to define the language in these options.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            'c',
            'cpp',
            'java'
          ]
        }
      }
    }
  }
})
```

If you wish to add highlighting for an unsupported language, you can do so by loading the grammar file for the language.

```ts [nuxt.config.ts]
import { readFileSync } from 'node:fs'

export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            // Read more about Shiki languages: https://shiki.style/guide/load-lang
            JSON.parse(
              readFileSync('./shiki/languages/gdscript.tmLanguage.json', 'utf-8'),
            ),
          ]
        }
      }
    }
  }
})
```

Read more about adding languages in the [Shiki documentation](https://github.com/shikijs/shiki/blob/main/docs/languages.md#adding-grammar){rel="nofollow"}.

### `pathMeta`

Content module uses files path to generate the slug, default title and content order, you can customize this behavior with `pathMeta` option.

#### `pathMeta.forceLeadingSlash`

If set to `true`, the path will be prefixed with a leading slash. Default value is `true`.

#### `pathMeta.slugifyOptions`

Content module uses [slugify](https://github.com/simov/slugify){rel="nofollow"} to generate the slug, you can customize the behavior of slugify with this option.

Checkout [slugify options](https://github.com/simov/slugify#options){rel="nofollow"} for more information.

### `transformers`

Nuxt Content has specific transformers for each content type to parse the raw content and prepare it for querying and rendering. Using this option you can define custom transformers to support new content types or improve functionalities of supported content types.

::code-group
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      transformers: [
        '~/transformers/title-suffix',
      ],
    },
  },
})
```

```ts [~/transformers/title-suffix.ts]
import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'title-suffix',
  extensions: ['.md'],
  transform(file) {
    return {
      ...file,
      title: file.title + ' (suffix)',
    }
  },
})
```
::

## `database`

By default Nuxt Content uses a local SQLite database to store and query content. If you like to use another database or you plan to deploy on Cloudflare Workers, you can modify this option.

Here is the list of supported database adapters:

### `SQLite`

If you want to change the default database location and move it to elsewhere you can use `sqlite` adapter to do so. This is the default value to the `database` option. Depending on your runtime-environment different sqlite adapters will be used (Node: better-sqlite-3, Bun: bun\:sqlite).

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    database: {
      type: 'sqlite',
      filename: 'SQLITE_DB_LOCATION'
    }
  }
})
```

### `D1`

If you plan to deploy your application to Cloudflare workers, you need to use the `d1` database adapter. Create a `d1` binding in the Cloudflare dashboard and fill in the `bindingName` field.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    database: {
      type: 'd1',
      bindingName: 'CF_BINDING_NAME'
    }
  }
})
```

### `Postgres`

If you plan to deploy your application using PostgreSQL database you need to use the `postgres` database adapter.

First, make sure to install the `pg` package:

```bash [Terminal]
npx npm i pg
```

Then, configure the `postgres` adapter in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    database: {
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      /* Other options for `pg` */
    }
  }
})
```

### `LibSQL`

If you plan to deploy your application using a LibSQL database you need to use the `libsql` database adapter.

First, make sure to install the `@libsql/client` package:

```bash [Terminal]
npx npm i @libsql/client
```

Then, configure the `libsql` adapter in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    database: {
      type: 'libsql',
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    }
  }
})
```

::note
The most popular LibSQL hosting services is [Turso](https://turso.tech/){rel="nofollow"}.
::

## `renderer`

Configure content renderer.

### `anchorLinks`

::code-group
```ts [Default]
{ h2: true, h3: true, h4: true }
```

```ts [Signature]
type AnchorLinks = boolean | Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', boolean>
```
::

Control anchor link generation, by default it generates anchor links for `h2`, `h3` and `h4` heading

Value:

- `false`: will disable link generation.
- `true`: will enable link generation for all headings.

### `alias`

::code-group
```ts [Default]
alias: {}
```

```ts [Signature]
type Alias = Record<string, string>
```
::

Aliases will be used to replace markdown components and render custom components instead of default ones.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    renderer: {
      alias: {
        p: 'MyCustomParagraph'
      }
    }
  }
})
```

## `watch`

```ts [Default]
watch: {
  enabled: true,
  port: 4000,
  showURL: false
}
```

Configure content hot reload in development.

Value:

- `enabled`: Enable/Disable hot reload.
- `port`: Select the port used for the WebSocket server.
- `showURL`: Toggle URL display in dev server boot message.

Nuxt Content uses [listhen](https://github.com/unjs/listhen){rel="nofollow"} to provide a local development server. Check out the [listhen documentation](https://github.com/unjs/listhen#options){rel="nofollow"} for more information.

::callout
The watcher is a development feature and will not be included in production.
::

::code-group
```ts [Enabled]
export default defineNuxtConfig({
  content: {
    watch: {
      port: 4000,
      showURL: true
    }
  }
})
```

```ts [Disabled]
export default defineNuxtConfig({
  content: {
    watch: {
      enabled: false
    }
  }
})
```
::

## `preview`

Enable `Preview API`

::prose-note
This is needed to enable live preview on [Nuxt Studio](https://content.nuxt.com/studio).
::

Value:

- `dev`: Enable in development mode
- `api`: Activate the preview mode and set the `API` to be linked with.

```ts [Enable Studio]
preview: {
  api: 'https://api.nuxt.studio',
}
```

## `experimental`

Experimental features that are not yet stable.

### `experimental.nativeSqlite`

As of Node.js v22.5.0, the `node:sqlite` module is available natively in Node.js.
This allows Nuxt Content to use SQLite as a database without the need for an external package.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    experimental: { nativeSqlite: true },
  },
});
```

::prose-note
This feature is only available in Node.js v22.5.0 and above. Enabling this feature in older version will not do anything.
::


# Migration

Nuxt Content v3 has been rebuilt from the ground up, resulting in a new library with enhanced capabilities. While we've redesigned concepts and components in a similar way as Content v2, breaking changes are inevitable.

Don't worry, you don't need to modify your content files. We made sure that Content v3 handles content in the same way as Content v2.

## Changes

### Vue utils

- `queryContent()` API is replaced with new `queryCollection()`

::prose-tip
The new API is backed by SQL and content queries happens within a specific collection.
::

- `fetchContentNavigation()` API is replaced with new `queryCollectionNavigation()`
- Surroundings now has its own separate API `queryCollectionItemSurroundings()`
- Document driven mode is dropped: `Markdown` files will not convert to Nuxt pages automatically, you need to create pages, [check this section to see how](https://content.nuxt.com/docs/components/content-renderer#example-usage).
- `useContent()` composable is removed
- `searchContent()` is dropped in favor of the new `queryCollectionSearchSections` API
- Full text search can easily be done using the `queryCollectionSearchSections` API, [check this section to see how](https://content.nuxt.com/docs/advanced/fulltext-search)

### Components

- All content should be rendered using `<ContentRenderer>` component. `<ContentDoc>`, `<ContentList>`, `<ContentNavigation>` and `<ContentQuery>` components are dropped in v3.
- `<ContentSlot>` and `<MDCSlot>` components are not supported in v3. Instead components can simply use Vue's native `<slot>` component

::prose-note
`<ContentSlot>` and `<MDCSlot>` was initially pro to manipulate content before rendering and removing wrapping paragraphs from slot content. This unwrapping behavior is now supported via `mdc-unwrap` attribute in `<slot>` component. Example: `<slot mdc-unwrap="p" />`
::

- Components created under the `components/content` directory are no longer automatically registered as global components. If you use [dynamic rendering](https://vuejs.org/guide/essentials/component-basics.html#dynamic-components){rel="nofollow"} to render these components outside markdown files, you must manually register them in your Nuxt app. Check out the [Nuxt - Custom Components Directories](https://nuxt.com/docs/guide/directory-structure/components#custom-directories){rel="nofollow"} documentation for more information on how to do so.

### Types

- `import type { NavItem } from '@nuxt/content/dist/runtime/types'` is replaced with `import type { ContentNavigationItem } from '@nuxt/content'`

### General

- `_dir.yml` files are renamed to `.navigation.yml`
- There is no source option in module options, instead you can define [multiple sources](https://content.nuxt.com/docs/collections/sources) for your collections in `content.config.ts`.
- Document `._path` is now renamed to `.path`, likewise all internal fields with `_` prefix are removed or renamed.
- `useContentHelpers()` is removed
- Module does not ignore dot files by default, you can ignore them by adding `ignore: ['**/.*']` in `exclude` options of your collection source.
- Due to SQL limitations, sort order now uses alphabetical order instead for numerical order. Check out the [Ordering Files](https://content.nuxt.com/docs/collections/types#ordering-files) section for more information.
- Module options have changed from v2. Check out [configuration page](https://content.nuxt.com/docs/getting-started/configuration) for details.

### Nuxt Studio integration

- The [studio module](https://nuxt.studio){rel="nofollow"} has been deprecated and a new generic `Preview API` has been implemented directly into Nuxt Content, you can remove the `@nuxthq/studio` package from your dependencies and from the `nuxt.config.ts` modules. Instead we just need to enable the preview mode in the Nuxt configuration file by binding the Studio API.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },
})
```

- In order to keep the [app config file](https://content.nuxt.com/docs/studio/config) updatable from Studio we just need to update the helper import of the `nuxt.schema.ts` file from `@nuxthq/studio/theme` to `@nuxt/content/preview`.

## Implement Document Driven mode in v3

Implementing document driven mode in Content v3 is quite easy. All you need is to create a catch-all page in Nuxt and fetch contents based on route path.

```vue [pages/[...slug\\].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})
</script>

<template>
  <div>
    <header><!-- ... --></header>

    <ContentRenderer v-if="page" :value="page" />

    <footer><!-- ... --></footer>
  </div>
</template>
```

## Converting `queryContent` to `queryCollections`

As we mentioned above, `queryContent` is dropped in favor of new collection based `queryCollection`. There are two main differences between these two:

1. `queryCollection` is building a query for an SQL database.
2. `queryCollection` does the search only inside the specified collection. You should know the collection's name (key on config).

```ts [Find content with path]
// Content v2
const v2Query = await queryContent(route.path).findOne()
// Content v3 - don't forget to create `content` collection in `content.config.ts`
const v3Query = await queryCollection('content').path(route.path).first()
```

```ts [Find contents with custom filter]
// Content v2
const v2Query = await queryContent()
  .where({ path: /^\/hello\/.*/ })
  .find()
// Content v3 - don't forget to create `content` collection in `content.config.ts`
const v3Query = await queryCollection('content')
  .where('path', 'LIKE', '/hello%')
  .first()
```

::prose-note{to="https://content.nuxt.com/docs/collections/define"}
Check the dedicated section for more info about collections
::

## Convert `queryContent().findSurround()`

Surround now has its own separate API.

```ts
const targetPath = '/docs'

// Content v2
const v2Surround = await queryContent(targetPath)
  .only(['title', 'description', 'navigation'])
  .findSurround(withoutTrailingSlash(route.path))

// Content v3 - don't forget to create `content` collection in `content.config.ts`
const v3Surround = await queryCollectionItemSurroundings(
  'content',
  targetPath,
  {
    fields: ['title', 'description', 'navigation']
  }
)
```

::prose-note
Check the dedicated section for more information about the
::

## Consolidate `ProsePre`, `ProseCode`, and `ProseCodeInline` components

Many `ProsePre` components are thin wrappers around the `ProseCode` component. We've consolidated these three components into two components. There is now no difference between `ProsePre` and multi-line code blocks.

1. MDC will now map and parse single backticks `` ` `` as `ProseCode` instead of `ProseCodeInline`.
2. MDC will now map and parse block code starting with three backticks` ``` ` as `ProsePre` component.

**Suggested Changes:**

1. Your current `ProseCode` logic should be moved to `ProsePre`
2. Rename your `ProseCodeInline` components to `ProseCode`

## `_dir.yml` files are renamed to `.navigation.yml`

In Content v3, we renamed `_dir.yml` to `.navigation.yml`. The new name better reflects the purpose of these files. :br
Module uses these files to gather information about directories for generating navigation.

Note that in order to make these files available for Module, youe should define your collection's source in
a way that includes these files. For example `source: '**'` and `source: '**/*.{md|yml}` will include these files
in collection, but `source: '**/*.md'` will not include them.

## Ignore dot files

By default, Content v3 does not ignore dot files. If you want to ignore them, you can add `ignore: ['**/.*']` in the `exclude` option of your collection source.

```ts
defineCollection({
  source: {
    include: '**',
    exclude: ['**/.*']
  }
})
```

Note that the above pattern will also exclude `.navigation.yml` file from collection. If you use `.navigation.yml` and want to keep them
you can use `**/.(!(navigation.yml))` pattern to exclude all dot files except `.navigation.yml`.

```ts
defineCollection({
  source: {
    include: '**',
    exclude: ['**/.!(navigation.yml)']
  }
})
```


# Define Content Collections

The Nuxt Content module automatically parses any content files within the `content/` directory located at the root of your Nuxt application. This setup allows you to freely structure the folder to suit your project's needs.

For better organization, consider using Content Collections, which let you categorize and manage content more effectively. These collections are defined in a `content.config.ts` file.

::warning
If no `content.config.ts` file is present, all files within the content folder are parsed and imported by default. However, once a config file is added, only files matching the specified path patterns defined in collections will be imported.
::

## What are Content Collections?

Content Collections organize related items within your Nuxt Content project. They provide a structured way to manage your content, making it easier to query, display, and maintain your site's data.

Key features include:

- **Logical Grouping**: Group similar content together, such as blog posts, product pages, or documentation articles
- **Shared Configuration**: Apply common settings and validations across all items within a collection
- **Improved Querying**: Fetch and filter related content items efficiently
- **Automatic Type Inference**: Get type safety and autocompletion in your development environment
- **Flexible Structure**: Organize collections by content type, category, or any other logical grouping that suits your needs

## Defining Collections

Create a `content.config.ts` file in your project's root directory. This special file configures your collections database, utility types, and content handling.

Here's a basic example:

```ts [content.config.ts]
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      // Load every file inside the `content` directory
      source: '**',
      // Specify the type of content in this collection
      type: 'page'
    })
  }
})
```

::warning
Currently, a document is designed to be present in only one collection at a time. If a file is referenced in multiple collections, live reload will not work correctly. To avoid this, it is recommended to use the `exclude` attribute to explicitly exclude a document from other collections using appropriate regex patterns.

This topic is still under discussion in this issue: [nuxt/content#2966](https://github.com/nuxt/content/issues/2966){rel="nofollow"}.
::

### Collection Schema

Schemas enforce data consistency within a collection and serve as the source of truth for TypeScript types.

On top of the built-in fields, you can define a schema by adding the `schema` property to your collection by using a [`zod`](https://zod.dev){rel="nofollow"} schema:

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      // Define custom schema for docs collection
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date()
      })
    })
  }
})
```

::note
`@nuxt/content` exposes a `z` object that contains a set of Zod schemas for common data types. Check [Zod’s README](https://github.com/colinhacks/zod){rel="nofollow"} for complete documentation on how Zod works and what features are available.
::

::tip
You can define as many collections as you want to organize different types of content.
::

## Querying Collections

Use the [`queryCollection`](https://content.nuxt.com/docs/utils/query-collection) util to fetch one or all items from a collection:

```vue [pages/blog.vue]
<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <div>
    <h1>Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

::note{to="https://content.nuxt.com/docs/utils/query-collection"}
Learn more about the available query options in our `queryCollections` API documentation.
::

## defineCollection()

The `defineCollection` function defines a collection in your content configuration. Here's its TypeScript signature:

```ts
function defineCollection(collection: Collection): DefinedCollection

type Collection = {
  // Determines how content is processed
  type: 'page' | 'data'
  // Specifies content location
  source?: string | CollectionSource
  // Zod schema for content validation and typing
  schema?: ZodObject<T>
}
```

::note{to="https://content.nuxt.com/docs/collections/types"}
Learn more about collection types.
::

```ts
type CollectionSource = {
  // Glob pattern for content matching
  include: string
  // .path prefix (only applies to 'page' type)
  prefix?: string
  // Glob patterns to exclude content
  exclude?: string[]
  // Root directory for content matching
  cwd?: string
  // Remote git repository URL (e.g., https://github.com/nuxt/content)
  repository?: string
  // Authentication token for private repositories (e.g., GitHub personal access token)
  authToken?: string
}
```

::note{to="https://content.nuxt.com/docs/collections/sources"}
Learn more about collection sources.
::

The function returns the defined collection object.


# Collection Types

In Nuxt Content, you can specify a type for each collection, depending on the intended purpose of the collection files. Collections can be defined as either **page** or **data** types.

For both types, built-in fields are generated. Every collection includes these default fields:

- `id`: Unique content identifier
- `stem`: File path without extension (used for sorting and location)
- `extension`: File extension
- `meta`: Custom fields not defined in the collection schema

## Page type

```ts
defineCollection({
  source: '**/*.md',
  type: 'page'
})
```

::tip
Use the **page** type if there is a 1-to-1 relationship between content files and pages on your site.
::

### Path generation

Nuxt Content will automatically generate a path for each file in the collection, making it easy to create URL mappings.

Here are examples of generated paths based on file structure:

|                                  |                       |
| -------------------------------- | --------------------- |
|                                  |                       |
| File                             | Path                  |
| `content/index.md`               | `/`                   |
| `content/about.md`               | `/about`              |
| `content/blog/index.md`          | `/blog`               |
| `content/blog/hello.md`          | `/blog/hello`         |
| `content/1.guide/2.installation` | `/guide/installation` |

::note
You can use the helper [`queryCollection('COLLECTION').path('PATH')`](https://content.nuxt.com/docs/utils/query-collection) to retrieve content by a specific path.
::

### Schema Overrides

When you use the **page** type, Nuxt Content generates several standard fields that are commonly used for web pages. These fields provide structure and are **automatically** applied to the collection’s schema:

- `path`: Generated route path
- `title`: Page title
- `description`: Page description
- `seo`: SEO metadata (to be used with Nuxt's `useSeoMeta` composable)
- `body`: Page content parsed as AST
- `navigation`: Page navigation configuration (for [queryCollectionNavigation](https://content.nuxt.com/docs/utils/query-collection-navigation))

Here is the corresponding schema applied:

```ts
  path: z.string(),
  title: z.string(),
  description: z.string(),
  seo: z.intersection(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      meta: z.array(z.record(z.string(), z.any())).optional(),
      link: z.array(z.record(z.string(), z.any())).optional(),
    }),
    z.record(z.string(), z.any()),
  ).optional().default({}),
  body: z.object({
    type: z.string(),
    children: z.any(),
    toc: z.any(),
  }),
  navigation: z.union([
    z.boolean(),
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    }),
  ]).default(true),
```

::note
You can override any of these fields by defining them in the collection’s schema.
::

## Data type

```ts
defineCollection({
  source: 'authors/**.yml',
  type: 'data'
})
```

The data type is useful for content that doesn't directly correspond to a webpage but instead represents structured data you might want to query and display within your application.

With data collections, you have complete control over the schema, allowing you to define custom structures.

::note
There's no strict relationship between collection type and file extension. For instance, a **page** collection can use [Markdown](https://content.nuxt.com/docs/files/markdown) or [YAML](https://content.nuxt.com/docs/files/yaml) or [JSON](https://content.nuxt.com/docs/files/json) files, and **data** collections can use any of these formats as well.
::

## Ordering Files

For both types, you may want to control the display order in lists. Use numeric prefixes in file and directory names to specify an order. Nuxt Content will use these numbers when ordering content lists.

::note
Nuxt Content uses alphabetical order for sorting, so if you want to use numerical order, you need to prefix single digit numbers with `0`. For example, without the `0` prefix, `10.foo.md` would come before `2.bar.md`.
::

```text [Directory structure]
content/
  1.frameworks/
    1.vue.md
    2.nuxt.md
    ...
  2.examples/
    01.nuxthub.md
    02.vercel.md
    03.netlify.md
    04.heroku.md
    ...
    10.cloudflare.md
    index.md
```

::warning
Separate number from file name using `.` character. Using any other separator will not work.
::


# Collection Sources

Nuxt Content provides several ways to import content files into your collection. You can configure the source by using the `source` property within `defineCollection`:

```ts [content.config.ts]
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      source: '**',
      type: 'page'
    })
  }
})
```

## `source`

The `source` property can be defined as either a string (following a glob pattern) or an object, allowing more detailed source configuration for your target directory and files within the content folder.

**Example:**

- `source: '**'` includes all files within the content directory and its subdirectories.
- `source: '**/*.md'`includes all `Markdown` files within the content directory and its subdirectories.
- `source: 'docs/**/*.yml'` includes all `YML` files within the `content/docs` and its subdirectories.
- `source: '**/*.{json,yml}'` includes `JSON` or `YML` file within the content directory and all its subdirectories.
- `source: '*.json'` includes only `JSON` files located directly within the content directory, excluding any subdirectories.

### `include` (required)

Glob pattern of your target repository and files in the content folder.

### `exclude`

Glob patterns to exclude content from the import.

### `prefix`

This configuration only applied for **page** type with 1-to-1 relationship between content files and pages on your site.

It represents the path prefix (base URL) of the corresponding page on the website.

::prose-warning
The `prefix` must start by a leading `/`.
::

By default, module extracts the static prefix of `source`(or `source.include`) and uses it as a prefix for content paths. For example, if you define `/en/**` source, module will auto-fill the `prefix` with `/en`. You can manually provide a prefix to override this behavior. The prefix can be removed by setting `prefix: '/'` in the collection source.

```ts
defineCollection({
  type: "page",
  source: {
    include: "en/**",
    exclude: ["en/index.md"],
    prefix: '/'
  }
})
```

### `cwd`

Root directory for content matching.

**Example:**

If you want to include files from a folder outside the content directory, set the absolute path of that folder to the `cwd` property.

```ts
source: {
  cwd: path.resolve('packages/my-pkg/docs'),
  include: '**/*.md',
}
```

### `repository`

External source representing a remote git repository URL (e.g., <https://github.com/nuxt/content>{rel="nofollow"}).

When defining an external source you must also define the `include` option.
`include` pattern is essential for the module to know which files to use for the collection.

```js
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/nuxt/content',
        include: 'docs/content/**',
      },
    })
  }
})
```

### `authToken`

Authentication token for private repositories (e.g., GitHub personal access token).

::warning{icon="i-lucide-shield-alert"}
Never commit authentication tokens or credentials directly in your code. Use environment variables or other secure methods to provide these values at runtime.
::

### `authBasic`

Basic authentication for private repositories (e.g., Bitbucket username and password).

```ts
defineCollection({
  type: 'page',
  source: {
    repository: 'https://bitbucket.org/username/repo',
    authBasic: {
      username: 'username',
      password: 'password',
    },
  },
})
```


# Markdown

## Usage

### Define a Collection

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string()
      })
    })
  }
})
```

::note{to="https://content.nuxt.com/docs/collections/types#page-type"}
Learn more about the `page` collection type.
::

### Create `.md` files

Create blog posts in `content/blog/` directory.

::code-group
```md [foo.md]
---
date: 2020-11-11
---

# Foo

This is Foo blog post.
```

```md [bar.md]
---
date: 2024-12-12
---
Hello
I am bar. Nice to meet you.
```
::

### Query Markdown Files

Now we can query blog posts:

```ts
// Get the foo post
const fooPost = await queryCollection('blog').path('/blog/foo').first()

// Find all posts
const allPosts = await queryCollection('blog').order('date', 'DESC').all()
```

### Display Markdown

To display the content of a markdown file, you can use the [`<ContentRenderer>`](https://content.nuxt.com/docs/components/content-renderer) component.

```vue [blog/[slug\\].vue]
<script setup>
const slug = useRoute().params.slug
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(`/blog/${slug}`).first()
})
</script>

<template>
  <!-- Render the blog post as Prose & Vue components -->
  <ContentRenderer :value="post" />
</template>
```

::note
Read more about the [`<ContentRenderer>`](https://content.nuxt.com/docs/components/content-renderer) component and [`Prose Components`](https://content.nuxt.com/docs/components/prose).
::

## Frontmatter

Frontmatter is a convention of Markdown-based CMS to provide meta-data to pages, like description or title. In Nuxt Content, the frontmatter uses the YAML syntax with `key: value` pairs.

These data are available when rendering the content and can store any information that you would need.

### Syntax

You can declare a frontmatter block at the top of the Markdown files in the `content/` directory with the `---` identifier.

```md [content/index.md]
---
title: 'Title of the page'
description: 'meta description of the page'
---

<!-- Content of the page -->
```

```ts [example.ts]
const home = await queryCollection('content').path('/').first()

console.log(home.title)
// => 'Title of the page'
console.log(home.description)
// => 'meta description of the page'
console.log(home.body)
// => AST object of the page content
```

### Native parameters

|               |           |                          |                                                                                                                                                |
| ------------- | --------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Key           | Type      | Default                  | Description                                                                                                                                    |
| `title`       | `string`  | First `<h1>` of the page | Title of the page, will also be injected in metas                                                                                              |
| `description` | `string`  | First `<p>` of the page  | Description of the page, will be shown below the title and injected into the metas                                                             |
| `navigation`  | `boolean` | `true`                   | Define if the page is included in [`queryCollectionNavigation`](https://content.nuxt.com/docs/utils/query-collection-navigation) return value. |

::warning
Additional parameters that you have defined in your frontmatter block need to be defined in your schema (see the date parameter in the example at top of this page) to be able to use them for querying.
::

## MDC Syntax

We created the MDC syntax to supercharge Markdown and give you the ability to integrate Vue components with slots and props inside your Markdown.

::callout
---
icon: i-simple-icons-visualstudiocode
to: https://marketplace.visualstudio.com/items?itemName=Nuxt.mdc
---
Install the **MDC VS Code extension** to get proper syntax highlighting for the MDC syntax.
::

## Vue Components

You can use any Vue component in your Markdown files.

We have a special syntax to make it easier to use components in your Markdown files.

```mdc [content/index.md]
::component-name
Default slot content
::
```

::warning
Components that are used in Markdown has to be marked as `global` in your Nuxt app if you don't use the `components/content/` directory, visit [Nuxt 3 docs](https://nuxt.com/docs/guide/directory-structure/components){rel="nofollow"} to learn more about it.
::

### Block Components

Block components are components that accept Markdown content or another component as a slot.

The component must contain at least one `<slot />` component to accept formatted text.

In a markdown file, use the component with the `::` identifier.

::code-group
```mdc [index.md]
::card
The content of the card
::
```

```html [Card.vue]
<!-- components/content/Card.vue -->
<template>
  <div class="p-2 border bg-white dark:bg-black dark:border-gray-700 rounded">
    <slot />
  </div>
</template>
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
    ::::example-card
    The content of the card
    ::::
  :::
::

### Slots

A component's slots can accept content or another components.

- **Default slot** renders the top-level content inside the block component or with `#default`
- **Named slots** use the `#` identifier to render the corresponding content.

::code-group
```mdc [index.md]
::hero
My Page Title

#description
This will be rendered inside the `description` slot.
::
```

```html [Hero.vue]
<template>
  <section>
    <h1 class="text-4xl">
      <slot mdc-unwrap="p" />
    </h1>
    <slot name="description" />
  </section>
</template>
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
    ::::example-hero
    My Page Title
    
    #description
    This will be rendered inside the `description` slot.
    ::::
  :::
::

::note
Read more about the [`<slot />`](https://content.nuxt.com/docs/components/slot) component.
::

::tip
You can use Markdown inside your components slots:

  :::code-group
  ```mdc [index.md]
  ::the-title
  A [rich text](/) will be **rendered** by the component.
  ::
  ```
  
  ```html [MyTitle.vue]
  <template>
    <h1 class="text-4xl">
      <slot mdc-unwrap="p" />
    </h1>
  </template>
  ```
  
    ::::preview-card{icon="i-lucide-eye" label="Preview"}
      :::::example-title
      A [rich text](https://content.nuxt.com) will be **rendered** by the component.
      :::::
    ::::
  :::
::

### Props

There are two ways to pass props to components using MDC.

#### Inline method

The `{}` identifier passes props to components in a terse way by using a `key=value` syntax.

::code-group
```mdc [index.md]
::alert{type="warning"}
The **alert** component.
::
```

```vue [Alert.vue]
<script setup>
defineProps(['type'])
</script>

<template>
  <div :class="[type]">
    <slot mdc-unwrap="p" />
  </div>
</template>
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
    ::::example-alert{type="warning"}
    The **alert** component.
    ::::
  :::
::

Multiple props can be separated with a space:

```mdc
::alert{type="warning" icon="exclamation-circle"}
Oops! An error occurred
::
```

The `v-bind` shorthand `:` can be also be used to bind a prop to a value in the frontmatter.

```mdc
---
type: "warning"
---

::alert{:type="type"}
Your warning
::
```

If you want to pass arrays or objects as props to components you can pass them as JSON string and prefix the prop key with a colon to automatically decode the JSON string. Note that in this case you should use single quotes for the value string so you can use double quotes to pass a valid JSON string:

::code-group
```mdc [array.md]
::dropdown{:items='["Nuxt", "Vue", "React"]'}
::
```

```mdc [number-array.md]
::dropdown{:items='[1,2,3.5]'}
::
```

```mdc [object.md]
::chart{:options='{"responsive": true, "scales": {"y": {"beginAtZero": true}}}'}
::
```
::

#### YAML method

The YAML method uses the `---` identifier to declare one prop per line, that can be useful for readability.

::code-group
```mdc [index.md]
::icon-card
---
icon: IconNuxt
description: Harness the full power of Nuxt and the Nuxt ecosystem.
title: Nuxt Architecture.
---
::
```

```html [IconCard.vue]
<script setup>
defineProps({
  title: {
    type: String,
    default: 'Default title'
  },
  description: {
    type: String,
    default: 'Default description'
  },
  icon: {
    type: String,
    default: 'IconMarkdown'
  }
})
</script>

<template>
  <div class="p-6 border bg-white dark:bg-black dark:border-gray-700 rounded">
    <component :is="icon" class="w-20 h-20" />
    <h2 class="text-3xl font-semibold mb-2">
      {{ title }}
    </h2>
    <p>{{ description }}</p>
  </div>
</template>
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
    ::::example-icon-card
    ---
    description: Harness the full power of Nuxt and the Nuxt ecosystem.
    icon: IconNuxt
    title: Nuxt Architecture.
    ---
    ::::
  :::
::

### Attributes

Attributes are useful for highlighting and modifying part of paragraph. The syntax is nearly similar to inline components and markdown links syntax.

Possible values are all named attributes, classes with the notation `.class-name` and an ID with `#id-name`.

::code-group
```mdc [index.md]
Hello [World]{style="color: green;" .custom-class #custom-id}!
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  Hello [World]{#custom-id .custom-class style="color: green;"} !
  :::
::

In addition to mdc components and `span`, attribute syntax will work on images, links, inline `code`, \**bold*\* and \_italic\_ text.

::code-group
```md [index.md]
Attributes work on:

- [link](#attributes){style="background-color: pink;"}, `code`{style="color: cyan;"},
- _italic_{style="background-color: yellow; color:black;"} and **bold**{style="background-color: lightgreen;"} texts.
```

  :::preview-card{prose label="Preview" prose=""}
  Attributes work on:
  
  - [link](https://content.nuxt.com/#attributes){style="background-color: pink;"}, `code`,
  - *italic* and **bold** texts.
  :::
::

## Binding Data in Markdown

You can bind data within your Markdown document using the `{{ $doc.variable || 'defaultValue' }}` syntax. These values can be defined in the YAML frontmatter at the top of the document, within each MDC component, or injected using the `data` prop of the `<ContentRenderer>` component.

### Example 1: Define in YAML

```mdc
---
title: 'Title of the page'
description: 'meta description of the page'
customVariable: 'Custom Value'
---

# The Title is {{ $doc.title }} and customVariable is {{ $doc.customVariable || 'defaultValue' }}

```

### Example 2: Define in external with `<ContentRenderer>`

```html [test.vue]
<template>
  <div>
    <ContentRenderer :value="data" :data="mdcVars"/>
    <button type="button" v-on:click="mdcVars.name = 'Hugo'">Change name</button>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData(() => queryCollection('content').path('/test').first());
const mdcVars = ref({ name: 'Maxime'});
</script>
```

```mdc [test.md]
# Hello {{ $doc.name || 'World' }}

```

## Prose Components

In Nuxt Content, the prose represents HTML tags generated by the Markdown syntax, such as heading levels and links.

For each HTML tag, a Vue component is used, allowing you to override them if needed, for example `<p>` becomes `<ProseP>`.

If you want to customize a Prose component, here are the recommended steps:

- Check out the original [component sources](https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose){rel="nofollow"}.
- Use the exact same props.
- In your `components/content/` directory, give it the same name.
- Make it yours 🚀.

::note{to="https://content.nuxt.com/docs/components/prose"}
Read the complete Prose reference in the Prose Components section.
::

## Code Highlighting

Nuxt Content uses [Shiki](https://github.com/shikijs/shiki){rel="nofollow"}, which colors tokens with VSCode themes.

Code highlighting works both on [`ProsePre`](https://content.nuxt.com/docs/components/prose#prosepre) and [`ProseCode`](https://content.nuxt.com/docs/components/prose#prosecodeinline).

Each line of a code block gets its line number in the `line` attribute so lines can be labeled or individually styled.

::callout
[Read the API reference to configure or entirely disable syntax highlighting.](https://content.nuxt.com/docs/getting-started/configuration)
::

## Images

You can add images to your `public` directory:

```bash [Directory structure]
content/
  index.md
public/
  image.png
nuxt.config.ts
package.json
```

And then use them in your markdown files in the `content` directory as such:

```md [content/index.md]
![my image](/image.png)
```

## Excerpt

Content excerpt or summary can be extracted from the content using `<!--more-->` as a divider.

```md [content/index.md]
---
title: Introduction
---

Learn how to use `@nuxt/content`.

<!--more-->

Full amount of content beyond the more divider.
```

Description property will contain the excerpt content unless defined within the frontmatter props.

If there is no `<!--more-->` divider in the text then excerpt is undefined.

::tip
You should define the `excerpt` field in the collection schema if you want to use the excerpt feature.

```ts [content.config.ts]
const content = defineCollection({
  type: 'page',
  source: '**',
  schema: z.object({
    excerpt: z.object({
      type: z.string(),
      children: z.any(),
    }),
  }),
})
```

Read more about the [collection schema](https://content.nuxt.com/docs/collections/define#collection-schema).
::

Example variables will be injected into the document:

```json
{
  "excerpt": Object
  "body": Object
  // ... other keys
}
```


# YAML

## Define Collection

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.yml',
      schema: z.object({
        name: z.string(),
        avatar: z.string(),
        url: z.string()
      })
    })
  }
})

```

## Create `.yml` files

Create authors files in `content/authors/` directory.

::code-group
```yaml [farnabaz.yml]
name: Ahad Birang
avatar: https://avatars.githubusercontent.com/u/2047945?v=4
url: https://github.com/farnabaz
```

```yaml [larbish.yml]
name: Baptiste Leproux
avatar: https://avatars.githubusercontent.com/u/7290030?v=4
url: https://github.com/larbish
```
::

## Query Data

Now we can query authors:

```vue
<script lang="ts" setup>
// Find a single author
const { data: author } = await useAsyncData('larbish', () => {
  return queryCollection('authors')
    .where('stem', '=', 'larbish')
    .first()
})

// Get all authors
const { data: authors } = await useAsyncData('authors', () => {
  return queryCollection('authors')
    .order('name', 'DESC')
    .all()
})
</script>
```


# JSON

## Define Collection

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.json',
      schema: z.object({
        name: z.string(),
        avatar: z.string(),
        url: z.string()
      })
    })
  }
})

```

## Create `.json` files

Create authors files in `content/authors/` directory.

::code-group
```json [farnabaz.json]
{
  "name": "Ahad Birang",
  "avatar": "https://avatars.githubusercontent.com/u/2047945?v=4",
  "url": "https://github.com/farnabaz"
}
```

```json [larbish.json]
{
  "name": "Baptiste Leproux",
  "avatar": "https://avatars.githubusercontent.com/u/7290030?v=4",
  "url": "https://github.com/larbish"
}
```
::

::warning
Each file in `data` collection should contain only one object, therefore having top level array in a JSON file will cause invalid result in query time.
::

## Query Data

Now we can query authors:

```vue
<script lang="ts" setup>
// Find a single author
const { data: author } = await useAsyncData('larbish', () => {
  return queryCollection('authors')
    .where('stem', '=', 'larbish')
    .first()
})

// Get all authors
const { data: authors } = await useAsyncData('authors', () => {
  return queryCollection('authors')
    .order('name', 'DESC')
    .all()
})
</script>
```


# CSV

Nuxt Content supports CSV files out of the box. You can store and query data in CSV format, with options for JSON conversion and custom delimiters.

## Configuration

You can configure how CSV files are parsed in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      csv: {
        // Convert CSV data to JSON objects
        json: true,
        // Specify custom delimiter (default is ',')
        delimiter: ','
      }
    }
  }
})
```

## Example Usage

Create a CSV file in your content directory:

```csv [content/users.csv]
id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com
```

Query the data in your components:

```vue
<script setup>
const { data } = await useAsyncData('users', () => 
  queryCollection('users').find()
)
</script>

<template>
  <ul>
    <li v-for="user in data" :key="user.id">
      {{ user.name }} ({{ user.email }})
    </li>
  </ul>
</template>
```

With `json: true` in the configuration, each row will be converted to a JavaScript object with the header row used as keys:

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

## Custom Delimiters

If your CSV files use a different delimiter, you can specify it in the configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    build: {
      csv: {
        delimiter: ';' // Use semicolon as delimiter
      }
    }
  }
})
```

This would parse CSV files like:

```csv
id;name;email
1;John Doe;john@example.com
```

::note
The CSV parser can be disabled by setting `csv: false` in the configuration if you don't need CSV support.
::


# queryCollection

## Usage

Use the auto-imported `queryCollection` to find contents inside a collection. Here we assume that you have defined `docs` collection inside `content.config.ts`.

If you have not defined any collection, check [How to define a collection](https://content.nuxt.com/docs/collections/define#defining-collections).

```vue [pages/[...slug\\].vue]
<script>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>
```

::tip
The `queryCollection` utility is available in both Vue and Nitro. Checkout [Server Usage](https://content.nuxt.com/#server-usage) for more details on how to use it on the server side.
::

## API

### Type

```ts
function queryCollection<T extends keyof Collections>(collection: T): CollectionQueryBuilder<Collections[T]>

interface CollectionQueryBuilder<T> {
  where(field: keyof T | string, operator: SQLOperator, value?: unknown): CollectionQueryBuilder<T>
  andWhere(groupFactory: QueryGroupFunction<T>): CollectionQueryBuilder<T>
  orWhere(groupFactory: QueryGroupFunction<T>): CollectionQueryBuilder<T>
  order(field: keyof T, direction: 'ASC' | 'DESC'): CollectionQueryBuilder<T>
  // ... other methods
}
```

### `queryCollection(collection: CollectionName)`

Create a query builder to search in the specific collection.

- Parameters:
- - `collection`: The key of defined collection in `content.config.ts`

### `path(path: string)`

Search for contents that have specific `path`. (`path` is an special field in `page` collections which generates based on fs path and can be use as route to render the content)

- Parameter:
- - `path`: The path string to match.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
```

### `select(...fields: keyof Collection)`

Select specific fields from the collection to be returned in the query result.

- Parameters:

  - `...fields`: A list of field names to select from the collection.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .select('path', 'title', 'description')
    .first()
})
```

### `where(field: keyof Collection | string, operator: SqlOperator, value?: unknown)`

Add a condition to the query to filter results based on a specific field.

- Parameters:

  - `field`: The field to filter on
  - `operator`: The SQL operator to use for comparison. Possible values include:

    - `'='`: Equal to
    - `'>'`: Greater than
    - `'<'`: Less than
    - `'<>'`: Not equal to
    - `'IN'`: In a list of values
    - `'BETWEEN'`: Between two values
    - `'NOT BETWEEN'`: Not between two values
    - `'IS NULL'`: Is null
    - `'IS NOT NULL'`: Is not null
    - `'LIKE'`: Matches a pattern
    - `'NOT LIKE'`: Does not match a pattern
  - `value`: The value to compare against. The type depends on the operator used.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .where('date', '<', '2024-04-04')
    .all()
})
```

### `andWhere(groupFactory: QueryGroupFunction<Collection>)`

Add an AND condition group to the query. This allows for more complex query conditions.

- Parameter:

  - `groupFactory`: A function that receives a query builder and can add multiple conditions that will be grouped together with AND

```ts
const { data } = await useAsyncData('recent-docs', () => {
  return queryCollection('docs')
    .where('published', '=', true)
    .andWhere(query => query.where('date', '>', '2024-01-01').where('category', '=', 'news'))
    .all()
})
```

### `orWhere(groupFactory: QueryGroupFunction<Collection>)`

Add an OR condition group to the query. This allows for alternative conditions.

- Parameter:

  - `groupFactory`: A function that receives a query builder and can add multiple conditions that will be grouped together with OR

```ts
const { data } = await useAsyncData('featured-docs', () => {
  return queryCollection('docs')
    .where('published', '=', true)
    .orWhere(query => query.where('featured', '=', true).where('priority', '>', 5))
    .all()
})
```

### `order(field: keyof Collection, direction: 'ASC' | 'DESC')`

Order the query results based on a specific field.

- Parameters:

  - `field`: The field to order by.
  - `direction`: The direction of ordering, either 'ASC' for ascending or 'DESC' for descending.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .order('date', 'DESC')
    .all()
})
```

### `limit(limit: number)`

Limit the number of results returned by the query.

- Parameter:

  - `limit`: The maximum number of results to return.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .limit(10)
    .all()
})
```

### `skip(skip: number)`

Skip a specified number of results in the query.

- Parameter:

  - `skip`: The number of results to skip.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    // Skip first 5 items
    .skip(5)
    .all()
})
```

### `all()`

Execute the query and return all matching results.

- Returns: A Promise that resolves to an array of all matching documents.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').all()
})
```

### `first()`

Execute the query and return the first matching result.

- Returns: A Promise that resolves to the first matching document, or `null` if no documents match.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs').first()
})
```

### `count()`

Count the number of matched collection entries based on the query.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    // Count matches
    .count()
})

// Returns
5 // number of matches
```

You can also use `count()` with other methods defined above such as `where()` in order to apply additional conditions within the collection query.

```ts
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('docs')
    .where('date', '<', '2024-04-04')
    // Count matches
    .count()
})

// Returns
3 // number of matches for the provided query
```

## Examples

Here is a complete example of how to fetch a list of documents in the `docs` collections.

```vue [index.vue]
<script setup lang="ts">
const { data: docs } = await useAsyncData('documents-list', () => {
  return queryCollection('docs')
    .order('date', 'DESC')
    .select('title', 'path', 'description')
    .all()
})
</script>

<template>
  <NuxtLink v-for="doc in docs" :key="doc.path" :to="doc.path">
    <h2>{{ doc.title }}</h2>
    <p>{{ doc.description }}</p>
  </NuxtLink>
</template>
```

## Server Usage

Nuxt Content provides a similar utility to query collections on the server side. The only difference is that you need to pass `event` as the first argument to the `queryCollection` function.

```ts [server/api/[slug\\].ts]
export default eventHandler(async (event) => {
  const { slug } = getRouterParams(event)
  const page = await queryCollection(event, 'docs').path(slug).first()
  return page
})
```

::note
Make sure to create `server/tsconfig.json` file with the following content to avoid type error.

```json
{
  "extends": "../.nuxt/tsconfig.server.json"
}
```
::


# queryCollectionNavigation

## Type

```ts
function queryCollectionNavigation<T extends keyof PageCollections>(
  collection: T,
  fields?: Array<keyof PageCollections[T]>
): ChainablePromise<T, ContentNavigationItem[]>

interface ChainablePromise<T extends keyof PageCollections, R> extends Promise<R> {
  where(field: keyof PageCollections[T] | string, operator: SQLOperator, value?: unknown): ChainablePromise<T, R>
  andWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  orWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  order(field: keyof PageCollections[T], direction: 'ASC' | 'DESC'): ChainablePromise<T, R>
}
```

## Usage

Use the auto-imported `queryCollectionNavigation` to generate a navigation tree for a specific collection. This is particularly useful for creating dynamic navigation menus or sidebars based on your content structure.

The function returns a chainable promise that allows you to add additional query conditions:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('docs')
    .where('published', '=', true)
    .order('date', 'DESC')
})
</script>
```

::tip
The `queryCollectionNavigation` utility is available in both Vue and Nitro. Checkout [Server Usage](https://content.nuxt.com/#server-usage) for more details on how to use it on the server side.
::

### Navigation metadata with `.navigation.yml`

You can add metadata to a directory using a `.navigation.yml` file.

```yml [.navigation.yml]
title: Getting Started
icon: i-lucide-square-play
```

## API

### `queryCollectionNavigation(collection: CollectionName, extraField: keyof Collection)`

Generate a navigation tree for the specified collection.

- Parameters:

  - `collection`: The key of the defined collection in `content.config.ts`.
  - `extraFields`: (Optional) An array of additional fields to include in the navigation items. (By default `title` and `path` are included in the navigation items.)
- Returns: A chainable promise that resolves to a navigation tree structure. The promise includes methods for adding query conditions:

  - `where(field, operator, value)`: Add a WHERE condition
  - `andWhere(groupFactory)`: Add a grouped AND condition
  - `orWhere(groupFactory)`: Add a grouped OR condition
  - `order(field, direction)`: Add an ORDER BY clause

The navigation tree is generated based on the directory structure and ordering happens based on files [ordering](https://content.nuxt.com/docs/collections/types#ordering-files)

## Examples

Basic usage without additional query conditions:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('docs')
})
</script>

<template>
  <nav>
    <ul v-if="data">
      <li v-for="item in data" :key="item.path">
        <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
```

Example with additional query conditions and extra fields:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('docs', ['description', 'badge'])
    .where('draft', '=', false)
    .where('partial', '=', false)
    .order('title', 'ASC')
})
</script>

<template>
  <nav>
    <ul v-if="data">
      <li v-for="item in data" :key="item.path">
        <NuxtLink :to="item.path">
          {{ item.title }}
          <span v-if="item.badge" class="badge">{{ item.badge }}</span>
        </NuxtLink>
        <p v-if="item.description">{{ item.description }}</p>
      </li>
    </ul>
  </nav>
</template>
```

## Server Usage

Nuxt Content provides a similar utility to query collections on the server side. The only difference is that you need to pass `event` as the first argument to the `queryCollectionNavigation` function.

```ts [server/api/navigation.ts]
export default eventHandler(async (event) => {
  const navigation = await queryCollectionNavigation(event, 'docs')
  return navigation
})
```

::note
Make sure to create `server/tsconfig.json` file with the following content to avoid type error.

```json
{
  "extends": "../.nuxt/tsconfig.server.json"
}
```
::


# queryCollectionItemSurroundings

## Type

```ts
function queryCollectionItemSurroundings<T extends keyof PageCollections>(
  collection: T,
  path: string,
  opts?: SurroundOptions<keyof PageCollections[T]>
): ChainablePromise<T, ContentNavigationItem[]>

interface ChainablePromise<T extends keyof PageCollections, R> extends Promise<R> {
  where(field: keyof PageCollections[T] | string, operator: SQLOperator, value?: unknown): ChainablePromise<T, R>
  andWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  orWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  order(field: keyof PageCollections[T], direction: 'ASC' | 'DESC'): ChainablePromise<T, R>
}
```

## Usage

Use the auto-imported `queryCollectionItemSurroundings` to find the previous and next items relative to a specific content item in a collection. This is particularly useful for creating navigation between related content pages.

The function returns a chainable promise that allows you to add additional query conditions:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('docs', '/foo')
    .where('published', '=', true)
    .order('date', 'DESC')
})
</script>
```

::tip
The `queryCollectionItemSurroundings` utility is available in both Vue and Nitro. Checkout [Server Usage](https://content.nuxt.com/#server-usage) for more details on how to use it on the server side.
::

## API

### `queryCollectionItemSurroundings(collection: CollectionName, path: string, opts?: SurroundOptions)`

Find the surrounding items (previous and next) for a specific content item in a collection.

- Parameters:

  - `collection`: The key of the defined collection in `content.config.ts`.
  - `path`: The path of the current content item.
  - `opts`: (Optional) An object with the following properties:

    - `before`: (Optional) The number of items to fetch before the current item. Default is 1.
    - `after`: (Optional) The number of items to fetch after the current item. Default is 1.
    - `fields`: (Optional) An array of additional fields to include in the surrounding items.
- Returns: A chainable promise that resolves to an array containing the surrounding items. The promise includes methods for adding query conditions:

  - `where(field, operator, value)`: Add a WHERE condition
  - `andWhere(groupFactory)`: Add a grouped AND condition
  - `orWhere(groupFactory)`: Add a grouped OR condition
  - `order(field, direction)`: Add an ORDER BY clause

The final result will be an array with the following structure:

- `[previousItem, nextItem]` if using default options
- `[...previousItems, ...nextItems]` if using custom `before` and `after` values

Each item in the array is of type `ContentNavigationItem` or `null` if there is no item in that position.

## Examples

Basic usage without additional query conditions:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('docs', '/foo')
})
</script>

<template>
  <div class="flex justify-between">
    <NuxtLink v-if="data?.[0]" :to="data[0].path">
      ← {{ data[0].title }}
    </NuxtLink>
    <NuxtLink v-if="data?.[1]" :to="data[1].path">
      {{ data[1].title }} →
    </NuxtLink>
  </div>
</template>
```

Example with additional query conditions:

```vue [pages/[...slug\\].vue]
<script setup lang="ts">
const { data } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('docs', '/foo', {
    before: 1,
    after: 1,
    fields: ['badge', 'description']
  })
    .where('_draft', '=', false)
    .where('_partial', '=', false)
    .order('date', 'DESC')
})
</script>
```

## Server Usage

Nuxt Content provides a similar utility to query collections on the server side. The only difference is that you need to pass `event` as the first argument to the `queryCollectionItemSurroundings` function.

```ts [server/api/surroundings.ts]
export default eventHandler(async (event) => {
  const surroundings = await queryCollectionItemSurroundings(event, 'docs', '/foo')
  return surroundings
})
```

::note
Make sure to create `server/tsconfig.json` file with the following content to avoid type error.

```json
{
  "extends": "../.nuxt/tsconfig.server.json"
}
```
::


# queryCollectionSearchSections

## Type

```ts
function queryCollectionSearchSections(collection: keyof Collections, opts?: { ignoredTags: string[] }): ChainablePromise<T, Section[]>

interface ChainablePromise<T extends keyof PageCollections, R> extends Promise<R> {
  where(field: keyof PageCollections[T] | string, operator: SQLOperator, value?: unknown): ChainablePromise<T, R>
  andWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  orWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>
  order(field: keyof PageCollections[T], direction: 'ASC' | 'DESC'): ChainablePromise<T, R>
}
```

## Usage

Use the auto-imported `queryCollectionSearchSections` to generate searchable sections from a specific collection. This is particularly useful for creating advanced search functionality or content discovery features in your application.

```vue [app.vue]
<script>
const { data: sections } = await useAsyncData('search-sections', () => {
  return queryCollectionSearchSections('docs')
})
</script>
```

::tip
The `queryCollectionSearchSections` utility is available in both Vue and Nitro. Checkout [Server Usage](https://content.nuxt.com/#server-usage) for more details on how to use it on the server side.
::

## API

### `queryCollectionSearchSections(collection: CollectionName, options?: SearchSectionsOptions)`

Generate searchable sections from the specified collection.

- Parameters:

  - `collection`: The key of the defined collection in `content.config.ts`.
  - `options`: (Optional) An object with the following properties:

    - `ignoredTags`: An array of tag names to ignore when generating sections. Default is an empty array.
- Returns: A Promise that resolves to an array of searchable sections. Each section is an object with the following properties:

  - `id`: A unique identifier for the section.
  - `title`: The title of the section (usually the heading text).
  - `titles`: An array of parent section titles, representing the hierarchy.
  - `content`: The textual content of the section.
  - `level`: The heading level (1-6) of the section, where 1 is the highest level.

## Example

Here's an example of how to use `queryCollectionSearchSections` to create searchable sections from the 'docs' collection:

```vue [pages/[...slug\\].vue]
<script>
const { data: surround } = await useAsyncData('foo-surround', () => {
  return queryCollectionSearchSections('docs', {
    ignoredTags: ['code']
  })
})
</script>
```

## Server Usage

Nuxt Content provides a similar utility to query collections on the server side. The only difference is that you need to pass `event` as the first argument to the `queryCollectionSearchSections` function.

```ts [server/api/search-sections.ts]
export default eventHandler(async (event) => {
  const sections = await queryCollectionSearchSections(event, 'docs')
  return sections
})
```

::note
Make sure to create `server/tsconfig.json` file with the following content to avoid type error.

```json
{
  "extends": "../.nuxt/tsconfig.server.json"
}
```
::


# ContentRenderer

The `<ContentRenderer>` component renders a document coming from a query with [`queryCollection()`](https://content.nuxt.com/docs/utils/query-collection).

::note
This component **only works** with `Markdown` files.
::

## Props

| Prop         | Default     | Type                  | Description                                                                                                                           |
| ------------ | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `value`      | `{}`        | `ParsedContent`       | The document to render.                                                                                                               |
| `tag`        | `'div'`     | `string`              | The tag to use for the renderer element if it is used.                                                                                |
| `excerpt`    | `false`     | `boolean`             | Whether to render the excerpt only without the rest of the content.                                                                   |
| `components` | `{}`        | `object`              | The map of custom components to use for rendering. This prop will pass to the markdown renderer and will not affect other file types. |
| `data`       | `{}`        | `object` (required)   | A map of variables to inject into the markdown content for later use in binding variables.                                            |
| `prose`      | `undefined` | `boolean`             | Whether or not to render Prose components instead of HTML tags.                                                                       |
| `class`      | `undefined` | `string` or `object`  | Root tag to use for rendering.                                                                                                        |
| `unwrap`     | `false`     | `boolean` or `string` | Tags to unwrap separated by spaces. Example: `'ul li'`.                                                                               |

## Example Usage

```vue [pages/[...slug\\].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
```

## Handling Missing Pages

If the queried content is **missing**, you can display a **custom fallback message**.

```vue [pages/[...slug\\].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).findOne()
})
</script>

<template>
  <template v-if="page">
    <ContentRenderer :value="page" />
  </template>
  <template v-else>
    <div class="empty-page">
      <h1>Page Not Found</h1>
      <p>Oops! The content you're looking for doesn't exist.</p>
      <NuxtLink to="/">Go back home</NuxtLink>
    </div>
  </template>
</template>
```

## Handling Empty Pages

If the queried content is **empty**, you can display a **custom fallback message**.


# Slot

When you write contents and paragraphs inside a component with the MDC syntax, you can use Vue's `<slot>` component to render the content.

## Usage

If you don't want to modify the rendered content, simply use Vue's `<slot>` component.

```vue [components/content/Callout.vue]
<template>
  <div class="callout">
    <slot />
  </div>
</template>
```

Now let's use it in Markdown:

```mdc [content/index.md]
::callout
This is a callout.
::
```

The rendered HTML will be:

```html
<div class="callout">
  <p>This is a callout.</p>
</div>
```

This usage would be similar to using the native `<slot>` component.

### Unwrapping

The `mdc-unwrap` prop allows you to remove one or multiple wrapping elements from the rendered content. This is useful when you want to extract the content nested in native Markdown syntax. Each specified tag will get removed from AST.

Let's unwrap the `<p>` element from the previous example:

```vue [components/content/Callout.vue]
<template>
  <div class="callout">
    <slot mdc-unwrap="p" />
  </div>
</template>
```

Now the rendered HTML will be:

```html
<div class="callout">
  This is a callout.
</div>
```

### Named Slots

The `name` prop allows you to bind a slot by its name. This is useful when you want to render a slot that is not the default one.

Let's improve our `Callout` component to have a `title` slot:

```vue [components/content/Callout.vue]
<template>
  <div class="callout">
    <h2 v-if="$slots.title">
      <slot name="title" mdc-unwrap="p" />
    </h2>
    <slot />
  </div>
</template>
```

Now let's use it in Markdown:

```mdc [content/index.md]
::callout
#title
Please be careful!
#default
Using MDC & Vue components is addictive.
::
```

This will result into:

```html
<div class="callout">
  <h2>Please be careful!</h2>
  <p>Using MDC & Vue components is addictive.</p>
</div>
```

When not using the `title` slot, the `h2` element will not be rendered.

## Props

- `mdc-unwrap`: Whether to unwrap the content or not. This is useful when you want to extract the content nested in native Markdown syntax. Each specified tag will get removed from AST.

  - **Type:** `boolean` or `string`
  - **Default:** `false`
  - **Example:** `'p'` or `'ul li'`


# Prose Components

Prose components are replacements for HTML typography tags. Prose components provide a simple way to customize content UI.

To overwrite a prose component, create a component with the same name in your project `components/content/` directory (ex: `components/content/ProseA.vue`).

::note
Prose components are originally part of [`@nuxtjs/mdc`](https://github.com/nuxt-modules/mdc){rel="nofollow"}.
::

## `ProseA`

::code-group
```md [Code]
[Link](/docs/components/prose)
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  [Link](https://content.nuxt.com/docs/components/prose)
  :::
::

## `ProseBlockquote`

::code-group
```md [Code]
> Block quote
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  > Block quote
  :::
::

## `ProsePre`

::code-group
````md [Code]
  ```js [file.js]{2} meta-info=val
  export default () => {
    console.log('Code block')
  }
  ```
````

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ```js [file.js]
  export default () => {
    console.log('Code block')
  }
  ```
  :::
::

Component properties will be:

```json
{
  code: "export default () => {\n    console.log('Code block')\n}"
  language: "js"
  filename: "file.js"
  highlights: [2]
  meta: "meta-info=val"
}
```

Check out the [highlight options](https://content.nuxt.com/docs/getting-started/configuration#highlight) for more about the syntax highlighting.

::callout{type="warning"}
If you want to use `]` in the filename, you need to escape it with 2 backslashes: `\\]`. This is necessary since JS will automatically escape the backslash in a string so `\]` will be resolved as `]` breaking our regex.
::

## `ProseCode`

::code-group
```md [Code]
`code`

`const code: string = 'highlighted code inline'`{lang="ts"}
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  `code`
  
  `const code: string = 'highlighted code inline'`
  :::
::

## `ProseH1`

::code-group
```md [Code]
# H1 Heading
```

  :::preview-card{.pt-4 label="Preview"}
  # H1 Heading
  :::
::

## `ProseH2`

::code-group
```md [Code]
## H2 Heading
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ## H2 Heading
  :::
::

## `ProseH3`

::code-group
```md [Code]
### H3 Heading
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ### H3 Heading
  :::
::

## `ProseH4`

::code-group
```md [Code]
#### H4 Heading
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  #### H4 Heading
  :::
::

## `ProseH5`

::code-group
```md [Code]
##### H5 Heading
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ##### H5 Heading
  :::
::

## `ProseH6`

::code-group
```md [Code]
###### H6 Heading
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ###### H6 Heading
  :::
::

## `ProseHr`

::code-group
```md [Code]
Divider under.

---

Divider above.
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  Divider under.
  
  ---
  
  Divider above.
  :::
::

## `ProseImg`

::code-group
```md [Code]
![A Cool Image](https://nuxt.com/assets/design-kit/icon-green.png)
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ![A Cool Image](https://nuxt.com/assets/design-kit/icon-green.png)
  :::
::

## `ProseUl`

::code-group
```md [Code]
- Just
- An
- Unordered
- List
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  - Just
  - An
  - Unordered
  - List
  :::
::

## `ProseLi`

::code-group
```md [Code]
- List element
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  - List element
  :::
::

## `ProseOl`

::code-group
```md [Code]
1. Foo
2. Bar
3. Baz
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  1. Foo
  2. Bar
  3. Baz
  :::
::

## `ProseP`

::code-group
```md [Code]
Just a paragraph.
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  Just a paragraph.
  :::
::

## `ProseStrong`

::code-group
```md [Code]
**Just a strong paragraph.**
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  **Just a strong paragraph.**
  :::
::

## `ProseEm`

::code-group
```md [Code]
_Just an italic paragraph._
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  *Just an italic paragraph.*
  :::
::

## `ProseTable`

::code-group
```md [Code]
| Key | Type      | Description |
| --- | --------- | ----------- |
| 1   | Wonderful | Table       |
| 2   | Wonderful | Data        |
| 3   | Wonderful | Website     |
```

  :::preview-card{icon="i-lucide-eye" label="Preview"}
  | Key | Type      | Description |
  | --- | --------- | ----------- |
  | 1   | Wonderful | Table       |
  | 2   | Wonderful | Data        |
  | 3   | Wonderful | Website     |
  :::
::

## `ProseTbody`

Included in **ProseTable** example.

## `ProseTd`

Included in **ProseTable** example.

## `ProseTh`

Included in **ProseTable** example.

## `ProseThead`

Included in **ProseTable** example.

## `ProseTr`

Included in **ProseTable** example.

::callout
---
icon: i-simple-icons-github
to: https://github.com/nuxt-modules/mdc/tree/main/src/runtime/components/prose
---
Checkout the source code for these components on GitHub.
::


# Server Hosting

## What is Node.js preset?

Node preset is the default preset for Nuxt, when building your project, Nuxt will output a Node.js server that you can run with `node .output/server/index.mjs`.

## Environment requirement

If you are using the default `better-sqlite3` module to operate the sqlite database,
then you have to deploy to an OS with Glibc version higher than 2.29, eg. Debian 11, Ubuntu 20.04.

::note
You can use `ldd --version` to check the Glibc version. Checkout [issue #3248](https://github.com/nuxt/content/issues/3248){rel="nofollow"} for more details.
::

## Building with Node.js preset

Build project with Nuxt build command:

```bash [Terminal]
nuxi build
```

When running `nuxi build` with the Node server preset, the result will be an entry point that launches a ready-to-run Node server.

```bash [Terminal]
$ node .output/server/index.mjs
Listening on http://localhost:3000
```

::note
The SQLite database will be loaded on the server side when booting the server as well as in the browser for client-side navigation or actions.
::


# Serverless Hosting

## What is Serverless Hosting?

Serverless hosting lets you run code and applications without managing servers directly - you just upload your code and the cloud provider automatically handles all the infrastructure, scaling, and maintenance while charging you only for the actual compute resources you use.

**In serverless environments, each user request triggers a fresh instance of your Nuxt server, meaning it starts from scratch every time.** This "stateless" nature means you can't store data in server memory or use file-based databases like SQLite. That's why we need to use external database services (like D1, Turso, or PostgreSQL) that persist data independently of your server instances.

## Deploy with Serverless

The module have built-in support for couple of famous serverless platforms. You can deploy your project to them with ease. Checkout the guides for each platform:

- [NuxtHub](https://content.nuxt.com/docs/deploy/nuxthub)
- [Cloudflare Pages](https://content.nuxt.com/docs/deploy/cloudflare-pages)
- [Vercel](https://content.nuxt.com/docs/deploy/vercel)

If you like to deploy to other platforms, you can follow below steps to deploy your project.

### 1. Select a database service

Before deploying your project, you need to select a database service:

::code-group
```ts [PostgreSQL]
// 1. Create a PostgreSQL database
// 2. And add the `POSTGRES_URL` to the env variables
export default defineNuxtConfig({
  content: {
    database: {
      type: 'postgres',
      url: process.env.POSTGRES_URL
    }
  }
})
```

```ts [Cloudflare D1]
// 1. Create a D1 database in your CF account
// 2. Link it to your project with the same binding name
export default defineNuxtConfig({
  content: {
    database: {
      type: 'd1',
      binding: '<YOUR_BINDING_NAME>'
    }
  }
})
```

```ts [LibSQL]
// 1. Create a LibSQL database on Turso.tech
// 2. And add the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env variables
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  content: {
    database: {
      type: 'libsql',
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    }
  }
})
```

```ts [NuxtHub]
// Install the NuxtHub module (see hub.nuxt.com)
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxthub/core'],
  content: {
    database: {
      type: 'd1',
      binding: 'DB'
    }
  },
  hub: {
    database: true
  }
})
```
::

### 2. Deploy your project

Nuxt Content uses Nuxt deployment presets to adjust the build process for different hosting platforms.

Various serverless platform are supported with zero configuration:

- [Cloudflare](https://nuxt.com/deploy/cloudflare){rel="nofollow"}
- [NuxtHub](https://nuxt.com/deploy/nuxthub){rel="nofollow"}
- [Vercel](https://nuxt.com/deploy/vercel){rel="nofollow"}
- [Netlify](https://nuxt.com/deploy/netlify){rel="nofollow"}

All you need to do is to set the build command to:

```bash [Terminal]
nuxi build
```

The generated output will be compatible with the selected platform.

::note
The linked database will be loaded on the server side when booting the server. In the browser, a [WASM SQLite](https://content.nuxt.com/docs/advanced/database#wasm-sqlite-in-browser) database will be loaded for client-side navigation and actions.
::

::tip
If you wish to deploy to AWS Lambda, you need to make sure your sqlite file is in `/tmp` since this is the only writeable folder

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  content: {
    database: {
      type: 'sqlite',
      filename: '/tmp/contents.sqlite'
    }
  }
})
```
::

### 3. Optimize with pre-rendering

As each request trigger a fresh instance of your Nuxt server, the performance of your serverless application will be impacted if you don't pre-render some pages.

To optimize your serverless application, you can pre-render your pages using the `routeRules` option:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true }
  }
})
```

::tip{to="https://hub.nuxt.com/docs/recipes/pre-rendering"}
We recommend to checkout **NuxtHub's Pre-rendering guide** to learn more about the different strategies to optimize your serverless application, it applies to all serverless platforms.
::


# NuxtHub

::card
Quick Setup

1. Install the `@nuxthub/core` module `nuxi module add hub`
2. Use `npx nuxthub deploy` to deploy your content to NuxtHub
::

---

Nuxt Content module has a built-in integration with [NuxtHub](https://hub.nuxt.com){rel="nofollow"} to deploy your content.

To enable NuxtHub integration, you need to install the `@nuxthub/core` module and register it in your `nuxt.config.ts`. More efficiently, you can use `nuxi module` command to do both at once.

```bash
npx nuxi module add hub
```

That's it 🎉

Now you can use the `npx nuxthub deploy` command to deploy your content to NuxtHub.

```bash
npx nuxthub deploy
```

::note
Nuxt Content module automatically enables NuxtHub database. And update database configuration to use Cloudflare D1 with `DB` binding name. (This is default configuration for NuxtHub database.)

:br

You can override the database configuration by providing your own database configuration in `nuxt.config.ts`.
::

Checkout the [NuxtHub documentation](https://hub.nuxt.com/docs/getting-started/deploy){rel="nofollow"} for more information.


# Cloudflare Pages

::card
Quick Setup

1. Use `nuxi build --preset=cloudflare_pages` to build your app
2. Create D1 database and connect to your project in Cloudflare Dashboard under `DB` binding name
3. Deploy/Redeploy your app
::

---

Nuxt Content module has a built-in integration with [Cloudflare Pages](https://pages.cloudflare.com){rel="nofollow"} to deploy your content.

Module will automatically detects the build target and prepare the necessary configuration for Cloudflare Pages. Content module currently only support [`cloudflare-pages` presets](https://nuxt.com/deploy/cloudflare){rel="nofollow"}.

You can either use `--preset=cloudflare_pages` option on `nuxi build` command or use `nuxt.config.ts` to configure the preset.

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare_pages',
  },
});
```

The module requires a D1 database to be connected to the app in order to work. By default it will use the `DB` binding name. You can override the database configuration by providing your own database configuration in `nuxt.config.ts`.

After creating a new Cloudflare Pages project, you need to create a new D1 database and connect it to the project. Make sure to use the same binding name as the module is using. (default is `DB`)

That's it 🎉

Checkout:

- [Nuxt Deploy documentation](https://nuxt.com/deploy/cloudflare){rel="nofollow"}
- [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/){rel="nofollow"}
- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/){rel="nofollow"}


# Vercel

::card
Quick Setup

- Execute `npx vercel deploy` command or go to Vercel dashboard and create a new project using git repository.
::

---

Nuxt Content projects can be deployed to Vercel with zero configuration. The module will automatically detect a Vercel environment and will prepare the necessary configuration for deployment.

All you need to do is to execute `npx vercel deploy` command or go to Vercel dashboard and create a new project using git repository.

That's it 🎉

::note
By default module will use SQlite database in Vercel located at `/tmp` directory. You can override the database configuration by providing your own database configuration.

:br

There are a couple of database providers that are supported by Vercel. You can use any of them by providing the correct connection string in `nuxt.config.ts`.
::

Checkout:

- [Nuxt Deploy documentation](https://nuxt.com/deploy/vercel){rel="nofollow"}
- [Vercel documentation](https://vercel.com/docs/deployments/deployment-methods){rel="nofollow"}


# Netlify

::card
Quick Setup

- Go go Netlify dashboard and create a new project using git repository.
- Go to `Site Configuration` under `Dependency management` and change Node Version to `20.x` or higher.
- Go to `deploys` and retry last deployment.
::

---

Nuxt Content projects can be deployed to Netlify with zero configuration. The module will automatically detects Netlify environment and prepare the necessary configuration for Netlify.

All you need to do is to go to Netlify dashboard and create a new project using git repository.

::note
By default Netlify uses Node.js 18.x which is not supported by the module. You need to change the Node.js version in `Site Configuration` under `Dependency management`.
::

That's it 🎉

Checkout:

- [Nuxt Deploy documentation](https://nuxt.com/deploy/netlify){rel="nofollow"}
- [Netlify documentation](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/){rel="nofollow"}


# AWS Amplify

::card
Quick Setup

- Install `sqlite3` package in your project.
- Go to AWS Amplify dashboard and create a new project using git repository and deploy the app.
::

---

Nuxt Content projects can be deployed to AWS Amplify with zero configuration.
The module will automatically detect an AWS Amplify environment and will prepare the necessary configuration for deployment.

All you need to do is to install `sqlite3` package in your project and go to AWS Amplify dashboard and create a new project using git repository.

That's it 🎉

::note
By default module will use SQlite database located at `/tmp` directory. You can override the database configuration by providing your own database configuration.
::

Checkout:

- [Nuxt Deploy documentation](https://nuxt.com/deploy/aws-amplify){rel="nofollow"}


# Docker

Docker is a popular containerization platform that allows you to package your application with all its dependencies into a single container. This makes it easy to deploy your Content app on any platform that supports Docker.

## With Node.js image

Using Docker's Node.js image, you can deploy your Content app. All you need is to create a Dockerfile and build the image. Here is an example Dockerfile:

```docker [Dockerfile]
# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host
ENV PORT 80
ENV HOST 0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
```

## With Bun image

If you like to use Bun, you can use the official Bun image. Here is an example Dockerfile:

```docker [Dockerfile]
# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lockb ./

# use ignore-scripts to avoid builting node modules like better-sqlite3
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

RUN bun --bun run build

# copy production dependencies and source code into final image
FROM oven/bun:1 AS production
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "--bun", "run", "/app/server/index.mjs" ]
```


# Static Hosting

## What is Static Hosting?

Static hosting is a type of hosting where your website is built and served as static files (HTML, CSS, JS) that can be served by any static file server.

Nuxt Content can be deployed to static hosting using Nuxt prerendering.

## Building with SSG

To build your app with static site generation, run the following command:

```bash
npx nuxi generate
```

::tip{icon="i-lucide-check"}
This command will create a `dist/` directory with your static site. You can upload it to any static hosting service.
::

Nuxt will automatically pre-render all pages using an internal crawler, you can customize it's behavior with the `nitro.prerender` options.

::note{to="https://nuxt.com/docs/getting-started/prerendering"}
Learn more about pre-rendering in Nuxt.
::

## What about the Database?

Nuxt Content will load the database in the browser using [WASM SQLite](https://content.nuxt.com/docs/advanced/database#wasm-sqlite-in-browser), this way, the content queries happening on client-side navigation or actions will run in the browser.


# Full-Text Search

Content module exposes a handy utility [`queryCollectionSearchSections`](https://content.nuxt.com/docs/utils/query-collection-search-sections) to break down content files into searchable sections. This is useful for implementing full-text search in your website. You can use the result of this utility in combination with [Nuxt UI Content Search](https://ui.nuxt.com/pro/components/content-search){rel="nofollow"} or other search libraries like [Fuse.js](https://fusejs.io/){rel="nofollow"}, [minisearch](https://lucaong.github.io/minisearch){rel="nofollow"}, etc.

## Nuxt UI Pro

Nuxt UI Pro provides a ready to use component for full-text search. You can use it by passing the result of `queryCollectionSearchSections` to the `files` prop of the component.

Read more about [Nuxt UI Content Search](https://ui.nuxt.com/pro/components/content-search){rel="nofollow"}.

::code-group
```vue [UContentSearchExample.vue]
<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = await useAsyncData('search', () => queryCollectionSearchSections('docs'))

const searchTerm = ref('')
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :files="files"
    :navigation="navigation"
    :fuse="{ resultLimit: 42 }"
  />
</template>
```

  :::preview-card{label="Live Preview"}
    ::::example-fulltext-content-search
    ::::
  :::
::

## MiniSearch example

Read more about [minisearch](https://lucaong.github.io/minisearch){rel="nofollow"}.

::code-group
```vue [MiniSearchExample.vue]
<script setup lang="ts">
import MiniSearch from 'minisearch'

const query = ref('')
const { data } = await useAsyncData('search', () => queryCollectionSearchSections('docs'))

const miniSearch = new MiniSearch({
  fields: ['title', 'content'],
  storeFields: ['title', 'content'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
})

// Add data to the MiniSearch instance
miniSearch.addAll(toValue(data.value))
const result = computed(() => miniSearch.search(toValue(query)))
</script>

<template>
  <UContainer class="p-4">
    <UCard>
      <UInput v-model="query" placeholder="Search..." />
      <ul>
        <li v-for="link of result" :key="link.id" class="mt-2">
          <NuxtLink :to="link.id">{{ link.title }}</NuxtLink>
          <p class="text-gray-500 text-xs">{{ link.content }}</p>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>
```

  :::preview-card{label="Live Preview"}
    ::::example-fulltext-mini-search
    ::::
  :::
::

## Fuse.js example

Read more about [Fuse.js](https://fusejs.io){rel="nofollow"}.

::code-group
```vue [FusejsExample.vue]
<script setup lang="ts">
import Fuse from 'fuse.js'

const query = ref('')
const { data } = await useAsyncData('search-data', () => queryCollectionSearchSections('docs'))

const fuse = new Fuse(data.value, {
  keys: ['title', 'description']
})

const result = computed(() => fuse.search(toValue(query)).slice(0, 10))
</script>

<template>
  <UContainer class="p-4">
    <UCard>
      <UInput v-model="query" placeholder="Search..." class="w-full" />
      <ul>
        <li v-for="link of result" :key="link.item.id" class="mt-2">
          <UButton variant="ghost" class="w-full" :to="link.item.id">
            {{ link.item.title }}
            <span class="text-gray-500 text-xs">
              {{ link.item.content?.slice(0, 100) }}...
            </span>
          </UButton>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>
```

  :::preview-card{label="Live Preview"}
    ::::example-fulltext-fusejs
    ::::
  :::
::


# Raw Content

There were lots of requests in Content version 2 about accessing contents raw data in production. In Content version 3 it is possible to ship contents raw data to production.

In order to ship raw contents to production you need to define `rawbody` field in your collection's schema. That's it.

Nuxt Content will detect this magical field in your schema and fill it with the raw content.

```ts [content.config.ts]

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      source: '**',
      type: 'page',
      schema: z.object({
        rawbody: z.string()
      })
    })
  }
})
```

And you can use `queryCollection()` to fetch the raw content.

```vue [pages/index.vue]
<script setup lang="ts">
const route = useRoute()
const { data } = useAsyncData('page-' + route.path, () => queryCollection('docs').path(route.path).first())
</script>

<template>
  <pre>{{ data.rawbody }}</pre>
</template>
```

In case you don't want to ship raw content of a specific file you can add `rawbody: ''` to frontmatter of that file. The auto filled value of `rawbody` is acting like default value and when you define `rawbody` in the frontmatter it will overwritten.

```md [content.md]
---
title: My page
rawbody: ''
---

```

::callout
It is important to fill frontmatter fields with a same type of data that is defined in collection schema. In this case `rawbody` is a string, and you should consider passing empty string. Do not use `boolean` or other type of values.
::


# Database

In Content v3, we have introduced a robust storage layer based on SQLite, which offers a powerful and efficient method for managing content. This marks a significant enhancement over the previous file-based storage system, which was constrained by performance and scalability limitations.

> In Content v2, the system read and parsed content during the Nitro runtime, creating a cache file for each content file to store the parsed data. This method introduced considerable overhead to the website's runtime.
>
> - The I/O time in production was substantial, as the module had to load all cache files to search through the content.
> - Additionally, the lack of optimization and compression for the content resulted in a large bundle size, particularly problematic in edge environments.

Content management in Content v3 involves three key steps, which are designed to streamline the process and enhance performance.

## Generating Database Dump

For each collection in your project, the module reads the content from the defined source and parses it into an Abstract Syntax Tree (AST). It creates a specific table for each collection based on its schema. The parsed content is then inserted into the corresponding table, ensuring that the data structure aligns with the defined schema for optimal querying. Everything is then saved in a dump file.

## Restoring Dump on Cold Start

During runtime, when the application executes the first query to retrieve content, the module reads the generated dump from the previous step and restores it into the target database. This process is fast and optimized for each deployment mode and platform.

The module employs a special integrity check mechanism to ensure that the database is updated with the latest content. This same integrity check also prevents duplicate imports, maintaining the integrity and accuracy of the data stored.

## WASM SQLite in Browser

For client-side navigation, the module utilizes a similar approach. When the application executes the first query for content, it downloads the generated dump from the server and initializes a local SQLite database within the browser. From that point onward, all queries are executed locally without needing to call the server, significantly improving the responsiveness of the application and providing a seamless user experience.

This architecture not only enhances performance but also allows for offline capabilities, enabling users to access content even without an active internet connection. The combination of server-side and client-side processing ensures that Nuxt Content v3 is both powerful and flexible, catering to a wide range of use cases and environments.


# Tools

Nuxt Content uses an &#x2A;*SQLite database (`contents.sqlite`)** to store and query content efficiently. If you're running into **missing content, slow queries, or database issues**, debugging your SQLite database can help!

::callout
---
icon: i-simple-icons-visualstudiocode
to: https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite
---
A simple way to inspect it? **Use the SQLite VS Code extension!**
::

## Install SQLite VS Code Extension

1. Open **Visual Studio Code**.
2. Go to the **Extensions** panel (`Ctrl+Shift+X` / `Cmd+Shift+X` on Mac).
3. Search for &#x2A;*"SQLite"** (by `alexcvzz`) and install it.
4. Open your Nuxt Content database (`.data/content/contents.sqlite`).

::tip{icon="i-lucide-lightbulb"}
If you don't see `contents.sqlite`, start your Nuxt app first:

```bash [Terminal]
npx nuxi dev
```
::

## Locate Your SQLite Database

Nuxt Content stores its database here:

```bash
.data/content/contents.sqlite
```

::note{to="https://nuxt.com/docs/getting-started/prerendering"}
This file is automatically generated when you start your Nuxt app. No need to create it manually!
::

## Open & Explore the Database

1. **Right-click** on `contents.sqlite` in VS Code.
2. Select &#x2A;*"Open Database"**.
3. Expand the **Database Explorer** panel to view tables & data.

![SQLite Explorer in VS Code](https://github.com/user-attachments/assets/c9f22c4c-7a95-43e8-ab03-aa76f2e49c8e)

## Fixing Common Issues

### Content Not Showing?

1. **Check if the database exists** (`.data/content/contents.sqlite`).
2. **Run a cleanup & restart Nuxt**:

   ```bash [Terminal]
   npx nuxi cleanup && npx nuxi dev
   ```
3. **Check if content is inside the database** (run an SQL query).

### Manually Reset the Database

If things seem **really broken**, try resetting it:

1. **Delete the database file**:

   ```bash [Terminal]
   rm -rf .data/content/contents.sqlite
   ```
2. **Run cleanup** to remove old caches:

   ```bash [Terminal]
   npx nuxi cleanup
   ```
3. **Restart Nuxt** to generate a fresh database:

   ```bash [Terminal]
   npx nuxi dev
   ```

::note{icon="i-lucide-triangle-alert"}
Cleaning up will remove cached data. Don't worry—it regenerates automatically!
::

## More Debugging Tools

If VS Code isn’t enough, check out:

- 🖥️ [**DB Browser for SQLite**](https://sqlitebrowser.org/){rel="nofollow"} – A visual tool for inspecting & modifying the database.
- 🛠️ **SQLite Command Line** – Use `sqlite3 contents.sqlite` to run SQL queries from your terminal.


# Hooks

## `content:file:beforeParse`{.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}

This hook is called before the content is parsed.

It can be used to modify the raw content from a `file` before it is transformed
or modify the transform options.

```ts
export default defineNuxtConfig({
  hooks: {
    'content:file:beforeParse'(ctx) {
      // ...
    }
  }
})
```

## `content:file:afterParse`{.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}

This hook is called after the content is parsed and before it is saved to the database.

```ts
export default defineNuxtConfig({
  hooks: {
    'content:file:afterParse'(ctx) {
      // ...
    }
  }
})
```

## Example Usage

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  hooks: {
    'content:file:beforeParse'(ctx) {
      const { file } = ctx;

      if (file.id.endsWith(".md")) {
        file.body = file.body.replace(/react/gi, "Vue");
      }
    },
    'content:file:afterParse'(ctx) {
      const { file, content } = ctx;

      const wordsPerMinute = 180;
      const text = typeof file.body === 'string' ? file.body : '';
      const wordCount = text.split(/\s+/).length;

      content.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
  }
})
```

::note{icon="i-lucide-info"}
In the `content:file:afterParse` hook, we added a custom property to our content object. To be able to access that property within our pages using [`queryCollection()`](https://content.nuxt.com/docs/utils/query-collection), we first need to define it in our content schema.

```ts [content.config.ts]
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        readingTime: z.number().optional()
      })
    })
  }
});
```
::


# Custom Source

By default, Nuxt Content provides some built-in sources like local files source and remote Github source. However this is not enough for some cases, for example, you want to fetch data from a remote API. In this case, you can define a custom source to fetch data and use it in your collections.

Using `defineCollectionSource`, you can define a custom source.

```ts
import { defineCollectionSource } from '@nuxt/content'

const hackernewsSource = defineCollectionSource({
  getKeys: () => {
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => res.json())
      .then(data => data.map((key: string) => `${key}.json`))
  },
  getItem: (key: string) => {
    const id = key.split('.')[0]
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(res => res.json())
  },
})
```

Then you can use this source in your collections.

```ts [content.config.ts]
import { defineContentConfig, defineCollectionSource, defineCollection, z } from '@nuxt/content'

const hackernewsSource = defineCollectionSource({
  getKeys: () => {
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => res.json())
      .then(data => data.map((key: string) => `${key}.json`))
  },
  getItem: (key: string) => {
    const id = key.split('.')[0]
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(res => res.json())
  },
})

const hackernews = defineCollection({
  type: 'data',
  source: hackernewsSource,
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.string(),
    score: z.number(),
    url: z.string(),
    by: z.string(),
  }),
})

export default defineContentConfig({
  collections: {
    hackernews,
  },
})
```


# LLMs Integration

The Nuxt Content module integrates [`nuxt-llms`](https://github.com/nuxtlabs/nuxt-llms){rel="nofollow"} to prepare your content for Large Language Models (LLMs). When `nuxt-llms` is detected, Content module automatically extends the LLMs module and inject collections of type [page](https://content.nuxt.com/docs/collections/types#page-type){rel="nofollow"} to the LLMs module.🚀

## Setup

::prose-steps
### Install the required module

```bash [terminal]
npm install nuxt-llms
```

### Configure your `nuxt.config.ts`

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-llms'],
  llms: {
    domain: 'https://your-site.com',
    title: 'Your Site Name',
    description: 'A brief description of your site',
  },
})
```
::

That's it 🚀 `/llms.txt` file is automatically generated and pre-rendered.

## Sections

When generating content, you can create custom sections to process your content into LLM-friendly formats.

You can create custom sections to the `llms.sections` array and define the `contentCollection` and `contentFilters` option for each section.

::prose-warning
If there is no section defined in the `contentCollection` option, the module will only add [page](https://content.nuxt.com/docs/collections/types#page-type){rel="nofollow"} collections to the LLMs module.
::

### `contentCollection`

This option specifies which content collection to use as source.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  llms: {
    sections: [
      {
        title: 'Documentation',
        description: 'Technical documentation and guides',
        contentCollection: 'docs',
       },
    ],
  },
})
```

### `contentFilters`

This options defines filters to select specific content within the collection.

You precisely control which content is included. Each filter consists of:

- `field`: The content property to check
- `operator`: Comparison operator (`=`, `<>`, `>`, `<`, `LIKE`, `IN`, `NOT IN`, `IS NULL`, `IS NOT NULL`, etc.)
- `value`: The value to compare against

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  llms: {
    sections: [
      {
        title: 'Documentation',
        description: 'Technical documentation and guides',
        contentCollection: 'docs',
        contentFilters: [
            // Only include markdown files
            { field: 'extension', operator: '=', value: 'md' },
            // Only include published content
            { field: 'draft', operator: '<>', value: true },
            // Filter by directory
            { field: 'path', operator: 'LIKE', value: '/guide%' },
        ]
      },
    ],
  },
})
```

::tip{to="https://github.com/nuxtlabs/nuxt-llms"}
Checkout the nuxt-llms documentation for more information about the module.
::


# Setup Nuxt Studio

Studio is an intuitive CMS interface to edit your Nuxt Content websites.

It takes advantage of the `Preview API` included in Nuxt Content to propose the best editing experience for your content files. Editors can benefit from a user-friendly interface to edit their `Markdown`, `YAML` or `JSON` files.

Developers can customize the editing experience and provide tools to the editor who can focus on content without requiring any technical expertise.

:video{autoplay controls loop poster="/home/videos/HomeNotionLikePoster.webp" src="https://res.cloudinary.com/nuxt/video/upload/v1733494722/contentv3final_rc8bvu.mp4"}

## Authentication

The Studio admin is located on [nuxt.studio](https://nuxt.studio){rel="nofollow"}. From there you can either login with GitHub or with Google. Both methods give you the same editing rights but since Studio is [synchronized with GitHub](https://content.nuxt.com/docs/studio/github), the repository import must be handled by a GitHub user.

::warning
Google authentication is adapted for non technical users. Google users have to join a team with existing projects to edit them.
::

## Connect your Nuxt Content Repository

Once you are logged in the admin, you have the possibility to import your Nuxt Content repository from the interface.

::tip
Two options are available, you can either import an existing repository or use one of our [templates](https://content.nuxt.com/templates).
::

The only requirement is to host your repository on GitHub. From the interface, connect to our [GitHub app](https://content.nuxt.com/docs/studio/github), you'll be then able to link a GitHub repository to your Studio project.

Once the project is created, you can start editing your files with the Studio editors and publish your changes.

## **Enable the Full Editing Experience**

To unlock the complete range of features in Studio, make sure your project URL is properly configured in the deployment section.

**This will enable all Studio features including:**

- **Live preview of your website:** instantly see changes reflected on your site as you work.
- **Dynamic form generation:** Automatically generate forms to edit your files based on your Nuxt Content [collections](https://content.nuxt.com/docs/collections/define).
- **Enhanced markdown editors:** enjoy an improved editing experience, including the ability to list and integrate [Vue components](https://content.nuxt.com/docs/studio/content#vue-components) that you’ve exposed.
- **Automatic app configuration:** generate [application configurations](https://content.nuxt.com/docs/studio/config) based on the schema you’ve defined.

::tip
We are proposing a GitHub Pages deployment. By using it, we will handle all the requirements for you. However, if you want to use the deployment platform of your choice, please follow the simple guideline below.
::

To be able to set your URL in Studio, you just need to set the `Preview API` in the content configuration of your `nuxt.config.ts` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  }
})
```

Once deployed, you can ensure the `Preview API` has been activated by navigating to the `/__preview.json` page on your site. This metadata page is automatically generated by the Content module and must be accessible to connect your URL in the self-hosted section of Studio.

### Troubleshooting

The `__preview.json` file is generated but you encounter a `Forbidden error: invalid property check` when setting your URL in the self-hosted section, follow these steps:

::prose-steps{level="4"}
#### Ensure the `gitInfo` field is set and accurate in the `__preview.json` file

```json [https://your-website.com/__preview.json]
"gitInfo": {
  "name": "content",
  "owner": "nuxt",
  "url": "https://github.com/nuxt/content"
},
```

  :::warning
  This information should be populated automatically in most cases. We support most popular providers (NuxtHub, Vercel, Netlify, etc.), but if you're using a non supported provider or a custom one, it may not be fetched correctly.
  :::

#### Override `gitInfo` in your `nuxt.config.ts`

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'Your repository name',
        owner: 'Your repository owner/organization',
        url: 'Your GitHub repository URL'
      }
    }
  }
})
```

#### Ensure these fields are correctly set in `__preview.json`

The `Forbidden error` should be resolved and you should be able to set your URL on Nuxt Studio. If not, please contact us on the [Discord server](https://discord.gg/sBXDm6e8SP){rel="nofollow"}.
::


# Real time synchronization between Studio and GitHub

::tip
This section explains the syncronization behaviour between Studio and GitHub. This process is handled directly from the platform and does not require any external action. This page purpose is purely informational.
::

## Overview

Nuxt Studio integrates with the [GitHub](https://github.com){rel="nofollow"} API, enabling smooth synchronization between Studio and your GitHub repositories. This first-class integration is made possible through the utilization of [GitHub Apps](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps#about-github-apps){rel="nofollow"}.

## Installation

During Studio project creation, you'll need to install the [Nuxt Studio GitHub App](https://github.com/apps/nuxt-studio){rel="nofollow"} in your personal account or in the organizations you manage. Installing a GitHub App requires either organization ownership or admin permissions in a repository. If you lack the necessary permissions, the repository owner will need to approve the request.

You can access the installation page from anywhere on the app by clicking on [Install with GitHub](https://github.com/apps/nuxt-studio/installations/new){rel="nofollow"}.

### Permissions

During the installation of our GitHub app, you will be prompted to grant certain permissions:

- Read access to `actions`, `metadata`, `members`, and `plan`
- Read and write access to `secrets`, `administration`, `contents`, `pages`, `pull requests` and `workflows`

We need read access to `actions` to send a notification when a workflow run fails on a pull request or on the repository default branch. `metadata` is mandatory to fetch repository data, `members` to import your organization members and repository collaborators and `plan` is used to propose features based on your GitHub account plan.

Nuxt Studio acts on your behalf to create repositories, branches, pull requests, and perform commits and merges. We also offer one-click deployment to GitHub Pages with instant preview of workflows and environment variables secrets management. To accomplish this, we need read and write access to `administration`, `contents`, `pages`, `pull requests`, `workflows` and `secrets`.

### Repositories Installations

When installing our GitHub app, you will be prompted to select all repositories or a subset of them. This selection can be changed at any time by going to the [GitHub app settings](https://github.com/apps/nuxt-studio/installations/new){rel="nofollow"}.

By clicking on `Install`, Nuxt Studio will install each repository you have selected, enabling you to perform all the actions listed above.

## Uninstall

All the data imported from GitHub is directly associated with your GitHub app installation. If you uninstall the GitHub app, all the associated data will be deleted.

If you delete your GitHub repository, the associated Nuxt Studio project will be automatically removed. However, if this project was subscribed to a Team plan, the subscription will not be canceled automatically. You will need to manually end the subscription via [Lemon Squeezy]() or [contact us](https://content.nuxt.com/team@nuxt.studio) for assistance.


# Edit your content

Nuxt Studio offers a versatile workspace for both developers and content writers, giving them the freedom to choose between our differents editors:

- [Notion-like editor](https://content.nuxt.com/#notion-like-editor-markdown-files) for `Markdown` files
- [Form editor](https://content.nuxt.com/#form-editor-yaml-and-json-files) for `YAML` and `JSON` files
- [Code editor](https://content.nuxt.com/#code-editor) for any kind of files (for technical users only)

::tip
You can choose your favorite editor from the settings page of your project.
::

Each editor serves its own purpose. Some users are used to code edition, while others prefer a non-technical, visual approach. At the end, **code syntax is the final output** for both editors.

## Notion-like editor (`Markdown` files)

![edit your website with a visual interface](https://content.nuxt.com/docs/studio/visual-markdown-editor.webp)

This editor is heavily inspired by Notion, well known for its intuitive design and flexibility. Much like a standard text editor, this editor is designed to be familiar and easy to use. However, it stands out with its additional features that improve the writing experience.

::tip{to="https://content.nuxt.com/blog/visual-editor"}
You want to know how we've built this editor and how it works under the hood? Check this blog post.
::

### Frontmatter

[Frontmatter](https://content.nuxt.com/docs/files/markdown#frontmatter) is a convention of Markdown-based CMS to provide meta-data to pages, like description or title or any other data you would like to store as `key: value` pair.

Based on the user [collection and schema](https://content.nuxt.com/docs/collections/define) provided, a form is generated to edit this metadata from the editor.

:video{autoplay controls loop poster="/home/videos/HomeNotionLikePoster.webp" src="https://res.cloudinary.com/nuxt/video/upload/v1739982761/frontmatterform_yjafgt.mp4"}

::prose-note{to="https://content.nuxt.com/#form-editor-yaml-and-json-files"}
Check this section to learn more about form generation based on schema.
::

### Toolbar

Highlight your text to reveal the toolbar, giving you access to all the standard text editing features (title formatting, Bold, Italic, Strike-through, code, link, class, bullet list, numerated list...).

### Medias

Users can simply drag and drop images directly into the editor. An upload modal will open to let you choose the destination folder.

By typing `/` and searching for `Image` or `Video`, they can quickly insert a media. A modal will open to let them choose the media they want to insert from the media gallery (aka the`public` folder of the Nuxt application).

From the media modal, you can set the [alt attribute](https://www.w3schools.com/tags/att_img_alt.asp){rel="nofollow"} for SEO and accessibility purpose.

### Vue Components

One of this editor standout features is its ability to integrate and customize any complex `Vue` component directly within the editor.

#### Create and integrate your own component

A developer can create any kind of visually complex components and editors will be able to use them and focus on the content. An editor can also play with the component properties, styles, and behaviour to fit its specific requirements as long as the developer made it customisable.

::steps{level="4"}
#### Create your component

You can create Vue components and integrate them into Markdown. They just need to be located in the `/components/content` folder to be available.

```vue [components/content/HomeFeature.vue]
<template>
  <div class="flex items-start gap-3">
    <div class="flex items-center justify-center border rounded-lg p-1.5">
      <UIcon :name="icon" />
    </div>
    <div class="flex flex-col">
      <h3 class="font-semibold">
        <ContentSlot name="title" />
      </h3>
      <span>
        <ContentSlot name="description" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'i-ph-cursor-click',
  },
})
</script>
```

#### Integrate these components easily within any Markdown file using [MDC syntax](https://content.nuxt.com/docs/files/markdown#mdc-syntax)

```mdc [content/index.md]
::home-feature
  ---
  icon: i-mdi-vuejs
  ---
  #title
  Embedded Vue components
  #description
  Edit slots and props inside the Notion-like editor.
::
```

#### Edit them with our Studio editors

The visual editor simplifies the component edition, allowing you to integrate and edit them directly in the visual editor. Non technical users can play with **slots** and **props** without any technical knowledge.

:video{autoplay controls loop src="https://res.cloudinary.com/nuxt/video/upload/v1744126742/studio/finalpropscomps_usfabp.mp4"}

All components in the `/components/content` folder are available in the editor. Studio users can type `/` anywhere while editing to access the list of available components.

  :::tip{to="https://content.nuxt.com/docs/studio/debug"}
  Take a look at this section to validate your 
  
  `Vue`
  
   component integration in the editor in local development.
  :::
::

#### Integrate built-in components from external libraries

By default, you can integrate any component inside a Markdown file and it should work and be editable from Studio but external components **won't be displayed in the components list in Studio and can't be integrated manually by a Studio editor**.

To list this component inside Studio and fetch all its metadata, you need to set it as global in your Nuxt config file.

Here is an example to integrate Button and Icon components from the [Nuxt UI](https://ui.nuxt.com){rel="nofollow"} library:

```ts
export default defineNuxtConfig({
  hooks: {
    'components:extend': (components) => {
      const globals = components.filter(c => ['UButton', 'UIcon'].includes(c.pascalName))

      globals.forEach(c => c.global = true)
    }
  },
})
```

## Form editor

![YAML and JSON edition with auto generated form](https://content.nuxt.com/blog/frontmatters.png)

This editor is used whether you’re editing the [frontmatter]() of a `Markdown` file or a `JSON` / `YAML` file.

It eliminates the need to interact directly with complex file syntax. Instead, a form is automatically generated based on the provided user [collection schema](https://content.nuxt.com/docs/collections/define).

### **Defining your form with** `zod` Schema

::prose-note{to="https://content.nuxt.com/docs/collections/define"}
Learn more about schema collection definition in the dedicated section.
::

Once the `schema` property has been defined in your collection, this will automatically generate the corresponding form on Studio interface.

::prose-code-group
```ts [content.config.ts]
export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        draft: z.boolean().default(false),
        category: z.enum(['Alps', 'Himalaya', 'Pyrenees']).optional(),
        date: z.date(),
        image: z.object({
          src: z.string().editor({ input: 'media' }),
          alt: z.string(),
        }),
        slug: z.string().editor({ hidden: true }),
        icon: z.string().optional().editor({ input: 'icon' }),
        authors: z.array(z.object({
          slug: z.string(),
          username: z.string(),
          name: z.string(),
          to: z.string(),
          avatar: z.object({
            src: z.string(),
            alt: z.string(),
          }),
        })),
      }),
    }),
  },
})    
```

  :::preview-card{icon="i-lucide-eye" label="Generated Form"}
  ![Form preview](https://content.nuxt.com/docs/studio/preview-schema.png)
  :::
::

### **Native Inputs Mapping**

Primitive Zod types are automatically mapped to appropriate form inputs in:

- **String** → Text input
- **Date** → Date picker
- **Number** → Number input (counter)
- **Boolean** → Toggle switch
- **Enum** → Select dropdown
- **Arrays of strings** → List of badge inputs
- **Arrays of objects** → Accordion of items with embedded form

:video{autoplay controls loop poster="https://res.cloudinary.com/nuxt/video/upload/v1740679550/arrayobjectandstring_r1jpvz.jpg" src="https://res.cloudinary.com/nuxt/video/upload/v1740679550/arrayobjectandstring_r1jpvz.mp4"}

### Custom Inputs Mapping

Studio goes beyond primitive types. You can customise form fields using the `editor` method, which extends Zod types with metadata to empower editor interface.

This allows you to define custom inputs or hide fields.

#### Usage

```ts [content.config.ts]
mainScreen: z.string().editor({ input: 'media' })
```

#### Options

##### `input: 'media' | 'icon'`

You can set the editor input type. Currently `icon` and `media` are available.

##### `hidden: Boolean`

This option can be set to avoid the display of a field in the Studio editor.

::prose-tip
Studio inputs are fully extensible. We can create as many input as we want based on our users needs.
::

## Code editor

![Edit directly your raw content with our code editor](https://content.nuxt.com/docs/studio/code-editor.webp)

Even though the two previous editors are dedicated to a specific file extension (`md` or `yaml`/`json`). The code editor can be used with any kind of file.

It provides full control over your content, allowing you to write raw content directly:

- [MDC](https://content.nuxt.com/docs/files/markdown) syntax for `Markdown` files
- [JSON](https://content.nuxt.com/docs/files/json) or [YAML](https://content.nuxt.com/docs/files/yaml) syntax

When your file is saved with the code editor, the content is stored exactly as you've written it, preserving all specific syntax and formatting. This editor is ideal for users comfortable with code syntax (`Markdown`, `YAML` or `JSON`) who want precise control over structure of their content.


# Manage and integrate Medias in Nuxt Content Studio CMS

## Browse your medias

All medias located in the `/public` directory are available in the **Media** tab of the Studio platform.

![Media gallery on Studio](https://content.nuxt.com/docs/studio/editors-medias.webp)

It's an intuitive interface for non technical users to manage their `/public` directory.

Users can easily browse folders, upload new media at any level, and drag and drop media into other folders, making medias organization straightforward.

The interface is designed to be intuitive for non-technical users. It can be viewed as a user friendly IDE.

## Use it in the Notion-like editor

Users can simply drag and drop images directly into the editor. An upload modal will open to let you choose the destination folder.

By typing `/` and searching for `Image`, they can quickly insert a media. A modal will open to let them choose the media they want to insert.

From the media modal, you can set the [alt attribute](https://www.w3schools.com/tags/att_img_alt.asp){rel="nofollow"} for SEO and accessibility purpose.


# Tailor application configuration edition

When entering the **Config** tab of the editor, you can browse configurations to customize your website. These configurations represent the settings defined in your `app.config.ts` file.

## `app.config.ts`

The [`app.config.ts`](https://nuxt.com/docs/guide/directory-structure/app-config){rel="nofollow"} file is a configuration file introduced in Nuxt 3. It's a TypeScript file that allows you to configure various aspects of your application settings. Developers can easily turn any website into a configurable experience using this file.

## Customize edition

::prose-note
Ensure you have at least an empty config file in your app.

```ts [app.config.ts]
export default defineAppConfig({})
```
::

To create a customized editing experience for your `app.config.ts` in Studio, you need to create a `nuxt.schema.ts` file in your project. This schema serves as a representation of your `app.config.ts`.

### Helpers

::prose-note
Those helpers are provided by the Nuxt Content `Preview API`.
::

- The `group` method allows you to customize parent objects.
- The `field` method allows you to customize inputs (aka leaf).

```ts [nuxt.schema.ts]
import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    parent: group({
      title: 'Parent title',
      description: 'Parent description.',
      icon: 'i-icon-to-display',
      fields: {
        leaf: field({
          type: 'Type of component used to edit your field',
          title: 'Field title',
          description: 'Field Description',
          icon: 'i-icon-to-display',
          default: 'default value'
        })
      }
    })
  }
})
```

::tip
It is not mandatory to include all your app config keys; only those you wish to showcase on the Studio interface need to be added.
::

#### Input Types

The `type` in the `field()` method's first parameter can accept various values:

- string
- number
- boolean
- array
- object
- icon
- media

Based on these values, the Studio UI will adapt to display the appropriate input type. For instance, an icon picker is displayed for `icon` type or the media library is displayed for `media` type.

Text can be displayed as a select instead on a classical input if you provide a `required` key in the `field()` method:

```ts [nuxt.schema.ts]
import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    parent: group({
      title: 'UI',
      description: 'UI configuration',
      icon: 'i-ph-palette-fill',
      fields: {
        primary: field({
          type: 'string',
          title: 'Primary',
          description: 'Primary color of your UI.',
          icon: 'i-ph-palette',
          default: 'sky',
          required: ['sky', 'mint', 'rose', 'amber']
        })
      }
    })
  }
})
```

### Edit on Studio

Once your schema is deployed. Any user can access the **Data** section and play with the generated form.

Any update in the form will be directly applied to the `app.config.ts` file. You can review those changes on the review page.

::code-group
  :::preview-card{icon="i-lucide-eye" label="Preview"}
  ![app config UI on Studio](https://content.nuxt.com/docs/studio/home-data-studio-dark.webp)
  :::

```ts [nuxt.schema.ts]
export default defineNuxtSchema({
  ui: group({
    title: 'UI',
    description: 'UI Customization.',
    icon: 'i-mdi-palette-outline',
    fields: {
      primary: field({
        type: 'string',
        title: 'Primary',
        description: 'Primary color of your UI.',
        icon: 'i-mdi-palette-outline',
        required: ['sky', 'mint', 'rose', 'amber', 'violet', 'emerald', 'fuchsia', '...']
      }),
      gray: field({ ... }),
      icons: group({
        title: 'Icons',
        description: 'Manage icons used in UI Pro.',
        icon: 'i-mdi-application-settings-outline',
        fields: {
          search: field({ ...}),
          dark: field({ ... }),
          light: field({ ... }),
          external: field({ ...}),
          chevron: field({ ... }),
          hash: field({ ... })
        }
      })
    }
  })
})
```
::

::tip{to="https://content.nuxt.com/docs/studio/debug"}
Take a look at this section to validate your schema in local development.
::

::tip{to="https://github.com/nuxt-ui-pro/docs/blob/main/nuxt.schema.ts"}
For a practical example, take a look at the schema we've developed for the UI Pro Docs starter.
::


# Local Debug

## Purpose

The goal of this section is to explain how to validate your customization in local before publishing on production.

It can help if:

- You want to create a `nuxt.schema.ts` file and [generate the appropriate interface](https://content.nuxt.com/docs/studio/config) on Studio.
- You want to integrate [custom Vue components](https://content.nuxt.com/docs/studio/content) and ensure edition is working as expected in the editor.

## Tutorial

::steps
### Import your project on Studio

### Clone your repository on local

### Enable Nuxt Content preview in development

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      // force module initialization on dev env
      dev: true
    }
  }
})
```

### Launch your app using your dev command with `--tunnel` to expose it to the internet

```bash [Terminal]
npx nuxt dev --tunnel
```

![local tunnel expose](https://content.nuxt.com/docs/studio/dev-tunnel.png)

### Ensure the metadata file has been generated

`__preview.json` file should accessible from `https://your-localtunnel-url/__preview.json`

### Copy the tunnel URL and copy it in the self-hosting section of the deployment tab on Studio platform
::

::tip
That's it! You should now be able to access Studio UI and confirm that your config interface has been successfully generated and your Vue components are available with their props and slots in the editor.
::

::warning
Any modification of your `nuxt.config.ts` file or any changes in a Vue file require a restart of the Nuxt dev server. Once the server has restarted you can synchronize the Studio interface by calling the `Sync meta` action from command menu :shortcut{value="meta"} :shortcut{value="K"} . A refresh of the Studio app should also apply the update.
::


# The git-based CMS for Nuxt projects.

::u-page-hero
  :::div{.hidden.sm:block}
    ::::u-color-mode-image
    ---
    class: size-full absolute bottom-0 inset-0 z-[-1]
    dark: /home/hero-dark.svg
    light: /home/hero-light.svg
    ---
    ::::
  :::

#title{unwrap="p"}
The git-based CMS for :br Nuxt projects.

#description
Nuxt Content is a module for Nuxt that provides a simple way to manage content for your application. It allows developers to write their content in Markdown, YAML, CSV or JSON files and then query and display it in their application.

#links{unwrap="p"}
  :::u-button
  ---
  label: Get Started
  size: xl
  to: https://content.nuxt.com/docs/getting-started/installation
  trailingIcon: i-lucide-arrow-right
  ---
  :::

  :::u-button
  ---
  color: neutral
  label: Open Visual Editor
  size: xl
  target: _blank
  to: https://nuxt.studio
  variant: subtle
  ---
  :::
::

::u-page-section
#features
  :::u-page-feature
  ---
  icon: i-lucide-files
  ---
  #title{unwrap="p"}
  File-based CMS
  
  #description{unwrap="p"}
  Write your content in Markdown, YAML, CSV or JSON and query it in your components.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-filter
  ---
  #title{unwrap="p"}
  Query Builder
  
  #description{unwrap="p"}
  Query your content with a MongoDB-like API to fetch the right data at the right time.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title{unwrap="p"}
  SQLite powered
  
  #description{unwrap="p"}
  Add custom fields to your content, making it suitable for various types of projects.
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title{unwrap="p"}
  Markdown with Vue
  
  #description{unwrap="p"}
  Use Vue components in Markdown files, with props, slots and nested components.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-list-minus
  ---
  #title{unwrap="p"}
  Code highlighting
  
  #description{unwrap="p"}
  Display beautiful code blocks on your website with the Shiki integration supporting VS Code themes.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-mouse-pointer-click
  ---
  #title{unwrap="p"}
  Visual Editor
  
  #description{unwrap="p"}
  Let your team edit your Nuxt Content project with Nuxt Studio, our visual editor.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-panel-left
  ---
  #title{unwrap="p"}
  Navigation Generation
  
  #description{unwrap="p"}
  Generate a structured object from your content files and display a navigation menu in minutes.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-heading-1
  ---
  #title{unwrap="p"}
  Prose Components
  
  #description{unwrap="p"}
  Customize HTML typography tags with Vue components to give your content a consistent style.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-globe
  ---
  #title{unwrap="p"}
  Deploy everywhere
  
  #description{unwrap="p"}
  Nuxt Content works on all hosting providers, static, server, serverless & edge.
  :::
::

::u-page-section
#title
Everything you need for content management

#description
Combine file-based simplicity with Vue component power. Build content-rich websites, from documentation pages to complex applications.

  :::div{.hidden.sm:block}
    ::::u-color-mode-image
    ---
    class: size-full absolute top-0 inset-0
    dark: /home/features-dark.svg
    light: /home/features-light.svg
    ---
    ::::
  :::
::

::u-page-section
---
reverse: true
orientation: horizontal
---
  :::code-group
    ::::preview-card{.!h-[458px] icon="i-lucide-eye" label="Preview"}
      :::::example-landing-hero
      ---
      class: "!h-[458px]"
      image: /mountains/everest.jpg
      ---
      #title
      The Everest.
      
      #description
      The Everest is the highest mountain in the world, standing at 8,848 meters above sea level.
      :::::
    ::::
  
  ```mdc [content/index.md]
  ---
  title: The Mountains Website
  description: A website about the most iconic mountains in the world.
  ---
  
  ::landing-hero
  ---
  image: /mountains/everest.png
  ---
  #title
  The Everest.
  
  #description
  The Everest is the highest mountain in the world, standing at 8,848 meters above sea level.
  ::
  ```
  
  ```vue [components/LandingHero.vue]
  <script setup lang="ts">
  defineProps<{ image: string }>()
  </script>
  
  <template>
    <section class="flex flex-col sm:flex-row sm:items-center flex-col-reverse gap-4 py-8 sm:gap-12 sm:py-12">
      <div>
        <h1 class="text-4xl font-semibold">
          <slot name="title" />
        </h1>
        <div class="text-base text-gray-600 dark:text-gray-300">
          <slot name="description" />
        </div>
      </div>
      <img :src="image" class="w-1/2 rounded-lg">
    </section>
  </template>
  ```
  :::

#title
Markdown meets [Vue]{.text-(--ui-primary)} components

#description
We created the MDC syntax to let you use Vue components with props and slots inside your Markdown files.

#features
  :::u-page-feature
  ---
  icon: i-lucide-list
  ---
  #title{unwrap="p"}
  Specify props with frontmatter syntax
  :::

  :::u-page-feature
  ---
  icon: i-lucide-hash
  ---
  #title{unwrap="p"}
  Use components slots with `#`
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code-xml
  ---
  #title{unwrap="p"}
  Add any other html attributes
  :::

#links
  :::u-button
  ---
  color: neutral
  label: Learn more about MDC
  to: https://content.nuxt.com/docs/files/markdown#mdc-syntax
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  :::
::

::u-page-section
---
orientation: horizontal
---
  :::code-group
  ```vue [pages/blog.vue]
  <script setup lang="ts">
  const { data: posts } = await useAsyncData('blog', () => {
    return queryCollection('blog').all()
  })
  </script>
  
  <template>
    <div>
      <h1>Blog</h1>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  ```
  
  ```ts [content.config.ts]
  import { defineContentConfig, defineCollection, z } from '@nuxt/content'
  
  export default defineContentConfig({
    collections: {
      blog: defineCollection({
        source: 'blog/*.md',
        type: 'page',
        // Define custom schema for docs collection
        schema: z.object({
          tags: z.array(z.string()),
          image: z.string(),
          date: z.Date()
        })
      })
    }
  })
  ```
  :::

#title
Query with [Type-Safety]{.text-(--ui-secondary)}

#description
Define your content structure with collections and query them with schema validation and full type-safety.

#features
  :::u-page-feature
  ---
  icon: i-lucide-layout-grid
  ---
  #title{unwrap="p"}
  Create collections for similar content files
  :::

  :::u-page-feature
  ---
  icon: i-lucide-circle-check
  ---
  #title{unwrap="p"}
  Define schema for the collection frontmatter
  :::

  :::u-page-feature
  ---
  icon: i-lucide-text-cursor
  ---
  #title{unwrap="p"}
  Get auto-completion in your Vue files
  :::

#links
  :::u-button
  ---
  color: neutral
  label: Learn more about content collections
  to: https://content.nuxt.com/docs/collections/define
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  :::
::

::u-page-section
---
reverse: true
orientation: horizontal
---
:video{autoplay controls loop src="https://res.cloudinary.com/nuxt/video/upload/v1733494722/contentv3final_rc8bvu.mp4"}

#title{unwrap="p"}
Let [anyone edit]{.text-(--ui-primary)} your website

#description
Edit your Nuxt Content website with **Studio**, our CMS platform with Notion-like Markdown editor and generated forms for `YAML` and `JSON` files. Live preview and online collaboration included.

#features
  :::u-page-feature
  ---
  icon: i-lucide-mouse-pointer-click
  ---
  #title{unwrap="p"}
  Visual editor with drag and drop for Markdown
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title{unwrap="p"}
  Form generation for YML and JSON files
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-google
  ---
  #title{unwrap="p"}
  Invite editors to login with Google and publish changes
  :::

#links
  :::u-button
  ---
  color: neutral
  label: Discover Studio
  to: https://content.nuxt.com/studio
  trailingIcon: i-lucide-arrow-right
  ---
  :::
::

::u-page-section
  :::div{.hidden.sm:block}
    ::::u-color-mode-image
    ---
    class: size-full absolute bottom-0 inset-0 z-[-1]
    dark: /home/cta-dark.svg
    light: /home/cta-light.svg
    ---
    ::::
  :::

#title
Add a git-based CMS to your Nuxt project.

#links
  :::u-button
  ---
  label: Start reading docs
  to: https://content.nuxt.com/docs/getting-started/installation
  trailingIcon: i-lucide-arrow-right
  ---
  :::

  :::u-button
  ---
  color: neutral
  label: Open Studio
  target: _blank
  to: https://nuxt.studio
  variant: outline
  ---
  :::
::


# Meet Studio, content edition for everyone.

::u-page-hero
  :::div{.hidden.sm:block}
    ::::u-color-mode-image
    ---
    class: size-full absolute bottom-0 inset-x-4 z-[-1]
    dark: /home/hero-dark.svg
    light: /home/hero-light.svg
    ---
    ::::
  :::

#title{unwrap="p"}
Meet Studio, content edition :br for everyone.

#description
**Nuxt Studio** brings visual editing to your Nuxt Content projects. Anyone can contribute to the website thanks to our versatile editor that adapt to markdown, YAML, or JSON. No technical expertise needed. *Built for developers, made for everyone.*

#links{unwrap="p"}
  :::u-button
  ---
  label: Get Started for free
  size: xl
  target: _blank
  to: https://nuxt.studio/signin
  trailingIcon: i-lucide-arrow-right
  ---
  :::

  :::u-button
  ---
  color: neutral
  label: Read the documentation
  size: xl
  to: https://content.nuxt.com/docs/studio/setup
  variant: subtle
  ---
  :::
::

::u-page-section
#features
  :::u-page-feature
  ---
  icon: i-lucide-circle-user
  ---
  #title{unwrap="p"}
  GitHub & Google Authentication
  
  #description{unwrap="p"}
  Personalized workspace for each role: developers, writers, and clients.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-pen
  ---
  #title{unwrap="p"}
  Easy content updates
  
  #description{unwrap="p"}
  From Markdown to YAML edition, our visual editor is designed for non technical users.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-users
  ---
  #title{unwrap="p"}
  Real-time Collaboration
  
  #description{unwrap="p"}
  Write as a team in real-time with our collaboration features.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-sparkles
  ---
  #title{unwrap="p"}
  From Code to Edition
  
  #description{unwrap="p"}
  Developers build the foundation while writers can safely edit the content.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-panels-top-left
  ---
  #title{unwrap="p"}
  Review before publishing
  
  #description{unwrap="p"}
  Review your changes before making them live on your website.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-mouse-pointer-click
  ---
  #title{unwrap="p"}
  Ready-to-use Templates
  
  #description{unwrap="p"}
  Get started quickly with pre-built templates for Saas sites, blogs, docs and more.
  :::
::

::u-page-section
---
orientation: horizontal
---
  :::code-group
  ```vue [components/content/HomeFeature.vue]
  <script setup lang="ts">
    defineProps({
      icon: {
        type: String,
        default: 'i-ph-cursor-click',
      },
    })
  </script>
  
  <template>
    <div class="flex items-start gap-3">
      <div class="flex items-center justify-center border rounded-lg p-1.5">
        <UIcon :name="icon" />
      </div>
      <div class="flex flex-col">
        <h3 class="font-semibold">
          <slot name="title" />
        </h3>
        <span>
          <slot name="description" />
        </span>
      </div>
    </div>
  </template>
  ```
  
  ```mdc [content/index.md]
  ::home-feature
    ---
    icon: i-mdi-vuejs
    ---
    #title
    Embedded Vue components
    #description
    Edit slots and props inside the Notion-like editor.
  ::
  ```
  
    ::::preview-card{icon="i-lucide-eye" label="Editor"}
    ![vue component edition on Studio](https://content.nuxt.com/docs/studio/home-content-studio-dark.webp)
    ::::
  :::

#title{unwrap="p"}
Developers create the [editing experience]{.text-(--ui-primary)}

#description
Developers build the foundation their way: custom components, media library, and site configuration.

#features
  :::u-page-feature
  ---
  icon: i-lucide-settings-2
  ---
  #title{unwrap="p"}
  Customizable and editable Vue components
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title{unwrap="p"}
  Edit your Markdown with our visual editor
  :::

  :::u-page-feature
  ---
  icon: i-lucide-brush
  ---
  #title{unwrap="p"}
  Edit your app.config visually
  :::

#links
  :::u-button
  ---
  color: neutral
  label: Learn more about custom components
  to: https://content.nuxt.com/docs/files/markdown#vue-components
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  :::
::

::u-page-section
---
reverse: true
orientation: horizontal
---
:video{autoplay controls loop src="https://res.cloudinary.com/nuxt/video/upload/v1744126742/studio/finalpropscomps_usfabp.mp4"}

#title{unwrap="p"}
Let [anyone edit]{.text-(--ui-primary)} your Nuxt Content website

#description
Teams and clients get a powerful visual editor for content management, from text edition to media management - all without touching code.

#features
  :::u-page-feature
  ---
  icon: i-lucide-mouse-pointer-click
  ---
  #title{unwrap="p"}
  Visual editor with drag and drop for Markdown
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title{unwrap="p"}
  Form generation for `YML` and `JSON` files
  :::

  :::u-page-feature
  ---
  icon: i-lucide-image
  ---
  #title{unwrap="p"}
  Manage all your medias in one place
  :::
::

::u-page-section
---
orientation: horizontal
---
  :::u-color-mode-image
  ---
  class: size-full
  dark: /home/pro-dark.svg
  light: /home/pro-light.svg
  ---
  :::

#title
[Edit together]{.text-(--ui-primary)} , preview instantly

#description
Edit content as a team and see your site come to life with live preview. From text editing to component updates, every change reflects your final website design. Experience seamless content creation without delays or manual refreshes.

#features
  :::u-page-feature
  ---
  icon: i-lucide-files
  ---
  #title{unwrap="p"}
  See your changes in real-time on your website
  :::

  :::u-page-feature
  ---
  icon: i-lucide-link
  ---
  #title{unwrap="p"}
  Share preview URLs to anyone with live updates
  :::

  :::u-page-feature
  ---
  icon: i-lucide-list
  ---
  #title{unwrap="p"}
  Review all your changes before publishing
  :::
::

::u-page-section
  :::div{.hidden.sm:block}
    ::::u-color-mode-image
    ---
    class: size-full absolute bottom-0 inset-x-4 z-[-1]
    dark: /home/cta-dark.svg
    light: /home/cta-light.svg
    ---
    ::::
  :::

#title
The [best way]{.text-(--ui-primary)} to edit your [Nuxt Content]{.text-(--ui-primary)} website

#links
  :::u-button
  ---
  label: Get started for free
  target: _blank
  to: https://nuxt.studio/signin
  trailingIcon: i-lucide-arrow-right
  ---
  :::

  :::u-button
  ---
  color: neutral
  label: See pricing
  to: https://content.nuxt.com/studio/pricing
  variant: outline
  ---
  :::

#description
Import your Nuxt Content website and invite your team to collaborate today.
::


# Canvas

::template-core
Canvas Portfolio is a fully customizable i18n portfolio template built with Nuxt and Nuxt UI, designed to help you showcase your work, testimonials, and key information with ease. The template integrates with Nuxt Studio for a smooth editing experience, while leveraging Nuxt Content for content management. Built with performance, flexibility, and responsiveness in mind, Canvas Portfolio provides a robust foundation for developers and creatives alike.

- **Modern Components & Layouts** – Includes built-in components.
- **Nuxt UI v3** – Utilize pre-built, customizable UI components.
- **NuxtHub ready** - Deploy on NuxtHub in seconds.
- **Tailwind CSS** – A beautiful, responsive design system.
- **Working Contact Form** – Integrated with Resend for easy email handling.
- **Multi-language Support** – Powered by Nuxt i18n.
- **SEO-Ready** – Open Graph Image (Nuxt OG Image) & Nuxt Robots for automatic robots.txt generation.
- **Good practices** – Auto-generated sitemap, optimized images (Nuxt Image), and ESLint (Nuxt config with Flat config).
- **Fully Responsive** – Adapts to all modern browsers and devices.
- **Minimal & Professional Design** – Clean, elegant, and easy to customize.

#right
  :::template-features
  ---
  features:
    - label: Nuxt Architecture
      content: Harness the full power of Nuxt 3 and its modules ecosystem.
    - label: Nuxt Studio ready
      content: Edit your theme content and appearance with live-preview within Nuxt
        Studio.
    - label: Vue Components
      content: Insert built-in components (or your own) inside your content.
    - label: Write Markdown
      content: Enjoy the ease and simplicity of Markdown and discover MDC syntax.
    - label: Deploy anywhere
      content: In one click from Studio or with zero config on Vercel or Netlify.
        Choose between static generation, on-demand rendering (Node) or edge-side
        rendering on CloudFlare workers.
    - label: Extensible
      content: Customize the whole design, or add components using slots - you can
        make Content-Wind your own.
  ---
  :::
::


# Content Wind

::template-core
A lightweight Nuxt theme to build a Markdown driven website, based on Nuxt Content, TailwindCSS and Iconify

- Use layouts in Markdown pages
- Enjoy meta tag generation
- Configurable prose components
- Generated navigation from pages
- Switch between light & dark mode
- Access 100,000 icons from 100+ icon sets
- Highlight code blocks with Shiki

#right
  :::template-features
  ---
  features:
    - label: Nuxt Architecture
      content: Harness the full power of Nuxt 3 and its modules ecosystem.
    - label: Nuxt Studio ready
      content: Edit your theme content and appearance with live-preview within Nuxt
        Studio.
    - label: Vue Components
      content: Insert built-in components (or your own) inside your content.
    - label: Write Markdown
      content: Enjoy the ease and simplicity of Markdown and discover MDC syntax.
    - label: Deploy anywhere
      content: In one click from Studio or with zero config on Vercel or Netlify.
        Choose between static generation, on-demand rendering (Node) or edge-side
        rendering on CloudFlare workers.
    - label: Extensible
      content: Customize the whole design, or add components using slots - you can
        make Content-Wind your own.
  ---
  :::
::


# Docs

::template-core
[Nuxt UI Pro](https://ui.nuxt.com/pro){rel="nofollow"} is a collection of premium components, an extension of [Nuxt UI](https://ui.nuxt.com){rel="nofollow"}, designed to facilitate the creation of appealing and responsive Nuxt applications in a matter of minutes.

The Nuxt UI team is dedicated to deliver the best integration and customization experience, while the Studio team is providing full compatibility with Nuxt Studio.

- **Fully customizable**: change the style of any component from your App Config or customize them specifically through the ui prop.
- **Write Markdown with ease**: Nuxt UI Pro overrides Nuxt Content prose components to make them awesome but also adds new ones like Callout, CodeGroup, Field, etc.
- **Beautiful Typography styles**: Tailwind CSS typography plugin is pre-configured and styled to match Nuxt UI components and colors.
- **Full-Text Search out of the box**: Nuxt UI Pro ships with a ready to use command palette component. No need to setup Algolia DocSearch anymore.
- **Slots for everything**: Each component leverages the power of Vue's slots to give you the flexibility to build anything.
- **Responsive by design**: Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size.

#right
  :::template-features
  ---
  features:
    - label: Nuxt 3
      content: Powered by Nuxt 3 for optimal performances and SEO.
    - label: Markdown
      content: Write your pages with MDC thanks to Nuxt Content.
    - label: Nuxt UI
      content: Offers a very large set of full customizable components.
    - label: TypeScript
      content: A fully typed development experience.
    - label: Nuxt Studio
      content: Supported by Nuxt Studio for fast updates and previews.
    - label: Search
      content: A full-text search modal empowered by Fuse.js.
  ---
  :::
::


# Landing

::div{.flex.justify-center}
:video{.rounded-lg autoplay controls loop :width='1000' src="https://res.cloudinary.com/nuxt/video/upload/v1745425967/studio/landing_q03gdo.mp4"}
::

::template-core
[Nuxt UI Pro](https://ui.nuxt.com/pro){rel="nofollow"} is a collection of premium components, an extension of [Nuxt UI](https://ui.nuxt.com){rel="nofollow"}, designed to facilitate the creation of appealing and responsive Nuxt applications in a matter of minutes.

The Nuxt UI team is dedicated to deliver the best integration and customization experience, while the Studio team is providing full compatibility with Nuxt Studio.

- **Fully customizable**: change the style of your UI from your App Config or edit your landing page content from the `index.yml` file.
- **Beautiful Typography styles**: Tailwind CSS typography plugin is pre-configured and styled to match Nuxt UI components and colors.
- **Responsive by design**: Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size.

#right
  :::template-features
  ---
  features:
    - label: Nuxt 3
      content: Powered by Nuxt 3 for optimal performances and SEO.
    - label: Content v3
      content: Write your content in yaml files or use Markdown with the MDC syntax.
    - label: Nuxt UI v3
      content: Offers a very large set of full customizable components.
    - label: TypeScript
      content: A fully typed development experience.
    - label: Nuxt Studio
      content: Supported by Nuxt Studio for fast updates and previews.
  ---
  :::
::


# Minimal Starter

::template-core
Unleash your imagination with our minimalist starter:

- Start with a clean slate and craft the application of your dreams.
- Nuxt Content all setup.
- Effortlessly compose pages using Markdown and Vue components, enhanced by the intuitive MDC syntax.

#right
  :::template-features
  ---
  features:
    - label: Nuxt Architecture
      content: Harness the full power of Nuxt 3 and its modules ecosystem.
    - label: Nuxt Studio ready
      content: Edit your theme content and appearance with live-preview within Nuxt
        Studio.
    - label: Vue Components
      content: Use built-in components (or your own) inside your content.
    - label: Write Markdown
      content: Enjoy the ease and simplicity of Markdown and discover MDC syntax.
    - label: Deploy anywhere
      content: In one click from Studio or with zero config on Vercel or Netlify.
        Choose between static generation, on-demand rendering (Node) or edge-side
        rendering on CloudFlare workers.
  ---
  :::
::


# Minted Directory

::template-core
Minted Directory is a highly customizable template designed for building successful directory websites quickly.

- Create a directory website with a customized style/brand
- Manage listings with markdown
- SEO optimized
- Search and Categorization with tags
- Blog Pages

#right
  :::template-features
  ---
  features:
    - label: Nuxt Architecture
      content: Harness the full power of Nuxt 3 and its modules ecosystem.
    - label: Nuxt Studio ready
      content: Edit your theme content and appearance with live-preview within Nuxt
        Studio.
    - label: Vue Components
      content: Insert built-in components (or your own) inside your content.
    - label: Write Markdown
      content: Enjoy the ease and simplicity of Markdown and discover MDC syntax.
    - label: Deploy anywhere
      content: In one click from Studio or with zero config on Vercel or Netlify.
        Choose between static generation, on-demand rendering (Node) or edge-side
        rendering on CloudFlare workers.
    - label: Extensible
      content: Customize the whole design, or add components using slots - you can
        make Minted Directory your own.
  ---
  :::
::


# Portfolio

::div{.flex.justify-center}
:video{.rounded-lg autoplay controls loop :width='1000' src="https://res.cloudinary.com/nuxt/video/upload/v1746088224/studio/d53kg6qoo802zy3dzmh0.mp4"}
::

::template-core
[Nuxt UI Pro](https://ui.nuxt.com/pro){rel="nofollow"} is a collection of premium components, an extension of [Nuxt UI](https://ui.nuxt.com){rel="nofollow"}, designed to facilitate the creation of appealing and responsive Nuxt applications in a matter of minutes.

The Nuxt UI team is dedicated to deliver the best integration and customization experience, while the Studio team is providing full compatibility with Nuxt Studio.

- **Fully customizable**: change the style of any component from your App Config or customize them specifically through the ui prop.
- **Write Markdown with ease**: Nuxt UI Pro overrides Nuxt Content prose components to make them awesome but also adds new ones like Callout, CodeGroup, Field, etc.
- **Beautiful Typography styles**: Tailwind CSS typography plugin is pre-configured and styled to match Nuxt UI components and colors.
- **Full-Text Search out of the box**: Nuxt UI Pro ships with a ready to use command palette component. No need to setup Algolia DocSearch anymore.
- **Slots for everything**: Each component leverages the power of Vue's slots to give you the flexibility to build anything.
- **Responsive by design**: Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size.

#right
  :::template-features
  ---
  features:
    - label: Nuxt 3
      content: Powered by Nuxt 3 for optimal performances and SEO.
    - label: Markdown
      content: Write your pages with MDC thanks to Nuxt Content.
    - label: Nuxt UI
      content: Offers a very large set of full customizable components.
    - label: TypeScript
      content: A fully typed development experience.
    - label: Nuxt Studio
      content: Supported by Nuxt Studio for fast updates and previews.
  ---
  :::
::


# Saas

::div{.flex.justify-center}
:video{.rounded-lg autoplay controls loop :width='1000' src="https://res.cloudinary.com/nuxt/video/upload/v1744979325/studio/saas_cafkml.mp4"}
::

::template-core
[Nuxt UI Pro](https://ui.nuxt.com/pro){rel="nofollow"} is a collection of premium components, an extension of [Nuxt UI](https://ui.nuxt.com){rel="nofollow"}, designed to facilitate the creation of appealing and responsive Nuxt applications in a matter of minutes.

The Nuxt UI team is dedicated to deliver the best integration and customization experience, while the Studio team is providing full compatibility with Nuxt Studio.

- **Fully customizable**: change the style of any component from your App Config or customize them specifically through the ui prop.
- **Write Markdown with ease**: Nuxt UI Pro overrides Nuxt Content prose components to make them awesome but also adds new ones like Callout, CodeGroup, Field, etc.
- **Beautiful Typography styles**: Tailwind CSS typography plugin is pre-configured and styled to match Nuxt UI components and colors.
- **Full-Text Search out of the box**: Nuxt UI Pro ships with a ready to use command palette component. No need to setup Algolia DocSearch anymore.
- **Slots for everything**: Each component leverages the power of Vue's slots to give you the flexibility to build anything.
- **Responsive by design**: Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size.

#right
  :::template-features
  ---
  features:
    - label: Nuxt 3
      content: Powered by Nuxt 3 for optimal performances and SEO.
    - label: Markdown
      content: Write your pages with MDC thanks to Nuxt Content.
    - label: Nuxt UI
      content: Offers a very large set of full customizable components.
    - label: TypeScript
      content: A fully typed development experience.
    - label: Nuxt Studio
      content: Supported by Nuxt Studio for fast updates and previews.
    - label: Search
      content: A full-text search modal empowered by Fuse.js.
  ---
  :::
::


# Introducing Nuxt Studio v2

::warning
This article was published before the merge of the [Content](https://github.com/nuxt/content){rel="nofollow"} and [Studio](https://github.com/nuxtlabs/studio-module){rel="nofollow"} modules on January 6, 2025. As a result, it may contain some inconsistencies. The Studio module is now deprecated and available as an opt-in feature of the Content module. Learn how to enable it in [this guide](https://content.nuxt.com/docs/getting-started).
::

We are excited to announce the release of Nuxt Studio v2, a major update bringing a brand new interface designed specifically for our users, based on their feedback.

::tip
Studio is optimized for **Nuxt Content** project but the only real requirement is to have a *content* folder with Markdown files. This simple setup is enough to start editing and publishing your files with the platform.
::

### **A more intuitive interface**

![Nuxt studio v2 interface](https://content.nuxt.com/blog/v2-interface.webp)

The main improvement in Version 2 is a **complete rework of the interface**. We have designed it to be more intuitive and user-friendly, especially for non-technical users. Our goal was to simplify the user experience, making it easier to create and set up projects with minimal hassle. The new interface is light, straightforward, and designed to streamline your workflow.

### **Google authentication**

![Google and GitHub authentication](https://content.nuxt.com/blog/google-github.webp)

We now have two different authentication methods. You can either login with **GitHub** or with **Google**. Both methods give you the same edition rights but since Studio is synchronized with GitHub, some features are specific to GitHub users, especially project creation.

::warning
Since a Google user can not create a project, he has to **join a team** with existing projects to edit them.
::

### **Minimal setup to edit your files**

You can now edit your content **without any setup**, just import your repository and this is it. You can navigate through your files and medias, edit your content and publish on GitHub.

Collaboration is available for teams.

![Notion-like editor with collaboration](https://content.nuxt.com/blog/collaborate.webp)

::warning
Medias in the editor are not displayed until you set up the live preview (see section below).
::

### Simplified setup for live preview

![preview enable between notion like editor and website](https://content.nuxt.com/blog/preview.webp)

As the live preview feature requires a deployed URL, we made it as simple as possible to set it up.

While GitHub pages deployment remains available and still does not require any configuration on your end, requirements have been simplified for self-hosted project as we removed the token verification. [Enabling the Studio module](https://nuxt.studio/docs/get-started/setup#enable-the-live-preview){rel="nofollow"} is the &#x2A;*only remaining requirement.**

::warning{to="https://github.com/nuxtlabs/studio-module"}
It's crucial to use the latest version of the **Studio module** to ensure compatibility and access to new features.
::

### New documentation

With a revamped platform comes a [new documentation](https://nuxt.studio/docs/get-started/introduction){rel="nofollow"}. Don't hesitate to check it out to learn everything about the new Studio.

Whether you are an [editor](https://nuxt.studio/docs/editors/introduction){rel="nofollow"} or a [developer](https://nuxt.studio/docs/developers/introduction){rel="nofollow"} you now have your dedicated section in the docs.

### A new direction for Studio

Most available CMS solutions have to choose between being very customizable for developers or highly user friendly for content editors, with Studio we want to do both.

**The developer provides the tools for the editors to focus on content, without requiring any technical knowledge**.

::tip
Our Notion-like editor has a bright future ahead, and we want to develop it collaboratively with the community.
::

###


# How to upgrade your Nuxt documentation website to Content x UI v3

**2025 kicks off with the power of 3!**

This start of year is marked by major updates to our favorite tools. The UI team is about to launch **version 3** of the **UI / UI Pro libraries** (currently in alpha), while the Content team has already released **Nuxt Content v3**.

These updates mean that all our starter templates combining **Content** and **UI** will need to be updated to align with the latest versions. To help you make the transition, this guide walks through migrating the **Nuxt UI Pro Docs Starter** to the new **Content v3 and Nuxt UI v3** packages.

::prose-tip{to="https://github.com/nuxt-ui-pro/docs/tree/v3"}
Check the UI Pro documentation starter repository source code.
::

## Content migration (v2 → v3)

### 1. Update package to v3

::code-group
```bash [pnpm]
pnpm add @nuxt/content@^3
```

```bash [yarn]
yarn add @nuxt/content@^3
```

```bash [npm]
npm install @nuxt/content@^3
```

```bash [bun]
bun add @nuxt/content@^3
```
::

### 2. Create `content.config.ts` file

This configuration file defines your data structure. A collection represents a set of related items. In the case of the docs starter, there are two different collections, the `landing` collection representing the home page and another `docs` collection for the documentation pages.

```js [content.config.ts]
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.yml'
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**',
        exclude: ['index.yml']
      },
      schema: z.object({
        links: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string(),
          target: z.string().optional()
        })).optional()
      })
    })
  }
})
```

On top of the built-in fields provided by the [`page`](https://content.nuxt.com/docs/collections/types#page-type) type, we added the extra field `links` to the `docs` collection so we can optionally display them in the docs [page header](https://ui3.nuxt.dev/components/page-header){rel="nofollow"}.

::prose-tip
The `type: page` means there is a 1-to-1 relationship between the content file and a page on your site.
::

### 3. Migrate `app.vue`

::prose-steps{level="4"}
#### Navigation fetch can be updated by moving from `fetchContentNavigation` to `queryCollectionNavigation` method

  :::prose-code-group
  ```ts [app.vue (v3)]
  const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
  
  ```
  
  ```ts [app.vue (v2)]
  const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
  ```
  :::

#### Content search command palette data can use the new `queryCollectionSearchSections` method

  :::prose-code-group
  ```ts [app.vue (v3)]
  const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
    server: false,
  })
  ```
  
  ```ts [app.vue (v2)]
  const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
    default: () => [],
    server: false
  })
  ```
  :::
::

### 4. Migrate landing page

::prose-steps{level="4"}
#### Home page data fetching can be updated by moving from `queryContent` to `queryCollection` method

  :::prose-code-group
  ```ts [index.vue (v3)]
  const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
  ```
  
  ```ts [index.vue (v2)]
  const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
  ```
  :::

#### `useSeoMeta` can be populated using the `seo` field provided by the [page](https://content.nuxt.com/docs/collections/types#page-type) type

```ts [index.vue]
useSeoMeta({
  title: page.value.seo.title,
  ogTitle: page.value.seo.title,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description
})
```

  :::prose-note
  Please note that the `seo` field is automatically overridden by the root `title` and `description` if not set.
  :::
::

### 5. Migrate catch-all docs page

::prose-steps{level="4"}
#### Docs page data and surround fetching can be updated and mutualised by moving from `queryContent` to `queryCollection` and `queryCollectionItemSurroundings` methods

  :::prose-code-group
  ```ts [docs/[...slug\\].vue (v3)]
  const { data } = await useAsyncData(route.path, () => Promise.all([
    queryCollection('docs').path(route.path).first(),
    queryCollectionItemSurroundings('docs', route.path, {
      fields: ['title', 'description'],
    }),
  ]), {
    transform: ([page, surround]) => ({ page, surround }),
  })
  
  const page = computed(() => data.value?.page)
  const surround = computed(() => data.value?.surround)
  ```
  
  ```ts [docs/[...slug\\].vue (v2)]
  const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
  
  const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
  )
  ```
  :::

#### Populate `useSeoMeta` with the `seo` field provided by the [page](https://content.nuxt.com/docs/collections/types#page-type) type

```ts [index.vue]
useSeoMeta({
  title: page.value.seo.title,
  ogTitle: `${page.value.seo.title} - ${seo?.siteName}`,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description
})
```

  :::prose-note
  Please note that the `seo` field is automatically overridden by the root `title` and `description` if not set.
  :::
::

### 6. Update types

Types have been significantly enhanced in Content v3, eliminating the need for most manual typings, as they are now directly provided by the Nuxt Content APIs.

Concerning the documentation starter, the only typing needed concerns the navigation items where `NavItem` can be replaced by `ContentNavigationItem` .

```ts
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
```

### 7. Replace folder metadata files

All `_dir.yml` files become `.navigation.yml`

### 8. Migrate Studio activation

Since the [studio module](https://nuxt.studio){rel="nofollow"} has been deprecated and a new generic `Preview API` has been implemented directly into Nuxt Content, we can remove the `@nuxthq/studio` package from our dependencies and from the `nuxt.config.ts` modules.

Instead we just need to enable the preview mode in the Nuxt configuration file by binding the Studio API.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },
})
```

Finally, in order to keep the [app config file updatable](https://content.nuxt.com/docs/studio/config) from Studio, we just need to update the helper import of the `nuxt.schema.ts` file from `@nuxthq/studio/theme` to `@nuxt/content/preview`.

::prose-tip
That's it, content v3 is now powering the starter. Let's now migrate to version 3 of [Nuxt UI / UI Pro](https://ui3.nuxt.dev){rel="nofollow"}.
::

## Nuxt UI Pro Migration (v1 → v3)

::prose-caution
This is a migration case, it won't cover all breaking changes introduced by the version upgrade. You should check each component you're using in the documentation to know if you need updates concerning props, slots or styles.
::

### 1. Setup package to v3

::prose-note
To maintain consistency with the UI versioning, which transitioned from v1 to v2. The Nuxt UI Pro version 2 is being skipped, and the update jumps directly to v3.
::

::prose-steps{level="4"}
#### Install the Nuxt UI v3 alpha package

  :::code-group{sync="pm"}
  ```bash [pnpm]
  pnpm add @nuxt/ui-pro@next
  ```
  
  ```bash [yarn]
  yarn add @nuxt/ui-pro@next
  ```
  
  ```bash [npm]
  npm install @nuxt/ui-pro@next
  ```
  
  ```bash [bun]
  bun add @nuxt/ui-pro@next
  ```
  :::

#### Add the module in the Nuxt configuration file

It's no longer required to add `@nuxt/ui` in modules as it is automatically imported by `@nuxt/ui-pro` .

  :::prose-code-group
  ```ts [nuxt.config.ts (v3)]
  export default defineNuxtConfig({
    modules: ['@nuxt/ui-pro']
  })
  ```
  
  ```ts [nuxt.config.ts (v1)]
  export default defineNuxtConfig({
    extends: ['@nuxt/ui-pro'],
    modules: ['@nuxt/ui']
  })
  ```
  :::

  :::prose-note
  **Nuxt UIPro V3** is now considered as a module and no longer as a layer.
  :::

#### Import Tailwind CSS and Nuxt UI Pro in your CSS

```css [assets/css/main.css]
@import "tailwindcss" theme(static);
@import "@nuxt/ui-pro";
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro'],
  css: ['~/assets/css/main.css']
})
```

#### Remove tailwind config file and use CSS-first theming

Nuxt UI v3 uses Tailwind CSS v4 that follows a CSS-first configuration approach. You can now customize your theme with CSS variables inside a `@theme` directive.

- Delete the `tailwind.config.ts` file
- Use the `@theme` directive to apply your theme in `main.css` file
- Use the `@source` directive in order for Tailwind to detect classes in `markdown` files.

```css [assets/css/main.css]
@import "tailwindcss" theme(static);
@import "@nuxt/ui-pro";

@source "../content/**/*";

@theme {
  --font-sans: 'DM Sans', sans-serif;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}

```
::

### 2. Update `ui` overloads in `app.config.ts`

::prose-caution{to="https://ui3.nuxt.dev/getting-started/theme#customize-theme"}
All overloads using the `ui` props in a component or the `ui` key in the `app.config.ts` are obsolete and need to be checked in the **UI / UI Pro** documentation.
::

::prose-code-group
```ts [app.config.ts (v3)]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },
  uiPro: {
    footer: {
      slots: {
        root: 'border-t border-gray-200 dark:border-gray-800',
        left: 'text-sm text-gray-500 dark:text-gray-400'
      }
    }
  },
}
```

```ts [app.config.ts (v1)]
export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800'
      }
    }
  },
})
```
::

### 3. Migrate `error.vue` page

New `UError` component can be used as full page structure.

::prose-code-group
```vue [error.vue (v3)]
<template>
  <div>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </div>
</template>
```

```vue [error.vue (v1)]
<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>

    <UNotifications />
  </div>
</template>
```
::

### 4. Migrate `app.vue` page

- `Main`, `Footer` and `LazyUContentSearch` components do not need any updates in our case.
- `Notification` component can be removed since `Toast` components are directly handled by the `App` component.
- Instead of the `NavigationTree` component you can use the `NavigationMenu` component or the `ContentNavigation` component to display content navigation.

::prose-code-group
```vue [Header.vue (v3)]
<script>
// Content navigation provided by queryCollectionNavigation('docs')
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UHeader>
    <template #content>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
     </template>
   </UHeader>
</template>
```

```vue [Header.vue (v1)]
<script>
// Content navigation provided by fetchContentNavigation()
const navigation = inject<Ref<NavItem[]>>('navigation')
</script>

<template>
  <UHeader>
    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
     </template>
   </UHeader>
</template>
```
::

### 5. Update landing page

We've decided to move the landing content from `YML` to `Markdown` .

::prose-tip
This decision was made because components used in Markdown no longer need to be exposed globally (nor do they need to be created in the `components/content` folder). Content v3 handles it under the hood.
::

::prose-steps{level="4"}
#### Update content configuration

```ts [content.config.ts]
export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**',
        exclude: ['index.md']
      },
      ...
    })
  }
})
```

#### Use `ContentRenderer` to render `Markdown`

  :::prose-note
  `prose` property must be set to `false` in `ContentRendered` as we don't want `Mardown` to be applied with prose styling in the case of a landing page integrating non prose Vue components.
  :::

  :::prose-code-group
  ```vue [index.vue (v3)]
  <template>
    <UContainer>
      <ContentRenderer
        v-if="page"
        :value="page"
        :prose="false"
      />
    </UContainer>
  </template>
  ```
  
  ```vue [index.vue (v1)]
  <template>
    <div>
      <ULandingHero
        v-if="page.hero"
        v-bind="page.hero"
      >
        <template #headline>
          <UBadge
            v-if="page.hero.headline"
            variant="subtle"
            size="lg"
            class="relative rounded-full font-semibold"
          >
            <NuxtLink
              :to="page.hero.headline.to"
              target="_blank"
              class="focus:outline-none"
              tabindex="-1"
            >
              <span
                class="absolute inset-0"
                aria-hidden="true"
              />
            </NuxtLink>
  
            {{ page.hero.headline.label }}
  
            <UIcon
              v-if="page.hero.headline.icon"
              :name="page.hero.headline.icon"
              class="ml-1 w-4 h-4 pointer-events-none"
            />
          </UBadge>
        </template>
  
        <template #title>
          <MDC cache-key="head-title" :value="page.hero.title" />
        </template>
  
        <MDC
          :value="page.hero.code"
          cache-key="head-code"
          class="prose prose-primary dark:prose-invert mx-auto"
        />
      </ULandingHero>
  
      <ULandingSection
        :title="page.features.title"
        :links="page.features.links"
      >
        <UPageGrid>
          <ULandingCard
            v-for="(item, index) of page.features.items"
            :key="index"
            v-bind="item"
          />
        </UPageGrid>
      </ULandingSection>
    </div>
  </template>
  ```
  :::

#### Migrate Vue components to MDC

Move all components in `index.md` following the [MDC syntax](https://content.nuxt.com/docs/files/markdown).

Landing components have been reorganised and standardised as generic `Page` components.

- `LandingHero` => `PageHero`
- `LandingSection` => `PageSection`
- `LandingCard` => `PageCard` (we'll use the `PageFeature` instead) :prose-tip[Have a look at the final `Markdown` result on GitHub.]{to="https://github.com/nuxt-ui-pro/docs/blob/v3/content/index.md"}
::

### 6. Migrate docs page

::prose-steps{level="4"}
#### Layout

- `Aside` component has been renamed to `PageAside` .
- `ContentNavigation` component can be used (instead of `NavigationTree`) to display the content navigation returned by `queryCollectionNavigation`. :prose-code-group[```vue \[layout/docs.vue (v3)\]
  <template>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation
              highlight
              :navigation="navigation"
            />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </template>
  ``````vue \[layout/docs.vue (v1)\]
  <template>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree :links="mapContentNavigation(navigation)" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </template>
  ```]

#### Catch-all pages

- `Divider` has been renamed to `Separator`
- `findPageHeadline` must be imported from `#ui-pro/utils/content`
- `prose` property does not exist no more on `PageBody` component.
::

::prose-tip{to="https://github.com/nuxt-ui-pro/docs/tree/v3"}
That's it! The docs starter is now fully running on both UI and Content v3 🎉
::

## Edit on Studio

If you're using Nuxt Studio to edit your documentation you also need to migrate the related code.

The Studio module has been deprecated and a new generic `Preview API` has been implemented directly into Nuxt Content, you can remove the `@nuxthq/studio` package from your dependencies and from the`nuxt.config.ts` modules. Instead you just need to enable the preview mode in the Nuxt configuration file by binding the Studio API.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },
})
```

In order to keep the app config file updatable from Studio you need to update the helper import of the `nuxt.schema.ts` file from `@nuxthq/studio/theme` to `@nuxt/content/preview`.

:video{autoplay controls loop poster="https://res.cloudinary.com/nuxt/video/upload/v1737458923/studio/docs-v3_lqfasl.png" src="https://res.cloudinary.com/nuxt/video/upload/v1737458923/studio/docs-v3_lqfasl.mp4"}


# **Announcing Nuxt Content 3.0**

We are thrilled to announce the first stable version of Nuxt Content 3.0.0 ✨

## 🚀 Performance Improvements

Nuxt Content v3 moves away from a file-based storage approach to an SQL database system. Using a database instead of the file-based storage reduces many I/O operations when querying large datasets.

::prose-note
The new database system enhances the way your data files are stored and structured, ensuring better performance and scalability. This update is entirely behind the scenes and does not affect the file types you can use in Content (`yml`, `json`, and `markdown` ).
::

This switch is transparent to users and Nuxt Content still provides a zero config support for development mode, [server hosting](https://content.nuxt.com/docs/deploy/server) and [static generation](https://content.nuxt.com/docs/deploy/static).

Furthermore, [serverless](https://content.nuxt.com/docs/deploy/serverless) hosting is now supported and client-side navigation performance has been improved.

### Serverless Compatibility

A key challenge with Nuxt Content v2 was the large bundle size required to store all content files. It was an issue when deploying to serverless or edge platforms like [Netlify](https://netlify.com){rel="nofollow"}, [NuxtHub](https://hub.nuxt.com){rel="nofollow"} or [Vercel](https://vercel.com){rel="nofollow"}.

In serverless environments, each user request triggers a fresh instance of your Nuxt server, it starts from scratch each time. This "stateless" nature means you can't store data in server memory or use file-based databases like SQLite. That's why we've implemented database adaptors that persist data independently of your server instances.

::prose-note
We're manually switching to the appropriate provider (Vercel / Postgres, NuxtHub / D1...) according to the [database type](https://cfec52f9.content-f0q.pages.dev/docs/getting-started/configuration#database){rel="nofollow"} you've set in your config.
::

### WASM SQLite in Browser

For client-side navigation, the module uses a similar approach. When the application executes the first content query, it downloads the generated dump from the server and initializes a local SQLite database within the browser. From that point onward, all queries are executed locally without needing to call the server: significantly improving the responsiveness of the application and providing a seamless user experience.

## 🗄️ Content Collections

Collections are groups of related content items within your Nuxt Content project. They help organize and manage large datasets more efficiently.

### **Define Collections**

You can now define collections in the [`content.config.ts`](https://content.nuxt.com/docs/getting-started/configuration) file to configure the database structure, utility types, and methods for finding, parsing, and querying content.

### **Collections Schema**

Schemas enforce consistency within collections and improve TypeScript typings for better integration with Nuxt Content utilities.

```ts [content.config.ts]
import { defineCollection, z } from '@nuxt/content'

// Export collections
export const collections = {
  // Define collection using `defineCollection` utility
  posts: defineCollection({
    // Specify the type of content in this collection
    type: 'page',
    // Load every file matching this pattern
    source: 'blog/**/*.md',
    // Define custom schema for this collection
    schema: z.object({
      date: z.date(),
      image: z.object({
        src: z.string(),
        alt: z.string()
      }),
      badge: z.object({
        label: z.string(),
        color: z.string()
      })
    })
  }),
}
```

::prose-tip{to="https://content.nuxt.com/docs/collections/define"}
Learn more about collections in the documentation.
::

## 🔧 Simplified Vue Utils

We simplified the utils to now expose:

- [queryCollection](https://content.nuxt.com/docs/utils/query-collection) to fetch your collections with our powerful query builder
- [queryCollectionNavigation](https://content.nuxt.com/docs/utils/query-collection-navigation) to fetch the generated navigation for a specific collection
- [queryCollectionItemSurroundings](https://content.nuxt.com/docs/utils/query-collection-item-surroundings) to fetch sibling content for a specific path
- [queryCollectionSearchSections](https://content.nuxt.com/docs/utils/query-collection-search-sections) to fetch searchable sections from a collection for enhanced content discovery

These four utils allow your to efficiently fetch and query your content within your Vue pages and components:

```vue [pages/blog.vue]
<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => {
  return queryCollection('blog').all()
})
</script>

<template>
  <div>
    <h1>Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

## 📦 Built-in Components

We've updated the components to include only the essentials:

- [ContentRenderer](https://content.nuxt.com/docs/components/content-renderer) to render the parsed Markdown to HTML & Vue components
- [Slot](https://content.nuxt.com/docs/components/slot) replaced `ContentSlot` as we now support unwrapping using a directive, making your Vue components perfectly compatible to be used in both Vue & Markdown
- [Prose Components](https://content.nuxt.com/docs/components/prose) are pre-designed components tailored for MDC syntax, with integrated styling for a good appearance

Here's an example of displaying the content of a Markdown file:

```vue [pages/about.vue]
<script lang="ts" setup>
const { data: page } = await useAsyncData(() => {
  return queryCollection('content').path('/about').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <p v-else>About page not written yet.</p>
</template>
```

## 🔷 TypeScript Integration

The new collections system provides automatic TypeScript types for all your data. Every utility and API is strongly typed based on your collection definitions, ensuring robust type safety throughout development.

## ⬆️ Migrating from V2

Migration should be as easy as possible, this is why we wrote the [migration guide](https://content.nuxt.com/docs/getting-started/migration).

::prose-note
Note that we've decided to remove the document-driven mode to simplify the module usage.
::

## 🖼️ Studio Integration

[Nuxt Studio](https://content.nuxt.com/studio) is a platform to visually edit your **Nuxt Content** projects in production. With support for `Markdown`, `YAML`, or `JSON` files, our editor ensures versatility and ease of use.

### Preview API

Previously an independent module, the [Studio module](https://github.com/nuxtlabs/studio-module){rel="nofollow"} has been updated to be more generic and is now integrated directly into Nuxt Content as a `Preview API`.

Enabling the preview functionality in Studio is easier than ever—simply configure the Studio API as your `Preview API` in your Nuxt Content settings:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  }
})
```

This simplification means no extra module is required for Studio, making setup faster. Furthermore, the Preview API is now generic, enabling other providers to deliver great editing experiences on top of Nuxt Content.

### **Unified Documentation**

In addition to this integration, we’ve unified the **Content** and **Studio** documentation and websites into a single comprehensive resource. Only the Studio platform (available once the user is logged-in) remains as a [standalone site](https://nuxt.studio){rel="nofollow"}.

**We can now take advantage of data structures and collections in Studio**. The Studio platform supports and adapts its behaviour to **collections** and **user-defined schemas**. This enhancement will allow schema-generated forms for both `YAML` and `JSON` files as well as front-matter within Markdown files.


# Behind the scenes of Nuxt Studio's visual editor

## **Introduction**

Nuxt Studio offers a versatile workspace for both developers and content writers, giving them the freedom to choose between two distinct editors for content creation and management: the Markdown editor and the Visual editor.

![Select your favorit editor from the project settings](https://content.nuxt.com/blog/favorite-editor.webp)

Each editor serves its own purpose—some users are used to Markdown edition, while others prefer a non-technical, visual approach.

At the end, **Markdown syntax is the final output** for both editors.

This article explains the technical processes behind the visual editor, exploring how it interprets Markdown, converts it back, and why this process might occasionally lead to changes from the original content.

## **Markdown Editor**

![Edit directly markdown on Nuxt Studio](https://content.nuxt.com/blog/markdown-editor.webp)

The Markdown editor in Nuxt Studio provides full control over your content, allowing you to write directly in [MDC](https://content.nuxt.com/docs/files/markdown) (an empowered Markdown syntax). This syntax enables integration of Vue components directly into your Markdown files, offering more flexibility to structure your pages.

When your file is saved with the Markdown editor, the content is stored exactly as you've written it, preserving all specific syntax and formatting. This editor is ideal for users comfortable with Markdown who want precise control over the layout and structure of their content.

## **Visual Editor**

![Edit your content with a visual editor on Nuxt Studio](https://content.nuxt.com/blog/visual-editor.webp)

The Visual Editor is a sort of WYSIWYG (What You See Is What You Get) tool built on top of [TipTap](https://tiptap.dev/){rel="nofollow"} and [ProseMirror](https://prosemirror.net/){rel="nofollow"}, designed to abstract away the complexities of Markdown syntax and offer a more intuitive, visual editing experience. This editor is particularly user-friendly for those who prefer not to deal with raw Markdown code.

### **How the visual editor processes files**

When you open a Markdown file with the Visual Editor, Nuxt Studio first parses the original Markdown file. Using the [MDC module](https://github.com/nuxt-modules/mdc){rel="nofollow"}, it generates an Abstract Syntax Tree (AST). This AST is then converted into a TipTap-compatible format (TipTap AST), allowing the editor to accurately render the document visually.

Once the Visual Editor displays the content, users can make updates in a visually intuitive way. Behind the scenes, the editor continuously transforms the TipTap AST back into MDC AST then MDC syntax, ensuring that your content remains in Markdown format.

### **Why Changes might occur in the original markdown file without user modification**

![Alert is displayed when automatic markdown parsing is detected](https://content.nuxt.com/blog/automatic-parsing-modal.webp)

#### **Non-Critical Changes**

As the Visual Editor translates the visual formatting back into Markdown, it applies a parsing algorithm that applies predefined Markdown standards. In some cases, these standards may differ slightly from the original content. These changes are typically non-impactful and are only another working syntax of the Markdown, the rendered website should remain consistent with the original.

#### **Critical Changes**

Ideally, every feature in Markdown has a direct and accurate equivalent in the Visual Editor. We've built custom TipTap extensions to support custom MDC syntax such as [Vue components](https://content.nuxt.com/docs/files/markdown#vue-components) edition or [front-matter](https://content.nuxt.com/docs/files/markdown#front-matter). However, in rare cases, particularly with complex or unconventional Markdown elements, the Visual Editor may not fully support or correctly interpret these elements. When this happens, the editor might approximate, simplify, or even omit these elements during the parsing process.

Such discrepancies can result in data loss or regressions when converting back to Markdown. While these occurrences are rare, they can disrupt the intended display or functionality of your content.

Our primary objective is to prevent any loss of content and to maintain the integrity of your Markdown files. If you encounter any issues where the transition from visual to Markdown isn’t perfect, we encourage you to report them on our Discord server. Your feedback is invaluable in helping us refine and improve the Visual Editor, ensuring it meets the needs of all users.

## **Best practices to minimize unintended changes**

To avoid losing crucial formatting or content, consider the following best practices:

- **Avoid using complex HTML structures**. As the MDC syntax allows you to integrate Vue components, It's more effective to create reusable components that can be easily inserted into the Markdown and edited within the editor, rather than relying on intricate HTML code.
- **Use one editor consistently.** Whenever possible, select the editor that best suits your needs and stick with it for the entire page.
- **Review changes after switching from an editor to the other.** After switching editors, always review the Markdown (on the review page) and check the preview to ensure no important elements have been altered.

## **Conclusion**

Switching between the Markdown editor and the visual editor in Nuxt Studio offers flexibility, but it's important to be aware of the technical implications.

Understanding how the visual editor processes and converts Markdown can help ensure that what you craft in Markdown is accurately displayed in the visual editor, allowing non-technical users to easily edit everything without altering the original Markdown file.

###


# Visual Front-matter Edition

::warning
This article was published before the merge of the [Content](https://github.com/nuxt/content){rel="nofollow"} and [Studio](https://github.com/nuxtlabs/studio-module){rel="nofollow"} modules on January 6, 2025. As a result, it may contain some inconsistencies. The Studio module is now deprecated and available as an opt-in feature of the Content module. Learn how to enable it in [this guide](https://content.nuxt.com/docs/getting-started).
::

## Visual Front-Matter editing

You can now edit your markdown front-matter without writing in the `YAML` syntax. Instead, Nuxt Studio automatically generates a user-friendly form that simplifies metadata editing.

:video{autoplay controls loop poster="https://res.cloudinary.com/nuxt/video/upload/v1729157955/frontmatterform2_rmh58v.jpg" src="https://res.cloudinary.com/nuxt/video/upload/v1729157955/frontmatterform2_rmh58v.mp4"}

## What is the front-matter?

Front-matter is a convention used in Markdown-based CMSs to provide metadata for pages, such as descriptions, titles, and more. In [Nuxt Content](https://content.nuxt.com/docs/files/markdown#front-matter), the front-matter uses the YAML syntax.

::callout
---
icon: i-ph-info
to: https://content.nuxt.com/docs/files/markdown#front-matter
---
For more detailed information about front-matter syntax, visit the Nuxt Content documentation.
::

## The last piece of our non-technical editor

Nuxt Studio has been designed with non-technical users in mind, mainly since our editor has been released. Our goal is to make markdown and content edition accessible to everyone.

The automatic form generation for front-matter is the next logical step. By moving away from the complexities of YAML syntax, we’re simplifying the process for non-developers, offering dynamic input options like image pickers, date pickers, boolean toggles and more. This enhancement brings us to a fully visual, user-friendly content management experience.

## Expanding to all YAML and JSON files

Soon, the form generation feature will extend to all `YAML` and `JSON` files you edit within Nuxt Studio, making it easier than ever to work with structured data.

## Looking ahead to Nuxt Content v3

::callout{icon="i-ph-lightbulb"}
This section is just a teaser of [Nuxt Content v3](https://github.com/nuxt/content/tree/v3){rel="nofollow"}. We will publish a more detailed blog post soon.
::

We're actively working on the next major update of Nuxt Content which will bring significant performance improvements and new features to further enhance your content management experience.

### Improved Performance

A key challenge with Nuxt Content v2 was the large bundle size required to store all content files. It was an issue when deploying to edge platforms like [NuxtHub](https://hub.nuxt.com/){rel="nofollow"}.

To address this, Nuxt Content v3 moves away from the file based storing in production and leverage SQL database system. This switch is transparent to users. We're providing a zero config support for development mode, static generation, server rendering and edge deployments with NuxtHub.

### Introducing Collections

Collections are groups of related content items within your Nuxt Content project. They help organize and manage large datasets more efficiently.

#### Define collections

You'll be able to define collections in the `content.config.ts` file which is used by Nuxt Content to configure database structures, utility types, and methods for finding, parsing, and querying content.

#### Collections schema

Schemas enforce consistency within collections and improve TypeScript typings for better integration with Nuxt Content utilities.

```ts [content.config.ts]
import { defineCollection, z } from '@nuxt/content'

// Export collections
export const collections = {
  // Define collection using `defineCollection` utility
  posts: defineCollection({
    // Specify the type of content in this collection
    type: 'page',
    // Load every file matching this pattern
    source: 'blog/**/*.md',
    // Define custom schema for this collection
    schema: z.object({
      date: z.date(),
      image: z.object({
        src: z.string(),
        alt: z.string()
      }),
      badge: z.object({
        label: z.string(),
        color: z.string()
      })
    })
  }),
}
```

### Built with Nuxt Studio in mind

Nuxt Studio was originally developed alongside Nuxt Content v2, but with v3, we're building the module with Nuxt Studio experience in mind. Our goal is to create the best CMS platform for content editing, while still offering the best developers experience.

For example, collection schemas will help us further enhance form generation in Studio. Among other things, you'll be able to set the editor type for a field directly in your schema.

```ts [content.config.ts]
image: z.object({
    src: z.string().editor({ type: 'media' })
    alt: z.string()
}),
icon: z.string().editor({ type: 'icon' })
```

::callout{icon="i-ph-lightbulb" to="https://github.com/nuxt/content/tree/main"}
Nuxt Content v3 has been officially released. Don't hesitate to try it out and give us feedback.
::


# Studio Form Customisation

The [Studio](https://nuxt.studio){rel="nofollow"} forms are dynamically generated based on the collection schema defined in your content configuration file. This behaviour applies whether you’re editing the [frontmatter](https://content.nuxt.com/docs/files/markdown#frontmatter) of a `Markdown` file or a `JSON` / `YAML` file.

:video{autoplay controls poster="https://res.cloudinary.com/nuxt/video/upload/v1739982761/frontmatterform_yjafgt.png" src="https://res.cloudinary.com/nuxt/video/upload/v1739982761/frontmatterform_yjafgt.mp4"}

## **Defining your form with** `zod` Schema

Nuxt Content leverages [zod](https://github.com/colinhacks/zod){rel="nofollow"} to let you define a type-safe schema for your content. This schema not only validates your data but also powers the form generation in **Studio**.

### **Built-in zod Helpers**

You can define your Content schema by adding the `schema` property to your collection and by using a [zod](https://github.com/colinhacks/zod){rel="nofollow"} schema.

`@nuxt/content` exposes a `z` object that contains a set of [Zod](https://content.nuxt.com) utilities for common data types.

::prose-code-group
```ts [content.config.ts]
export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        draft: z.boolean().default(false),
        category: z.enum(['Alps', 'Himalaya', 'Pyrenees']).optional(),
        date: z.date(),
        image: z.object({
          src: z.string().editor({ input: 'media' }),
          alt: z.string(),
        }),
        slug: z.string().editor({ hidden: true }),
        icon: z.string().optional().editor({ input: 'icon' }),
        authors: z.array(z.object({
          slug: z.string(),
          username: z.string(),
          name: z.string(),
          to: z.string(),
          avatar: z.object({
            src: z.string(),
            alt: z.string(),
          }),
        })),
      }),
    }),
  },
})    
```

  :::preview-card{icon="i-lucide-eye" label="Generated Form"}
  ![Form preview](https://content.nuxt.com/docs/studio/preview-schema.png)
  :::
::

### **Native Inputs Mapping**

Primitive Zod types are automatically mapped to appropriate form inputs in **Studio**:

- **String** → Text input
- **Date** → Date picker
- **Number** → Number input (counter)
- **Boolean** → Toggle switch
- **Enum** → Select dropdown
- **Arrays of strings** → List of badge inputs
- **Arrays of objects** → Accordion of items with embedded form

:video{autoplay controls loop poster="https://res.cloudinary.com/nuxt/video/upload/v1740679550/arrayobjectandstring_r1jpvz.jpg" src="https://res.cloudinary.com/nuxt/video/upload/v1740679550/arrayobjectandstring_r1jpvz.mp4"}

### Custom Inputs Mapping

Content goes beyond primitive types. You can customise form fields using the `editor` method, which extends Zod types with metadata to empower editor interface.

This allows you to define custom inputs or hide fields.

#### Usage

```ts [content.config.ts]
mainScreen: z.string().editor({ input: 'media' })
```

#### Options

##### `input: 'media' | 'icon'`

You can set the editor input type. Currently both icon and media are available since there are handled in Studio editor.

##### `hidden: Boolean`

This option can be set to avoid the display of a field in the Studio editor.

::prose-tip
Studio inputs are fully extensible. We can create as many input as we want based on our users needs.
::


# Visual YAML and JSON File Edition

::warning
This article was published before the merge of the [Content](https://github.com/nuxt/content){rel="nofollow"} and [Studio](https://github.com/nuxtlabs/studio-module){rel="nofollow"} modules on January 6, 2025. As a result, it may contain some inconsistencies. The Studio module is now deprecated and available as an opt-in feature of the Content module. Learn how to enable it in [this guide](https://content.nuxt.com/docs/getting-started).
::

## Auto-generated form for `YAML` and `JSON` files

:video{controls loop src="https://res.cloudinary.com/nuxt/video/upload/v1730132248/yml-json-form_n9czcs.mp4"}

Continuing our journey to make Nuxt Studio the tool for non-technical users to edit their content with Nuxt websites, we're excited to announce that `YAML` and `JSON` files can now be edited through a generated visual form. This update removes the need for users to interact directly with complex file syntax such as YAML or JSON.

::callout{icon="i-ph-info"}
Arrays are not yet handled as form but we'll work on it once collections and user-defined schemas will be released with Nuxt Content v3. See the section below.
::

### Synchronized navigation

Alongside this update, we’ve improved the synchronized navigation between the preview and selected files for non-Markdown formats (like YAML and JSON). To apply this fixe, please update the Studio module to the latest version `v2.2.0`.

## On the Road to Nuxt Content v3

We’re excited to share that the fourth alpha version of Nuxt Content v3 has been released, with the [**draft documentation**](https://content.nuxt.com/){rel="nofollow"} available.

### What’s Next?

In the coming months, we’ll focus on testing and refining Nuxt Content v3 to ensure a robust, production-ready release. Here’s a quick look at the Nuxt Studio related improvements ahead:

- **Merging the Studio module**: Soon, the Studio module will be integrated directly into Nuxt Content. Once Nuxt Content v3 is released, activating Studio will be as simple as setting `content.editor: true` in your `nuxt.config.ts` file. This simplification means no extra module is required for Studio, making setup faster.
- **Unified documentation**: With the module integration, we’ll also merge the [Content](https://content.nuxt.com){rel="nofollow"} and [Studio](https://nuxt.studio){rel="nofollow"} documentation and websites into one comprehensive resource. Only the Studio platform (available once the user is logged) will remain as a standalone site.
- **Take advantage of data structures and collections in Studio**: With Nuxt Content v3, the Studio platform will support and adapt its behaviour to [collections](https://content.nuxt.com/docs/collections/define) and user-defined schemas. This enhancement will allow schema-generated forms for both YAML and JSON files as well as front-matter within Markdown files.

These updates reflect our commitment to providing the best content editing platform for your Nuxt website. Stay tuned!