/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_FORMSPREE_ID: string
  // ... другие переменные если есть
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}