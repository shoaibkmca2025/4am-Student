import React, { useEffect, useRef } from 'react';

const STATS = [
  { value: '99%', label: 'Client Satisfaction' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '5+', label: 'Years of Innovation' },
  { value: '50+', label: 'Team Members' },
];

const About: React.FC = () => {
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
    <section id="about" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="animate-on-scroll">
              <span className="badge-pill">
                <span className="pulse-dot"></span>
                Our Origin Story
              </span>
            </div>

            <h2 className="section-title mt-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              We build when the world sleeps.
              <br />
              <span className="text-gradient">That's why we're 4AM.</span>
            </h2>

            <div className="space-y-4 mt-6">
              <p className="section-subtitle animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                4AM Global Media was founded on a simple principle: extraordinary things happen when
                passion meets discipline. Our name represents the "Golden Hours" where deep focus leads
                to massive breakthroughs.
              </p>
              <p className="section-subtitle animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
                Based at the intersection of creativity and logic, we help businesses transition from
                traditional models to digital-first powerhouses. Our ecosystem bridges the gap between
                high-end software development and industry-ready talent through our unique training
                division.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center animate-on-scroll"
                style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#22d3ee' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
