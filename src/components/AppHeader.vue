<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Menu, Search, X } from 'lucide-vue-next';
import { navLinks } from '../data/site';
import { useScrollReveal } from '../composables/useScrollReveal';

defineEmits<{ search: [] }>();

const { reducedMotion } = useScrollReveal();
const scrolled = ref(false);
const menuOpen = ref(false);

function onScroll(): void {
  scrolled.value = window.scrollY > 24;
}
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') menuOpen.value = false;
}
function onResize(): void {
  if (window.innerWidth >= 768) menuOpen.value = false;
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,padding] duration-300"
    :class="scrolled || menuOpen ? 'border-b border-ink bg-paper/92 py-2.5 backdrop-blur-md' : 'border-b border-transparent py-4'"
  >
    <a
      href="#main"
      class="label sr-only z-50 bg-acid px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
    >
      Skip to content
    </a>
    <div class="container-editorial flex items-center justify-between gap-6">
      <a href="#top" class="font-display text-xl font-bold tracking-[-0.06em] md:text-2xl" aria-label="OFFGRID — back to top" @click="menuOpen = false">
        OFF<span class="mark-acid">GRID</span>
      </a>

      <nav aria-label="Primary" class="hidden md:block">
        <ul class="flex items-center gap-8">
          <li v-for="(link, i) in navLinks" :key="link.id">
            <a :href="`#${link.id}`" class="group label flex items-baseline gap-1.5 py-2">
              <span class="text-mute transition-colors group-hover:text-ink">0{{ i + 1 }}</span>
              <span class="link-draw">{{ link.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="grid size-11 place-items-center transition-colors hover:bg-acid"
          aria-label="Open search"
          aria-haspopup="dialog"
          @click="menuOpen = false; $emit('search')"
        >
          <Search :size="20" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="grid size-11 place-items-center transition-colors hover:bg-acid md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" aria-hidden="true" />
          <Menu v-else :size="22" aria-hidden="true" />
        </button>
      </div>
    </div>

    <Transition name="fade">
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        aria-label="Mobile"
        class="container-editorial h-[calc(100dvh-4rem)] overflow-y-auto pt-8 pb-10 md:hidden"
      >
        <ul class="border-t border-ink">
          <li
            v-for="(link, i) in navLinks"
            :key="link.id"
            v-motion
            :initial="reducedMotion ? { opacity: 1 } : { opacity: 0, x: -24 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 450, delay: 60 * i } }"
            class="border-b border-ink"
          >
            <a
              :href="`#${link.id}`"
              class="flex items-baseline justify-between py-4 font-display text-5xl font-semibold tracking-[-0.05em] active:bg-acid"
              @click="menuOpen = false"
            >
              {{ link.label }}
              <span class="label text-mute">0{{ i + 1 }}</span>
            </a>
          </li>
        </ul>
        <p class="label mt-8 text-mute">Style outside the lines.</p>
      </nav>
    </Transition>
  </header>
</template>
