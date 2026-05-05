import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#111111] px-4 py-24 text-white">
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] p-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.22), transparent 72%)",
            }}
          />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8468EB]">
              myAImatch admin
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em]">
              Affiliate OS login
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/50">
              Magic-link access for approved myAImatch operators only.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
