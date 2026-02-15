import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SupportDesk - Gestión de Tickets',
        short_name: 'SupportDesk',
        description: 'Sistema profesional de gestión de tickets de soporte técnico con videollamadas WebRTC integradas, chat en tiempo real y seguimiento de albaranes',
        id: '/?source=pwa',
        start_url: '/?source=pwa',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        lang: 'es-ES',
        dir: 'ltr',
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Ver Tickets',
            short_name: 'Tickets',
            description: 'Acceso rápido a la lista de tickets',
            url: '/tickets?source=pwa',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Crear Ticket',
            short_name: 'Nuevo',
            description: 'Crear un nuevo ticket de soporte',
            url: '/tickets?nuevo=true&source=pwa',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Mis Albaranes',
            short_name: 'Albaranes',
            description: 'Ver albaranes y facturas',
            url: '/albaranes?source=pwa',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Dashboard',
            short_name: 'Panel',
            description: 'Panel de control administrativo',
            url: '/dashboard?source=pwa',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutos
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    middlewareMode: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5001',
        ws: true,
      },
    }
  }
})
