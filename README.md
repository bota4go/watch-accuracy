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

## Setup

Full env (local + Vercel + Google): **[SETUP_OAUTH.md](./SETUP_OAUTH.md)**

**Quick start (local):**

```bash
cp .env.example .env
# fill DATABASE_URL, NEXTAUTH_*, GOOGLE_*
npx prisma db push
npm install
npm run dev
```

- **Tests:** `npm test`  
- **Build:** `npm run build`

## Stack

- Next.js 14, TypeScript, Tailwind, framer-motion, Recharts, NextAuth, Prisma, PostgreSQL

## License

Private / your deployment.
