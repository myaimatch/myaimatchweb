import Link from "next/link";
import Image from "next/image";
import AssessmentPopupTrigger from "@/components/assessment/AssessmentPopupTrigger";
import myAiMatchWordmark from "../../brand_assets/Capa_1.png";

const linkColumns = [
  {
    title: "Product",
    links: [
      { label: "Browse AI tools", href: "/#match-tools" },
      { label: "Start Free AI Match", href: "/assessment", popup: true, ctaLocation: "footer_column" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Full AI Strategy Assessment", href: "/services/full-ai-strategy-assessment" },
      { label: "AI Tech Stack Implementation", href: "/services/ai-tech-stack-implementation" },
      { label: "Fractional AI Lead", href: "/services/ai-coaching" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="bg-[#131313] relative"
      style={{
        borderTop: "1px solid transparent",
        backgroundImage:
          "linear-gradient(#131313, #131313), linear-gradient(90deg, #8468EB 0%, transparent 60%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo + tagline */}
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="inline-block">
              <Image
                src={myAiMatchWordmark}
                alt="myAIMatch"
                width={176}
                height={24}
                style={{ width: "176px", height: "auto", objectFit: "contain" }}
                priority
              />
            </Link>
            <p className="text-[#A0A0A0] text-sm leading-relaxed">
              Browse the AI tool landscape, or answer a few questions and get a
              personalized stack match for your workflow, team, and current tools.
            </p>
            <AssessmentPopupTrigger
              ctaLocation="footer_primary"
              className="inline-flex h-10 w-fit items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #8468EB 0%, #5B42C3 100%)",
                boxShadow: "0 0 0 1px rgba(132,104,235,0.4), 0 6px 18px rgba(132,104,235,0.22)",
              }}
            >
              Start Free AI Match
            </AssessmentPopupTrigger>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {linkColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-white text-sm font-semibold tracking-wide">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      {"popup" in link && link.popup ? (
                        <AssessmentPopupTrigger
                          href={link.href}
                          ctaLocation={link.ctaLocation}
                          className="text-[#A0A0A0] hover:text-white text-sm transition-colors duration-150"
                        >
                          {link.label}
                        </AssessmentPopupTrigger>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[#A0A0A0] hover:text-white text-sm transition-colors duration-150"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A0A0A0] text-xs">
            © 2026 myAIMatch. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-[#A0A0A0] hover:text-white text-xs transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#A0A0A0] hover:text-white text-xs transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
