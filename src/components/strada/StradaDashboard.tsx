import { RefreshCw } from "lucide-react";
import { GearCage } from "./GearCage";
import { ChatZone } from "./ChatZone";
import { FlightPlan } from "./FlightPlan";

export function StradaDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* global top strip placeholder */}
      <div className="border-b border-border bg-surface/60 px-6 py-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            SERYLDA
          </span>
          <span className="font-mono text-[10px] text-tertiary-foreground">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* dashboard header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-mono text-xs tracking-[0.3em] text-muted-foreground">STRADA</h1>
          <span className="font-mono text-[10px] text-tertiary-foreground">
            daily ops
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            All systems calm
          </span>
          <button
            className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Refresh"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </header>

      {/* three columns */}
      <main className="grid grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-[28fr_40fr_32fr]">
        <div className="min-w-0">
          <GearCage />
        </div>
        <div className="min-w-0 lg:h-[calc(100vh-9rem)]">
          <ChatZone />
        </div>
        <div className="min-w-0">
          <FlightPlan />
        </div>
      </main>
    </div>
  );
}
