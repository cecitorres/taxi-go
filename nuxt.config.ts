// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-primevue"],
  primevue: {},

  css: ["primevue/resources/themes/aura-light-green/theme.css"],
  runtimeConfig: {
    public: {
      AWS_LOCATION_SERVICE_KEY: process.env.NUXT_AWS_LOCATION_SERVICE,
    },
  },
});
