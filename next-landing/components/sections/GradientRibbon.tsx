"use client";

import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export default function GradientRibbon() {
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !ribbonRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const el = ribbonRef.current;
    const animation = gsap.to(el, {
      yPercent: -12,
      xPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.1,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      ref={ribbonRef}
      className="pointer-events-none absolute -bottom-28 left-1/2 w-[1400px] max-w-[150vw] -translate-x-1/2"
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -18, 0],
              x: [0, 14, 0],
              scale: [1, 1.025, 1],
            }
      }
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 1200 320" className="h-[340px] w-full holo-ribbon opacity-95 blur-[2px]">
        <defs>
          <linearGradient id="holoMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B66FF" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#39A9FF" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#70FFE2" stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id="holoReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="58%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="ribbonBlur" x="-10%" y="-25%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <path
          d="M0,260 C170,220 240,160 380,180 C550,205 680,300 860,275 C1010,255 1080,170 1200,120 L1200,340 L0,340 Z"
          fill="url(#holoMain)"
          filter="url(#ribbonBlur)"
        />
        <path
          d="M60,245 C210,205 295,165 420,186 C585,214 695,292 860,266 C1000,245 1070,178 1160,134"
          fill="none"
          stroke="url(#holoReflection)"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
