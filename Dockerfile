# Stage 1: Build frontend + compile server
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps
RUN npx prisma generate

COPY . .

# Build frontend (Vite) and compile server (esbuild)
RUN npm run build && npx esbuild server/index.ts --bundle --platform=node --outdir=dist-server --format=esm --packages=external

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production deps only + generate Prisma client
RUN npm ci --omit=dev --legacy-peer-deps && npx prisma generate

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy compiled server
COPY --from=build /app/dist-server ./dist-server

# Copy public assets
COPY --from=build /app/public ./public

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x /app/start.sh

EXPOSE ${PORT:-3042}

CMD ["/app/start.sh"]
