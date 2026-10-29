<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import type { Fit } from '../types/content';
import { useScrollReveal } from '../composables/useScrollReveal';
import EditorialImage from './EditorialImage.vue';

defineProps<{ fit: Fit; number: number; offset?: boolean }>();
defineEmits<{ open: [fit: Fit] }>();

const { reveal } = useScrollReveal();
</script>

<template>
  <article v-motion v-bind="reveal(number * 80)" class="group" :class="offset ? 'md:mt-24' : ''">
    <button
      type="button"
      class="block w-full cursor-pointer text-left"
      :aria-label="`View fit: ${fit.title}`"
      @click="$emit('open', fit)"
    >
      <div class="relative">
        <EditorialImage
          :src="fit.image"
          :alt="`${fit.title} — ${fit.description}`"
          ratio="3 / 4"
          sizes="(min-width: 768px) 45vw, 100vw"
          hover
        />
        <span class="label absolute top-3 left-3 flex items-center gap-2 bg-ink px-2 py-1 text-paper">
          <span class="size-1.5 bg-acid" aria-hidden="true" />{{ fit.category }}
        </span>
      </div>
      <div class="mt-4 flex items-start justify-between gap-4 border-b border-ink/20 pb-4">
        <div>
          <p class="label text-mute">Fit {{ String(number).padStart(2, '0') }} — {{ fit.mood }}</p>
          <h3 class="mt-2 font-display text-3xl leading-none font-semibold tracking-tight md:text-4xl">
            <span class="link-draw">{{ fit.title }}</span>
          </h3>
          <p class="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/75">{{ fit.description }}</p>
        </div>
        <span
          class="mt-1 grid size-10 shrink-0 place-items-center border border-ink transition-colors duration-300 group-hover:bg-acid"
          aria-hidden="true"
        >
          <Plus :size="18" />
        </span>
      </div>
    </button>
  </article>
</template>
