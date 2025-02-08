// https://nuxt.com/docs/api/configuration/nuxt-config
import packageJson from './package.json' assert { type: 'json' }

const packageJsonTyped = packageJson as {
  version: string
  meta?: { 'special-version'?: string }
  homepage?: string
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@thespielplatz/nuxt-auth',
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
  runtimeConfig: {
    public: {
      releasedVersion: packageJsonTyped.version,
      version: packageJsonTyped.meta?.['special-version'] || packageJsonTyped.version,
      githubLink: packageJsonTyped.homepage,
    },
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-11-01',
})
