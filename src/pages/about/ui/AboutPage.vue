<script setup lang="ts">
import { author } from '@/shared/config'
</script>

<template>
  <article class="card">
    <div class="card-body p-4">
      <h1 class="h3 mb-1">{{ author.fullName }}</h1>
      <p class="text-body-secondary">Студент, автор застосунку Vue Lottery</p>

      <h2 class="h5 mt-4">Technical skills</h2>
      <div class="row">
        <section v-for="skill in author.skills" :key="skill.group" class="col-md-6 mb-3">
          <h3 class="h6">{{ skill.group }}</h3>
          <ul class="mb-0">
            <li v-for="item in skill.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>

      <a :href="author.githubUrl" class="btn btn-outline-primary mt-2" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-github me-1" /> GitHub
      </a>
    </div>
  </article>
</template>
