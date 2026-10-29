import { ref } from 'vue';
import type { MotionVariants } from '@vueuse/motion';

const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const reducedMotion = ref(query?.matches ?? false);
query?.addEventListener('change', (event) => {
  reducedMotion.value = event.matches;
});

type Reveal = MotionVariants<string>;

const EASE = [0.22, 1, 0.36, 1];

/** Motion presets for `v-motion` that collapse to static states when the user prefers reduced motion. */
export function useScrollReveal() {
  const still = (): Reveal => ({ initial: { opacity: 1 }, enter: { opacity: 1 } });

  /** Fade + lift when the element first scrolls into view. */
  function reveal(delay = 0, distance = 28): Reveal {
    if (reducedMotion.value) return still();
    return {
      initial: { opacity: 0, y: distance },
      visibleOnce: { opacity: 1, y: 0, transition: { duration: 700, delay, ease: EASE } }
    };
  }

  /** Slow image development: slight scale-down with fade, on first view. */
  function develop(delay = 0): Reveal {
    if (reducedMotion.value) return still();
    return {
      initial: { opacity: 0, scale: 1.06 },
      visibleOnce: { opacity: 1, scale: 1, transition: { duration: 1100, delay, ease: EASE } }
    };
  }

  /** Load-time entrance (used in the hero, which is visible immediately). */
  function enter(delay = 0, from: { x?: number; y?: number } = { y: 40 }): Reveal {
    if (reducedMotion.value) return still();
    return {
      initial: { opacity: 0, ...from },
      enter: { opacity: 1, x: 0, y: 0, transition: { duration: 900, delay, ease: EASE } }
    };
  }

  /** Subtle image drift on hover. */
  function hoverShift(): Reveal {
    if (reducedMotion.value) return {};
    return {
      initial: { scale: 1, x: 0 },
      hovered: { scale: 1.035, x: -6, transition: { duration: 600, ease: EASE } }
    };
  }

  return { reducedMotion, reveal, develop, enter, hoverShift };
}
