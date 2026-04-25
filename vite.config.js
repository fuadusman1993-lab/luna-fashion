import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Luna Fashion',
        short_name: 'Luna',
        description: 'Luna Fashion - High-End Luxury Clothing',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: "standalone",
        orientation: "portrait",
        display_override: ["standalone"],
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: '/logo.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
