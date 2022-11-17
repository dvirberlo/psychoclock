import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Psycho Clock",
        short_name: "PsychoClock",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "256x256",
            type: "image/x-icon",
          },
          {
            src: "/icons/app/app-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/app/app-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/app/app-128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/app/app-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/app/app-152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/app/app-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/app/app-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/app/app-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        display: "standalone",
      },
    }),
  ],
});
