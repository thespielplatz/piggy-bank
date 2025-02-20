// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@thespielplatz/nuxt-auth',
    '@thespielplatz/nuxt-dev-base',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      ],
    },
  },
  css: [
    '@/assets/css/global.css',
    '@/assets/css/main.css',
  ],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'footer'],
    },
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-11-01',
  fonts: {
    families: [
      { name: 'Fredoka', provider: 'google' },
      { name: 'Tektur', provider: 'google' },
    ],
    experimental: {
      processCSSVariables: true,
    },
  },
})
