FROM node:20-slim

WORKDIR /app

# Use a minimal Node.js image
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Install Playwright and WebKit (minimum install for Playwright WebKit)
RUN npx playwright install webkit --with-deps

# Copy the application code
COPY index.js index.js

# Expose the port used by the application
EXPOSE 5000

# Run the application
CMD ["node", "index.js"]
