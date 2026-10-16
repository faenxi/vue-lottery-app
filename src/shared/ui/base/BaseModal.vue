<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
}>()

const isOpen = defineModel<boolean>({ required: true })
const dialogRef = ref<HTMLElement | null>(null)

function close(): void {
  isOpen.value = false
}

// Фокус на вікні, щоб працював @keydown.esc
function focusDialog(): void {
  dialogRef.value?.focus()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal" @after-enter="focusDialog">
      <div v-if="isOpen">
        <div class="modal-backdrop show" />
        <div
          ref="dialogRef"
          class="modal d-block"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          @keydown.esc="close"
          @click.self="close"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title fs-5">
                  <slot name="header">{{ title }}</slot>
                </h2>
                <button type="button" class="btn-close" aria-label="Close" @click="close" />
              </div>
              <div class="modal-body">
                <slot />
              </div>
              <div v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity 0.2s ease;
}

.app-modal-enter-from,
.app-modal-leave-to {
  opacity: 0;
}
</style>
