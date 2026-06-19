#!/bin/bash
set -e

EC2_HOST="ec2-3-39-190-52.ap-northeast-2.compute.amazonaws.com"
EC2_USER="ec2-user"
PEM="/Users/dev/Desktop/gncai/gnc.pem"
REMOTE_DIR="/var/www/html/Flowlink"

echo "▶ 파일 동기화 중..."
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.next' \
  -e "ssh -i $PEM" \
  "$(dirname "$0")/" \
  "$EC2_USER@$EC2_HOST:$REMOTE_DIR/"

echo "▶ 빌드 중..."
ssh -i "$PEM" "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && npm run build"

echo "▶ 서버 재시작 중..."
ssh -i "$PEM" "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && pm2 restart ecosystem.config.js --update-env && pm2 save"

echo "✓ 배포 완료"
