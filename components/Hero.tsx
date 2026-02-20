
import React from 'react';

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );

  const TerminalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
  );

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="hero-glow"></div>
      <div className="hero-orbit-layer">
        <div className="hero-orbit hero-orbit-primary"></div>
        <div className="hero-orbit hero-orbit-secondary"></div>
      </div>
      <div className="hero-particles">
        <span className="hero-particle" style={{ top: '18%', left: '58%' }}></span>
        <span className="hero-particle" style={{ top: '72%', left: '64%' }}></span>
        <span className="hero-particle" style={{ top: '30%', left: '8%' }}></span>
        <span className="hero-particle" style={{ top: '62%', left: '20%' }}></span>
      </div>
      <div className="hero-scan-layer">
        <div className="hero-scan-bar"></div>
      </div>
      <div className="animated-code-bg">
        <div className="animated-code-grid"></div>
        <div className="animated-code-lines">
          <span>{`const stack = ['React', 'Node', 'MongoDB']\nconst latency = '< 100ms'\n\nconst buildSaaS = async (idea) => {\n  const product = await ship(idea)\n  return scale(product)\n}`}</span>
          <span>{`interface Service {\n  id: string\n  title: string\n  outcome: 'ROI' | 'Growth'\n}\n\nconst deploy = (regions: string[]) => {\n  return regions.map(edgePush)\n}`}</span>
          <span>{`type TrainingPath = 'Frontend' | 'Backend' | 'Fullstack'\n\nasync function mentor(student: string, path: TrainingPath) {\n  await buildPortfolio(student, path)\n  return matchWithIndustry(student)\n}`}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Engineering the Future of SaaS</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6">
              Empowering Ideas <br />
              <span className="text-gradient">Beyond Midnight.</span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
              We are a team of passionate engineers and designers dedicated to building high-performance 
              software solutions and training the next generation of tech leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => scrollTo('contact')}
                className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold flex items-center justify-center hover:bg-sky-400 hover:scale-105 transition-all group focus:outline-none"
              >
                Build with us
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  <ArrowRight />
                </span>
              </button>
              <button 
                onClick={() => scrollTo('training')}
                className="px-8 py-4 glass text-white rounded-xl font-bold flex items-center justify-center hover:bg-white/5 transition-all focus:outline-none"
              >
                Join Training
              </button>
            </div>
            
            <div className="mt-12 flex items-center space-x-6 grayscale opacity-50">
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-500">Trusted By</span>
              <div className="flex items-center space-x-8 font-bold text-xl">
                <span>ALPHA</span>
                <span>VENTURE</span>
                <span>SYNK</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-xs text-slate-500 font-mono">index.tsx — 4AM</span>
                </div>
                <div className="font-mono text-sm text-sky-300 space-y-1">
                  <p><span className="text-purple-400">const</span> buildTheFuture = <span className="text-yellow-400">async</span> () ={'>'} {'{'}</p>
                  <p className="pl-4"><span className="text-purple-400">const</span> vision = <span className="text-green-400">'Limitless'</span>;</p>
                  <p className="pl-4"><span className="text-purple-400">const</span> quality = <span className="text-green-400">'Compromise-free'</span>;</p>
                  <p className="pl-4"><span className="text-slate-500">// Initialize growth protocol</span></p>
                  <p className="pl-4"><span className="text-yellow-400">await</span> innovation.<span className="text-sky-400">apply</span>({'{'} vision, quality {'}'});</p>
                  <p className="pl-4 text-pink-400">return <span className="text-white">Success;</span></p>
                  <p>{'}'}</p>
                </div>
                
                <div className="absolute -bottom-6 -right-6 glass p-4 rounded-xl border border-white/20 shadow-2xl animate-bounce">
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-500/20 p-2 rounded-lg">
                      <TerminalIcon />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Active Deployments</p>
                      <p className="text-lg font-bold">1,280+</p>
                    </div>
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

export default Hero;
