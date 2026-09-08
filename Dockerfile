# ==========================================
# Multi-stage Build Dockerfile for Offline Backup
# ==========================================

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Production Nginx
FROM nginx:alpine

# Copy custom Nginx config for SPA routing and gzip compression
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
