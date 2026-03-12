import React, { useEffect, useRef } from 'react';
import { INTERNSHIP_PERKS } from '../constants';

const TRAINING_PROGRAMS = [
  { title: 'Web Mastery', tech: 'React, Node, TypeScript', gradient: 'from-cyan-500 to-blue-600', icon: '<>' },
  { title: 'App Design', tech: 'Figma, UX Psychology', gradient: 'from-pink-500 to-rose-600', icon: '##' },
  { title: 'Backend Pro', tech: 'SQL, Redis, Docker', gradient: 'from-emerald-500 to-green-600', icon: '≡' },
  { title: 'AI Integrations', tech: 'LLMs, Python, APIs', gradient: 'from-amber-500 to-orange-600', icon: '⊕' },
];

const PERK_ICONS = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
];

const Internship: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="training" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side */}
          <div>
            <div className="animate-on-scroll">
              <span className="badge-pill">
                <span className="pulse-dot"></span>
                2024 Enrollment Open
              </span>
            </div>

            <h2 className="section-title mt-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              Not Just a Course.
              <br />
              <span className="text-gradient">A Career Launchpad.</span>
            </h2>

            <p className="section-subtitle mt-4 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
              Most students are taught what to think. We teach you how to build. Our Internship &
              Training Division focuses on project-based learning that mimics the high-pressure
              environment of top tech firms.
            </p>

            {/* Perk cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {INTERNSHIP_PERKS.map((perk, idx) => (
                <div
                  key={perk.title}
                  className="glass-card p-4 flex items-start gap-3 animate-on-scroll"
                  style={{ transitionDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <div className="icon-box shrink-0 w-10 h-10">
                    {PERK_ICONS[idx]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{perk.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Training program cards */}
          <div className="grid grid-cols-2 gap-4">
            {TRAINING_PROGRAMS.map((prog, idx) => (
              <div
                key={prog.title}
                className="glass-card p-5 animate-on-scroll"
                style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                  {prog.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{prog.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{prog.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Internship;
