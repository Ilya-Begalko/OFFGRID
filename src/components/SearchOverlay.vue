<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { ArrowRight, Search, X } from 'lucide-vue-next';
import { useSearch } from '../composables/useSearch';
import { useScrollReveal } from '../composables/useScrollReveal';
import type { SearchResult } from '../types/content';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; select: [result: SearchResult] }>();

const { query, normalized, results, clear } = useSearch();
const { reducedMotion } = useScrollReveal();
const input = ref<HTMLInputElement | null>(null);
const root = ref<HTMLElement | null>(null);
const active = ref(0);
let returnFocus: HTMLElement | null = null;

const suggestions = ['Technical', 'Minimal', 'Sneakers', 'Carhartt', 'City'];
const kindLabel = { story: 'Story', fit: 'Fit', brand: 'Brand' } as const;

function titleOf(result: SearchResult): string {
  return result.kind === 'brand' ? result.item.name : result.item.title;
}
function metaOf(result: SearchResult): string {
  if (result.kind === 'story') return `${result.item.category} — ${result.item.readingTime} min read`;
  if (result.kind === 'fit') return `${result.item.category} — ${result.item.mood}`;
  return result.item.category;
}
function optionId(index: number): string {
  return `search-option-${index}`;
}

watch(results, () => {
  active.value = 0;
});

function choose(result: SearchResult | undefined): void {
  if (!result) return;
  returnFocus = null;
  emit('select', result);
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
  } else if (event.key === 'ArrowDown' && results.value.length) {
    event.preventDefault();
    active.value = (active.value + 1) % results.value.length;
  } else if (event.key === 'ArrowUp' && results.value.length) {
    event.preventDefault();
    active.value = (active.value - 1 + results.value.length) % results.value.length;
  } else if (event.key === 'Enter' && event.target === input.value) {
    event.preventDefault();
    choose(results.value[active.value]);
  } else if (event.key === 'Tab' && root.value) {
    const nodes = Array.from(root.value.querySelectorAll<HTMLElement>('button, input'));
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}

watch(active, async (index) => {
  await nextTick();
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' });
});

watch(
  () => props.open,
  async (open) => {
    if (open) {
      returnFocus = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      await nextTick();
      input.value?.focus();
    } else {
      document.body.style.overflow = '';
      returnFocus?.focus({ preventScroll: true });
      clear();
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

function clearAndFocus(): void {
  clear();
  input.value?.focus();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        ref="root"
        class="fixed inset-0 z-[60] flex flex-col bg-paper/97 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Search OFFGRID"
        @keydown="onKeydown"
      >
        <div
          v-motion
          :initial="reducedMotion ? { opacity: 1 } : { opacity: 0, y: -24 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 450, ease: [0.22, 1, 0.36, 1] } }"
          class="container-editorial flex min-h-0 flex-1 flex-col pt-4 md:pt-6"
        >
          <div class="flex items-center justify-between">
            <p class="label">Search the journal</p>
            <button
              type="button"
              class="flex min-h-11 items-center gap-2 px-2 label transition-colors hover:bg-acid"
              @click="emit('close')"
            >
              Esc <X :size="18" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-6 flex items-center gap-3 border-b-2 border-ink pb-3 md:mt-10">
            <Search class="shrink-0" :size="28" aria-hidden="true" />
            <label for="search-input" class="sr-only">Search stories, fits and brands</label>
            <input
              id="search-input"
              ref="input"
              v-model="query"
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Stories, fits, brands…"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="search-results"
              :aria-expanded="results.length > 0"
              :aria-activedescendant="results.length ? optionId(active) : undefined"
              class="min-w-0 flex-1 bg-transparent font-display text-3xl font-medium tracking-tight placeholder:text-mute/70 focus:outline-none md:text-6xl [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              v-if="query"
              type="button"
              class="label flex min-h-11 shrink-0 items-center gap-1 px-2 hover:bg-acid"
              @click="clearAndFocus"
            >
              Clear
            </button>
          </div>

          <p class="sr-only" aria-live="polite">
            {{ normalized ? `${results.length} results` : '' }}
          </p>

          <div class="mt-6 min-h-0 flex-1 overflow-y-auto pb-10">
            <div v-if="!normalized">
              <p class="label text-mute">Try</p>
              <ul class="mt-3 flex flex-wrap gap-2">
                <li v-for="term in suggestions" :key="term">
                  <button
                    type="button"
                    class="min-h-11 border border-ink px-4 text-sm transition-colors hover:bg-acid"
                    @click="query = term; input?.focus()"
                  >
                    {{ term }}
                  </button>
                </li>
              </ul>
            </div>

            <div v-else-if="!results.length" class="max-w-xl py-8">
              <p class="font-display text-3xl font-semibold tracking-tight">Nothing found for “{{ query.trim() }}”.</p>
              <p class="mt-3 text-mute">Try a broader word — a category like “streetwear”, a fit name or a brand.</p>
            </div>

            <ul v-else id="search-results" role="listbox" aria-label="Search results" class="border-t border-ink/20">
              <li
                v-for="(result, index) in results"
                :id="optionId(index)"
                :key="`${result.kind}-${result.item.id}`"
                role="option"
                :aria-selected="index === active"
                class="group flex cursor-pointer items-center gap-4 border-b border-ink/20 py-4 transition-colors md:gap-8"
                :class="index === active ? 'bg-acid/60' : 'hover:bg-ink/5'"
                @click="choose(result)"
                @mousemove="active = index"
              >
                <span class="label w-12 shrink-0 pl-2 text-mute md:w-16">{{ kindLabel[result.kind] }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block font-display text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
                    {{ titleOf(result) }}
                  </span>
                  <span class="label mt-1 block text-mute">{{ metaOf(result) }}</span>
                </span>
                <ArrowRight
                  :size="20"
                  class="mr-2 shrink-0 transition-transform"
                  :class="index === active ? 'translate-x-0' : '-translate-x-2 opacity-40'"
                  aria-hidden="true"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
