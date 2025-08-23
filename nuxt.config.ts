import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "@waradu/keyboard/nuxt",
    "nuxt-svgo",
    "@nuxtjs/seo",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
  ],

  site: {
    url: "https://games.waradu.dev",
    name: "Games",
    description: "Play minigames",
    defaultLocale: "en",
  },

  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  fonts: {
    provider: "bunny",
    families: [
      {
        name: "Inter",
        provider: "bunny",
        subsets: ["latin"]
      }
    ]
  },

  $production: {
    app: {
      head: {
        script: [
          {
            src: "https://analytics.epilogue.team/api/script.js",
            async: true,
            defer: true,
            "data-site-id": "10",
            "data-web-vitals": "true",
            "data-track-errors": "true",
          },
        ],
      }
    },
  },

  nitro: {
    preset: "bun"
  },

  svgo: {
    autoImportPath: false,
    defaultImport: "component",
    dts: true,
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Games",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { name: "author", content: "Noan" },
        {
          name: "description",
          content: "",
        },
        {
          property: "og:title",
          content: "",
        },
        {
          property: "og:description",
          content: "",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: "",
        },
      ],
    },
  },

  pwa: {
    manifest: {
      name: "Games",
      short_name: "Games",
      theme_color: "#171717",
      background_color: "#171717",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
    }
  },
});