FROM ubuntu:18.04

WORKDIR /var/www/app

RUN apt-get update && apt-get install -y redis-tools nodejs npm

RUN nodejs -v
RUN npm -v

RUN npm install pm2 -g
  
# Cache npm modules if possible
ADD package.json /var/www/app
RUN npm install

# Add application files
ADD . /var/www/app

# # Entrypoint script
# RUN cp docker-entrypoint.sh /usr/local/bin/ && \
#     chmod +x /usr/local/bin/docker-entrypoint.sh

RUN redis-cli -v

ADD wait-for-redis.sh /opt/wait-for-redis.sh
RUN chmod +x /opt/wait-for-redis.sh

# Expose the port
EXPOSE 3000
# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# RUN npm run start-docker

