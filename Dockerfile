FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock .yarnrc.yml ./

# Enable Corepack and Yarn 4
RUN corepack enable \
    && corepack prepare yarn@4 --activate \
    && yarn --version

# Install production dependencies
RUN yarn workspaces focus --production \
  && yarn add express dotenv tsx \
  && yarn cache clean

# Copy source code
COPY src ./src
COPY server.ts ./server.ts

# Expose port
EXPOSE 3000

# Start the app
CMD ["yarn", "tsx", "server.ts"]
