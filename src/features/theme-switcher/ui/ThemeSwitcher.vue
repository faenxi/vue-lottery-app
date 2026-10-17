<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggle } = themeStore
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    text
    rounded
    aria-label="Toggle light/dark theme"
    @click="toggle"
  />
</template>
