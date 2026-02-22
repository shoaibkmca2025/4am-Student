
import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import logoImage from '../4am logo.jpeg';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <img
              src={logoImage}
              alt="4AM Global Media"
              className="h-10 w-10 rounded-lg object-cover group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-extrabold tracking-tight">
              4AM <span className="text-sky-400">Global Media</span>
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-slate-300 hover:text-sky-400 transition-colors font-medium text-sm focus:outline-none"
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-sky-400 hover:text-white transition-all shadow-lg shadow-sky-500/10 focus:outline-none"
            >
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full glass border-t border-white/10 transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col space-y-4 px-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-slate-300 text-lg font-medium hover:text-sky-400 py-3 border-b border-white/5 last:border-0 text-left focus:outline-none"
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={(e) => scrollToSection(e, 'contact')}
            className="bg-sky-500 text-white px-5 py-4 rounded-xl font-bold text-center mt-4 shadow-lg shadow-sky-500/20 focus:outline-none"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
