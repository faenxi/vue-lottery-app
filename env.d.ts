/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API (DummyJSON) */
  readonly VITE_API_URL: string
  /** Час життя accessToken у хвилинах (необов'язково) */
  readonly VITE_TOKEN_EXPIRES_IN_MINS?: string
  /** Базовий шлях для збірки (gh-pages), необов'язково */
  readonly VITE_BASE_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
