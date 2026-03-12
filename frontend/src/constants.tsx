
import React from 'react';
import { Service, InternshipPerk, NavLink } from './types';

// Robust Inline SVG Icons
const Icons = {
  Web: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  App: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  SaaS: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M2 7v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"/><path d="M2 7h20"/><path d="M5 12h14"/><path d="M5 15h7"/></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>,
  Design: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.179-1.208l1.41-2.115a3 3 0 0 1 4.822-1.378L22 19V12c0-5.5-4.5-10-10-10Z"/></svg>,
  Consulting: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.71 14.12 3H16l-3.35 9.06L20 10.29l-10.12 11.71H8l3.35-9.06L4 14.71z"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
};

export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: 'about' },
  { label: 'Services', href: 'services' },
  { label: 'Training', href: 'training' },
  { label: 'Why Us', href: 'why-us' },
  { label: 'Contact', href: 'contact' },
];

export const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Web Development',
    description: 'High-performance, responsive web applications built with modern frameworks like React and Next.js.',
    icon: <Icons.Web />,
  },
  {
    id: 'app',
    title: 'App Development',
    description: 'Native and cross-platform mobile solutions designed for scale and exceptional user engagement.',
    icon: <Icons.App />,
  },
  {
    id: 'saas',
    title: 'SaaS Solutions',
    description: 'End-to-end cloud platforms that solve complex business problems with seamless scalability.',
    icon: <Icons.SaaS />,
  },
  {
    id: 'backend',
    title: 'Backend Systems',
    description: 'Robust, secure, and distributed architecture designed to handle millions of requests.',
    icon: <Icons.Database />,
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'User-centric design thinking that bridges the gap between functionality and aesthetic beauty.',
    icon: <Icons.Design />,
  },
  {
    id: 'consulting',
    title: 'Tech Consulting',
    description: 'Strategic roadmap development and technology stack optimization for growing startups.',
    icon: <Icons.Consulting />,
  },
];

export const INTERNSHIP_PERKS: InternshipPerk[] = [
  {
    title: 'Industry Mentorship',
    description: 'Learn directly from senior engineers who build real-world systems every day.',
  },
  {
    title: 'Live Projects',
    description: 'Work on active client projects and see your code in production environments.',
  },
  {
    title: 'Career Coaching',
    description: 'Professional resume building and mock interviews to make you 100% job-ready.',
  },
  {
    title: 'Global Certification',
    description: 'Receive recognized certifications that validate your technical expertise.',
  },
];

export const FEATURES = [
  {
    title: 'Speed of Execution',
    description: 'We move fast. Our agile methodology ensures rapid deployment without sacrificing quality.',
    icon: <Icons.Zap />,
  },
  {
    title: 'Scale-Ready Tech',
    description: 'We build for tomorrow. Every line of code is written with future growth in mind.',
    icon: <Icons.Target />,
  },
  {
    title: 'Elite Talent',
    description: 'Our team consists of top-tier developers and designers passionate about innovation.',
    icon: <Icons.Users />,
  },
  {
    title: 'Business Focused',
    description: 'We don\'t just write code; we solve business problems and drive measurable ROI.',
    icon: <Icons.Briefcase />,
  },
];
