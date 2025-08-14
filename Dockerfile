# Stage 1: Build the frontend
FROM node:16 AS frontend-build
WORKDIR /app/front-end
COPY front-end/package.json front-end/yarn.lock ./
RUN yarn config set registry https://registry.npmjs.org/
RUN yarn install
COPY front-end/ ./
RUN sed -i 's|https://onlinechess-py-backend.onrender.com|http://localhost:80|g' src/SocketConfig.js
RUN yarn build

# Stage 2: Production image
FROM python:3.9-slim
WORKDIR /app

# Copy backend and stockfish
COPY back-end/ /app/
COPY --from=frontend-build /app/front-end/build /app/static
COPY stockfish/ /app/stockfish/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port and start the app
EXPOSE 80
CMD ["python", "server_updated.py"]
