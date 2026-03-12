
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="section bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-100 blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">Solutions</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Expertise That Scales.</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From architecture to deployment, we provide a full spectrum of software services 
            tailored to your specific business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="feature-card card-hover group p-8"
            >
              <div className="feature-icon w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed">
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
