import { useToast } from 'primevue/usetoast'

/** Повідомлення про результат операцій. <AppToast /> має бути підключений один раз у App.vue. */
export function useNotify() {
  const toast = useToast()

  return {
    success: (detail: string, summary = 'Success') =>
      toast.add({ severity: 'success', summary, detail, life: 4000 }),
    error: (detail: string, summary = 'Error') =>
      toast.add({ severity: 'error', summary, detail, life: 6000 }),
    info: (detail: string, summary = 'Info') => toast.add({ severity: 'info', summary, detail, life: 4000 }),
  }
}
