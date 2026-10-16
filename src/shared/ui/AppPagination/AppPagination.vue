<script setup lang="ts">
import Paginator from 'primevue/paginator'

const props = defineProps<{
  total: number
  pageSize: number
}>()

// Нумерація сторінок для застосунку починається з 1 (так само, як у query-параметрі ?page=)
const page = defineModel<number>('page', { required: true })

function onPage(event: { page: number }): void {
  page.value = event.page + 1
}
</script>

<template>
  <Paginator
    v-if="total > pageSize"
    :first="(page - 1) * props.pageSize"
    :rows="pageSize"
    :total-records="total"
    template="PrevPageLink PageLinks NextPageLink"
    @page="onPage"
  />
</template>
