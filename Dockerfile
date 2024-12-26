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
COPY . .
ENV NODE_ENV=production

EXPOSE 3000
CMD ["yarn", "start"]
