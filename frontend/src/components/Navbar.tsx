import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/82 shadow-lg shadow-slate-900/5 border-b border-slate-200/70 py-4 backdrop-blur-xl' : 'bg-white/50 py-5 backdrop-blur-md border-b border-white/30'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/25">
              <span className="text-white font-black text-base tracking-tight">4</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              4AM <span className="text-primary">Global Media</span>
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="nav-link text-slate-700 hover:text-primary transition-colors font-semibold text-sm focus:outline-none"
              >
                {link.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="nav-link text-slate-700 hover:text-primary transition-colors font-semibold text-sm focus:outline-none"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    navigate('/');
                    window.location.reload();
                  }}
                  className="text-slate-600 hover:text-error transition-colors font-semibold text-sm focus:outline-none border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="nav-link text-slate-700 hover:text-primary transition-colors font-semibold text-sm focus:outline-none"
              >
                Login
              </button>
            )}

            <button 
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-slate-700 p-2 hover:bg-white/80 rounded-lg transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col space-y-4 px-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-slate-700 text-lg font-semibold hover:text-primary py-3 border-b border-slate-100 last:border-0 text-left focus:outline-none"
            >
              {link.label}
            </button>
          ))}
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-slate-700 text-lg font-semibold hover:text-primary py-3 border-b border-slate-100 text-left focus:outline-none"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                  window.location.reload();
                }}
                className="text-error text-lg font-semibold hover:text-error-600 py-3 border-b border-slate-100 text-left focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-700 text-lg font-semibold hover:text-primary py-3 border-b border-slate-100 text-left focus:outline-none"
            >
              Login
            </button>
          )}

          <button 
            onClick={() => navigate('/register')}
            className="btn-primary text-center mt-4"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
