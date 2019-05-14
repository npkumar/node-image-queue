FROM node:9

WORKDIR /var/www/app

RUN npm install pm2 -g
  
# Use Cache please
ADD package.json /var/www/app
RUN npm install

# Add application files
ADD . /var/www/app

# Entrypoint script
RUN cp docker-entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]