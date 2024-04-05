// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-primevue", "@nuxtjs/tailwindcss"],
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: { from: path.resolve(__dirname, "./presets/lara/") },
  },

  css: [
    // "primevue/resources/themes/aura-light-blue/theme.css",
    "~/assets/css/base.css",
    "primeicons/primeicons.css",
  ],
  runtimeConfig: {
    public: {
      AWS_LOCATION_SERVICE_KEY: process.env.NUXT_AWS_LOCATION_SERVICE,
    },
  },
});
