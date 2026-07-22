# Multi-Stage Dockerfile for Mini ERP + CRM Portal

# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend ---
FROM node:20-alpine AS build-backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# --- Stage 3: Production Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built frontend assets
COPY --from=build-frontend /app/dist ./public

# Copy backend build
COPY --from=build-backend /app/server/dist ./server-dist
COPY --from=build-backend /app/server/package*.json ./server/

WORKDIR /app/server
RUN npm ci --only=production

EXPOSE 3000 5000

ENV PORT=5000
CMD ["node", "../server-dist/index.js"]
