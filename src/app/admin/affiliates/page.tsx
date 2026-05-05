import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Activity, BadgeDollarSign, ClipboardCheck, Link2, Radar, Tags } from "lucide-react";
import { fetchAffiliateAdminOverview, isAdminEmail } from "@/lib/supabase/affiliate-admin";
import {
  createSupabaseAuthServerClient,
  getSupabaseAdminClient,
  hasSupabaseConfig,
  hasSupabaseServiceConfig,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Affiliate OS",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusLabel(value: string) {
  return value.replace(/_/g, " ");
}

async function requireAdminEmail() {
  "use server";

  const authClient = createSupabaseAuthServerClient();
  const { data } = authClient ? await authClient.auth.getUser() : { data: { user: null } };
  const email = data.user?.email;

  if (!email || !(await isAdminEmail(email))) {
    throw new Error("Unauthorized");
  }

  return email;
}

async function recordRevenue(formData: FormData) {
  "use server";

  const email = await requireAdminEmail();
  const amount = Number(formData.get("amount"));
  const toolId = String(formData.get("tool_id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!toolId || !Number.isFinite(amount)) throw new Error("Missing revenue fields");

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("revenue_events").insert({
    tool_id: toolId,
    amount,
    notes,
    created_by: email,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/affiliates");
}

async function reviewFinding(formData: FormData) {
  "use server";

  const email = await requireAdminEmail();
  const findingId = String(formData.get("finding_id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!findingId || (decision !== "approved" && decision !== "rejected")) {
    throw new Error("Invalid finding review");
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("agent_findings")
    .update({
      status: decision,
      reviewed_by: email,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", findingId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_log").insert({
    actor_email: email,
    action: `agent_finding_${decision}`,
    entity_type: "agent_findings",
    entity_id: findingId,
    after: { status: decision },
  });

  revalidatePath("/admin/affiliates");
}

export default async function AffiliateAdminPage() {
  if (!hasSupabaseConfig() || !hasSupabaseServiceConfig()) {
    return (
      <AdminShell>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
            Setup required
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">
            Supabase is not connected yet.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
            Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
            `SUPABASE_SERVICE_ROLE_KEY`, run the migration, then add your email to
            `admin_users`.
          </p>
        </div>
      </AdminShell>
    );
  }

  const authClient = createSupabaseAuthServerClient();
  const { data } = authClient ? await authClient.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) redirect("/admin/login");
  if (!(await isAdminEmail(user.email))) redirect("/admin/login");

  const overview = await fetchAffiliateAdminOverview();
  const { stats } = overview;

  return (
    <AdminShell>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
            Affiliate Operating System
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white">
            Revenue links, deals, and agent reviews.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">
            Human approval remains required before any affiliate link or promo code goes public.
          </p>
        </div>
        <Link
          href="/deals"
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#8468EB]/40 bg-white/[0.04] px-5 text-sm font-bold text-white"
        >
          View public deals
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Metric icon={<Radar />} label="Tools" value={String(stats.tools)} />
        <Metric icon={<Link2 />} label="Active links" value={String(stats.activeLinks)} />
        <Metric icon={<ClipboardCheck />} label="Need action" value={String(stats.applyNeeded)} />
        <Metric icon={<Tags />} label="Active deals" value={String(stats.activeDeals)} />
        <Metric icon={<Activity />} label="Clicks 30d" value={String(stats.clicks30d)} />
        <Metric icon={<BadgeDollarSign />} label="Revenue" value={formatMoney(stats.revenueTotal)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Pending agent findings</h2>
              <p className="mt-1 text-xs leading-6 text-white/40">
                The agent can propose changes, but these approvals do not auto-publish links.
              </p>
            </div>
            <span className="rounded-full border border-[#8468EB]/25 bg-[#8468EB]/10 px-3 py-1 text-xs font-bold text-[#C4B5FD]">
              {overview.pendingFindings.length}
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {overview.pendingFindings.map((finding) => (
              <div key={finding.id} className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{finding.toolName}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8468EB]">
                      {statusLabel(finding.findingType)}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/50">{finding.summary}</p>
                  </div>
                  <form action={reviewFinding} className="flex gap-2">
                    <input type="hidden" name="finding_id" value={finding.id} />
                    <button
                      name="decision"
                      value="approved"
                      className="h-9 rounded-full border border-[#8468EB]/35 bg-[#8468EB]/15 px-4 text-xs font-bold text-[#C4B5FD]"
                    >
                      Approve
                    </button>
                    <button
                      name="decision"
                      value="rejected"
                      className="h-9 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-bold text-white/50"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {overview.pendingFindings.length === 0 && (
              <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-5 text-sm text-white/45">
                No pending agent findings.
              </div>
            )}
          </div>
        </div>

        <form action={recordRevenue} className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5">
          <h2 className="text-lg font-semibold text-white">Record manual revenue</h2>
          <p className="mt-1 text-xs leading-6 text-white/40">
            Use this for CSV or dashboard payout reports before network APIs are connected.
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
                Tool
              </span>
              <select
                name="tool_id"
                required
                className="h-12 rounded-full border border-white/10 bg-[#111111] px-4 text-sm text-white"
              >
                <option value="">Select tool</option>
                {overview.rows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
                Amount USD
              </span>
              <input
                name="amount"
                type="number"
                step="0.01"
                required
                className="h-12 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
                Notes
              </span>
              <textarea
                name="notes"
                rows={3}
                className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white"
                placeholder="PartnerStack March payout, manual CSV import, etc."
              />
            </label>
            <button className="h-12 rounded-full border border-[#8468EB]/50 bg-gradient-to-br from-[#8468EB] to-[#5B42C3] px-5 text-sm font-bold text-white">
              Save revenue event
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Tool coverage</h2>
          <p className="mt-1 text-xs text-white/40">
            Apply-needed, pending findings, active links, deals, clicks, and manual revenue.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-left text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                <th className="px-5 py-3">Tool</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Links</th>
                <th className="px-4 py-3">Deals</th>
                <th className="px-4 py-3">Findings</th>
                <th className="px-4 py-3">Clicks 30d</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {overview.rows.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.06] text-sm">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{row.name}</div>
                    <div className="mt-1 text-xs text-white/35">{row.websiteUrl}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-[#8468EB]/25 bg-[#8468EB]/10 px-3 py-1 text-xs font-semibold text-[#C4B5FD]">
                      {statusLabel(row.programStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/60">
                    {row.activeLinks} active / {row.pendingLinks} pending
                  </td>
                  <td className="px-4 py-4 text-white/60">{row.activeDeals}</td>
                  <td className="px-4 py-4 text-white/60">{row.pendingFindings}</td>
                  <td className="px-4 py-4 text-white/60">{row.clicks30d}</td>
                  <td className="px-4 py-4 text-right font-semibold text-white">
                    {formatMoney(row.revenueTotal)}
                  </td>
                </tr>
              ))}
              {overview.rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-sm text-white/45">
                    No Supabase tools found. Run `npm run migrate:affiliate-os`.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111111] px-4 py-16 text-white">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.18), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#8468EB]/25 bg-[#8468EB]/10 text-[#C4B5FD]">
        {icon}
      </div>
      <div className="mt-5 text-2xl font-bold tracking-[-0.03em] text-white">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
        {label}
      </div>
    </div>
  );
}
