import Link from "next/link";
import Image from "next/image";

const linkColumns = [
  {
    title: "Product",
    links: [
      { label: "Find Your Match", href: "/#match-tools" },
      { label: "Get Your Match", href: "/assessment" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Services", href: "/services" },
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
          "linear-gradient(#131313, #131313), linear-gradient(90deg, #814ac8 0%, transparent 60%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-myaimatch.png"
                alt="myAIMatch"
                width={140}
                height={40}
                style={{ objectFit: "contain" }}
                priority
              />
            </Link>
            <p className="text-[#A0A0A0] text-sm max-w-xs leading-relaxed">
              The universal AI matching engine. Find, compare, and implement the
              right AI tools for your business.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-10">
            {linkColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-white text-sm font-semibold tracking-wide">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[#A0A0A0] hover:text-white text-sm transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
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
