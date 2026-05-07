"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

const VIDEO_SRC = "/videos/myaimatch-vision-draft.mp4";

export function VisionVideoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      videoRef.current?.pause();
    }
  }, [isOpen]);

  return (
    <>
      <div className="vision-video-launcher">
        <button
          type="button"
          className="vision-video-button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
        >
          <span className="vision-video-button-icon" aria-hidden="true">
            <Play size={16} strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="vision-video-button-copy">
            <span>Watch the 30s vision film</span>
            <strong>Investor pitch · myAI Navigator</strong>
          </span>
        </button>
      </div>

      {isOpen ? (
        <div className="vision-video-modal" role="dialog" aria-modal="true" aria-label="myAImatch vision video">
          <button
            type="button"
            className="vision-video-backdrop"
            aria-label="Close video"
            onClick={() => setIsOpen(false)}
          />
          <div className="vision-video-panel">
            <div className="vision-video-panel-head">
              <span>myAImatch Vision</span>
              <button
                type="button"
                className="vision-video-close"
                aria-label="Close video"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
            <video
              ref={videoRef}
              className="vision-video-player"
              src={VIDEO_SRC}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
