FROM node:lts-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN set -eux \
    & apk add \
        --no-cache \
        yarn
RUN yarn install

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn run build

# Stage 3: Production server

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder package.json ./

EXPOSE 3000
CMD ["npm", "start"]
