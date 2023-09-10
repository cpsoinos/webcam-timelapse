declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLOUDFLARE_ACCOUNT_ID: string
      R2_ACCESS_KEY_ID: string
      R2_SECRET_ACCESS_KEY: string
      R2_BUCKET: string
    }
  }
}

export {}
