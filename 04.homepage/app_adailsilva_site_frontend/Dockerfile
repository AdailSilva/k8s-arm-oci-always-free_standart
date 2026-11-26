### Deploy as SPA - Single Page Application
# syntax=docker/dockerfile:1

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

RUN --mount=type=cache,target=/root/.npm \
    npm install -g @angular/cli@21

COPY . .

# Perfil explícito: troca src/environments/environment.ts por environment.production.ts
# (não depende do defaultConfiguration do angular.json).
RUN npm run build:production

# ── Stage 2: Servidor Nginx ───────────────────────────────────────────────────
FROM nginx:alpine

# Metadados da imagem
LABEL maintainer="AdailSilva <adail101@hotmail.com>" \
      app="app-adailsilva-site-frontend" \
      description="Homepage – k8s.adailsilva.com.br – Frontend Angular"

COPY --from=builder /app/dist/app-adailsilva-site-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 80/tcp
CMD ["nginx", "-g", "daemon off;"]