import React, { useState, useEffect, useRef } from 'react';
import { contactService } from '../services/api';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', interest: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactService.send(formData);
      setStatus('sent');
      setFormData({ name: '', email: '', interest: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      label: 'Email Us',
      value: '4amhustles@gmail.com',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Call Us',
      value: '9000598600',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Headquarters',
      value: 'Silicon Valley, CA / Remote Global',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="animate-on-scroll">
            <span className="badge-pill mx-auto">Contact</span>
          </div>
          <h2 className="section-title mt-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
            Let's build something <span className="text-gradient">epic.</span>
          </h2>
          <p className="section-subtitle mx-auto mt-4 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            Ready to take your project to the next level or jumpstart your career? Reach out and
            we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Contact info */}
          <div className="space-y-4">
            {contactInfo.map((info, idx) => (
              <div
                key={info.label}
                className="glass-card p-5 flex items-center gap-4 animate-on-scroll"
                style={{ transitionDelay: `${0.1 * idx}s` }}
              >
                <div className="icon-box shrink-0" style={{ color: '#00f5ff' }}>
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs text-gray-500">{info.label}</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{info.value}</div>
                </div>
              </div>
            ))}

            {/* Social icons */}
            <div className="flex gap-3 pt-4 animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
              {['T', 'L', 'G', 'I'].map((letter) => (
                <div key={letter} className="social-icon cursor-pointer">
                  <span className="text-sm font-bold">{letter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="dark-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="dark-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Interest</label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="dark-input"
                required
              >
                <option value="">Select an option</option>
                <option value="web">Web Development</option>
                <option value="app">App Development</option>
                <option value="saas">SaaS Solutions</option>
                <option value="training">Training Program</option>
                <option value="consulting">Tech Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                rows={5}
                className="dark-input resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center text-base py-3"
            >
              {status === 'sending' ? (
                'Sending...'
              ) : status === 'sent' ? (
                'Message Sent ✓'
              ) : (
                <>
                  Send Message
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                  </svg>
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Failed to send. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
