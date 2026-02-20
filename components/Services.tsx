
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden scroll-mt-24">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-sky-400 uppercase tracking-[0.2em] mb-4">Solutions</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Expertise That Scales.</h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From architecture to deployment, we provide a full spectrum of software services 
            tailored to your specific business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="group p-8 rounded-3xl glass border border-white/10 hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-2 shadow-xl"
            >
              <div className="bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{service.title}</h4>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
