# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build frontend (Vite) and compile server (TypeScript)
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install all dependencies (tsx needed at runtime)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# Re-generate Prisma client for production image
RUN npx prisma generate

# Copy built frontend assets
COPY --from=build /app/dist ./dist

# Copy server source (runs via tsx)
COPY server ./server

# Copy public assets if present
COPY --from=build /app/public ./public

EXPOSE ${PORT:-3042}

# Run database migrations then start the server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx server/index.ts"]
