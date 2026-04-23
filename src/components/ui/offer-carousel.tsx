"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Deal {
  id: string;
  name: string;
  tag: string;
  deal: string;
  dealLabel?: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  website: string;
}

interface DealCardProps {
  deal: Deal;
}

const DealCard = React.forwardRef<HTMLAnchorElement, DealCardProps>(
  ({ deal }, ref) => {
    const initials = (deal.name || "?").slice(0, 2).toUpperCase();
    const [logoError, setLogoError] = React.useState(false);

    return (
      <motion.a
        ref={ref}
        href={deal.href}
        className="relative flex-shrink-0 w-[300px] h-[380px] rounded-2xl overflow-hidden group snap-start block"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label={`View ${deal.name} details and special offer`}
      >
        {/* Top half — branded background */}
        <div className="relative h-[190px] w-full overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)"
          }}
        >
          {/* Radial gradient overlay */}
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(132,104,235,0.25) 0%, transparent 70%)"
            }}
          />

          {/* myAImatch logo watermark */}
          <Image
            src="/logo.png"
            alt="myAImatch"
            width={64}
            height={64}
            className="absolute bottom-3 right-3 w-16 h-auto opacity-10"
          />

          {/* Tool logo from Clearbit */}
          <div className="relative z-10">
            {!logoError ? (
              <Image
                src={`https://logo.clearbit.com/${deal.website}`}
                alt={deal.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-contain"
                loading="lazy"
                unoptimized={false}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "#8468EB", color: "white" }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Category tag pill */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "rgba(132,104,235,0.85)", backdropFilter: "blur(8px)" }}
          >
            <Tag className="w-3 h-3" />
            {deal.tag}
          </div>

          {/* Deal label badge */}
          {deal.dealLabel && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(132,104,235,0.5)" }}
            >
              {deal.dealLabel}
            </div>
          )}
        </div>

        {/* Bottom half — content */}
        <div
          className="h-[190px] flex flex-col justify-between p-5"
          style={{ backgroundColor: "#111111", borderTop: "1px solid #2a2a2a" }}
        >
          <div className="space-y-1.5">
            <h3 className="text-white font-bold text-base leading-snug">{deal.name}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>{deal.deal}</p>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end pt-4"
            style={{ borderTop: "1px solid #1e1e1e" }}
          >
            {/* Arrow CTA */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:-rotate-45"
              style={{ backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" }}
            >
              <ArrowRight className="w-4 h-4 transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.6)" }}
              />
            </div>
          </div>
        </div>

        {/* Subtle border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: "inset 0 0 0 1px rgba(132,104,235,0.5)" }}
        />
      </motion.a>
    );
  }
);
DealCard.displayName = "DealCard";

export interface OfferCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  deals: Deal[];
}

const OfferCarousel = React.forwardRef<HTMLDivElement, OfferCarouselProps>(
  ({ deals, className, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (!scrollRef.current) return;
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full group/carousel", className)}
        {...props}
      >
        {/* Left button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center
            opacity-0 group-hover/carousel:opacity-100 transition-all duration-300
            hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid #2a2a2a",
            color: "rgba(255,255,255,0.8)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#8468EB";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#8468EB";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.75)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Right button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center
            opacity-0 group-hover/carousel:opacity-100 transition-all duration-300
            hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid #2a2a2a",
            color: "rgba(255,255,255,0.8)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#8468EB";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#8468EB";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.75)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }
);
OfferCarousel.displayName = "OfferCarousel";

export { OfferCarousel, DealCard };
