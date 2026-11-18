FROM node:20.4.0-alpine AS build
WORKDIR /usr/local/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.31.9-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
