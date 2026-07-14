FROM php:8.2-cli

# Install system dependencies and PHP extensions for Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Grab Composer from its official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy all backend files into the container
COPY . .

# Install production PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose the default port
EXPOSE 8000

# Start Laravel server using the port assigned dynamically by Render
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}