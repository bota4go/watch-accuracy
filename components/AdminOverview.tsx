import type { User, Watch, SyncEntry } from "@prisma/client";
import { Shield } from "lucide-react";

type UserWithWatches = User & {
  watches: (Watch & { syncs: SyncEntry[] })[];
};

export function AdminOverview({ users }: { users: UserWithWatches[] }) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-app-muted">
        <Shield className="mb-0.5 mr-1.5 inline h-4 w-4 text-amber-400/80" />
        Read-only overview of all accounts, watches, and recorded drifts (offset in seconds at each sync).
      </p>

      {users.length === 0 ? (
        <p className="text-center text-app-muted">No users yet.</p>
      ) : null}

      {users.map((u) => (
        <section
          key={u.id}
          className="overflow-hidden rounded-xl border-2 border-app-line bg-app-card shadow-[0_0_0_1px_color-mix(in_srgb,var(--app-a1)_6%,transparent)]"
        >
          <div className="border-b border-app-line/80 bg-app-body/20 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-app-in/90">
                {u.email || u.name || u.id}
              </h2>
              <code className="text-[10px] text-app-muted/80 select-all">{u.id}</code>
            </div>
            {u.name && u.email && <p className="mt-1 text-xs text-app-muted">{u.name}</p>}
          </div>

          {u.watches.length === 0 ? (
            <p className="px-4 py-6 text-sm text-app-muted sm:px-5">No watches.</p>
          ) : (
            <div className="divide-y divide-app-line/60">
              {u.watches.map((w) => (
                <div key={w.id} className="px-4 py-4 sm:px-5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-app-a2/80">
                      {w.name}
                    </h3>
                    <span className="text-[10px] text-app-muted/90">
                      {w.syncs.length} sync{w.syncs.length === 1 ? "" : "s"} · created{" "}
                      {w.createdAt.toLocaleString()}
                    </span>
                  </div>
                  {w.syncs.length === 0 ? (
                    <p className="text-xs text-app-muted/80">No sync entries yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[32rem] border-collapse text-left text-[11px]">
                        <thead>
                          <tr className="text-app-muted">
                            <th className="border-b border-app-line/80 py-1.5 pr-2 font-medium">Record time</th>
                            <th className="border-b border-app-line/80 py-1.5 pr-2 font-medium">offsetSec</th>
                            <th className="border-b border-app-line/80 py-1.5 font-medium">Drift to record</th>
                          </tr>
                        </thead>
                        <tbody>
                          {w.syncs.map((s) => (
                            <tr key={s.id} className="text-app-fg/90">
                              <td className="border-b border-app-line/60 py-1.5 pr-2 font-mono text-app-fg/80">
                                {s.at.toLocaleString()}
                              </td>
                              <td className="border-b border-app-line/60 py-1.5 pr-2 font-mono tabular-nums">
                                {s.offsetSec}
                              </td>
                              <td className="border-b border-app-line/60 py-1.5 font-mono tabular-nums text-amber-200/90">
                                {formatOffsetForDisplay(s.offsetSec)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function formatOffsetForDisplay(sec: number): string {
  return `${sec > 0 ? "+" : ""}${sec} s`;
}
