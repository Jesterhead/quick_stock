FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose
COPY . .
RUN npm run build -- --base-href=/
RUN ls -la dist/my-web-app || echo "ERROR: dist folder is empty or missing!"

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist/my-web-app/browser /app/dist
RUN ls -la dist || echo "ERROR: dist folder not copied!"
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]