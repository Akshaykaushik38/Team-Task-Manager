# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build for production
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to nginx html directory
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 8080 (Railway uses 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
