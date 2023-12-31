// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    "/websiteSettings/editor": { ssr: false }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API: process.env.API,
      TINYMCE_API_KEY: process.env.TINYMCE_API_KEY
    }
  },
  app: {
    head: {
      title: 'Cart & Tell - Admin',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' }
      ],
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ]
})
