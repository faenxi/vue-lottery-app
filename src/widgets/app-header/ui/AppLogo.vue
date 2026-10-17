<template>
  <RouterLink :to="{ name: 'home' }" class="app-logo" aria-label="Vue Lottery, home">
    <span class="app-logo__mark"><i class="pi pi-trophy" /></span>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--p-text-color);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

.app-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  color: var(--p-primary-contrast-color);
  background: var(--p-primary-color);
  border-radius: 0.5rem;
}
</style>
