# Deploy API to VPS (api.banglajackpot.online)

Same VPS as the client: `103.72.65.213`  
DNS A record: `api.banglajackpot.online` → `103.72.65.213` (Cloudflare **DNS only** / grey cloud until SSL is issued)

Create the `api` A record in Cloudflare before the first deploy. The apex record for `banglajackpot.online` does **not** cover this subdomain.

## 1. DNS

| Host | Type | Value | Proxy |
|---|---|---|---|
| `@` | A | `103.72.65.213` | DNS only (grey) |
| `api` | A | `103.72.65.213` | DNS only (grey) |

Wait until `ping api.banglajackpot.online` hits `103.72.65.213`.

## 2. GitHub secrets (city-server repo)

In **https://github.com/Amit7366/city-server** → **Settings → Secrets and variables → Actions**

Use the **same** values as `city-client`:

| Secret | Value |
|---|---|
| `VPS_HOST` | `103.72.65.213` |
| `VPS_USERNAME` | `root` |
| `VPS_KEY` | same private key as client (`~/.ssh/city_deploy`) |

## 3. Create `.env` on the VPS (required before first API deploy)

```bash
ssh -i ~/.ssh/city_deploy root@103.72.65.213
mkdir -p /root/city-server
nano /root/city-server/.env
```

Copy from your local `server/.env`, then set production URLs to:

```env
NODE_ENV=production
PORT=5000
BASE_URL=https://api.banglajackpot.online
CALLBACK_URL=https://api.banglajackpot.online/api/v1/callback
BKASH_CALLBACK_URL=https://api.banglajackpot.online/api/v1/bkash/callback
RESET_PASS_UI_LINK=https://banglajackpot.online/auth/reset-password
GAME_LAUNCH_HOME_URL=https://banglajackpot.online
PROVIDER_WHITELIST_DOMAIN=api.banglajackpot.online
CORS_ORIGINS=https://banglajackpot.online,https://www.banglajackpot.online
```

Keep `DATABASE_URL`, JWT secrets, `SUPER_ADMIN_PASSWORD`, and `GAME_API_*` from your working local `.env`.

CORS already allows `https://banglajackpot.online` and every `https://*.banglajackpot.online` subdomain in code.

## 4. Push to `main`

From `server/`:

```bash
git add -A
git commit -m "Configure Docker CI/CD for api.banglajackpot.online"
git push origin main
```

Pushing `main` starts **Actions → Deploy API**.

## 5. Verify

```bash
curl https://api.banglajackpot.online
```

Browser WebSocket should be `wss://api.banglajackpot.online/socket.io/...`
