import React, { useEffect, useRef } from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="animate-on-scroll">
            <span className="badge-pill mx-auto">Solutions</span>
          </div>
          <h2 className="section-title mt-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
            Expertise That <span className="text-gradient">Scales.</span>
          </h2>
          <p className="section-subtitle mx-auto mt-4 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            From architecture to deployment, we provide a full spectrum of software services
            tailored to your specific business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="glass-card p-6 group animate-on-scroll"
              style={{ transitionDelay: `${0.1 * idx}s` }}
            >
              <div className="icon-box mb-6">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary">
                Learn more
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
