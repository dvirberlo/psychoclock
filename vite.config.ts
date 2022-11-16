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
            src: "/icons/app-black.svg",
            sizes: "400x400",
            type: "image/svg+xml",
          },
          {
            src: "/favicon.ico",
            sizes: "256x256",
            type: "image/x-icon",
          },
        ],
        display: "standalone",
      },
    }),
  ],
});
