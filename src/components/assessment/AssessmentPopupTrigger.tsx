"use client";

import type { AnchorHTMLAttributes } from "react";
import { AI_MATCH_TALLY_POPUP_HREF } from "@/lib/assessment-link";

type AssessmentPopupTriggerProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href?: string;
  ctaLocation?: string;
  originPage?: string;
};

export default function AssessmentPopupTrigger({
  href = AI_MATCH_TALLY_POPUP_HREF,
  ctaLocation,
  originPage,
  children,
  ...props
}: AssessmentPopupTriggerProps) {
  void ctaLocation;
  void originPage;

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
