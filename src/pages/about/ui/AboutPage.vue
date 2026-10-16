<script setup lang="ts">
import { AppCard, AppLinkButton } from '@/shared/ui'
import { author } from '@/shared/config'
</script>

<template>
  <AppCard>
    <h1>{{ author.fullName }}</h1>
    <p class="text-muted">Студент, автор застосунку Vue Lottery</p>

    <h2 class="about__subtitle">Technical skills</h2>
    <div class="about__skills">
      <section v-for="skill in author.skills" :key="skill.group">
        <h3 class="about__group">{{ skill.group }}</h3>
        <ul class="about__list">
          <li v-for="item in skill.items" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>

    <AppLinkButton :href="author.githubUrl" label="GitHub" icon="pi pi-github" />
  </AppCard>
</template>

<style scoped lang="scss">
.about__subtitle {
  margin-top: 1.5rem;
  font-size: 1.15rem;
}

.about__skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.about__group {
  font-size: 1rem;
}

.about__list {
  padding-left: 1.25rem;
  margin: 0;
}
</style>
