// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // routeRules: {
  //   "/websiteSettings/editor": { ssr: false }
  // },
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API: process.env.API,
      TINYMCE_API_KEY: process.env.TINYMCE_API_KEY,
      GA_PropertyID: process.env.GA_PropertyID,
      GA_Service_Email: process.env.GA_Service_Email,
      GA_Service_Private_Key: process.env.GA_Service_Private_Key,
    },
  },
  app: {
    head: {
      title: 'Cart & Tell - Admin',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
        { rel: "icon", type: "image/x-icon", href: "/cartAndTell.jpg" }
      ],
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ]
})
