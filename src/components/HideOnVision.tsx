"use client";
import { usePathname } from "next/navigation";

export function HideOnVision({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/vision") return null;
  return <>{children}</>;
}
