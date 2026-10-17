<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'
import AppMessage from '../AppMessage/AppMessage.vue'

const {
  title = 'Confirm',
  message = '',
  confirmLabel = 'Так',
  cancelLabel = 'Ні',
  loading = false,
  error = null,
} = defineProps<{
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{ confirm: [] }>()

const isOpen = defineModel<boolean>({ required: true })
</script>

<template>
  <Dialog v-model:visible="isOpen" modal :header="title" :closable="!loading" :style="{ width: '28rem' }">
    <slot>{{ message }}</slot>
    <AppMessage v-if="error" severity="error" class="app-confirm__error">{{ error }}</AppMessage>
    <template #footer>
      <AppButton :label="confirmLabel" variant="danger" :loading="loading" @click="emit('confirm')" />
      <AppButton :label="cancelLabel" variant="secondary" :disabled="loading" @click="isOpen = false" />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.app-confirm__error {
  margin-top: 1rem;
}
</style>
