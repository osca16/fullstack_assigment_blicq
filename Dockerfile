# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS builder


ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production


ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]