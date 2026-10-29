<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal';

defineProps<{
  id: string;
  index: string;
  /** Each entry renders on its own line — lets headings break in unexpected places. */
  lines: string[];
  kicker: string;
  note?: string;
}>();

const { reveal } = useScrollReveal();
</script>

<template>
  <header class="grid grid-cols-12 gap-x-4 gap-y-6 border-t border-ink pt-4 md:pt-5">
    <div class="col-span-12 flex items-baseline justify-between md:col-span-3 md:block">
      <p class="label">{{ index }} / {{ kicker }}</p>
      <p v-if="note" class="label mt-0 text-mute md:mt-3 md:max-w-[16rem] md:normal-case md:tracking-normal md:text-sm md:font-normal">
        {{ note }}
      </p>
    </div>
    <h2
      :id="id"
      v-motion
      v-bind="reveal()"
      class="display col-span-12 text-[clamp(2.75rem,9vw,8.5rem)] uppercase md:col-span-9"
    >
      <span
        v-for="(line, i) in lines"
        :key="line"
        class="block"
        :class="i % 2 === 1 ? 'pl-[12%]' : ''"
      >{{ line }}</span>
    </h2>
    <slot />
  </header>
</template>
