"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, Activity, Crosshair, Zap } from "lucide-react";
import { AuthBar } from "@/components/AuthBar";
import { AnalogWatchFace } from "@/components/AnalogWatchFace";
import { DriftChart } from "@/components/DriftChart";
import { useTick } from "@/hooks/use-tick";
import { useEnvHealth } from "@/hooks/use-env-health";
import { useWatches } from "@/lib/use-watches";
import { cn } from "@/lib/cn";
import {
  buildDriftSamples,
  daysBetweenSyncsHint,
  formatSecPerDay,
  meanAbsDailyDriftSec,
  meanDailyDriftSec,
} from "@/lib/drift-math";
import type { WatchRecord } from "@/lib/types";

export default function Home() {
  const {
    ready,
    watches,
    registerWatch,
    removeWatch,
    recordSync,
    isAuthed,
    user,
    loadError,
  } = useWatches();
  const envHealth = useEnvHealth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (watches.length && !selectedId) setSelectedId(watches[0]!.id);
  }, [watches, selectedId]);

  useEffect(() => {
    if (isAuthed && !watches.length) setSelectedId(null);
  }, [isAuthed, watches.length]);

  const selected: WatchRecord | null = useMemo(
    () => watches.find((w) => w.id === selectedId) ?? null,
    [watches, selectedId]
  );

  const samples = useMemo(
    () => (selected ? buildDriftSamples(selected.syncs) : []),
    [selected]
  );

  const meanAbs = meanAbsDailyDriftSec(samples);
  const meanSign = meanDailyDriftSec(samples);
  const hint = selected ? daysBetweenSyncsHint(selected.syncs) : null;

  const nudge = useCallback((d: number) => {
    setOffset((o) => {
      const next = o + d;
      if (next > 999) return 999;
      if (next < -999) return -999;
      return Math.round(next * 10) / 10;
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-cyan-400 text-xs tracking-[0.3em]">
        LOADING…
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(100,0,200,0.2),transparent_40%),radial-gradient(ellipse_at_85%_70%,rgba(0,200,255,0.12),transparent_40%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] [background:linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-6 glow-border-cyan">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400/70">vibe sync · v1.0</p>
              <h1 className="mt-1 text-4xl font-black tracking-tight sm:text-5xl">
                <span className="text-cyan-300 glow-cyan">WATCH</span>
                <span className="text-fuchsia-400 glow-pink">DRIFT</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Two live analog dials: atomic time vs your watch (shifted with +/–). When they match
                what you read on the wrist, hit record — we store drift in seconds, backed up to your
                account.
              </p>
            </div>
            <AuthBar isAuthed={isAuthed} user={user} />
          </div>
        </header>

        {loadError && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-2 text-center text-sm text-red-200/90">
            {loadError}
          </p>
        )}

        {isAuthed && envHealth && !envHealth.database && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-2 text-center text-sm text-amber-200/90">
            Set <code className="text-cyan-200/90">DATABASE_URL</code> in <code className="text-cyan-200/90">.env</code> and run{" "}
            <code className="text-cyan-200/90">npx prisma db push</code> so watches can be saved. See{" "}
            <code className="text-cyan-200/90">SETUP_OAUTH.md</code>.
          </p>
        )}

        {!isAuthed ? (
          <div className="rounded-xl border-2 border-dashed border-cyan-500/25 bg-[#070b1a]/80 p-10 text-center">
            <p className="text-lg text-cyan-200/90">Sign in with Google to save your watches in the cloud.</p>
            <p className="mt-2 text-sm text-slate-500">Your sync history and graphs persist across devices.</p>
          </div>
        ) : (
          <>
        <section className="grid gap-4 sm:grid-cols-[1fr_280px]">
          <div className="rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-4 sm:p-5">
            <label className="text-[10px] uppercase tracking-[0.28em] text-slate-500">New watch</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="relative min-w-[12rem] flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-500/50">&gt;</span>
                <input
                  className="h-10 w-full rounded-lg border-2 border-slate-700/60 bg-black/50 pl-6 pr-2 text-sm text-cyan-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
                  placeholder="Seiko, Rolex, G-Shock…"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && nameInput.trim()) {
                      e.preventDefault();
                      const id = await registerWatch(nameInput);
                      setNameInput("");
                      setSelectedId(id);
                      setOffset(0);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                disabled={!nameInput.trim()}
                onClick={async () => {
                  if (!nameInput.trim()) return;
                  const id = await registerWatch(nameInput);
                  setNameInput("");
                  setSelectedId(id);
                  setOffset(0);
                }}
                className="h-10 rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 px-4 text-xs font-bold uppercase tracking-widest text-cyan-200 shadow-[0_0_14px_rgba(0,245,255,0.2)] enabled:hover:bg-cyan-500/20 disabled:opacity-30"
              >
                Register
              </button>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-4 text-xs text-slate-500">
            <p className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-400/60">
              <Crosshair className="h-3 w-3" /> how it works
            </p>
            <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-slate-400">
              <li>Left dial = atomic (this device), right = your watch display.</li>
              <li>Use +/– until the right dial matches your real watch, then record.</li>
              <li>We store the second difference and plot drift over time (PostgreSQL).</li>
            </ol>
          </div>
        </section>

        {watches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-cyan-500/30 p-12 text-center text-slate-500 text-sm">
            No watches yet. Add one above.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Select watch</p>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {watches.map((w) => (
                    <motion.button
                      key={w.id}
                      layout
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setSelectedId(w.id);
                        setOffset(0);
                      }}
                      className={cn(
                        "group flex items-center gap-1 rounded-lg border-2 px-3 py-2 text-xs font-bold uppercase tracking-wider",
                        w.id === selectedId
                          ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-200"
                          : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                      )}
                    >
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      {w.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {selected && (
              <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                <Workspace
                  key={selected.id}
                  watch={selected}
                  offset={offset}
                  onOffset={setOffset}
                  nudge={nudge}
                  onDelete={async () => {
                    const id = selected.id;
                    const rest = watches.filter((w) => w.id !== id);
                    await removeWatch(id);
                    setSelectedId(rest[0]?.id ?? null);
                  }}
                  onRecordSync={async () => {
                    await recordSync(selected.id, offset);
                  }}
                  isAuthed={isAuthed}
                  samples={samples}
                  meanAbs={meanAbs}
                  meanSign={meanSign}
                  hint={hint}
                />
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </main>
  );
}

function Workspace({
  watch,
  offset,
  onOffset,
  nudge,
  onDelete,
  onRecordSync,
  isAuthed,
  samples,
  meanAbs,
  meanSign,
  hint,
}: {
  watch: WatchRecord;
  offset: number;
  onOffset: (n: number) => void;
  nudge: (d: number) => void;
  onDelete: () => void | Promise<void>;
  onRecordSync: () => void | Promise<void>;
  isAuthed: boolean;
  samples: ReturnType<typeof buildDriftSamples>;
  meanAbs: number | null;
  meanSign: number | null;
  hint: string | null;
}) {
  return (
    <>
      <div className="space-y-5 lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-5"
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-cyan-200">
                {watch.name}
              </h2>
              <p className="text-[10px] text-slate-500">
                Syncs logged: {watch.syncs.length}
                {watch.syncs.length > 0 && (
                  <span>
                    {" "}
                    · last:{" "}
                    {new Date(watch.syncs[watch.syncs.length - 1]!.at).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-red-500/30 p-1.5 text-red-400/80 hover:bg-red-500/10"
              title="Delete watch"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-3 text-xs text-slate-400">
            Match the <span className="text-fuchsia-300">right</span> dial to your physical watch. The
            app displays atomic time on the <span className="text-cyan-300">left</span> (browser clock).
            <span className="text-cyan-300/90"> +</span> = your watch is{" "}
            <span className="text-cyan-300">fast</span> (ahead),<span className="text-fuchsia-300/90"> −</span>{" "}
            = <span className="text-fuchsia-300">slow</span> (behind). Record stores this difference
            in seconds.
          </p>

          <WorkspaceDials offsetSec={offset} />

          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">drift to record</p>
            <div className="font-mono text-4xl font-bold tabular-nums text-cyan-200 [text-shadow:0_0_20px_rgba(34,211,238,0.4)] sm:text-5xl">
              {offset > 0 ? "+" : ""}
              {offset}
              <span className="text-xl text-slate-500 sm:text-2xl">s</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                { label: "−10", d: -10 },
                { label: "−1", d: -1 },
                { label: "−.1", d: -0.1 },
                { label: "+.1", d: 0.1 },
                { label: "+1", d: 1 },
                { label: "+10", d: 10 },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => nudge(b.d)}
                  className="flex h-9 min-w-[44px] items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/5 px-1.5 text-[10px] font-bold tabular-nums text-cyan-200/90 hover:border-cyan-300 hover:bg-cyan-500/15 sm:text-xs"
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOffset(0)}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300"
              >
                Reset 0
              </button>
            </div>
            <button
              type="button"
              onClick={onRecordSync}
              className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-fuchsia-500/50 bg-fuchsia-500/10 py-3 text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-200 shadow-[0_0_20px_rgba(232,121,249,0.2)] transition hover:brightness-110"
            >
              <Zap className="h-4 w-4" />
              Record sync
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatPill
            label="Samples"
            value={String(samples.length)}
            icon={<Activity className="h-3.5 w-3.5" />}
          />
          <StatPill
            label="Mean |drift|"
            value={meanAbs != null ? formatSecPerDay(meanAbs) : "—"}
            sub="per day (abs)"
            icon={null}
          />
          <StatPill
            label="Mean drift"
            value={meanSign != null ? formatSecPerDay(meanSign) : "—"}
            sub="signed (gain+)"
            icon={null}
          />
          <StatPill
            label="Data"
            value={isAuthed ? "cloud" : "—"}
            sub={isAuthed ? "signed-in account" : "—"}
            icon={null}
          />
        </div>
        {hint && <p className="text-center text-[10px] text-slate-500">{hint}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Offset over time</p>
        </div>
        <div className="rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-4 glow-border-cyan">
          <DriftChart syncs={watch.syncs} />
        </div>
        <p className="px-1 text-[10px] text-slate-500">
          Drift is computed between consecutive syncs. Need at least two syncs on different days for a
          meaningful rate.
        </p>
      </div>
    </>
  );
}

function WorkspaceDials({ offsetSec }: { offsetSec: number }) {
  const now = useTick(32);
  return (
    <div className="mb-1 grid w-full max-w-md grid-cols-1 justify-items-center gap-8 sm:max-w-none sm:grid-cols-2 sm:gap-4">
      <AnalogWatchFace
        timeMs={now}
        label="Atomic"
        subLabel="(reference)"
        tone="cyan"
        showSecondHand
      />
      <AnalogWatchFace
        timeMs={now + offsetSec * 1000}
        label="Your watch"
        subLabel="(nudge to match)"
        tone="fuchsia"
        showSecondHand
      />
    </div>
  );
}

function StatPill({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-black/30 px-3 py-2.5">
      <div className="mb-0.5 flex items-center justify-between text-[9px] uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        {icon}
      </div>
      <div className="truncate text-sm font-bold text-cyan-200/90">{value}</div>
      {sub && <div className="mt-0.5 text-[9px] text-slate-600">{sub}</div>}
    </div>
  );
}
