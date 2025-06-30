// / <reference types="vite/client" />
import 'vite/client' // FIX OF: vite - Property 'env' does not exist on type 'ImportMeta'.ts(2339)

interface ImportMetaEnv {
  readonly VITE_PUSHER_KEY: string
  readonly VITE_PUSHER_CLUSTER: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}