import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "myAIMatch — Find Your Perfect AI Stack",
    template: "%s | myAIMatch",
  },
  description:
    "Stop guessing which AI tools are right for you. Get a personalized AI stack recommendation in minutes — free.",
  keywords: ["AI tools", "AI directory", "AI recommendations", "AI stack"],
  openGraph: {
    title: "myAIMatch — Find Your Perfect AI Stack",
    description:
      "Stop guessing which AI tools are right for you. Get a personalized AI stack recommendation in minutes — free.",
    url: "https://myaimatch.ai",
    siteName: "myAIMatch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myAIMatch — Find Your Perfect AI Stack",
    description:
      "Stop guessing which AI tools are right for you. Get a personalized AI stack recommendation in minutes — free.",
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
        <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
