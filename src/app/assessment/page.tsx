import type { Metadata } from "next";
import AssessmentRouteOpener from "@/components/assessment/AssessmentRouteOpener";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Use the AI Match Engine to get a free personalized AI stack recommendation for your workflow and team.",
  openGraph: {
    title: "myAImatch — AI Match Engine",
    description:
      "Use the AI Match Engine to get a free personalized AI stack recommendation for your workflow and team.",
    url: "https://myaimatch.ai/assessment",
    type: "website",
  },
};

export default function AssessmentPage() {
  return <AssessmentRouteOpener />;
}
