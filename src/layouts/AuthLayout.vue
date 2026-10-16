<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
</script>

<template>
  <div class="auth-layout d-flex flex-column align-items-center justify-content-center min-vh-100 px-3">
    <AppLogo class="mb-4" />
    <main class="auth-layout__card card w-100">
      <div class="card-body p-4">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout__card {
  max-width: 420px;
}
</style>
