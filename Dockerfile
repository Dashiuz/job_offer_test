# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Production Runtime ----------
FROM node:20-alpine AS production
WORKDIR /app

# Copy only what's required at runtime
COPY package*.json ./

# Install prod deps as root (has write access)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Create non-root user and take ownership AFTER files exist
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app

ENV NODE_ENV=production
EXPOSE 3000

# Drop privileges now
USER app

CMD ["node", "dist/main.js"]
