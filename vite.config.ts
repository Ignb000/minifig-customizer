import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015',
    
    // Force CSS extraction
    cssCodeSplit: false,
    
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'customizer.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return 'assets/[name].[ext]'
          }
          
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          
          // Force CSS to customizer.css
          if (ext === 'css') {
            return 'customizer.css'
          }
          
          if (assetInfo.name === 'index.css') {
            return 'customizer.css'
          }
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'assets/[name].[ext]'
          }
          
          return 'assets/[name].[ext]'
        }
      }
    },
    
    assetsInlineLimit: 0,
  },
  
  base: './',
})