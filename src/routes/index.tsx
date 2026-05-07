import { createFileRoute } from "@tanstack/react-router";
import { StradaDashboard } from "@/components/strada/StradaDashboard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Serylda — Strada" },
      { name: "description", content: "Daily ops dashboard for the Serylda system." },
    ],
  }),
});

function Index() {
  return <StradaDashboard />;
}
