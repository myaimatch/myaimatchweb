import assert from "node:assert/strict";
import {
  THANK_YOU_ACCESS_TTL_MS,
  isFreshThankYouAccess,
} from "./thank-you-access";

const now = 1_800_000;

assert.equal(isFreshThankYouAccess(null, now), false);
assert.equal(isFreshThankYouAccess("not-json", now), false);
assert.equal(isFreshThankYouAccess(JSON.stringify({ submittedAt: now }), now), true);
assert.equal(
  isFreshThankYouAccess(JSON.stringify({ submittedAt: now - THANK_YOU_ACCESS_TTL_MS + 1 }), now),
  true,
);
assert.equal(
  isFreshThankYouAccess(JSON.stringify({ submittedAt: now - THANK_YOU_ACCESS_TTL_MS - 1 }), now),
  false,
);
assert.equal(isFreshThankYouAccess(JSON.stringify({ submittedAt: "now" }), now), false);
