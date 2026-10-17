<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton, useNotify } from '@/shared/ui'

const session = useSessionStore()
const router = useRouter()
const notify = useNotify()

function logout(): void {
  session.logout()
  notify.info('You have been signed out.')
  void router.push({ name: 'login' })
}
</script>

<template>
  <AppButton label="Logout" variant="outline-primary" size="small" @click="logout" />
</template>
