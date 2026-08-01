
# ============================================
# BUILD
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm \
    npm install --global npm@11.6.2 \
        --no-audit \
        --no-fund \
    && npm --version

ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_FETCH_TIMEOUT=300000 \
    NPM_CONFIG_MAXSOCKETS=25

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .

RUN DATABASE_URL="file:/tmp/dev.db" npx prisma generate
RUN npm run build

# Retire les dépendances de développement après le build
RUN npm prune --omit=dev

# ============================================
# PRODUCTION
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S -g 101 nodejs \
    && adduser -S -u 100 -G nodejs nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

COPY --chown=nestjs:nodejs package.json package-lock.json ./
COPY --chown=nestjs:nodejs prisma ./prisma

RUN mkdir -p /app/database \
    && chown -R nestjs:nodejs /app/database

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD ["node", "-e", "require('http').get('http://127.0.0.1:3000/health', r => { r.resume(); process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"]

CMD ["node", "dist/main.js"]