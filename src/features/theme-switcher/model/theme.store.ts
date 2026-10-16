import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

/** Клас на <html>, який вмикає темну тему PrimeVue (див. app/providers/ui.ts) */
const DARK_CLASS = 'app-dark'

function getSystemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Стор теми. Збереження у localStorage робить pinia-plugin-persistedstate
 * (параметр persist), на відміну від session.store.ts, де воно написане вручну.
 */
export const useThemeStore = defineStore(
  'theme',
  () => {
    // Значення за замовчуванням: системна тема. Збережений вибір підставить плагін.
    const theme = ref<Theme>(getSystemTheme())

    const isDark = computed(() => theme.value === 'dark')

    function toggle(): void {
      theme.value = isDark.value ? 'light' : 'dark'
    }

    watch(
      theme,
      (value) => {
        document.documentElement.classList.toggle(DARK_CLASS, value === 'dark')
      },
      { immediate: true },
    )

    return { theme, isDark, toggle }
  },
  {
    persist: { key: 'vue-lottery-theme', pick: ['theme'] },
  },
)
