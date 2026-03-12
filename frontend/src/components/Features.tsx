import React, { useEffect, useRef } from 'react';
import { FEATURES } from '../constants';

const FEATURE_NUMBERS = ['01', '02', '03', '04'];

const Features: React.FC = () => {
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
    <section id="why-us" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="animate-on-scroll">
            <span className="badge-pill mx-auto">Why 4AM?</span>
          </div>
          <h2 className="section-title mt-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
            Built <span className="text-gradient">Different.</span>
          </h2>
          <p className="section-subtitle mx-auto mt-4 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            We don't just ship code. We ship value. Our culture of excellence ensures that every
            project is a masterpiece of modern engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="glass-card p-6 relative animate-on-scroll"
              style={{ transitionDelay: `${0.1 * idx}s` }}
            >
              {/* Number tag */}
              <span
                className="absolute -top-3 -right-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'rgba(0, 245, 255, 0.15)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                }}
              >
                {FEATURE_NUMBERS[idx]}
              </span>

              <div className="icon-box mb-5">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
