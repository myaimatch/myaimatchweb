"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .faq-list { display: flex; flex-direction: column; margin-top: 44px; }
        .faq-item { border-top: 1px solid rgba(255,255,255,0.08); }
        .faq-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .faq-button {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          width: 100%; padding: 22px 0; background: transparent; border: none;
          color: rgba(255,255,255,0.88); font-size: 15px; font-weight: 600;
          letter-spacing: -0.01em; text-align: left; cursor: pointer;
          transition: color 150ms ease;
        }
        .faq-button:hover { color: #ffffff; }
        .faq-button:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 3px; border-radius: 4px; }
        .faq-chevron-icon {
          flex-shrink: 0; width: 18px; height: 18px;
          color: rgba(255,255,255,0.36);
          transition: transform 320ms cubic-bezier(0.22,1,0.36,1), color 150ms ease;
        }
        .faq-item.is-open .faq-chevron-icon { transform: rotate(180deg); color: #8468EB; }
        .faq-answer {
          overflow: hidden; max-height: 0;
          transition: max-height 380ms cubic-bezier(0.22,1,0.36,1);
        }
        .faq-item.is-open .faq-answer { max-height: 300px; }
        .faq-answer-inner {
          padding-bottom: 22px;
          color: rgba(255,255,255,0.56); font-size: 15px; line-height: 1.75;
        }
      `}</style>
      <div className="faq-list">
        {items.map((item, i) => (
          <div key={i} className={`faq-item${openIndex === i ? " is-open" : ""}`}>
            <button
              type="button"
              className="faq-button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span>{item.question}</span>
              <ChevronDown className="faq-chevron-icon" aria-hidden />
            </button>
            <div className="faq-answer" aria-hidden={openIndex !== i}>
              <p className="faq-answer-inner">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
