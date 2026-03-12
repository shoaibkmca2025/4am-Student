
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="section bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-900 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-3xl">4AM</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-lg hidden md:block">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">5+</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-widest">Years of Innovation</div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">Our Origin Story</h2>
            <h3 className="text-4xl font-bold mb-6 leading-tight text-gray-900">We build when the world sleeps. That's why we're 4AM.</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              4AM Global Media was founded on a simple principle: extraordinary things happen when passion meets discipline. Our name represents the "Golden Hours" where deep focus leads to massive breakthroughs.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Based at the intersection of creativity and logic, we help businesses transition from traditional models to digital-first powerhouses. Our ecosystem bridges the gap between high-end software development and industry-ready talent through our unique training division.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="card p-4">
                <div className="text-2xl font-bold mb-1 text-primary-600">99%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
              <div className="card p-4">
                <div className="text-2xl font-bold mb-1 text-primary-600">200+</div>
                <div className="text-sm text-gray-600">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
