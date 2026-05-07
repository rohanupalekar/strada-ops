import { useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Mode = "STANDARD" | "TRIAGE" | "CRUCIBLE" | "POST-WIN" | "DRIFT";
const modeColor: Record<Mode, string> = {
  STANDARD: "bg-csarge-active/20 text-csarge-active border-csarge-active/40",
  TRIAGE: "bg-triage/20 text-triage border-triage/40",
  CRUCIBLE: "bg-alarm/20 text-alarm border-alarm/40",
  "POST-WIN": "bg-postwin/20 text-postwin border-postwin/40",
  DRIFT: "bg-drift/30 text-muted-foreground border-drift/50",
};

type Msg =
  | { id: string; from: "user"; text: string }
  | { id: string; from: "csarge" | "donna"; text: string; streaming?: boolean };

const SEED: Msg[] = [
  { id: "1", from: "user", text: "How am I doing this week?" },
  {
    id: "2",
    from: "csarge",
    text:
      "Velocity's up 12% from last week. Don't get comfortable. Three missions still on deck.",
  },
  { id: "3", from: "user", text: "What's tomorrow look like?" },
];

const STREAM_REPLY =
  "Recovery routine. Lighter load — Zone-2 cardio in the morning, deep work bookends, no missions stacked after 16:00. You earned the breath. Don't waste it scrolling.";

export function ChatZone() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [mode] = useState<Mode>("STANDARD");
  const [streamText, setStreamText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-stream the reply once on mount for demo
    const t = setTimeout(() => startStream(), 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamText]);

  function startStream() {
    setStreaming(true);
    setStreamText("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStreamText(STREAM_REPLY.slice(0, i));
      if (i >= STREAM_REPLY.length) {
        clearInterval(id);
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), from: "csarge", text: STREAM_REPLY },
        ]);
        setStreamText("");
      }
    }, 22);
  }

  function send() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "user", text: input.trim() }]);
    setInput("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-border bg-surface">
      {/* status banner area (empty by default) */}
      <div className="px-5 pt-4">
        <div className="rounded-md border border-donna/30 bg-donna-soft px-3 py-2 text-xs text-donna donna-text">
          Donna noted: tomorrow shifts to recovery routine.
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
        {streaming && (
          <MessageBubble
            msg={{ id: "stream", from: "csarge", text: streamText, streaming: true }}
          />
        )}
      </div>

      <div className="px-5 pb-2">
        <div className="flex justify-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.2em] ${modeColor[mode]} animate-mode-pop`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {mode}
          </span>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-md border border-border bg-background px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Talk to C-Sarge or Donna…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-tertiary-foreground focus:outline-none"
            style={{ maxHeight: "6rem" }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled
                  className="rounded-md p-1.5 text-tertiary-foreground transition-colors disabled:cursor-not-allowed"
                  aria-label="Voice input"
                >
                  <Mic size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Voice — coming soon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="rounded-md bg-csarge p-1.5 text-csarge-foreground transition-colors hover:bg-csarge-active disabled:bg-surface-2 disabled:text-tertiary-foreground"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm text-foreground">
          {msg.text}
        </div>
      </div>
    );
  }
  const stripColor = msg.from === "csarge" ? "bg-csarge-active" : "bg-donna";
  const textCls = msg.from === "csarge" ? "csarge-text" : "donna-text";
  const label = msg.from === "csarge" ? "C-SARGE" : "DONNA";
  const labelColor = msg.from === "csarge" ? "text-csarge-active" : "text-donna";
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[85%] gap-3">
        <span className={`w-[3px] shrink-0 rounded-full ${stripColor}`} />
        <div>
          <div
            className={`mb-1 font-mono text-[9px] tracking-[0.25em] ${labelColor}`}
          >
            {label}
          </div>
          <div className={`text-sm leading-relaxed text-foreground ${textCls}`}>
            {msg.text}
            {msg.streaming && (
              <span
                className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-csarge-active animate-cursor-pulse"
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
