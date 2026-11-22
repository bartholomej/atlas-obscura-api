# Build stage
FROM node:26-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./

# Node 25+ no longer ships Corepack
RUN npm install -g corepack@0.36.0 \
    && corepack enable \
    && corepack prepare yarn@4 --activate

RUN yarn

COPY . .

RUN yarn build && yarn build:server

# Production stage
FROM node:26-alpine AS production

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist ./

# Hono is bundled into server.js; the lockfile pins the library's runtime dependencies
COPY .yarnrc.yml yarn.lock ./

# Node 25+ no longer ships Corepack
RUN npm install -g corepack@0.36.0 \
    && corepack enable \
    && corepack prepare yarn@4 --activate

RUN yarn workspaces focus --production \
    && yarn cache clean

EXPOSE 3000

CMD ["node", "server.js"]
