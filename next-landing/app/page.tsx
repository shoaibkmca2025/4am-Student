"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/sections/Hero";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ThreeRibbonBackground from "@/components/ThreeRibbonBackground";

export default function HomePage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const nodes = pageRef.current.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="relative z-[2]">
      <ThreeRibbonBackground />
      <Hero />

      <section id="scene-creation" className="section-shell py-20 md:py-28">
        <div data-reveal className="card-soft relative overflow-hidden rounded-[32px] p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-cyan-100/30" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Solutions</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-slate-900 sm:text-6xl">
              Enhance the pace
              <br />
              of <span className="bg-holo bg-clip-text text-transparent italic">creating</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Move from student learning to recruitment outcomes with cinematic clarity, smooth handoffs, and visible momentum.
            </p>
          </div>
        </div>
      </section>

      <section id="solutions" className="relative">
        <FeatureGrid />
      </section>

      <section id="integrations" className="section-shell py-8 md:py-14">
        <div data-reveal className="rounded-[34px] border border-slate-900/10 bg-slate-900 px-8 py-12 text-white shadow-[0_32px_80px_-32px_rgba(2,6,23,0.6)] md:px-12 md:py-16">
          <h3 className="font-display text-3xl font-semibold md:text-5xl">Integrations that fit your entire campus-to-career stack.</h3>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
            Connect assessments, interviews, dashboards, and communication tools without disrupting your workflow rhythm.
          </p>
        </div>
      </section>

      <section id="company" className="section-shell pb-24 pt-20 md:pb-32 md:pt-28">
        <div data-reveal className="card-soft mb-8 rounded-[34px] p-8 md:p-12">
          <h3 className="font-display text-3xl font-semibold text-slate-900 sm:text-5xl">Built for teams that move with intent.</h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            From student cohorts to hiring teams, 4AM Global keeps strategy, execution, and collaboration in one refined interface.
          </p>
        </div>
      </section>

      <section id="scene-questions" className="section-shell pb-24 pt-0 md:pb-32">
        <div data-reveal className="card-soft rounded-[34px] p-8 md:p-12">
          <h3 className="font-display text-3xl font-semibold text-slate-900 sm:text-5xl">Still have unanswered questions?</h3>
          <div className="mt-7 max-w-xl">
            <label htmlFor="question" className="mb-2 block text-sm font-medium text-slate-600">
              Ask us a question
            </label>
            <input
              id="question"
              type="text"
              placeholder="Ask us a question"
              className="w-full rounded-2xl border border-white/80 bg-white/80 px-5 py-3.5 text-base text-slate-800 outline-none transition focus:border-cyan-300"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
