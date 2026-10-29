import { computed, ref } from 'vue';
import { stories } from '../data/stories';
import { fits } from '../data/fits';
import { brands } from '../data/brands';
import { categories } from '../data/categories';
import type { Category, FitCategory } from '../types/content';

/**
 * Category ids from `categories.ts` mapped to the wording used in the `category`
 * fields of stories, fits and brands. One matcher drives every filter on the page.
 */
const aliases: Record<string, string[]> = {
  streetwear: ['streetwear'],
  minimalism: ['minimalism', 'minimal'],
  workwear: ['workwear'],
  technical: ['technical'],
  sneakers: ['sneakers', 'footwear'],
  'urban-culture': ['urban culture']
};

export function matchesCategory(itemCategory: string, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  const value = itemCategory.toLowerCase();
  return (aliases[categoryId] ?? [categoryId]).some((alias) => value.includes(alias));
}

export type FitFilter = 'All' | FitCategory;
export const fitFilters: FitFilter[] = ['All', 'Minimal', 'Streetwear', 'Technical', 'Smart Casual'];

const activeCategory = ref('all');
const activeFit = ref<FitFilter>('All');

export type CategoryWithCounts = Category & { stories: number; fits: number; brands: number; total: number };

const categoriesWithCounts = computed<CategoryWithCounts[]>(() =>
  categories
    .map((category) => {
      const s = stories.filter((x) => matchesCategory(x.category, category.id)).length;
      const f = fits.filter((x) => matchesCategory(x.category, category.id)).length;
      const b = brands.filter((x) => matchesCategory(x.category, category.id)).length;
      return { ...category, stories: s, fits: f, brands: b, total: s + f + b };
    })
    // Never offer a category that would filter nothing.
    .filter((category) => category.total > 0)
);

const filteredStories = computed(() => stories.filter((s) => matchesCategory(s.category, activeCategory.value)));
const filteredFits = computed(() =>
  fits.filter((f) => activeFit.value === 'All' || f.category === activeFit.value)
);
const activeCategoryLabel = computed(
  () => categories.find((c) => c.id === activeCategory.value)?.label ?? 'All'
);

function selectCategory(id: string): void {
  activeCategory.value = id;
  // Keep the Fits filter in step with the category when an equivalent fit category exists.
  activeFit.value = fitFilters.find((f) => f !== 'All' && matchesCategory(f, id)) ?? 'All';
}

function isBrandHighlighted(brandCategory: string): boolean {
  return activeCategory.value !== 'all' && matchesCategory(brandCategory, activeCategory.value);
}

export function useContentFilter() {
  return {
    activeCategory,
    activeCategoryLabel,
    activeFit,
    categoriesWithCounts,
    filteredStories,
    filteredFits,
    selectCategory,
    isBrandHighlighted
  };
}
