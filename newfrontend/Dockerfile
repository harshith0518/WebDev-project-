# Build phase
FROM node:22.17.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.9.2
RUN npm install
COPY . .
RUN npm run build

# Serve phase
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
