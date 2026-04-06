import Link from "next/link";

const linkColumns = [
  {
    heading: "Product",
    links: [
      { label: "Directory", href: "/directory" },
      { label: "Compare", href: "/compare" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#131313] border-t border-[#343434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-white font-bold text-xl tracking-tight hover:text-[#8468EB] transition-colors"
            >
              myAIMatch
            </Link>
            <p className="text-[#A0A0A0] text-sm max-w-xs">
              Find and implement the right AI tools for your business — faster.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-10">
            {linkColumns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <span className="text-white text-sm font-semibold">
                  {col.heading}
                </span>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#343434] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#A0A0A0] text-sm">
            © 2026 myAIMatch. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
