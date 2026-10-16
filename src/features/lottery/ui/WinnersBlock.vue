<script setup lang="ts">
import { fullName } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppButton, AppCard } from '@/shared/ui'
import WinnerItem from './WinnerItem.vue'

defineProps<{
  winners: User[]
  isDrawDisabled: boolean
}>()

const emit = defineEmits<{
  draw: []
  'remove-winner': [id: number]
}>()
</script>

<template>
  <AppCard>
    <div class="winners">
      <div class="winners__field">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :name="fullName(winner)"
          @remove="emit('remove-winner', winner.id)"
        />
        <span v-if="winners.length === 0" class="text-muted">Winners</span>
      </div>
      <AppButton label="New winner" :disabled="isDrawDisabled" @click="emit('draw')" />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.winners {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.winners__field {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  min-height: 2.4rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-md);
}
</style>
