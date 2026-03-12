
import React from 'react';

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-0 w-[36rem] h-[36rem] bg-primary-200/35 blur-[130px] rounded-full" />
        <div className="absolute top-10 right-0 w-[30rem] h-[30rem] bg-secondary-200/35 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-warning-200/20 blur-[110px] rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/75 border border-primary-200 text-primary-700 text-xs font-bold uppercase tracking-[0.14em] mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            <span>WHY 4AM?</span>
          </div>
          
          <h1 className="hero-title text-slate-900 mb-6 animate-fade-in-up">
            Product-Grade Tech.
            <br />
            <span className="text-gradient">Business-Ready Outcomes.</span>
          </h1>
          
          <p className="hero-subtitle text-slate-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We build digital systems that look premium, scale reliably, and deliver measurable growth.
            Strategy, design, engineering, and talent acceleration in one execution team.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => scrollTo('contact')}
              className="btn-primary flex items-center justify-center group"
            >
              Get Started
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                <ArrowRight />
              </span>
            </button>
            <button 
              onClick={() => scrollTo('about')}
              className="btn-outline flex items-center justify-center"
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="feature-card text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="feature-icon mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Speed of Execution</h3>
            <p className="text-slate-600">
              From concept to deployment in record time. Our agile approach ensures rapid iteration without compromising quality.
            </p>
          </div>
          
          <div className="feature-card text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="feature-icon mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Scale-Ready Tech</h3>
            <p className="text-slate-600">
              Built for millions. Our architecture scales seamlessly with your growth, handling any load with ease.
            </p>
          </div>
          
          <div className="feature-card text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="feature-icon mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3.5-3.5M21 16v0"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Elite Talent</h3>
            <p className="text-slate-600">
              Top-tier engineers and designers who are passionate about creating exceptional digital experiences.
            </p>
          </div>
          
          <div className="feature-card text-center animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <div className="feature-icon mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                <rect x="2" y="6" width="20" height="12" rx="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Business Focused</h3>
            <p className="text-slate-600">
              We understand your business goals and deliver solutions that drive real ROI and sustainable growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
