import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
      ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10 py-3 shadow-sm'
      : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 group focus:outline-none"
          >
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white dark:text-black font-black text-sm"
              style={{ background: 'var(--primary)' }}>
              4
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              4AM <span style={{ color: 'var(--primary)' }}>Global</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="nav-link focus:outline-none"
              >
                {link.label}
              </button>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="nav-link focus:outline-none"
                >
                  Dashboard
                </button>
                {!isAdmin ? (
                  <>
                    <button
                      onClick={() => navigate('/features')}
                      className="nav-link focus:outline-none"
                    >
                      Features
                    </button>
                    <button
                      onClick={() => navigate('/modules')}
                      className="nav-link focus:outline-none"
                    >
                      Modules
                    </button>
                    <button
                      onClick={() => navigate('/tools')}
                      className="nav-link focus:outline-none"
                    >
                      Tools
                    </button>
                  </>
                ) : null}
                {isAdmin ? (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
                    style={{
                      border: '1px solid var(--primary)',
                      color: theme === 'dark' ? '#0f172a' : '#ffffff',
                      background: 'var(--primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-bright)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                    }}
                  >
                    Add Assessment
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate('/');
                    window.location.reload();
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors text-sm font-medium focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="nav-link focus:outline-none"
              >
                Login
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200"
              style={{
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = theme === 'dark' ? '#000' : '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              className="text-gray-500 dark:text-gray-300 p-2 hover:text-primary rounded-lg transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <button
        type="button"
        aria-label="Close mobile menu"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 top-[61px] bg-slate-900/25 dark:bg-black/45 backdrop-blur-[1px] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-black/5 dark:border-white/10 transition-all duration-300 ease-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[28rem] py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}>
        <div className="flex flex-col space-y-1 px-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 last:border-0 text-left focus:outline-none transition-colors"
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
              >
                Dashboard
              </button>
              {!isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/features');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      navigate('/modules');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
                  >
                    Modules
                  </button>
                  <button
                    onClick={() => {
                      navigate('/tools');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
                  >
                    Tools
                  </button>
                </>
              ) : null}
              {isAdmin ? (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
                >
                  Add Assessment
                </button>
              ) : null}
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                  window.location.reload();
                }}
                className="text-red-500 dark:text-red-400 text-base font-medium py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-slate-600 dark:text-gray-300 text-base font-medium hover:text-primary py-3 border-b border-black/5 dark:border-white/5 text-left focus:outline-none transition-colors"
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
