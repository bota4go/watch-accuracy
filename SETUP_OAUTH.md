# Google sign-in and environment (Watch Drift)

## 1. Create `.env` in the project root

```bash
copy .env.example .env
```

(Or duplicate `.env.example` to `.env` in your editor.)

## 2. `NEXTAUTH_SECRET` (required)

Use any long random string (32+ characters), or generate one with Node: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. Put it in `.env` as `NEXTAUTH_SECRET=...`

## 3. `NEXTAUTH_URL` (required — must match the address in the browser)

- If the app says `Local: http://localhost:3004`, set:

  `NEXTAUTH_URL=http://localhost:3004`

- **No trailing slash.**
- If you change ports, update this and **restart** `npm run dev`.

## 3b. Vercel production (this project)

Production app: **https://bota4go-watch-accuracy.vercel.app**

In the Vercel project → **Settings** → **Environment Variables** (Production), set:

| Name | Value |
|------|--------|
| `NEXTAUTH_URL` | `https://bota4go-watch-accuracy.vercel.app` (no trailing slash) |
| `NEXTAUTH_SECRET` | Same as local or a new random string |
| `DATABASE_URL` | Your hosted Postgres (e.g. Neon) connection string |
| `GOOGLE_CLIENT_ID` | From Google Cloud OAuth client |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud OAuth client |

In **Google Cloud** → OAuth client (Web) add:

- **Authorized JavaScript origins:** `https://bota4go-watch-accuracy.vercel.app`
- **Authorized redirect URIs:** `https://bota4go-watch-accuracy.vercel.app/api/auth/callback/google`

Redeploy after changing env. Apply DB schema: `npx prisma db push` (or migrate) using the **production** `DATABASE_URL` once.

## 4. `DATABASE_URL` (required for saving watches)

Use a hosted PostgreSQL database, for example [Neon](https://neon.tech) (free tier). Create a project, copy the connection string, set `DATABASE_URL=...` in `.env`, then from the project folder run:

```bash
npx prisma db push
```

## 5. Google OAuth (required for “Sign in with Google”)

### 5.1 Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick an existing one).
3. **APIs & Services** → **OAuth consent screen**:
   - User type: **External** (or Internal for Workspace only).
   - App name, your email, add yourself as a **Test user** if the app is in “Testing”.

### 5.2 Create OAuth client

1. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
2. Application type: **Web application**.
3. **Authorized JavaScript origins** — add exactly (no path):

   - `http://localhost:3000`  
   - If you use another port, add that too, e.g. `http://localhost:3004`

4. **Authorized redirect URIs** — add exactly (one line per port you use):

   - `http://localhost:3000/api/auth/callback/google`
   - e.g. `http://localhost:3004/api/auth/callback/google`

5. Create → copy **Client ID** and **Client secret** into `.env`:

   ```env
   GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-..."
   ```

6. **Save** the OAuth client in Google.

### 5.3 Common mistakes

| Problem | Fix |
|--------|-----|
| `OAuthSignin` / sign-in never starts | Empty or wrong `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |
| `redirect_uri_mismatch` | Redirect URI in Google must be exactly `{NEXTAUTH_URL}/api/auth/callback/google` for the port you use |
| Works on one port, not another | Add that port’s origin + redirect URI in Google, and set `NEXTAUTH_URL` to match |

## 6. Restart

After any `.env` change:

```bash
npm run dev
```

The app’s **Sign in with Google** button stays disabled until `GOOGLE_*`, `NEXTAUTH_*`, and (for the API) `DATABASE_URL` are set; the header shows short hints if something is missing.
