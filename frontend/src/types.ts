
// Added React import to fix "Cannot find namespace 'React'" error.
import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface InternshipPerk {
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}