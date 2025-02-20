# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /app

# Build
FROM base AS build

COPY --link package.json .
COPY package-lock.json .

# Install Git only if package.json or package-lock.json contains dependencies that require it (e.g., dependencies with 'git+' URLs)
RUN if grep -q 'git+' package.json package-lock.json; then apt-get update && apt-get install -y git; fi

RUN rm package-lock.json
# This isn’t working because the dependencies in package-lock.json are specific to the architecture 
# of the machine where npm install was run.

RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=$PORT
#ENV HOST 0.0.0.0

COPY --from=build /app/.output /app/.output
COPY package.json /app
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /app/node_modules /app/node_modules

CMD [ "node", ".output/server/index.mjs" ]