import { NextRequest, NextResponse } from "next/server";
import {
  logAffiliateClick,
  resolveAffiliateDestinationForSlug,
} from "@/lib/supabase/affiliate-resolver";

function safeRedirectUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed : new URL("https://myaimatch.ai");
  } catch {
    return new URL("https://myaimatch.ai");
  }
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } },
) {
  const source = request.nextUrl.searchParams.get("src") || "unknown";
  const recommendationId = request.nextUrl.searchParams.get("rid");
  const resolved = await resolveAffiliateDestinationForSlug(params.toolSlug, source);

  if (!resolved) {
    return NextResponse.redirect(new URL("/#match-tools", request.url), 307);
  }

  try {
    await logAffiliateClick({
      resolved,
      source,
      recommendationId,
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
      ip: getClientIp(request),
    });
  } catch (error) {
    console.error("Failed to log affiliate click", error);
  }

  return NextResponse.redirect(safeRedirectUrl(resolved.resolution.destinationUrl), 302);
}
