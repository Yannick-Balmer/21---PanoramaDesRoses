# syntax=docker/dockerfile:1.7

# ============================================
# BUILD
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g npm@11.6.2

ARG NEXT_PUBLIC_BACK_END
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

ENV NEXT_PUBLIC_BACK_END=$NEXT_PUBLIC_BACK_END \
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY \
    NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_FETCH_TIMEOUT=300000 \
    NPM_CONFIG_MAXSOCKETS=5

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .

RUN npm run build


# ============================================
# RUNTIME (Next standalone)
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5556 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs \
    && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN mkdir -p /app/.next/cache \
    && chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 5556

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD ["node", "-e", "require('http').get('http://127.0.0.1:5556/api/health', r => { r.resume(); process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"]

CMD ["node", "server.js"]