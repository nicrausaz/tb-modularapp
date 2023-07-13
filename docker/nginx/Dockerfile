FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=modapp /app/packages/server/build/public /var/www/