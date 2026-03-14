import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Internship from '../components/Internship';
import Features from '../components/Features';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ParticleCanvas from '../components/ParticleCanvas';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative">
      <ParticleCanvas />

      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/3 -right-1/3 w-[70vw] h-[70vw] rounded-full bg-cyan-300/30 dark:bg-cyan-900/20 blur-[120px]" />
        <div className="absolute -bottom-1/3 -left-1/3 w-[70vw] h-[70vw] rounded-full bg-sky-300/30 dark:bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Features />
          <Internship />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
