
import React from 'react';

const Icons = {
  Twitter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  Linkedin: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  Github: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
};

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">4</div>
              <span className="text-xl font-extrabold tracking-tight text-white">4AM <span className="text-sky-400">Global Media</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
              Engineering tomorrow's technology today. We help brands evolve through 
              cutting-edge software and empower individuals through world-class training.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Icons.Twitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Icons.Linkedin />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Icons.Github />
              </a>
              <a href="https://instagram.com/4amhustles" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Icons.Instagram />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Quick Links</h5>
            <ul className="space-y-4">
              <li><button onClick={() => scrollTo('about')} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">About Us</button></li>
              <li><button onClick={() => scrollTo('services')} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">Services</button></li>
              <li><button onClick={() => scrollTo('training')} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">Internships</button></li>
              <li><button onClick={() => scrollTo('why-us')} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">Why Choose Us</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Services</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>Web Development</li>
              <li>Mobile Solutions</li>
              <li>UI/UX Strategy</li>
              <li>Cloud Computing</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-xs mb-4 md:mb-0">
            © 2024 4AM Global Media. All rights reserved. Built with passion & sleepless nights.
          </p>
          <div className="flex space-x-6 text-xs text-slate-600">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
