FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose
COPY . .
RUN npm run build -- --base-href=/
RUN echo "=== Build output ===" && ls -laR /app/dist/

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache wget
RUN npm install -g http-server
COPY --from=builder /app/dist/my-web-app/browser /app/dist
RUN ls -la /app/dist
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1
CMD sh -c "http-server dist -p 8080 -c-1 -f index.html"