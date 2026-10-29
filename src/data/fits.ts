import type { Fit } from '../types/content';

export type { Fit };

export const fits: Fit[] = [
  {
    id: 'everyday-uniform',
    title: 'Everyday Uniform',
    category: 'Minimal',
    description: 'Relaxed proportions, dependable basics and a palette that works on repeat.',
    pieces: ['Heavyweight off-white T-shirt', 'Straight-leg dark denim', 'Simple leather or canvas sneakers', 'Lightweight overshirt'],
    image: '/images/fits/everyday-uniform.jpg',
    mood: 'Daily / understated'
  },
  {
    id: 'technical-layers',
    title: 'Technical Layers',
    category: 'Technical',
    description: 'A functional shell and considered layers for a day that moves between indoors and outdoors.',
    pieces: ['Weather-resistant shell jacket', 'Neutral sweatshirt or fleece', 'Relaxed utility trousers', 'Trail-inspired sneakers'],
    image: '/images/fits/technical-layers.jpg',
    mood: 'Utility / movement'
  },
  {
    id: 'off-duty',
    title: 'Off-Duty',
    category: 'Streetwear',
    description: 'Comfort first, but with shape: roomy layers, washed textures and one strong accessory.',
    pieces: ['Boxy sweatshirt', 'Loose-fit washed denim', 'Retro runners or skate shoes', 'Cap or compact shoulder bag'],
    image: '/images/fits/off-duty.jpg',
    mood: 'Weekend / relaxed'
  },
  {
    id: 'after-hours',
    title: 'After Hours',
    category: 'Smart Casual',
    description: 'A cleaner silhouette for evenings, built from pieces that still feel easy to wear.',
    pieces: ['Textured knit or dark overshirt', 'Pleated or straight tailored trousers', 'Minimal dark shoes', 'Simple metal accessory'],
    image: '/images/fits/after-hours.jpg',
    mood: 'Evening / refined'
  }
];
