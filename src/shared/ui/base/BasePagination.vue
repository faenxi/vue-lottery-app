<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pageCount: number
}>()

const page = defineModel<number>('page', { required: true })

type PageItem = { key: string; page: number | null }

// 1 … 4 5 6 … 20: показуємо першу, останню та сусідні сторінки
const items = computed<PageItem[]>(() => {
  const total = props.pageCount
  const visible = new Set<number>([1, total, page.value - 1, page.value, page.value + 1])
  const sorted = [...visible].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  const result: PageItem[] = []
  sorted.forEach((n, index) => {
    const previous = sorted[index - 1]
    if (previous !== undefined && n - previous > 1) {
      result.push({ key: `gap-${n}`, page: null })
    }
    result.push({ key: `page-${n}`, page: n })
  })
  return result
})

function goTo(target: number): void {
  if (target < 1 || target > props.pageCount || target === page.value) return
  page.value = target
}
</script>

<template>
  <nav v-if="pageCount > 1" aria-label="Pagination">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button type="button" class="page-link" :disabled="page <= 1" aria-label="Previous page" @click="goTo(page - 1)">
          &laquo;
        </button>
      </li>
      <li
        v-for="item in items"
        :key="item.key"
        class="page-item"
        :class="{ active: item.page === page, disabled: item.page === null }"
      >
        <span v-if="item.page === null" class="page-link">&hellip;</span>
        <button v-else type="button" class="page-link" :aria-current="item.page === page ? 'page' : undefined" @click="goTo(item.page)">
          {{ item.page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page >= pageCount }">
        <button
          type="button"
          class="page-link"
          :disabled="page >= pageCount"
          aria-label="Next page"
          @click="goTo(page + 1)"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>
