
import React, { useState } from 'react';
import { contactService } from '../services/api';

const Icons = {
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.21-8.58"/></svg>
};

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Software Development Services',
    message: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await contactService.send(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact form', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section bg-gray-50 relative overflow-hidden scroll-mt-24">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-100 blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">Contact</h2>
            <h3 className="text-4xl font-bold mb-6 text-gray-900">Let's build something <span className="text-gradient">epic.</span></h3>
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">
              Ready to take your project to the next level or jumpstart your career? 
              Reach out and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600">
                  <Icons.Mail />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-lg font-semibold text-gray-900">4amhustles@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary-100 border border-secondary-200 flex items-center justify-center text-secondary-600">
                  <Icons.Phone />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-lg font-semibold text-gray-900">9000598600</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600">
                  <Icons.MapPin />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Headquarters</p>
                  <p className="text-lg font-semibold text-gray-900">Silicon Valley, CA / Remote Global</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {isSubmitted ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-6">
                  <Icons.Send />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Message Sent!</h4>
                <p className="text-gray-600">Thanks for reaching out. Our team will contact you shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-primary-600 font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Interest</label>
                  <select 
                     name="interest"
                     value={formData.interest}
                     onChange={handleChange}
                     className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-all text-gray-900"
                   >
                    <option value="Software Development Services">Software Development Services</option>
                    <option value="Internship & Training Program">Internship & Training Program</option>
                    <option value="Career Opportunities">Career Opportunities</option>
                    <option value="Partnerships">Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-gray-900"
                    placeholder="Tell us about your project or goals..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 btn-secondary flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.Loader />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
