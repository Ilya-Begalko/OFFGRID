<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { asset } from '../utils/asset';
import { useScrollReveal } from '../composables/useScrollReveal';

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    /** CSS aspect-ratio, e.g. "4 / 5". Reserves space so the layout never jumps. */
    ratio?: string;
    eager?: boolean;
    hover?: boolean;
    sizes?: string;
  }>(),
  { ratio: '4 / 5', eager: false, hover: false, sizes: '(min-width: 1280px) 50vw, 100vw' }
);

const { hoverShift } = useScrollReveal();
const failed = ref(false);
const loaded = ref(false);
const url = computed(() => asset(props.src));

watch(
  () => props.src,
  () => {
    failed.value = false;
    loaded.value = false;
  }
);
</script>

<template>
  <div class="relative overflow-hidden bg-[#e4e1d8]" :style="{ aspectRatio: ratio }">
    <img
      v-if="!failed"
      v-motion
      v-bind="hover ? hoverShift() : {}"
      :src="url"
      :alt="alt"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      width="1300"
      height="1625"
      class="absolute inset-0 h-full w-full object-cover grayscale-[15%] transition-opacity duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
      @error="failed = true"
    />
    <div
      v-else
      role="img"
      :aria-label="alt"
      class="absolute inset-0 flex flex-col justify-between p-4 text-mute"
    >
      <span class="label">Image unavailable</span>
      <span class="display text-4xl text-ink/15">OFFGRID</span>
    </div>
  </div>
</template>
