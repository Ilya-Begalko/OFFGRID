<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import type { Story } from '../types/content';
import { formatDate } from '../utils/asset';
import { useScrollReveal } from '../composables/useScrollReveal';
import EditorialImage from './EditorialImage.vue';

const props = withDefaults(
  defineProps<{ story: Story; number: number; variant?: 'lead' | 'tall' | 'wide' | 'compact' }>(),
  { variant: 'compact' }
);

defineEmits<{ open: [story: Story] }>();

const { reveal } = useScrollReveal();

const ratios: Record<NonNullable<typeof props.variant>, string> = {
  lead: '4 / 5',
  tall: '3 / 4',
  wide: '3 / 2',
  compact: '1 / 1'
};
</script>

<template>
  <article v-motion v-bind="reveal(number * 60)" class="group relative">
    <button
      type="button"
      class="block w-full cursor-pointer text-left"
      :aria-label="`Read story: ${story.title}`"
      @click="$emit('open', story)"
    >
      <div class="relative">
        <EditorialImage
          :src="story.image"
          :alt="`Editorial photograph for “${story.title}”`"
          :ratio="ratios[variant]"
          :sizes="variant === 'lead' ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 30vw, 100vw'"
          hover
        />
        <span class="label absolute top-3 left-3 bg-paper px-2 py-1">{{ story.category }}</span>
        <span
          class="absolute right-3 bottom-3 grid size-10 place-items-center bg-acid opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-hidden="true"
        >
          <ArrowUpRight :size="18" />
        </span>
      </div>

      <div class="mt-4 grid grid-cols-[auto_1fr] gap-x-4">
        <span class="label pt-1 text-mute tabular-nums">{{ String(number).padStart(2, '0') }}</span>
        <div>
          <h3
            class="font-display font-semibold tracking-tight text-balance"
            :class="variant === 'lead' ? 'text-4xl leading-[0.95] md:text-6xl' : 'text-2xl leading-none md:text-[1.75rem]'"
          >
            <span class="link-draw">{{ story.title }}</span>
          </h3>
          <p class="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink/75" :class="variant === 'lead' ? 'md:text-lg' : ''">
            {{ story.excerpt }}
          </p>
          <p class="label mt-4 flex gap-3 text-mute">
            <time :datetime="story.date">{{ formatDate(story.date) }}</time>
            <span aria-hidden="true">/</span>
            <span>{{ story.readingTime }} min read</span>
          </p>
        </div>
      </div>
    </button>
  </article>
</template>
