FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=modapp /app/packages/server/build/public /var/www/

RUN apt-get install openssl
RUN openssl req -x509 -nodes -days 365 -subj "/C=CH/ST=VD/O=YALK/CN=localhost" -addext "subjectAltName=DNS:localhost" -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt;