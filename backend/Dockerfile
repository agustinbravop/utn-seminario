FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
COPY prisma .
COPY src src/

# Instalar dependencias del proyecto.
RUN npm install

# Construir el proyecto a la carpeta `dist/`.
RUN npm run build

# Se construye un container sin los archivos fuente, solo con el ejecutable en `dist/`.
FROM node:18-alpine

# Variables de entorno.
ENV DATABASE_URL=postgresql://postgres:root@localhost:5432/canchasdb
ENV JWT_SECRET=l7K15qPS401QMpTNXHfg5YTvkIvmUPQY
ENV JWT_ISSUER=playfinder-api
ENV JWT_EXPIRATION_TIME=24h
ENV PORT=80

ENV FRONT_URL=http://localhost:5173

ENV GOOGLE_CLIENT_ID=242199369878-vh11h5c6s5t8oo0sp4tubclc3mv59l11.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET={secret}
ENV SENDGRID_API_KEY={secret}
ENV SENDGRID_VERIFIED_SENDER=playfinder0@gmail.com

WORKDIR /app

# Copiar el artefacto compilado.
COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules/

CMD [ "index.js" ]

EXPOSE 80