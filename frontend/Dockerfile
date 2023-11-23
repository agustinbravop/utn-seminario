FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Instalar dependencias del proyecto.
RUN yarn install
COPY . .

# Vite inyecta las variables de entorno en buildtime, no runtime. Podríamos buscar una manera
# (incómoda) de inyectarlas en runtime para pasarlas en `docker run` y no en `docker build`.
ARG API_BASE_URL=http://localhost:3001
ARG GOOGLE_CLIENT_ID=242199369878-vh11h5c6s5t8oo0sp4tubclc3mv59l11.apps.googleusercontent.com
ARG BASE_URL=http://localhost:5173

ENV VITE_API_BASE_URL=${API_BASE_URL}
ENV VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV VITE_BASE_URL=${BASE_URL}

# Construir el proyecto a la carpeta `dist/`.
RUN yarn build

# Construir un container con un servidor NGINX para servir el sitio web.
FROM nginx:alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

CMD [ "nginx", "-g", "daemon off;" ]

EXPOSE 80