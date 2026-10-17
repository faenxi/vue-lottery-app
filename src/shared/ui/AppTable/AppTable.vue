<script setup lang="ts" generic="T extends object">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { AppTableColumn } from './types'

defineProps<{
  rows: T[]
  columns: AppTableColumn[]
  dataKey?: string
}>()

function cellValue(row: T, field?: string): unknown {
  return field ? (row as Record<string, unknown>)[field] : ''
}

function cellStyle(column: AppTableColumn): string {
  const align = column.align === 'right' ? 'text-align: right;' : ''
  const nowrap = column.nowrap ? 'white-space: nowrap;' : ''
  return align + nowrap
}
</script>

<template>
  <DataTable :value="rows" :data-key="dataKey" class="app-table">
    <Column
      v-for="column in columns"
      :key="column.key"
      :header="column.header"
      :header-style="cellStyle(column)"
      :body-style="cellStyle(column)"
    >
      <template #body="{ data, index }">
        <!-- Вміст клітинки можна замінити слотом cell-<key> -->
        <slot :name="`cell-${column.key}`" :row="data as T" :index="index">
          {{ cellValue(data as T, column.field) }}
        </slot>
      </template>
    </Column>
    <template #empty>
      <slot name="empty">No data.</slot>
    </template>
  </DataTable>
</template>
