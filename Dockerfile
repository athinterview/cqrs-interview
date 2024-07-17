FROM node:20-alpine

RUN mkdir /app
RUN chown node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src ./src

USER node
RUN npm install

EXPOSE 5080
CMD ["node_modules/.bin/tsx", "src/main.ts"]
