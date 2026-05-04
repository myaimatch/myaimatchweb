import type { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Your AI Match Is On Its Way",
  description:
    "Your AI Match assessment has been received. Your personalized recommendation is being sent by email.",
  openGraph: {
    title: "Your AI Match Is On Its Way | myAImatch",
    description:
      "Your AI Match assessment has been received. Your personalized recommendation is being sent by email.",
    url: "https://myaimatch.ai/thank-you",
    type: "website",
  },
};

export default function ThankYouPage() {
  return <ThankYouClient />;
}
