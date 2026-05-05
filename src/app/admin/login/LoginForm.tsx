"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const canUseSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canUseSupabase) return;

    setStatus("sending");
    setMessage("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myaimatch.ai'}/admin/affiliates`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check your inbox for the admin login link.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      {!canUseSupabase && (
        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/58">
          Supabase environment variables are not configured yet.
        </div>
      )}
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8468EB]">
          Admin email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="angel@myaimatch.ai"
          className="h-14 rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none focus:border-[#8468EB]"
        />
      </label>
      <button
        type="submit"
        disabled={!canUseSupabase || status === "sending"}
        className="h-14 rounded-full border border-[#8468EB]/50 bg-gradient-to-br from-[#8468EB] to-[#5B42C3] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending link..." : "Send magic link"}
      </button>
      {message && (
        <p className={`text-sm ${status === "error" ? "text-[#C4B5FD]" : "text-white/58"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
