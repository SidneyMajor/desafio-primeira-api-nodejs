FROM node:22-alpine AS builder

WORKDIR /app

RUN npm ci

COPY . ./

EXPOSE 3333

CMD ["node", "src/server.ts"]