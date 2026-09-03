FROM node:22-bookworm-slim AS builder
WORKDIR /app

ENV CI=true \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_UNSAFE_PERM=true

COPY package.json package-lock.json ./
# npm 10 (bundled with Node 22) crashes in Docker with "Exit handler never called".
RUN npm install -g npm@9.9.4 \
  && npm ci --unsafe-perm --foreground-scripts --no-audit --no-fund \
  || (echo "===== npm debug log =====" && cat /root/.npm/_logs/*debug*.log && exit 1)

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY public ./public

EXPOSE 5000
CMD ["node", "dist/server.js"]
