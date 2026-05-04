"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AI_MATCH_TALLY_FORM_ID } from "@/lib/assessment-link";
import { markThankYouAccess } from "@/lib/thank-you-access";

type TallySubmissionPayload = {
  formId?: string;
};

type TallyMessage = {
  payload?: TallySubmissionPayload;
};

function getTallySubmissionPayload(data: unknown) {
  if (typeof data !== "string" || !data.includes("Tally.FormSubmitted")) {
    return null;
  }

  try {
    return (JSON.parse(data) as TallyMessage).payload ?? null;
  } catch {
    return null;
  }
}

export default function TallySubmissionTracker() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const payload = getTallySubmissionPayload(event.data);

      if (payload?.formId !== AI_MATCH_TALLY_FORM_ID) {
        return;
      }

      markThankYouAccess();

      if (pathname !== "/thank-you") {
        router.push("/thank-you");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [pathname, router]);

  return null;
}
