# from nginx, serve static files from /var/www/html
FROM nginx:stable-alpine
COPY . /var/www/html
COPY ./src/nginx.conf /etc/nginx/nginx.conf
ENV PORT 80

