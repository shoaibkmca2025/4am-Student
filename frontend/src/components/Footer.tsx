import React from 'react';
import { useNavigate } from 'react-router-dom';

const FOOTER_LINKS = {
  Company: [
    { label: 'About', type: 'section', value: 'about' },
    { label: 'Careers', type: 'section', value: 'training' },
    { label: 'Contact', type: 'section', value: 'contact' },
  ],
  Services: [
    { label: 'Web Development', type: 'section', value: 'services' },
    { label: 'App Development', type: 'section', value: 'services' },
    { label: 'SaaS Solutions', type: 'section', value: 'services' },
  ],
  Training: [
    { label: 'Programs', type: 'section', value: 'training' },
    { label: 'Apply Now', type: 'path', value: '/register' },
    { label: 'Mentorship', type: 'section', value: 'training' },
  ],
  Legal: [
    { label: 'Privacy', type: 'path', value: '/register' },
    { label: 'Terms', type: 'path', value: '/register' },
    { label: 'Cookies', type: 'path', value: '/register' },
  ],
};

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleFooterAction = (type: string, value: string) => {
    if (type === 'section') {
      const element = document.getElementById(value);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    navigate(value);
  };

  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2.5 mb-4">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center text-black font-black text-sm"
                style={{ background: '#22d3ee' }}
              >
                4
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                4AM <span className="text-primary">Global</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Engineering the future of SaaS. Building when the world sleeps.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleFooterAction(link.type, link.value)}
                      className="text-sm text-gray-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors bg-transparent border-0 p-0 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © 2026 4AM Global Media. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: '#22d3ee', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {'< Built with passion at 4AM />'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
