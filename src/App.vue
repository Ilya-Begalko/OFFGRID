<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { ArrowDown, ArrowRight, Check } from 'lucide-vue-next';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import SectionHeading from './components/SectionHeading.vue';
import StoryCard from './components/StoryCard.vue';
import FitCard from './components/FitCard.vue';
import BrandList from './components/BrandList.vue';
import SearchOverlay from './components/SearchOverlay.vue';
import ContentModal from './components/ContentModal.vue';
import EditorialImage from './components/EditorialImage.vue';
import { stories } from './data/stories';
import { fits } from './data/fits';
import { brands } from './data/brands';
import { site } from './data/site';
import { fitFilters, matchesCategory, useContentFilter } from './composables/useContentFilter';
import { useScrollReveal } from './composables/useScrollReveal';
import { formatDate, scrollToSection } from './utils/asset';
import type { Fit, SearchResult, Story } from './types/content';

const { enter, reveal, develop } = useScrollReveal();
const {
  activeCategory,
  activeCategoryLabel,
  activeFit,
  categoriesWithCounts,
  filteredStories,
  filteredFits,
  selectCategory,
  isBrandHighlighted
} = useContentFilter();

const leadStory = stories.find((s) => s.featured) ?? stories[0]!;

type Opened = { kind: 'story'; item: Story } | { kind: 'fit'; item: Fit } | null;
const opened = ref<Opened>(null);
const searchOpen = ref(false);
const focusedBrand = ref<string | null>(null);

function openStory(item: Story): void {
  opened.value = { kind: 'story', item };
}
function openFit(item: Fit): void {
  opened.value = { kind: 'fit', item };
}

const storyLayout = (index: number) => {
  if (index === 0) return { cls: 'md:col-span-7', variant: 'lead' as const };
  if (index === 1) return { cls: 'md:col-span-4 md:col-start-9 md:mt-32', variant: 'tall' as const };
  const offsets = ['', 'xl:mt-20', 'xl:-mt-12'];
  return { cls: `md:col-span-6 xl:col-span-4 ${offsets[(index - 2) % 3]}`, variant: 'compact' as const };
};

function chooseCategory(id: string): void {
  selectCategory(id);
  const storyHits = stories.filter((item) => matchesCategory(item.category, id)).length;
  const fitHits = fits.filter((item) => matchesCategory(item.category, id)).length;
  if (id === 'all' || storyHits) scrollToSection('stories');
  else if (fitHits) scrollToSection('fits');
  else scrollToSection('brands');
}

async function onSearchSelect(result: SearchResult): Promise<void> {
  searchOpen.value = false;
  await nextTick();
  if (result.kind === 'story') openStory(result.item);
  else if (result.kind === 'fit') openFit(result.item);
  else {
    focusedBrand.value = result.item.id;
    const row = document.getElementById(`brand-${result.item.id}`);
    row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    window.setTimeout(() => (focusedBrand.value = null), 2200);
  }
}

const issueDate = computed(() => formatDate(leadStory.date));

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
</script>

<template>
  <div id="top" class="min-h-dvh overflow-x-clip">
    <AppHeader @search="searchOpen = true" />

    <main id="main" tabindex="-1" class="focus:outline-none">
      <!-- HERO -->
      <section aria-labelledby="hero-title" class="container-editorial relative pt-24 md:pt-28">
        <div class="label flex items-center justify-between border-b border-ink pb-3">
          <span v-motion v-bind="enter(100, { y: -12 })" class="flex items-center gap-2">
            <span class="bg-acid px-1.5 py-0.5 text-ink">{{ site.issue }}</span>
            <span class="hidden text-mute sm:inline">Autumn / Winter</span>
          </span>
          <span v-motion v-bind="enter(200, { y: -12 })" class="text-mute">{{ issueDate }}</span>
        </div>

        <div class="relative grid grid-cols-12 gap-x-4 pt-6 md:pt-8">
          <h1
            id="hero-title"
            class="display pointer-events-none relative z-10 col-span-12 text-[clamp(5rem,23vw,22rem)] leading-[0.78] mix-blend-normal md:absolute md:inset-x-0 md:top-[clamp(1rem,6vw,5rem)]"
          >
            <span v-motion v-bind="enter(150, { y: 80 })" class="block">OFF</span>
            <span v-motion v-bind="enter(300, { y: 80 })" class="block pl-[8%] md:pl-[34%]">
              GRID<span class="text-acid [-webkit-text-stroke:2px_var(--color-ink)]">.</span>
            </span>
          </h1>

          <div class="col-span-12 mt-6 md:col-span-4 md:mt-[clamp(18rem,40vw,34rem)] xl:col-span-4">
            <p v-motion v-bind="enter(500)" class="label">{{ site.descriptor }}</p>
            <p v-motion v-bind="enter(600)" class="mt-4 font-display text-3xl leading-none font-medium tracking-tight md:text-4xl">
              Style outside<br />the <span class="mark-acid">lines.</span>
            </p>

            <article v-motion v-bind="enter(750)" class="mt-10 border-t border-ink pt-4">
              <p class="label flex justify-between text-mute">
                <span>Cover story</span><span>{{ leadStory.readingTime }} min</span>
              </p>
              <h2 class="mt-3 font-display text-2xl leading-none font-semibold tracking-tight">{{ leadStory.title }}</h2>
              <p class="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{{ leadStory.excerpt }}</p>
              <button
                type="button"
                class="group label mt-5 inline-flex min-h-11 items-center gap-3 border border-ink px-4 transition-colors hover:bg-ink hover:text-paper"
                @click="openStory(leadStory)"
              >
                Read the story
                <ArrowRight :size="16" class="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </article>
          </div>

          <figure class="relative col-span-12 mt-10 md:col-span-7 md:col-start-6 md:mt-[clamp(6rem,15vw,12rem)] xl:col-span-6 xl:col-start-6">
            <div v-motion v-bind="enter(250, { y: 0 })">
              <EditorialImage
                src="/images/hero-editorial.jpg"
                alt="A man in an oversized sweatshirt and cap stands in a cloud of street steam between Manhattan towers"
                ratio="4 / 5"
                sizes="(min-width: 768px) 55vw, 100vw"
                eager
              />
            </div>
            <figcaption class="label mt-3 flex justify-between text-mute">
              <span>Fig. 01 — Steam, 7th Ave.</span><span>Photo: Unsplash</span>
            </figcaption>
            <span
              v-motion
              v-bind="enter(900, { x: 40 })"
              class="absolute -top-5 -right-1 hidden size-20 bg-acid md:block"
              aria-hidden="true"
            />
            <span
              v-motion
              v-bind="enter(1000, { y: 30 })"
              class="label absolute bottom-24 -left-4 hidden origin-left -rotate-90 bg-paper px-2 py-1 md:block"
              aria-hidden="true"
            >
              Men's style — No. 001
            </span>
          </figure>

          <div class="col-span-12 hidden md:col-span-1 md:col-start-12 md:flex md:items-end md:justify-end xl:col-span-1">
            <a href="#stories" class="label group flex flex-col items-center gap-2">
              <span class="link-draw [writing-mode:vertical-rl]">Scroll</span>
              <ArrowDown :size="16" class="transition-transform group-hover:translate-y-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <!-- LATEST STORIES -->
      <section id="stories" aria-labelledby="stories-title" class="container-editorial mt-24 md:mt-40">
        <SectionHeading
          id="stories-title"
          index="01"
          kicker="Journal"
          :lines="['Latest', 'Stories']"
          note="Short reads on wardrobes, cities and the people building both."
        >
          <div class="col-span-12 flex flex-wrap items-center gap-3 md:col-start-4" aria-live="polite">
            <template v-if="activeCategory !== 'all'">
              <span class="label">Filtered by</span>
              <span class="label flex items-center gap-1.5 bg-acid px-2 py-1"><Check :size="12" aria-hidden="true" />{{ activeCategoryLabel }}</span>
              <button type="button" class="label link-draw min-h-11 px-1 text-mute hover:text-ink" @click="selectCategory('all')">
                Clear filter
              </button>
            </template>
          </div>
        </SectionHeading>

        <TransitionGroup
          v-if="filteredStories.length"
          tag="div"
          name="list"
          class="relative mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-14 md:grid-cols-12 md:gap-y-20"
        >
          <StoryCard
            v-for="(story, index) in filteredStories"
            :key="story.id"
            :story="story"
            :number="stories.indexOf(story) + 1"
            :variant="storyLayout(index).variant"
            :class="storyLayout(index).cls"
            @open="openStory"
          />
        </TransitionGroup>
        <div v-else class="mt-10 border-y border-ink/20 py-12 md:pl-[25%]">
          <p class="font-display text-3xl font-semibold tracking-tight">No stories in {{ activeCategoryLabel }} yet.</p>
          <p class="mt-2 text-mute">The category is covered in Fits and Brands below.</p>
          <button type="button" class="label mt-6 min-h-11 border border-ink px-4 hover:bg-acid" @click="selectCategory('all')">
            Show all stories
          </button>
        </div>
      </section>

      <!-- FITS -->
      <section id="fits" aria-labelledby="fits-title" class="container-editorial mt-28 md:mt-44">
        <SectionHeading
          id="fits-title"
          index="02"
          kicker="Fits"
          :lines="['Built for', 'the city']"
          note="Four outfits, no shopping cart. Just the pieces and the mood."
        >
          <div class="col-span-12 md:col-start-4" role="group" aria-label="Filter fits by category">
            <ul class="flex flex-wrap gap-2">
              <li v-for="filter in fitFilters" :key="filter">
                <button
                  type="button"
                  :aria-pressed="activeFit === filter"
                  class="label flex min-h-11 items-center gap-2 border px-4 transition-colors duration-200"
                  :class="activeFit === filter ? 'border-ink bg-ink text-paper' : 'border-ink/30 hover:border-ink hover:bg-acid'"
                  @click="activeFit = filter"
                >
                  <span class="size-2 transition-colors" :class="activeFit === filter ? 'bg-acid' : 'border border-ink/40'" aria-hidden="true" />
                  {{ filter }}
                </button>
              </li>
            </ul>
          </div>
        </SectionHeading>

        <TransitionGroup tag="div" name="list" class="relative mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-14 md:grid-cols-2 xl:gap-x-24">
          <FitCard
            v-for="(fit, index) in filteredFits"
            :key="fit.id"
            :fit="fit"
            :number="index + 1"
            :offset="index % 2 === 1"
            @open="openFit"
          />
        </TransitionGroup>
      </section>

      <!-- CATEGORIES -->
      <section id="categories" aria-labelledby="categories-title" class="mt-28 bg-ink py-16 text-paper md:mt-44 md:py-24">
        <div class="container-editorial">
          <div class="grid grid-cols-12 gap-x-4 gap-y-6 border-t border-paper/40 pt-4">
            <p class="label col-span-12 md:col-span-3">03 / Index</p>
            <h2 id="categories-title" class="col-span-12 max-w-xl text-paper/70 md:col-span-6">
              Browse by category. Picking one filters the stories, sets the matching fit filter and marks the brands that belong to it.
            </h2>
          </div>

          <ul class="mt-10 md:mt-14">
            <li v-for="(category, i) in categoriesWithCounts" :key="category.id" v-motion v-bind="reveal(i * 40, 12)">
              <button
                type="button"
                :aria-pressed="activeCategory === category.id"
                class="group grid w-full grid-cols-12 items-baseline gap-x-4 border-b border-paper/25 py-3 text-left md:py-4"
                @click="chooseCategory(category.id)"
              >
                <span class="label col-span-2 text-paper/40 tabular-nums md:col-span-1">{{ String(i).padStart(2, '0') }}</span>
                <span
                  class="col-span-10 flex items-center gap-3 font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-acid md:col-span-7"
                  :class="activeCategory === category.id ? 'text-acid' : ''"
                >
                  <span class="link-draw">{{ category.label }}</span>
                  <Check v-if="activeCategory === category.id" :size="28" class="shrink-0" aria-label="selected" />
                </span>
                <span class="col-span-10 col-start-3 text-sm text-paper/60 md:col-span-4 md:col-start-auto">
                  {{ category.description }}
                  <span class="label mt-1 block text-paper/40">
                    {{ countLabel(category.stories, 'story', 'stories') }} ·
                  {{ countLabel(category.fits, 'fit', 'fits') }} ·
                  {{ countLabel(category.brands, 'brand', 'brands') }}
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </section>

      <!-- BRANDS -->
      <section id="brands" aria-labelledby="brands-title" class="container-editorial mt-28 md:mt-44">
        <SectionHeading
          id="brands-title"
          index="04"
          kicker="Watchlist"
          :lines="['Brands', 'we watch']"
          note="Labels whose design language holds up after the trend cycle moves on."
        />
        <div class="mt-10 md:mt-14">
          <BrandList :brands="brands" :is-highlighted="isBrandHighlighted" :focused-id="focusedBrand" />
        </div>
        <p class="label mt-4 text-mute">Independent editorial selection. No affiliation with the brands listed.</p>
      </section>

      <!-- ABOUT -->
      <section id="about" aria-labelledby="about-title" class="container-editorial mt-28 md:mt-44">
        <div class="grid grid-cols-12 gap-x-4 gap-y-10 border-t border-ink pt-4">
          <p class="label col-span-12 md:col-span-3">05 / About OFFGRID</p>
          <div class="col-span-12 md:col-span-9">
            <h2 id="about-title" class="sr-only">About OFFGRID</h2>
            <p
              v-motion
              v-bind="reveal()"
              class="font-display text-[clamp(1.85rem,4.4vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance"
            >
              <span class="mark-acid">OFFGRID</span> explores the intersection of personal style, urban life and contemporary
              design. We look beyond trends to find the pieces, people and ideas shaping the way we dress.
            </p>
          </div>
          <div class="col-span-12 grid grid-cols-12 gap-x-4 md:col-span-9 md:col-start-4">
            <div v-motion v-bind="develop()" class="col-span-12 md:col-span-7">
              <EditorialImage
                src="/images/about-city.jpg"
                alt="Monolithic grey concrete facade against a pale sky"
                ratio="16 / 10"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div class="col-span-12 mt-6 flex flex-col justify-end md:col-span-4 md:col-start-9 md:mt-0">
              <p class="label">{{ site.tagline }}</p>
              <p class="mt-2 text-sm leading-relaxed text-mute">
                Written in the city, edited slowly. Published issue by issue, without a shop attached.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />

    <SearchOverlay :open="searchOpen" @close="searchOpen = false" @select="onSearchSelect" />

    <ContentModal
      :open="opened !== null"
      labelledby="modal-title"
      :kicker="opened?.kind === 'fit' ? 'Fit / Built for the city' : 'Story / OFFGRID Journal'"
      @close="opened = null"
    >
      <article v-if="opened?.kind === 'story'" class="grid grid-cols-1 md:grid-cols-12">
        <div class="md:sticky md:top-[57px] md:col-span-5 md:self-start">
          <EditorialImage :src="opened.item.image" :alt="`Editorial photograph for “${opened.item.title}”`" ratio="4 / 5" sizes="(min-width: 768px) 40vw, 100vw" eager />
        </div>
        <div class="px-5 py-8 md:col-span-7 md:px-10 md:py-12">
          <p class="label flex flex-wrap gap-3">
            <span class="bg-acid px-1.5">{{ opened.item.category }}</span>
            <time class="text-mute" :datetime="opened.item.date">{{ formatDate(opened.item.date) }}</time>
            <span class="text-mute">{{ opened.item.readingTime }} min read</span>
          </p>
          <h2 id="modal-title" class="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9]">{{ opened.item.title }}</h2>
          <p class="mt-6 font-display text-xl leading-snug font-medium tracking-tight md:text-2xl">{{ opened.item.excerpt }}</p>
          <div class="mt-8 space-y-5 border-t border-ink pt-6 text-[1.05rem] leading-[1.75] text-ink/85">
            <p v-for="(paragraph, i) in opened.item.content" :key="i" :class="i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-semibold' : ''">
              {{ paragraph }}
            </p>
          </div>
          <p class="label mt-10 text-mute">— OFFGRID Editorial / {{ site.issue }}</p>
        </div>
      </article>

      <article v-else-if="opened?.kind === 'fit'" class="grid grid-cols-1 md:grid-cols-12">
        <div class="md:sticky md:top-[57px] md:col-span-6 md:self-start">
          <EditorialImage :src="opened.item.image" :alt="`${opened.item.title} — ${opened.item.description}`" ratio="3 / 4" sizes="(min-width: 768px) 45vw, 100vw" eager />
        </div>
        <div class="px-5 py-8 md:col-span-6 md:px-10 md:py-12">
          <p class="label flex flex-wrap gap-3">
            <span class="bg-acid px-1.5">{{ opened.item.category }}</span>
            <span class="text-mute">{{ opened.item.mood }}</span>
          </p>
          <h2 id="modal-title" class="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9]">{{ opened.item.title }}</h2>
          <p class="mt-6 text-lg leading-relaxed text-ink/80">{{ opened.item.description }}</p>
          <h3 class="label mt-10">The pieces</h3>
          <ol class="mt-3 border-t border-ink">
            <li v-for="(piece, i) in opened.item.pieces" :key="piece" class="flex items-baseline gap-4 border-b border-ink/20 py-3">
              <span class="label text-mute tabular-nums">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="font-display text-xl font-medium tracking-tight">{{ piece }}</span>
            </li>
          </ol>
        </div>
      </article>
    </ContentModal>
  </div>
</template>
