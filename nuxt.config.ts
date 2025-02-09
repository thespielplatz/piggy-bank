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
  ],
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-11-01',
})
