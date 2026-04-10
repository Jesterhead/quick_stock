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
EXPOSE 8080
CMD sh -c "http-server dist -p 8080 -c-1 -f index.html"