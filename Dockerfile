# Stage build
FROM node:alpine AS build

ARG DB_FILE_NAME
ENV DB_FILE_NAME=$DB_FILE_NAME

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

RUN npx drizzle-kit push 

# Stage production
FROM node:alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

ARG DB_FILE_NAME

# Copy thư mục dist từ stage build
COPY --from=build /app/dist ./dist
COPY --from=build /app/${DB_FILE_NAME} .

# CMD trỏ tới file đầu ra thực tế
CMD ["node", "dist/src/main.js"] 
