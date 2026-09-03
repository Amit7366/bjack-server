# Deploy API to VPS (api.city777.shop)

Same VPS as the client: `103.72.65.213`  
DNS A record: `api.city777.shop` → `103.72.65.213` (Cloudflare **DNS only** / grey cloud until SSL is issued)

Create the `api` A record in Cloudflare before the first deploy. The apex record for `city777.shop` does **not** cover this subdomain.

## 1. DNS

| Host | Type | Value | Proxy |
|---|---|---|---|
| `@` | A | `103.72.65.213` | DNS only (grey) |
| `api` | A | `103.72.65.213` | DNS only (grey) |

Wait until `ping api.city777.shop` hits `103.72.65.213`.

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
BASE_URL=https://api.city777.shop
CALLBACK_URL=https://api.city777.shop/api/v1/callback
BKASH_CALLBACK_URL=https://api.city777.shop/api/v1/bkash/callback
RESET_PASS_UI_LINK=https://city777.shop/auth/reset-password
GAME_LAUNCH_HOME_URL=https://city777.shop
PROVIDER_WHITELIST_DOMAIN=api.city777.shop
CORS_ORIGINS=https://city777.shop,https://www.city777.shop
```

Keep `DATABASE_URL`, JWT secrets, `SUPER_ADMIN_PASSWORD`, and `GAME_API_*` from your working local `.env`.

CORS already allows `https://city777.shop` and every `https://*.city777.shop` subdomain in code.

## 4. Push to `main`

From `server/`:

```bash
git add -A
git commit -m "Configure Docker CI/CD for api.city777.shop"
git push origin main
```

Pushing `main` starts **Actions → Deploy API**.

## 5. Verify

```bash
curl https://api.city777.shop
```

Browser WebSocket should be `wss://api.city777.shop/socket.io/...`
