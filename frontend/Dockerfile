FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose
COPY . .
RUN npm run build
RUN ls -la dist/ || echo "ERROR: dist folder is empty or missing!"

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
RUN ls -la dist/ || echo "ERROR: dist folder not copied!"
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]