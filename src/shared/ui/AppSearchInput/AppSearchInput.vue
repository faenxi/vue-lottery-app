<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

defineProps<{
  placeholder?: string
  ariaLabel?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <IconField>
    <InputIcon class="pi pi-search" />
    <InputText v-model="model" type="search" :placeholder="placeholder" :aria-label="ariaLabel" fluid />
  </IconField>
</template>
