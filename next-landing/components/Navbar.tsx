"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Company", href: "/#company" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="section-shell pt-4">
        <nav className="glass flex items-center justify-between rounded-[24px] px-4 py-3 md:px-6">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-slate-900">
            4AM <span className="bg-holo bg-clip-text text-transparent">Global</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/pricing"
              className="rounded-full border border-white/70 bg-white/75 px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((p) => !p)}
            className="rounded-xl border border-white/70 bg-white/80 p-2 text-slate-700 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass mt-2 rounded-3xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/80"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/pricing"
                className="mt-2 rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.header>
  );
}
