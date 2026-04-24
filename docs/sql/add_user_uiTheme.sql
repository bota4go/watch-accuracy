-- One-shot fix if production errors with: "The column User.uiTheme does not exist"
-- Run in Neon SQL Editor, or: DATABASE_URL="…" npx prisma db push

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "uiTheme" TEXT NOT NULL DEFAULT 'neon';
