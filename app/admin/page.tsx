import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { AdminOverview } from "@/components/AdminOverview";
import { getAllUsersWithWatches, isAdminInDatabase } from "@/lib/admin-db";
import { adminEmail } from "@/lib/admin";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }
  if (!(await isAdminInDatabase(session.user.id))) {
    redirect("/");
  }

  const users = await getAllUsersWithWatches();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 app-hero-grad" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-xl border-2 border-amber-500/30 bg-app-card p-6 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400/70">admin</p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-black tracking-tight text-amber-100/95 sm:text-3xl">
                <LayoutDashboard className="h-7 w-7 text-amber-400/80" />
                All users
              </h1>
              <p className="mt-2 max-w-xl text-sm text-app-muted">
                Signed in as <span className="text-app-in/90">{session.user.email}</span>. This page
                is only for <code className="text-app-in/80">{adminEmail()}</code> (override with{" "}
                <code className="text-app-in/80">ADMIN_EMAIL</code>).
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center self-start rounded-lg border-2 border-app-btn-b bg-app-a1/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-app-in transition hover:brightness-110"
            >
              Back to app
            </Link>
          </div>
        </header>

        <AdminOverview users={users} />
      </div>
    </main>
  );
}
