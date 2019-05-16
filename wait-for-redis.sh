#!/usr/bin/env bash

# Pings redis server until we get a reply.
# Ensures redis is running before application is launched.
# Usage: wait-for-redis.sh hostname port

HOST=$1
PORT=$2

echo "Waiting for Redis to start start. Host '$HOST', '$PORT'..."
echo "Pinging Redis... "
PONG=`redis-cli -h $HOST -p $PORT ping | grep PONG`
while [ -z "$PONG" ]; do
    sleep 1
    echo "Retrying Redis ping... "
    echo "redis-cli -h $HOST -p $PORT ping"
    PONG=`redis-cli -h $HOST -p $PORT ping | grep PONG`
done
echo "Redis at host '$HOST', port '$PORT' has started."