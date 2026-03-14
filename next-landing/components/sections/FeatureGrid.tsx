"use client";

import { BarChart3, Layers3, ShieldCheck, Zap, Workflow, Globe2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: Workflow,
    title: "Visual Pipelines",
    text: "Design release pipelines with drag-and-drop flows and approvals your whole team can understand.",
  },
  {
    icon: BarChart3,
    title: "Live Product Metrics",
    text: "Track activation, retention, and rollout confidence from one clean command center.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-Ready",
    text: "Enterprise-grade controls, audit logs, and encrypted collaboration across your stack.",
  },
  {
    icon: Zap,
    title: "Faster Iteration",
    text: "Run experiments, compare outcomes, and ship improvements without waiting on manual reports.",
  },
  {
    icon: Layers3,
    title: "Modular Architecture",
    text: "Compose reusable workflows that adapt across teams, products, and release cadences.",
  },
  {
    icon: Globe2,
    title: "Global Reliability",
    text: "Deliver low-latency experiences for distributed teams and customers around the world.",
  },
];

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = sectionRef.current.querySelectorAll("[data-feature-card]");
    const heading = sectionRef.current.querySelector("[data-feature-heading]");

    const ctx = gsap.context(() => {
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: heading,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power1.inOut",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cards[0],
            start: "top 84%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="section-shell py-24 md:py-32">
      <div data-feature-heading className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Capabilities</p>
        <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-5xl">Everything your SaaS team needs to ship elegantly</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              data-feature-card
              className="card-soft group rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-34px_rgba(11,20,41,0.45)]"
            >
              <div className="mb-5 inline-flex rounded-2xl border border-white/70 bg-white/80 p-2.5 text-slate-800 transition-transform duration-300 group-hover:scale-105">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
