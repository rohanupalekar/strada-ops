import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarClock,
  Repeat,
  Utensils,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Day = { date: number; label: string; routine: string; events: boolean; today?: boolean };

const WEEK: Day[] = [
  { date: 4, label: "MON", routine: "WM", events: true },
  { date: 5, label: "TUE", routine: "WM", events: false },
  { date: 6, label: "WED", routine: "CR", events: true },
  { date: 7, label: "THU", routine: "WM", events: true, today: true },
  { date: 8, label: "FRI", routine: "RD", events: false },
  { date: 9, label: "SAT", routine: "WK", events: true },
  { date: 10, label: "SUN", routine: "RD", events: false },
];

type Kind = "deep" | "habit" | "meal" | "movement" | "transition";
type Block = { time: string; label: string; kind: Kind; current?: boolean };

const BLOCKS: Block[] = [
  { time: "06:30", label: "Wake & hydrate", kind: "habit" },
  { time: "07:00", label: "Workout (60min)", kind: "movement" },
  { time: "08:00", label: "Shower", kind: "transition" },
  { time: "08:30", label: "Breakfast", kind: "meal" },
  { time: "09:00", label: "Deep work — block 1 (120min)", kind: "deep" },
  { time: "11:00", label: "Break", kind: "transition" },
  { time: "11:30", label: "Deep work — block 2 (90min)", kind: "deep" },
  { time: "13:00", label: "Lunch", kind: "meal" },
  { time: "14:00", label: "Mission: resume rewrite (90min)", kind: "deep", current: true },
  { time: "15:30", label: "Walk", kind: "movement" },
  { time: "16:00", label: "Calls", kind: "habit" },
  { time: "18:00", label: "Dinner", kind: "meal" },
  { time: "19:00", label: "Reading", kind: "habit" },
];

const UPCOMING = [
  { date: "Fri 8", title: "Resume final review w/ mentor", kind: "MEET" },
  { date: "Mon 11", title: "FAANG application deadline", kind: "DEADLINE" },
  { date: "Wed 13", title: "Strength test (deadlift PR)", kind: "EVENT" },
];

const kindIcon: Record<Kind, React.ReactNode> = {
  deep: <Brain size={13} />,
  habit: <Repeat size={13} />,
  meal: <Utensils size={13} />,
  movement: <Activity size={13} />,
  transition: <ArrowRight size={13} />,
};

export function FlightPlan() {
  const [activeDay, setActiveDay] = useState<Day | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          WEEK
        </h3>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK.map((d) => (
            <button
              key={d.date}
              onClick={() => setActiveDay(d)}
              className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-center transition-colors hover:bg-surface-2 ${
                d.today ? "border-donna" : "border-border"
              }`}
            >
              <span className="font-mono text-[9px] tracking-[0.15em] text-tertiary-foreground">
                {d.label}
              </span>
              <span
                className={`font-mono text-sm ${d.today ? "text-donna" : "text-foreground"}`}
              >
                {d.date}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">{d.routine}</span>
              <span
                className={`size-1 rounded-full ${d.events ? "bg-donna" : "bg-transparent"}`}
              />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          TODAY
        </h3>
        <ul className="flex flex-col">
          {BLOCKS.map((b, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-md border-l-2 py-1.5 pl-3 pr-2 ${
                b.current
                  ? "border-l-donna bg-donna-soft/40"
                  : "border-l-transparent"
              }`}
            >
              <span className="w-12 font-mono text-[11px] text-muted-foreground">{b.time}</span>
              <span
                className={`flex size-5 items-center justify-center rounded ${
                  b.current ? "text-donna" : "text-tertiary-foreground"
                }`}
              >
                {kindIcon[b.kind]}
              </span>
              <span
                className={`donna-text flex-1 truncate text-xs ${
                  b.current ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {b.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          UPCOMING
        </h3>
        <ul className="flex flex-col gap-2">
          {UPCOMING.map((u) => (
            <li key={u.title} className="flex items-center gap-3">
              <CalendarClock size={13} className="text-donna" />
              <span className="font-mono text-[10px] text-muted-foreground">{u.date}</span>
              <span className="donna-text flex-1 truncate text-xs text-foreground">
                {u.title}
              </span>
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.15em] text-tertiary-foreground">
                {u.kind}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Sheet open={!!activeDay} onOpenChange={(o) => !o && setActiveDay(null)}>
        <SheetContent
          side="right"
          className="border-l-2 border-l-donna bg-background text-foreground"
        >
          <SheetHeader>
            <SheetTitle className="donna-text font-mono text-xs tracking-[0.2em] text-muted-foreground">
              {activeDay?.label} {activeDay?.date} · FULL PLAN
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-1">
            {BLOCKS.map((b, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className="w-12 font-mono text-[11px] text-muted-foreground">{b.time}</span>
                <span className="text-tertiary-foreground">{kindIcon[b.kind]}</span>
                <span className="donna-text text-xs text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
