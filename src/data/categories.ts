import type { Category } from '../types/content';

export type { Category };

export const categories: Category[] = [
  { id: 'all', label: 'All', description: 'Everything on OFFGRID' },
  { id: 'streetwear', label: 'Streetwear', description: 'Everyday street style, relaxed fits and subcultural references' },
  { id: 'minimalism', label: 'Minimalism', description: 'Considered essentials, shape and texture' },
  { id: 'workwear', label: 'Workwear', description: 'Utility details and hard-wearing staples' },
  { id: 'technical', label: 'Technical Wear', description: 'Weather-ready layers and functional design' },
  { id: 'sneakers', label: 'Sneakers', description: 'Footwear, rotation and styling ideas' },
  { id: 'urban-culture', label: 'Urban Culture', description: 'The people, spaces and ideas around city style' }
];
