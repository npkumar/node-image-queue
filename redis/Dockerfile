FROM redis:5.0.4-alpine

COPY ./wait-for-redis.sh /opt/wait-for-redis.sh
RUN chmod +x /opt/wait-for-redis.sh

EXPOSE 6379

# ENTRYPOINT ["/bin/sh", "-c"]

# CMD ["/opt/wait-for-redis.sh redis 6397"]