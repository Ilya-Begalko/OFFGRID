<script setup lang="ts">
import { Instagram } from 'lucide-vue-next';
import { developerLinks, navLinks, site } from '../data/site';

const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-24 bg-ink text-paper md:mt-40">
    <div class="container-editorial pt-14 pb-8 md:pt-20">
      <div class="grid grid-cols-12 gap-x-4 gap-y-10">
        <div class="col-span-12 md:col-span-7">
          <p class="display text-[clamp(4rem,17vw,15rem)] leading-[0.8]" aria-hidden="true">
            OFF<br /><span class="pl-[0.6em] text-acid">GRID</span>
          </p>
          <p class="sr-only">OFFGRID</p>
        </div>

        <div class="col-span-12 flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
          <nav aria-label="Footer">
            <p class="label text-paper/50">Sections</p>
            <ul class="mt-4 border-t border-paper/25">
              <li v-for="link in navLinks" :key="link.id" class="border-b border-paper/25">
                <a :href="`#${link.id}`" class="flex min-h-12 items-center justify-between font-display text-2xl font-medium tracking-tight transition-colors hover:text-acid">
                  {{ link.label }}<span class="label text-paper/40">↗</span>
                </a>
              </li>
              <li v-if="site.instagram" class="border-b border-paper/25">
                <a
                  :href="site.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex min-h-12 items-center justify-between font-display text-2xl font-medium tracking-tight hover:text-acid"
                >
                  Instagram <Instagram :size="18" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
          <div class="label flex justify-between text-paper/60">
            <span>{{ site.tagline }}</span>
            <span>© {{ year }}</span>
          </div>
        </div>
      </div>

      <div class="mt-16 flex flex-col gap-5 border-t border-paper/25 pt-6 md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-paper/70">
          Designed and developed by <span class="text-paper">Ilya Begalko</span>.
        </p>
        <ul class="flex flex-wrap gap-x-2 gap-y-2" aria-label="Developer links">
          <li v-for="link in developerLinks" :key="link.label">
            <a
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              class="label flex min-h-11 items-center gap-2 border border-paper/25 px-3 transition-colors hover:border-acid hover:bg-acid hover:text-ink"
            >
              <component :is="link.icon" :size="15" aria-hidden="true" />
              <span>{{ link.label }}</span>
              <span v-if="link.external" class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
