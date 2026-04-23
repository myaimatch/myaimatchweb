import type { Metadata } from "next";
import AssessmentRouteOpener from "@/components/assessment/AssessmentRouteOpener";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Take the AI Match Free Assessment and get Your AI Match — a free personalized tool recommendation for your workflow and team.",
  openGraph: {
    title: "myAImatch — AI Match Free Assessment",
    description:
      "Take the AI Match Free Assessment and get Your AI Match — a free personalized tool recommendation for your workflow and team.",
    url: "https://myaimatch.ai/assessment",
    type: "website",
  },
};

export default function AssessmentPage() {
  return <AssessmentRouteOpener />;
}
