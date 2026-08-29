# Deploy API to VPS (api.raja1.online)

Same VPS as the client: `187.53.128.57`  
DNS A record: `api.raja1.online` → `187.53.128.57`

Seed data locally first (already done). The VPS does not get `src/data`.

## 1. DNS

Create an A record:

| Host | Type | Value |
|---|---|---|
| `api` | A | `187.53.128.57` |

Wait until `ping api.raja1.online` hits that IP.

## 2. GitHub secrets (raja-server repo)

Repo: `https://github.com/Amit7366/raja-server`  
**Settings → Secrets and variables → Actions**

Use the **same** values as `raja-client`:

| Secret | Value |
|---|---|
| `VPS_HOST` | `187.53.128.57` |
| `VPS_USERNAME` | `root` |
| `VPS_KEY` | same private key as client (`~/.ssh/raja_deploy`) |

## 3. Create `.env` on the VPS (before first deploy)

```bash
ssh -i ~/.ssh/raja_deploy root@187.53.128.57
mkdir -p /root/raja-server
nano /root/raja-server/.env
```

Copy from your local `server/.env`, then change production URLs to:

```env
NODE_ENV=production
PORT=5000
BASE_URL=https://api.raja1.online
CALLBACK_URL=https://api.raja1.online/api/v1/callback
BKASH_CALLBACK_URL=https://api.raja1.online/api/v1/bkash/callback
RESET_PASS_UI_LINK=https://raja1.online/auth/reset-password
GAME_LAUNCH_HOME_URL=https://raja1.online
PROVIDER_WHITELIST_DOMAIN=api.raja1.online
CORS_ORIGINS=https://raja1.online,https://www.raja1.online
```

Keep `DATABASE_URL`, JWT secrets, `SUPER_ADMIN_PASSWORD`, and `GAME_API_*` from your working local `.env`.

## 4. Push deploy files

From `server/`:

```bash
git add docker-compose.yml Dockerfile .github/workflows/deploy.yaml deploy DEPLOY.md .env.example src/app.ts src/app/config/cors.ts
git commit -m "Add Docker CI/CD for api.raja1.online"
git push origin main
```

Pushing `main` starts **Actions → Deploy API**.

## 5. Verify

```bash
curl https://api.raja1.online
```

Browser WebSocket should be `wss://api.raja1.online/socket.io/...`
