export const THANK_YOU_ACCESS_STORAGE_KEY = "myaimatch:thank-you-access";
export const THANK_YOU_ACCESS_TTL_MS = 1000 * 60 * 60;

type ThankYouAccessPayload = {
  submittedAt: number;
};

export function isFreshThankYouAccess(value: string | null, now = Date.now()) {
  if (!value) {
    return false;
  }

  try {
    const parsed = JSON.parse(value) as Partial<ThankYouAccessPayload>;
    return (
      typeof parsed.submittedAt === "number" &&
      Number.isFinite(parsed.submittedAt) &&
      now - parsed.submittedAt <= THANK_YOU_ACCESS_TTL_MS
    );
  } catch {
    return false;
  }
}

export function markThankYouAccess(storage: Storage = window.sessionStorage) {
  storage.setItem(
    THANK_YOU_ACCESS_STORAGE_KEY,
    JSON.stringify({ submittedAt: Date.now() } satisfies ThankYouAccessPayload),
  );
}

export function hasFreshThankYouAccess(storage: Storage = window.sessionStorage) {
  return isFreshThankYouAccess(storage.getItem(THANK_YOU_ACCESS_STORAGE_KEY));
}
