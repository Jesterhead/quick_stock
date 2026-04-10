FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose
COPY . .
RUN npm run build -- --base-href=/

FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/my-web-app/browser /app/dist
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["http-server", "dist", "-p", "3000"]