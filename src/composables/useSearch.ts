import { computed, ref } from 'vue';
import { stories } from '../data/stories';
import { fits } from '../data/fits';
import { brands } from '../data/brands';
import type { SearchResult } from '../types/content';

function includes(fields: string[], needle: string): boolean {
  return fields.some((field) => field.toLowerCase().includes(needle));
}

export function useSearch() {
  const query = ref('');
  const normalized = computed(() => query.value.trim().toLowerCase());

  const results = computed<SearchResult[]>(() => {
    const q = normalized.value;
    if (!q) return [];
    return [
      ...stories
        .filter((s) => includes([s.title, s.excerpt, s.category], q))
        .map((item) => ({ kind: 'story' as const, item })),
      ...fits
        .filter((f) => includes([f.title, f.description, f.category], q))
        .map((item) => ({ kind: 'fit' as const, item })),
      ...brands
        .filter((b) => includes([b.name, b.category], q))
        .map((item) => ({ kind: 'brand' as const, item }))
    ];
  });

  function clear(): void {
    query.value = '';
  }

  return { query, normalized, results, clear };
}
