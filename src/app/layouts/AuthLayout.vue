<script setup lang="ts">
import { AppLogo } from '@/widgets/app-header'
import { AppCard } from '@/shared/ui'
</script>

<template>
  <div class="auth-layout">
    <AppLogo class="auth-layout__logo" />
    <main class="auth-layout__main">
      <AppCard>
        <slot />
      </AppCard>
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-layout__logo {
  margin-bottom: 1.5rem;
}

.auth-layout__main {
  width: 100%;
  max-width: 420px;
}
</style>
