FROM node:22-alpine

WORKDIR /app


RUN apk add --no-cache openssl


COPY package*.json ./

RUN npm ci

COPY prisma ./prisma


RUN npx prisma generate


COPY . .

RUN npm run build

RUN mkdir -p dist/Documentation && cp -r documentation/* dist/Documentation/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]