#!/bin/bash
DIR=/app/web
PORT=5000

if [ -d $DIR ]
then
    echo "directory existing"
else
    mkdir -p $DIR
fi

cd $DIR

sudo chown -R ec2-user:root $DIR

sudo yarn install

sudo yarn build

netstat -tuln | grep ":$PORT " > /dev/null

if [ $? -eq 0 ]; then
    echo "Port $PORT is active"
else
    echo "Port $PORT is not active"

    yarn install

    yarn build
fi

sudo systemctl restart klosanow.service
