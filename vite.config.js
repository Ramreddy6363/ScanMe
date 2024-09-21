// vite.config.js
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: 'ScanMe || QR Code Scanner and Generator',
        short_name: 'ScanMe',
        description: 'A simple QR code scanner and generator',
        theme_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: '/public/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/public/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      registerType: 'autoUpdate', // Automatically updates the service worker
      devOptions: {
        enabled: true // Enable PWA in development mode
      }
    })
  ]
});
