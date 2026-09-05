# Stage 1: Build the React app
FROM node:18-slim AS builder

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build:prod

# Stage 2: Playwright runtime + action code
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Install serve for static file serving
RUN npm install -g serve@14

# Copy built React app
COPY --from=builder /app/build /app/build

# Copy and build action source
WORKDIR /action
COPY action/package.json action/tsconfig.json ./
RUN npm install --ignore-scripts
COPY action/src ./src
RUN npx tsc

ENTRYPOINT ["node", "/action/dist/main.js"]
