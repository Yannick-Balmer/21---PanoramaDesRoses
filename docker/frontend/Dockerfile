# ============================================
# BUILD
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g npm@11.6.2

ARG NEXT_PUBLIC_BACK_END
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_PUBLIC_BACK_END=$NEXT_PUBLIC_BACK_END
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ============================================
# RUNTIME (Next standalone)
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5556
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 5556

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
CMD ["node", "-e", "require('http').get('http://127.0.0.1:5556/api/health',  r => { r.resume(); process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"]

CMD ["node", "server.js"]