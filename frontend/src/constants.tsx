import React from 'react';
import { Service, InternshipPerk, NavLink } from './types';

const Icons = {
  Web: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  App: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
    </svg>
  ),
  SaaS: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  Database: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  ),
  Design: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  Consulting: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-2 10h7L11 22l2-10H6L13 2z" />
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: 'services' },
  { label: 'Training', href: 'training' },
  { label: 'About', href: 'about' },
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
    description: "We don't just write code; we solve business problems and drive measurable ROI.",
    icon: <Icons.Briefcase />,
  },
];
