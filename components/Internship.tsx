
import React from 'react';
import { INTERNSHIP_PERKS } from '../constants';

const Internship: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  );

  const GraduationCap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  );

  const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  );

  const TrendingUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  );

  return (
    <section id="training" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-[3rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
                <AwardIcon />
                <span>2024 Enrollment Open</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Not Just a Course.<br />
                <span className="text-gradient">A Career Launchpad.</span>
              </h2>
              
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Most students are taught what to think. We teach you how to build. Our Internship & Training Division 
                focuses on project-based learning that mimics the high-pressure environment of top tech firms.
              </p>

              <div className="space-y-6">
                {INTERNSHIP_PERKS.map((perk, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1 bg-sky-500/20 p-1 rounded-full text-sky-400">
                      <CheckIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{perk.title}</h4>
                      <p className="text-sm text-slate-400">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-sky-500/25 focus:outline-none"
                >
                  Apply for Internship
                </button>
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-emerald-400"><TrendingUp /></span>
                  <span className="text-sm font-medium">92% Job Placement Rate</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="glass p-6 rounded-2xl border border-white/10">
                  <h5 className="text-sky-400 font-bold text-lg mb-2">Web Mastery</h5>
                  <p className="text-xs text-slate-500 mb-4">React, Node, TypeScript</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 w-3/4 h-full"></div>
                  </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/10 translate-x-4">
                  <h5 className="text-purple-400 font-bold text-lg mb-2">App Design</h5>
                  <p className="text-xs text-slate-500 mb-4">Figma, UX Psychology</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 w-1/2 h-full"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="glass p-6 rounded-2xl border border-white/10">
                  <h5 className="text-emerald-400 font-bold text-lg mb-2">Backend Pro</h5>
                  <p className="text-xs text-slate-500 mb-4">SQL, Redis, Docker</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 w-2/3 h-full"></div>
                  </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/10 translate-x-4">
                  <h5 className="text-pink-400 font-bold text-lg mb-2">AI Integrations</h5>
                  <p className="text-xs text-slate-500 mb-4">LLMs, Python, APIs</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-400 w-4/5 h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Internship;
