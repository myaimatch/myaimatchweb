import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { handleZapierAssessmentCompleted } from "@/lib/supabase/zapier-assessment-handler";

export const dynamic = "force-dynamic";

function signatureMatches(rawBody: string, signature: string, secret: string) {
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

function isAuthorized(request: NextRequest, rawBody: string) {
  const secret = process.env.ZAPIER_WEBHOOK_SECRET;
  if (!secret) return false;

  const bearer = request.headers.get("authorization");
  if (bearer === `Bearer ${secret}`) return true;

  const signature = request.headers.get("x-myaimatch-signature");
  return signature ? signatureMatches(rawBody, signature, secret) : false;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!isAuthorized(request, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    const result = await handleZapierAssessmentCompleted(payload);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown assessment error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
