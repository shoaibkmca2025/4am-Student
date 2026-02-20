
import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <section id="why-us" className="py-24 bg-slate-950 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-sky-400 uppercase tracking-[0.2em] mb-4">Why 4AM?</h2>
          <h3 className="text-4xl font-bold mb-6">Built Different.</h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We don't just ship code. We ship value. Our culture of excellence ensures 
            that every project is a masterpiece of modern engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all group">
              <div className="mb-6 inline-block p-4 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
