#!/usr/bin/env bash
# One-time setup on Ubuntu EC2 (run as root or with sudo).
set -euo pipefail

DOMAIN="bkbajiapi.xyz"
DEPLOY_DIR="/root/bkbaji-server"

export DEBIAN_FRONTEND=noninteractive

apt-get update -qq
apt-get install -y -qq git nginx certbot python3-certbot-nginx

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

mkdir -p /var/www/certbot
mkdir -p "${DEPLOY_DIR}"

if [ ! -f "${DEPLOY_DIR}/.env" ]; then
  echo "Create ${DEPLOY_DIR}/.env before starting the API (see .env.example)."
fi

if [ -f "${DEPLOY_DIR}/deploy/nginx/${DOMAIN}.conf" ]; then
  cp "${DEPLOY_DIR}/deploy/nginx/${DOMAIN}.conf" "/etc/nginx/sites-available/${DOMAIN}"
  ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl enable nginx
  systemctl reload nginx
fi

if [ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}" || true
fi

# Prefer SSL template with WebSocket upgrade headers once certs exist
if [ -d "/etc/letsencrypt/live/${DOMAIN}" ] && [ -f "${DEPLOY_DIR}/deploy/nginx/${DOMAIN}.ssl.conf" ]; then
  cp "${DEPLOY_DIR}/deploy/nginx/${DOMAIN}.ssl.conf" "/etc/nginx/sites-available/${DOMAIN}"
  nginx -t && systemctl reload nginx
fi

echo "EC2 setup done. Add GitHub secrets VPS_HOST, VPS_USERNAME, VPS_KEY and push to main."
