"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, Braces, Users } from "lucide-react";

const parent = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.12,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      icon: Bot,
      title: "Task Automation",
      desc: "Automate hiring tasks, interview workflows, and admin operations with fewer manual steps.",
    },
    {
      icon: Users,
      title: "Efficient Collaboration",
      desc: "Keep students, mentors, and recruiters aligned in one smooth collaboration flow.",
    },
    {
      icon: Braces,
      title: "Code Analysis",
      desc: "Analyze skill test outcomes and performance trends with confidence and clarity.",
    },
  ];

  return (
    <section id="scene-hero" className="relative overflow-hidden pt-36 md:pt-44">
      <div className="section-shell relative z-10">
        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1
            variants={child}
            className="font-display text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-6xl md:text-7xl"
          >
            Key <span className="bg-holo bg-clip-text text-transparent italic">benefits</span>
            <br />
            of our app
          </motion.h1>

          <motion.p
            variants={child}
            className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg"
          >
            4AM Global Media helps students and companies move faster with intelligent assessments, streamlined collaboration, and insight-driven hiring.
          </motion.p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={child}
                  transition={{ delay: 0.18 + i * 0.15, duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
                >
                  <motion.article
                    className="glass rounded-[28px] p-5 text-left"
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            y: [0, -7, 0],
                          }
                    }
                    whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
                    transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="mb-4 inline-flex rounded-2xl border border-white/80 bg-white/75 p-2 text-slate-800">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{card.desc}</p>
                  </motion.article>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="h-44 sm:h-52" />
    </section>
  );
}
