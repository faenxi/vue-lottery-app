import type { App } from 'vue'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// Тема: Aura з основним кольором застосунку (#3aafd9)
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f9fd',
      100: '#dff1fa',
      200: '#b9e3f4',
      300: '#85cfec',
      400: '#4fb9e0',
      500: '#3aafd9',
      600: '#1e8fb9',
      700: '#19729a',
      800: '#195e7e',
      900: '#1a4e69',
      950: '#10324a',
    },
  },
})

/**
 * Підключення UI-бібліотеки. Компоненти PrimeVue імпортуються окремо в shared/ui
 * (tree-shaking), тому глобальна реєстрація компонентів не потрібна.
 * Темна тема вмикається класом .app-dark на <html>.
 */
export function setupUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: AppPreset,
      options: { darkModeSelector: '.app-dark', cssLayer: false },
    },
  })
  app.use(ToastService)
}
