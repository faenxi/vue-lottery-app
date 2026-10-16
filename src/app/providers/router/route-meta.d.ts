import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Заголовок вкладки браузера */
    title?: string
    /** Сторінка доступна лише авторизованим */
    requiresAuth?: boolean
    /** Сторінка лише для гостей (наприклад, /login) */
    guestOnly?: boolean
    /** Layout сторінки */
    layout?: 'default' | 'auth'
  }
}
