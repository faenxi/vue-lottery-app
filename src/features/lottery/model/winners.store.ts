import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const MAX_WINNERS = 3

export const useWinnersStore = defineStore('winners', () => {
  const winners = ref<User[]>([])

  const isFull = computed(() => winners.value.length >= MAX_WINNERS)

  /** Переможцем може стати лише той, хто ще не є переможцем. */
  function getCandidates(users: User[]): User[] {
    return users.filter((user) => !winners.value.some((winner) => winner.id === user.id))
  }

  function canDraw(users: User[]): boolean {
    return !isFull.value && getCandidates(users).length > 0
  }

  function draw(users: User[]): void {
    if (!canDraw(users)) return
    const candidates = getCandidates(users)
    const winner = candidates[Math.floor(Math.random() * candidates.length)]
    if (winner) winners.value.push(winner)
  }

  function remove(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  /** Оновлює дані переможця після редагування користувача. */
  function update(user: User): void {
    winners.value = winners.value.map((winner) => (winner.id === user.id ? user : winner))
  }

  return { winners, isFull, canDraw, draw, remove, update }
})
