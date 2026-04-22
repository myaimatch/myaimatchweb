"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useAssessmentPopup } from "./AssessmentPopupProvider";

type AssessmentPopupTriggerProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href?: string;
  ctaLocation?: string;
  originPage?: string;
};

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.button !== 0
  );
}

export default function AssessmentPopupTrigger({
  href = "/assessment",
  ctaLocation,
  originPage,
  onClick,
  children,
  ...props
}: AssessmentPopupTriggerProps) {
  const { openPopup } = useAssessmentPopup();

  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || isModifiedEvent(event) || props.target === "_blank") {
          return;
        }

        event.preventDefault();
        openPopup({ ctaLocation, originPage });
      }}
    >
      {children}
    </a>
  );
}
