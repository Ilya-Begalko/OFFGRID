export type Story = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  image: string;
  date: string;
  readingTime: number;
  featured?: boolean;
};

export type FitCategory = 'Minimal' | 'Streetwear' | 'Technical' | 'Smart Casual';

export type Fit = {
  id: string;
  title: string;
  category: FitCategory;
  description: string;
  pieces: string[];
  image: string;
  mood: string;
};

export type Brand = {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  image?: string;
};

export type Category = {
  id: string;
  label: string;
  description: string;
};

export type SearchResult =
  | { kind: 'story'; item: Story }
  | { kind: 'fit'; item: Fit }
  | { kind: 'brand'; item: Brand };
