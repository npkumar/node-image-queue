FROM ubuntu:18.04

WORKDIR /var/www/app

RUN apt-get update && apt-get install -y redis-tools nodejs npm

RUN npm install pm2 -g
  
# Cache npm modules if possible
ADD package.json /var/www/app
RUN npm install

# Add application files
ADD . /var/www/app

ADD wait-for-redis.sh /opt/wait-for-redis.sh
RUN chmod +x /opt/wait-for-redis.sh

# Expose port
EXPOSE 3000
