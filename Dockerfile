# Stage 1: Build frontend
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all deps (tsx, prisma needed at runtime)
RUN npm ci --legacy-peer-deps && npx prisma generate

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server source (runs via tsx)
COPY server ./server

# Copy public assets
COPY --from=build /app/public ./public

EXPOSE ${PORT:-3042}

CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx server/index.ts"]
