FROM richarvey/nginx-php-fpm:latest

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Install PostgreSQL PDO extension
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql

# Install node and npm for Vite (if needed)
RUN apk add --update nodejs npm

# Install composer dependencies
RUN composer install --optimize-autoloader --no-dev

# Run Laravel optimizations
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true

# Set proper permissions
RUN chown -R nginx:nginx /var/www/html
RUN chmod -R 755 /var/www/html/storage

CMD ["/start.sh"]