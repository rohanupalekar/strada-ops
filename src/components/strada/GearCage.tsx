import { useState } from "react";
import { AttributesRadar, type Attribute } from "./AttributesRadar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ATTRS: Attribute[] = [
  { key: "STR", value: 72 },
  { key: "INT", value: 84 },
  { key: "DIS", value: 63 },
  { key: "SOC", value: 51 },
  { key: "WLT", value: 44 },
];

type Priority = "standard" | "triage" | "crucible";
type Mission = {
  id: string;
  title: string;
  deadline: string;
  difficulty: number;
  priority: Priority;
  detail: string;
};

const MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Finish resume rewrite for FAANG",
    deadline: "Today · 18:00",
    difficulty: 7,
    priority: "crucible",
    detail: "Tighten the impact bullets. Quantify outcomes. No fluff. Cut to one page.",
  },
  {
    id: "m2",
    title: "30-min Zone-2 cardio",
    deadline: "Today",
    difficulty: 3,
    priority: "standard",
    detail: "Easy nasal-breathing pace. Stay under 145 bpm. Recovery, not punishment.",
  },
  {
    id: "m3",
    title: "Read 40 pages systems design",
    deadline: "Tomorrow",
    difficulty: 4,
    priority: "triage",
    detail: "Chapter 4 — replication. Annotate trade-offs. No skimming.",
  },
];

const WINS = [
  { title: "Cold-emailed 10 founders", when: "Yesterday" },
  { title: "Refactored auth module", when: "2d ago" },
  { title: "Ran 5K", when: "3d ago" },
];

const priorityColor: Record<Priority, string> = {
  standard: "bg-csarge-active",
  triage: "bg-triage",
  crucible: "bg-alarm",
};

export function GearCage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          ATTRIBUTES
        </h3>
        <AttributesRadar data={ATTRS} onClick={() => setHistoryOpen(true)} />
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          GOALS — TODAY
        </h3>
        <ul className="flex flex-col gap-2">
          {MISSIONS.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => setActiveMission(m)}
                className="flex w-full items-stretch gap-3 rounded-md border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-surface-2"
              >
                <span className={`w-px shrink-0 rounded-full ${priorityColor[m.priority]}`} />
                <div className="min-w-0 flex-1">
                  <div className="csarge-text truncate text-sm text-foreground">{m.title}</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <span>{m.deadline}</span>
                    <span className="text-tertiary-foreground">·</span>
                    <span>DIFF {m.difficulty}/10</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          RECENT WINS
        </h3>
        <ul className="flex flex-col gap-2">
          {WINS.map((w) => (
            <li key={w.title} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check size={12} className="text-csarge-active" />
              <span className="flex-1 truncate">{w.title}</span>
              <span className="font-mono text-[10px] text-tertiary-foreground">{w.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent
          side="left"
          className="border-r-2 border-r-csarge bg-background text-foreground"
        >
          <SheetHeader>
            <SheetTitle className="csarge-text font-mono text-xs tracking-[0.2em] text-muted-foreground">
              ATTRIBUTE HISTORY
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-6">
            {(["30D", "90D", "365D"] as const).map((range) => (
              <div key={range}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    {range}
                  </span>
                  <span className="font-mono text-[10px] text-csarge-active">+12%</span>
                </div>
                <MiniSpark />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!activeMission} onOpenChange={(o) => !o && setActiveMission(null)}>
        <DialogContent className="border-csarge/40 bg-surface text-foreground">
          <DialogHeader>
            <DialogTitle className="csarge-text">{activeMission?.title}</DialogTitle>
          </DialogHeader>
          {activeMission && (
            <>
              <div className="flex gap-4 font-mono text-[11px] text-muted-foreground">
                <span>{activeMission.deadline}</span>
                <span>DIFF {activeMission.difficulty}/10</span>
                <span className="uppercase">{activeMission.priority}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activeMission.detail}</p>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" size="sm">
                  Abandon
                </Button>
                <Button variant="outline" size="sm">
                  Grade
                </Button>
                <Button
                  size="sm"
                  className="bg-csarge text-csarge-foreground hover:bg-csarge-active"
                >
                  Complete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniSpark() {
  const pts = [10, 18, 14, 22, 28, 24, 32, 38, 34, 42, 48, 46];
  const max = 50;
  const w = 280;
  const h = 48;
  const step = w / (pts.length - 1);
  const path = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full">
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="var(--csarge)" fillOpacity="0.25" />
      <path d={path} fill="none" stroke="var(--csarge-active)" strokeWidth="1.5" />
    </svg>
  );
}
