"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$29",
    desc: "For early teams shipping their first product loop.",
    points: ["3 workspaces", "Core analytics", "Email support"],
  },
  {
    name: "Scale",
    price: "$99",
    desc: "For growing SaaS companies optimizing delivery.",
    points: ["Unlimited workflows", "Custom dashboards", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For regulated and high-scale organizations.",
    points: ["SAML + SCIM", "Advanced governance", "Dedicated success lead"],
  },
];

export default function PricingPage() {
  return (
    <main className="section-shell pt-36 pb-24 md:pt-44 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pricing</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 sm:text-6xl">Simple plans, crafted for modern teams</h1>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.article
            key={plan.name}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-[30px] border p-6 md:p-7 ${
              plan.featured
                ? "border-slate-900/20 bg-slate-900 text-white shadow-[0_25px_80px_-40px_rgba(2,6,23,0.8)]"
                : "border-white/70 bg-white/80 text-slate-900 shadow-glass"
            }`}
          >
            <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
            <p className={`mt-3 text-sm leading-7 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{plan.desc}</p>
            <p className="mt-7 font-display text-4xl font-semibold">{plan.price}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
