import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@typeform/embed/build/css/popup.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssessmentPopupProvider from "@/components/assessment/AssessmentPopupProvider";
import ServicePolish from "@/components/services/ServicePolish";
import GlobalCursorTrail from "@/components/GlobalCursorTrail";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "myAImatch — Find Your Perfect AI Match",
    template: "%s | myAImatch",
  },
  description:
    "Stop guessing which AI tools are right for you. Get Your AI Match — a personalized tool recommendation in minutes, free.",
  keywords: ["AI tools", "AI tool directory", "AI recommendations", "AI match", "Your AI Match"],
  openGraph: {
    title: "myAImatch — Find Your Perfect AI Match",
    description:
      "Stop guessing which AI tools are right for you. Get Your AI Match — a personalized tool recommendation in minutes, free.",
    url: "https://myaimatch.ai",
    siteName: "myAImatch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myAImatch — Find Your Perfect AI Match",
    description:
      "Stop guessing which AI tools are right for you. Get Your AI Match — a personalized tool recommendation in minutes, free.",
  },
  metadataBase: new URL("https://myaimatch.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AssessmentPopupProvider>
          <Navbar />
          <main>{children}</main>
          <GlobalCursorTrail />
          <ServicePolish />
          <Footer />
        </AssessmentPopupProvider>
        <Analytics />
      </body>
    </html>
  );
}
