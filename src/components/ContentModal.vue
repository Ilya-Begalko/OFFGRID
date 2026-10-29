<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { useScrollReveal } from '../composables/useScrollReveal';

const props = defineProps<{ open: boolean; labelledby: string; kicker?: string }>();
const emit = defineEmits<{ close: [] }>();

const { reducedMotion } = useScrollReveal();
const panel = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let returnFocus: HTMLElement | null = null;

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    return;
  }
  if (event.key !== 'Tab' || !panel.value) return;
  const nodes = Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!nodes.length) return;
  const first = nodes[0]!;
  const last = nodes[nodes.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function lockScroll(lock: boolean): void {
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = lock ? 'hidden' : '';
  document.body.style.paddingRight = lock && scrollbar > 0 ? `${scrollbar}px` : '';
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      returnFocus = document.activeElement as HTMLElement | null;
      lockScroll(true);
      document.addEventListener('keydown', onKeydown);
      await nextTick();
      panel.value?.scrollTo({ top: 0 });
      closeButton.value?.focus({ preventScroll: true });
    } else {
      lockScroll(false);
      document.removeEventListener('keydown', onKeydown);
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    }
  }
);

onBeforeUnmount(() => {
  lockScroll(false);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
        <div class="modal-backdrop absolute inset-0 bg-ink/55" aria-hidden="true" @click="emit('close')" />
        <div
          ref="panel"
          v-motion
          :initial="reducedMotion ? { opacity: 1 } : { opacity: 0, x: 60 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 550, ease: [0.22, 1, 0.36, 1] } }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelledby"
          class="modal-panel relative flex h-full w-full flex-col overflow-y-auto overscroll-contain bg-paper md:w-[min(92vw,1080px)] md:border-l md:border-ink"
        >
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-ink bg-paper px-5 py-3 md:px-8">
            <p class="label">{{ kicker ?? 'OFFGRID' }}</p>
            <button
              ref="closeButton"
              type="button"
              class="flex min-h-11 items-center gap-2 px-2 label transition-colors hover:bg-acid"
              @click="emit('close')"
            >
              Close <X :size="18" aria-hidden="true" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.35s ease;
}
.modal-leave-active .modal-panel {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to .modal-panel {
  transform: translateX(48px);
}
</style>
