#!/bin/bash
#Description: compress and zip all files >> copy to remote server if all test passed.

ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa

ssh-copy-id $USER@$HOST_IP

tar -czvf klosanow.tar.gz * >/dev/null

scp klosanow.tar.gz ubuntu@44.203.157.61:~/api/ && ssh ubuntu@44.203.157.61 "tar -xf ~/api/klosanow.tar.gz -C ~/test/"

rm -rf klosanow.tar.gz

# sudo sshpass -p "$PASSWORD" systemctl restart expressjs.service

ssh "$USER@$HOST_IP" "sudo systemctl restart expressjs.service