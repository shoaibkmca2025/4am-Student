import React from 'react';

const Icons = {
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  Instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
};

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 border-t border-slate-800/80 pt-16 pb-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-primary-500/20 blur-[100px]" />
        <div className="absolute -bottom-10 right-0 h-72 w-72 rounded-full bg-secondary-500/20 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex cursor-pointer items-center space-x-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-black text-white">4</div>
              <span className="text-xl font-extrabold tracking-tight text-white">4AM <span className="text-primary-300">Global Media</span></span>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-300/85">
              Engineering tomorrow's technology today. We help brands evolve through cutting-edge software and empower individuals through world-class training.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:text-white">
                <Icons.Twitter />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:text-white">
                <Icons.Linkedin />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:text-white">
                <Icons.Github />
              </a>
              <a href="https://instagram.com/4amhustles" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:text-white">
                <Icons.Instagram />
              </a>
            </div>
          </div>

          <div>
            <h5 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</h5>
            <ul className="space-y-4">
              <li><button onClick={() => scrollTo('about')} className="text-sm text-slate-400 transition-colors hover:text-primary-300">About Us</button></li>
              <li><button onClick={() => scrollTo('services')} className="text-sm text-slate-400 transition-colors hover:text-primary-300">Services</button></li>
              <li><button onClick={() => scrollTo('training')} className="text-sm text-slate-400 transition-colors hover:text-primary-300">Internships</button></li>
              <li><button onClick={() => scrollTo('why-us')} className="text-sm text-slate-400 transition-colors hover:text-primary-300">Why Choose Us</button></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">Services</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>Web Development</li>
              <li>Mobile Solutions</li>
              <li>UI/UX Strategy</li>
              <li>Cloud Computing</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs md:flex-row">
          <p className="text-slate-500">Copyright 2024 4AM Global Media. All rights reserved.</p>
          <div className="flex space-x-6 text-slate-500">
            <span className="cursor-pointer transition-colors hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer transition-colors hover:text-white">Terms of Service</span>
            <span className="cursor-pointer transition-colors hover:text-white">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
