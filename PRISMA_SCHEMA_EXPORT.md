# Prisma Schema Export

Generated on: 2026-04-19
Source: `prisma/schema.prisma`

## Purpose

This file exports your current Prisma schema and provides a short explanation of each enum and model.

## Enums

- `Role`: User access level (`USER`, `MODERATOR`).
- `UserStatus`: Account moderation state (`ACTIVE`, `BLOCKED`).
- `AdStatus`: Advertisement lifecycle state (`PENDING`, `ACTIVE`, `REJECTED`).

## Models Overview

- `User`: Identity and role/status for platform users.
- `Account`: OAuth provider linkage for NextAuth.
- `Category`: Hierarchical ad categories (supports parent/children).
- `Location`: Geographic label/slugs for ads.
- `Advertisement`: Core listing entity.
- `AdImage`: Image records attached to an advertisement.
- `Session`: Database-backed auth sessions.
- `VerificationToken`: Token storage for verification flows.

## Exact Schema

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
