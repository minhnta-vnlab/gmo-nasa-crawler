FROM node:22-alpine
COPY . /app

WORKDIR /app
RUN npm install --frozen-lockfile
RUN npm run build