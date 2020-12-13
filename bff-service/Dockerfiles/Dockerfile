# Base
FROM node:12-alpine AS build

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Build
RUN npm run build

# remove development dependencies
RUN npm prune --production

# run node prune
RUN /app/scripts/node/node-prune.sh

# Application
FROM node:12-alpine as application

WORKDIR /app

# copy from build image
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

USER node
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]