import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "motion-v/nuxt", "@nuxt/fonts"],

  fonts: {
    provider: "bunny",
  },

  vite: { plugins: [tailwindcss()] },

  css: ["~/assets/css/main.css"],
});
