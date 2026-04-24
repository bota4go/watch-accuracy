# Watch Drift

Synthwave-styled **mechanical watch accuracy** tracker: compare your watch to “atomic” (browser) time, log drift in seconds, chart it over time. **Google sign-in** with data stored in **PostgreSQL** (e.g. [Neon](https://neon.tech)) — deployable on [Vercel](https://vercel.com).

## Architecture

![Watch Drift system architecture](docs/diagrams/watch_drift_arch.svg)

- **User** — browser; reads time and uses +/– to match the on-screen “your watch” dial.  
- **Vercel** — hosts **Next.js 14** (App Router) and **NextAuth.js** (Google).  
- **Google** — OAuth 2.0 identity; tokens handled server-side.  
- **Neon (Postgres)** — **Prisma** stores users, watches, and sync points.

### Diagram as code (Diagrams, mingrammer)

A Python script using the [**diagrams**](https://diagrams.mingrammer.com) library (see [Getting started / Examples](https://diagrams.mingrammer.com/docs/getting-started/examples)) is in the repo. It can export a high-res **PNG** when [Graphviz](https://graphviz.org) is installed:

```bash
pip install -r docs/diagrams/requirements.txt
# Windows: install Graphviz (e.g. winget install Graphviz.Graphviz) so `dot` is on PATH
python docs/diagrams/watch_drift_arch.py
# → docs/diagrams/watch_drift_arch.png
```

The hand-maintained **SVG** above is kept so GitHub always shows a diagram even without Graphviz. Regenerate the PNG if you change `watch_drift_arch.py` and need a bitmap for docs.

## First-time setup (Neon, Google, and `.env`)

You need: a **PostgreSQL** connection string, **NextAuth** secret and public URL, and a **Google OAuth** web client (Client ID + secret). Deeper detail, production URLs, and a troubleshooting table: **[SETUP_OAUTH.md](./SETUP_OAUTH.md)**.

### 1) Install dependencies

```bash
npm install
```

### 2) Create a database on Neon (Postgres)

1. Sign in at [Neon](https://neon.tech) and open the dashboard.
2. **Create a project** (pick a name and region close to you).
3. In the project, find **Connection string** (or “Connect”) and choose the **pooled** connection if offered (Prisma works well with pooling).
4. Copy the full URI. It should look like  
   `postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require` (your host and db name may differ).
5. You will paste this into `DATABASE_URL` in `.env` (step 4), then run `npx prisma db push` in step 5 after the file is saved.

### 3) Get Google OAuth “secrets” (Client ID and Client secret)

1. Open [Google Cloud Console](https://console.cloud.google.com/) and sign in.
2. **Create or select a project** (top bar).
3. **APIs & Services** → **OAuth consent screen**:
   - Choose **External** (or **Internal** only if everyone uses Google Workspace in your org).
   - Fill app name, support email, and developer contact.
   - If the app stays in **Testing**, add your Google account under **Test users** so you can sign in.
4. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
5. If prompted, configure the “OAuth consent screen” first, then return to Credentials.
6. Application type: **Web application**.
7. **Authorized JavaScript origins** — add the exact base URL you use in the browser (no path, no trailing slash), for example:
   - `http://localhost:3000` for local dev (or `http://localhost:3004` if `next dev` prints a different port — **they must match**).
8. **Authorized redirect URIs** — one URI per origin you use, with this exact path:  
   `{that same base URL}/api/auth/callback/google`  
   Examples:  
   `http://localhost:3000/api/auth/callback/google`  
   `http://localhost:3004/api/auth/callback/google`
9. Click **Create** and copy **Client ID** and **Client secret** (you can reopen the client later if needed).

**Production:** in the same OAuth client (or a second one), add your deployed origin and redirect, e.g. `https://your-app.vercel.app` and `https://your-app.vercel.app/api/auth/callback/google`. See [SETUP_OAUTH.md](./SETUP_OAUTH.md) for a concrete Vercel example.

### 4) Create `.env` in the project root

```bash
# macOS / Linux
cp .env.example .env
```

On Windows, copy `.env.example` to `.env` in Explorer or: `copy .env.example .env`

Fill the values (quotes optional but fine):

| Variable | What to set |
|----------|---------------|
| `DATABASE_URL` | The Neon connection string from step 2. |
| `NEXTAUTH_SECRET` | Long random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` or PowerShell in [.env.example](./.env.example)). |
| `NEXTAUTH_URL` | The URL you type in the browser, e.g. `http://localhost:3000` — **same host and port** as in Google’s origins, **no trailing slash**. If Next.js prints a different local port, use that. |
| `GOOGLE_CLIENT_ID` | From Google (ends with `apps.googleusercontent.com` unless using a new format). |
| `GOOGLE_CLIENT_SECRET` | From Google (starts with `GOCSPX-` in many cases). |

### 5) Apply schema, run, build

```bash
npx prisma db push
npm run dev
```

- Open the URL shown in the terminal; sign in with a **Test user** Google account if the consent screen is still in Testing mode.
- **Tests:** `npm test`
- **Production build:** `npm run build`

### 6) Deploy on Vercel (summary)

- Create/import the project, set the **same** env keys as in `.env` in Vercel → **Settings** → **Environment Variables** (especially `NEXTAUTH_URL` to your `https://…vercel.app` domain with no trailing slash, plus `DATABASE_URL` and the Google client values).
- Redeploy after env changes. Run `npx prisma db push` against the **production** database once if the schema is new.

[SETUP_OAUTH.md](./SETUP_OAUTH.md) lists example production URLs and common OAuth mistakes (`redirect_uri_mismatch`, etc.).

## App admin (optional)

A single **admin email** (default `bota4go@gmail.com`) can open **`/admin`** and see all users, watches, and sync rows. Set **`ADMIN_EMAIL`** in `.env` / Vercel to use a different address. Access is enforced server-side; non-admins are redirected to `/`. JSON for scripts or tools: `GET /api/admin/overview` (same auth + email check).

## Stack

- Next.js 14, TypeScript, Tailwind, framer-motion, Recharts, NextAuth, Prisma, PostgreSQL

## License

Private / your deployment.
