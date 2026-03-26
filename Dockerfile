# Stage 1: Build the Angular app
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install build deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy sources and build
COPY . .
RUN npm run build -- --configuration production --silent

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app (project-specific dist folder)
COPY --from=builder /usr/src/app/dist/chat-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]