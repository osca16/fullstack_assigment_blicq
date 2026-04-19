# Full Repository Export and Explanation

Generated on: 2026-04-19

## Scope

This export documents the current project files and folder structure, excluding dependency/build folders:
- `node_modules/`
- `.next/`
- `.git/`

## High-Level Architecture

- Framework: Next.js App Router project with TypeScript.
- Authentication: NextAuth with Google OAuth and Prisma adapter.
- Database: PostgreSQL via Prisma ORM.
- UI: Tailwind CSS + shadcn/ui patterns.
- App Domains: Public browsing, user ad management, and moderator/admin review flow.

## Repository Tree (project files)

~~~text
.
|-- .env
|-- .gitignore
|-- AGENTS.md
|-- CLAUDE.md
|-- components.json
|-- eslint.config.mjs
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- prisma.config.ts
|-- PROJECT_EXPORT.md
|-- README.md
|-- tsconfig.json
|-- prisma/
|   `-- schema.prisma
|-- public/
|   |-- file.svg
|   |-- globe.svg
|   |-- next.svg
|   |-- vercel.svg
|   `-- window.svg
`-- src/
    |-- middleware.ts
    |-- actions/
    |   |-- ad.actions.ts
    |   |-- auth.actions.ts
    |   `-- moderation.actions.ts
    |-- app/
    |   |-- globals.css
    |   |-- layout.tsx
    |   |-- (admin)/
    |   |   |-- layout.tsx
    |   |   `-- moderator/
    |   |       |-- page.tsx
    |   |       `-- pending/
    |   |           `-- page.tsx
    |   |-- (auth)/
    |   |   |-- layout.tsx
    |   |   |-- error/
    |   |   |   `-- page.tsx
    |   |   `-- login/
    |   |       `-- page.tsx
    |   |-- (public)/
    |   |   |-- layout.tsx
    |   |   |-- page.tsx
    |   |   `-- search/
    |   |       `-- page.tsx
    |   |-- (user)/
    |   |   |-- layout.tsx
    |   |   |-- ads/
    |   |   |   `-- new/
    |   |   |       `-- page.tsx
    |   |   `-- dashboard/
    |   |       `-- page.tsx
    |   `-- api/
    |       `-- auth/
    |           `-- [...nextauth]/
    |               `-- route.ts
    |-- components/
    |   |-- moderator/
    |   |   |-- PendingAdRow.tsx
    |   |   |-- ReviewPanel.tsx
    |   |   `-- StatusCard.tsx
    |   |-- public/
    |   |   |-- AdCard.tsx
    |   |   |-- AdDetail.tsx
    |   |   |-- CategoryNav.tsx
    |   |   `-- SearchBar.tsx
    |   |-- shared/
    |   |   |-- AuthGuard.tsx
    |   |   |-- Footer.tsx
    |   |   `-- Header.tsx
    |   |-- ui/
    |   |   `-- button.tsx
    |   `-- user/
    |       |-- AdForm.tsx
    |       `-- MyAdCard.tsx
    |-- generated/
    |   `-- prisma/
    |       |-- browser.ts
    |       |-- client.ts
    |       |-- commonInputTypes.ts
    |       |-- enums.ts
    |       |-- models.ts
    |       |-- query_engine-windows.dll.node
    |       |-- internal/
    |       |   |-- class.ts
    |       |   |-- prismaNamespace.ts
    |       |   `-- prismaNamespaceBrowser.ts
    |       `-- models/
    |           |-- Account.ts
    |           |-- AdImage.ts
    |           |-- Advertisement.ts
    |           |-- Category.ts
    |           |-- Location.ts
    |           |-- Session.ts
    |           |-- User.ts
    |           `-- VerificationToken.ts
    |-- lib/
    |   |-- auth.ts
    |   |-- prisma.ts
    |   |-- utils.ts
    |   |-- email/
    |   |   |-- ses.ts
    |   |   `-- templates/
    |   |       |-- approvalEmail.ts
    |   |       `-- rejectionEmail.ts
    |   `-- validators/
    |       |-- ad.schema.ts
    |       `-- moderation.schema.ts
    `-- types/
        |-- index.ts
        `-- next-auth.d.ts
~~~

## Root Files Explanation

- `.env`: Environment variable definitions (DB connection, OAuth, auth secrets, AWS SES keys). Contains sensitive values.
- `.gitignore`: Ignore patterns for dependencies, build outputs, env files, and generated Prisma artifacts.
- `AGENTS.md`: Agent guidance note warning about Next.js version changes.
- `CLAUDE.md`: Reference file that points to `AGENTS.md`.
- `components.json`: shadcn/ui generator configuration (style, aliases, Tailwind settings).
- `eslint.config.mjs`: ESLint setup for Next.js and TypeScript rules.
- `next-env.d.ts`: Next.js TypeScript auto-generated type references.
- `next.config.ts`: Next.js config placeholder object.
- `package-lock.json`: NPM lockfile with exact dependency tree.
- `package.json`: Project scripts and dependency manifest.
- `postcss.config.mjs`: PostCSS plugin setup with Tailwind PostCSS plugin.
- `prisma.config.ts`: Prisma config binding schema path, migrations path, and datasource env.
- `README.md`: Default create-next-app README (not customized yet).
- `tsconfig.json`: TypeScript compiler configuration and path alias mapping.

## Prisma Folder

- `prisma/schema.prisma`: Core data model with enums and models for users, auth, ads, categories, locations, sessions, and verification tokens.

## Public Assets

- `public/file.svg`: Static icon/image asset.
- `public/globe.svg`: Static icon/image asset.
- `public/next.svg`: Static Next.js logo asset.
- `public/vercel.svg`: Static Vercel logo asset.
- `public/window.svg`: Static icon/image asset.

## Source Code Explanation

### `src/middleware.ts`

- Placeholder middleware file (currently empty).

### `src/actions/`

- `src/actions/ad.actions.ts`: Placeholder for advertisement-related server actions.
- `src/actions/auth.actions.ts`: Placeholder for auth-related server actions.
- `src/actions/moderation.actions.ts`: Placeholder for moderation-related server actions.

### `src/app/`

- `src/app/globals.css`: Global design tokens/theme variables and base Tailwind layers.
- `src/app/layout.tsx`: Currently only defines imported fonts (`Inter`, `DM_Sans`) and font CSS variables.

#### `src/app/(admin)/`

- `src/app/(admin)/layout.tsx`: Placeholder admin layout (empty).
- `src/app/(admin)/moderator/page.tsx`: Placeholder moderator landing page (empty).
- `src/app/(admin)/moderator/pending/page.tsx`: Placeholder page for pending moderation queue (empty).

#### `src/app/(auth)/`

- `src/app/(auth)/layout.tsx`: Placeholder auth layout (empty).
- `src/app/(auth)/error/page.tsx`: Placeholder auth error page (empty).
- `src/app/(auth)/login/page.tsx`: Placeholder login page (empty).

#### `src/app/(public)/`

- `src/app/(public)/layout.tsx`: Placeholder public layout (empty).
- `src/app/(public)/page.tsx`: Placeholder public home page (empty).
- `src/app/(public)/search/page.tsx`: Placeholder search page (empty).

#### `src/app/(user)/`

- `src/app/(user)/layout.tsx`: Placeholder user layout (empty).
- `src/app/(user)/ads/new/page.tsx`: Placeholder create-ad page (empty).
- `src/app/(user)/dashboard/page.tsx`: Placeholder user dashboard (empty).

#### `src/app/api/auth/[...nextauth]/route.ts`

- Exposes NextAuth request handlers (`GET`, `POST`) from `src/lib/auth.ts`.

### `src/components/`

#### `src/components/moderator/`

- `src/components/moderator/PendingAdRow.tsx`: Placeholder row component for pending ad list.
- `src/components/moderator/ReviewPanel.tsx`: Placeholder moderation review panel component.
- `src/components/moderator/StatusCard.tsx`: Placeholder stats/status card component.

#### `src/components/public/`

- `src/components/public/AdCard.tsx`: Placeholder public advertisement card component.
- `src/components/public/AdDetail.tsx`: Placeholder public ad detail component.
- `src/components/public/CategoryNav.tsx`: Placeholder category navigation component.
- `src/components/public/SearchBar.tsx`: Placeholder search UI component.

#### `src/components/shared/`

- `src/components/shared/AuthGuard.tsx`: Placeholder auth guard wrapper.
- `src/components/shared/Footer.tsx`: Placeholder footer component.
- `src/components/shared/Header.tsx`: Placeholder header/navigation component.

#### `src/components/ui/`

- `src/components/ui/button.tsx`: Implemented reusable button component using class-variance-authority and Radix Slot pattern.

#### `src/components/user/`

- `src/components/user/AdForm.tsx`: Placeholder ad form component.
- `src/components/user/MyAdCard.tsx`: Placeholder user-owned ad card component.

### `src/generated/prisma/` (Auto-Generated)

All files in this folder are generated by Prisma client generation and should not be manually edited.

- `src/generated/prisma/browser.ts`: Browser-side Prisma exports/types.
- `src/generated/prisma/client.ts`: Main Prisma client API entry.
- `src/generated/prisma/commonInputTypes.ts`: Shared generated query/input types.
- `src/generated/prisma/enums.ts`: Generated enums from schema.
- `src/generated/prisma/models.ts`: Generated model exports.
- `src/generated/prisma/query_engine-windows.dll.node`: Windows-native Prisma query engine binary.
- `src/generated/prisma/internal/class.ts`: Internal generated runtime class definitions.
- `src/generated/prisma/internal/prismaNamespace.ts`: Internal generated Prisma namespace.
- `src/generated/prisma/internal/prismaNamespaceBrowser.ts`: Internal browser namespace variant.
- `src/generated/prisma/models/Account.ts`: Generated model type for `Account`.
- `src/generated/prisma/models/AdImage.ts`: Generated model type for `AdImage`.
- `src/generated/prisma/models/Advertisement.ts`: Generated model type for `Advertisement`.
- `src/generated/prisma/models/Category.ts`: Generated model type for `Category`.
- `src/generated/prisma/models/Location.ts`: Generated model type for `Location`.
- `src/generated/prisma/models/Session.ts`: Generated model type for `Session`.
- `src/generated/prisma/models/User.ts`: Generated model type for `User`.
- `src/generated/prisma/models/VerificationToken.ts`: Generated model type for `VerificationToken`.

### `src/lib/`

- `src/lib/auth.ts`: NextAuth configuration with Google provider, Prisma adapter, database sessions, session enrichment, and blocked-user sign-in guard.
- `src/lib/prisma.ts`: Prisma client singleton pattern to avoid multiple clients in development.
- `src/lib/utils.ts`: `cn()` helper combining `clsx` and `tailwind-merge`.

#### `src/lib/email/`

- `src/lib/email/ses.ts`: Placeholder for AWS SES email sending utility.
- `src/lib/email/templates/approvalEmail.ts`: Placeholder for ad approval email template.
- `src/lib/email/templates/rejectionEmail.ts`: Placeholder for ad rejection email template.

#### `src/lib/validators/`

- `src/lib/validators/ad.schema.ts`: Placeholder for ad validation schema.
- `src/lib/validators/moderation.schema.ts`: Placeholder for moderation action schema.

### `src/types/`

- `src/types/index.ts`: Placeholder barrel for shared app-level types.
- `src/types/next-auth.d.ts`: Extends NextAuth `Session.user` with `id`, `role`, and `status`.

## Prisma Schema Export (Exact Content)

~~~prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role{
  USER
  MODERATOR
}

enum UserStatus{
  ACTIVE
  BLOCKED
}

enum AdStatus{
  PENDING
  ACTIVE
  REJECTED
}

model User{
  id String @id @default(cuid())
  name String?
  email String @unique
  role Role @default(USER)
  status UserStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  //Relations
  accounts Account[]
  sessions Session[]
  advertisements Advertisement[]

}

model Account{
  id String @id @default(cuid())
  userId String
  type String
  provider String
  providerAccountId String
  refresh_token String?
  access_token String?
  expires_at Int?
  token_type String?
  scope String?
  id_token String?
  session_state String?

  user User @relation(fields: [userId], references:[id], onDelete:Cascade)
  @@unique([provider, providerAccountId])
}

model Category {
  id String @id @default(cuid())
  name String
  slug String @unique
  parentId String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  //self relation
  parent Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  //Relations
  advertisements Advertisement[]

  @@index([parentId])
}

model Location {
  id String @id @default(cuid())
  name String
  slug String @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  advertisements Advertisement[]
}

model Advertisement{
  id String @id @default(cuid())
  userId String
  categoryId String
  locationId String

  title String
  description String
  price Decimal @db.Decimal(10, 2)
  status AdStatus @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  //Relations
  user User @relation(fields: [userId], references:[id], onDelete:Cascade)
  category Category @relation(fields: [categoryId], references:[id])
  location Location @relation(fields: [locationId], references:[id])
  images AdImage[]

  @@index([categoryId])
  @@index([locationId])
  @@index([status])
  @@index([userId])
}


model AdImage{
  id String @id @default(cuid())
  advertisementId String 
  filePath String
  isPrimary Boolean @default(false)

  advertisement Advertisement @relation(fields: [advertisementId], references:[id], onDelete:Cascade)
}

model Session {
  id String @id @default(cuid())
  sessionToken String @unique
  userId String
  expires DateTime

  user User @relation(fields: [userId], references: [id], onDelete:Cascade)
}

model VerificationToken {
  identifier String 
  token String @unique
  expires DateTime

  @@unique([identifier, token])
}
~~~

## Notes

- A large part of the app is scaffolded and currently empty placeholders.
- `src/generated/prisma/` is generated output, not hand-authored business logic.
- `.env` contains secrets and should not be published as-is.
