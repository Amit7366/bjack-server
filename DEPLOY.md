# Deploy API to AWS (bkbajiapi.xyz)

## Prerequisites

1. **EC2** (Ubuntu 22.04) with Elastic IP.
2. **DNS**: `A` record for `bkbajiapi.xyz` → Elastic IP.
3. **MongoDB Atlas** (or other): allow EC2 IP; set `DATABASE_URL` in server `.env`.
4. **GitHub repo** secrets (Settings → Secrets → Actions):
   - `VPS_HOST` — EC2 public IP or hostname
   - `VPS_USERNAME` — e.g. `ubuntu` or `root`
   - `VPS_KEY` — SSH private key (PEM)

## One-time server setup

SSH into EC2:

```bash
ssh -i your-key.pem ubuntu@<EC2_IP>
```

Clone and configure env (first time only):

```bash
sudo git clone https://github.com/Amit7366/mns-server.git /root/bkbaji-server
cd /root/bkbaji-server
sudo cp .env.example .env
sudo nano .env   # paste production secrets; set BASE_URL and CALLBACK_URL to https://bkbajiapi.xyz
sudo bash deploy/setup-ec2.sh
```

Or copy your local `.env` to `/root/bkbaji-server/.env` (never commit it).

## CI/CD

Push to `main` → GitHub Actions runs `.github/workflows/deploy.yaml`:

- Pulls latest code on EC2
- `docker compose up -d --build`
- Installs/updates Nginx + Let's Encrypt for `bkbajiapi.xyz`

## Verify

```bash
curl https://bkbajiapi.xyz/
# → 🔥 App is Running
```

## Client / Admin (Socket.IO)

Frontends must bake the API host into the browser bundle at **Docker build** time:

```yaml
# client + admin-frontend docker-compose.yml
build:
  args:
    NEXT_PUBLIC_SOCKET_URL: https://bkbajiapi.xyz
environment:
  API_URL: https://bkbajiapi.xyz
  NEXT_PUBLIC_SOCKET_URL: https://bkbajiapi.xyz
```

Nginx on this API host must proxy WebSocket upgrades (`Upgrade` / `Connection`) — see `deploy/nginx/bkbajiapi.xyz.ssl.conf`.

After deploy, browser DevTools → Network → WS should show:

`wss://bkbajiapi.xyz/socket.io/...` (status 101), **not** `ws://localhost:8000`.

## Client REST proxy

```env
API_URL=https://bkbajiapi.xyz
```
