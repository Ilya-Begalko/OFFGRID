<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import type { Brand } from '../types/content';
import { useScrollReveal } from '../composables/useScrollReveal';
import EditorialImage from './EditorialImage.vue';

defineProps<{
  brands: Brand[];
  isHighlighted: (category: string) => boolean;
  /** Brand flashed after being picked from search. */
  focusedId?: string | null;
}>();

const { reveal } = useScrollReveal();
</script>

<template>
  <ol class="border-t border-ink">
    <li
      v-for="(brand, i) in brands"
      :id="`brand-${brand.id}`"
      :key="brand.id"
      v-motion
      v-bind="reveal(i * 50, 16)"
      class="group relative border-b border-ink"
    >
      <a
        :href="brand.website"
        target="_blank"
        rel="noopener noreferrer"
        class="relative grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-5 transition-colors duration-300 hover:bg-acid focus-visible:bg-acid md:py-7"
        :class="[
          isHighlighted(brand.category) ? 'bg-acid/45' : '',
          focusedId === brand.id ? 'bg-acid' : ''
        ]"
      >
        <span class="label col-span-2 pl-1 text-mute tabular-nums md:col-span-1">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="col-span-10 font-display text-[clamp(2rem,6vw,5rem)] leading-[0.9] font-semibold tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-3 md:col-span-6">
          {{ brand.name }}
        </span>
        <span class="col-span-10 col-start-3 text-sm leading-relaxed text-ink/75 md:col-span-4 md:col-start-auto">
          <span class="label mb-2 flex items-center gap-2 text-ink">
            <span v-if="isHighlighted(brand.category)" class="size-1.5 bg-ink" aria-hidden="true" />
            {{ brand.category }}
          </span>
          {{ brand.description }}
        </span>
        <span class="col-span-12 flex justify-end pr-1 md:col-span-1" aria-hidden="true">
          <ArrowUpRight :size="22" class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
        <span class="sr-only">— visit official site (opens in a new tab)</span>
      </a>
      <div
        v-if="brand.image"
        class="pointer-events-none absolute top-1/2 right-[18%] z-10 hidden w-44 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 xl:block"
        aria-hidden="true"
      >
        <EditorialImage :src="brand.image" alt="" ratio="4 / 5" sizes="176px" />
      </div>
    </li>
  </ol>
</template>
