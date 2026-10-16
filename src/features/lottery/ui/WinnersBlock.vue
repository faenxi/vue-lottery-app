<script setup lang="ts">
import { BaseButton } from '@/shared/ui'
import type { User } from '@/types/user'
import { fullName } from '@/entities/user'
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
  <section class="card mb-3">
    <div class="card-body d-flex gap-3 align-items-start">
      <div class="winners-field form-control flex-grow-1">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :name="fullName(winner)"
          @remove="emit('remove-winner', winner.id)"
        />
        <span v-if="winners.length === 0" class="text-body-secondary">Winners</span>
      </div>
      <BaseButton :disabled="isDrawDisabled" @click="emit('draw')">New winner</BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.winners-field {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  min-height: 2.4rem;
  background: #fff;
}
</style>
