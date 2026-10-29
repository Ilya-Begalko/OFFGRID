import type { Component } from 'vue';
import { Send, Github, Linkedin, Mail } from 'lucide-vue-next';

export const site = {
  name: 'OFFGRID',
  slogan: 'Style outside the lines.',
  descriptor: "MEN'S STYLE / CULTURE / OBJECTS",
  issue: 'ISSUE 001',
  tagline: 'Independent style journal',
  manifesto:
    'OFFGRID explores the intersection of personal style, urban life and contemporary design. We look beyond trends to find the pieces, people and ideas shaping the way we dress.',
  /** Set to a real profile URL to show Instagram in the footer. */
  instagram: null as string | null
};

export const navLinks = [
  { id: 'stories', label: 'Stories' },
  { id: 'fits', label: 'Fits' },
  { id: 'brands', label: 'Brands' },
  { id: 'about', label: 'About' }
] as const;

export const developerLinks: Array<{
  label: string;
  href: string;
  external: boolean;
  icon: Component;
}> = [
  {
    label: 'Telegram',
    href: 'https://t.me/ilbglk',
    external: true,
    icon: Send
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Ilya-Begalko',
    external: true,
    icon: Github
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ilya-begalko/',
    external: true,
    icon: Linkedin
  },
  {
    label: 'Email',
    href: 'mailto:ilya.begalko@gmail.com',
    external: false,
    icon: Mail
  }
];
