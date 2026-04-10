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
CMD ["http-server", "dist", "-p", "3000", "-c-1", "-f", "index.html"]