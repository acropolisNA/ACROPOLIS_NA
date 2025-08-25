import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build:{
    rollupOptions:{
      input:{
        main: resolve(__dirname,'index.html'),
        asist: resolve(__dirname,'asistencia.html'),
        avanc: resolve(__dirname,'avance.html'),
        cumpl: resolve(__dirname,'cumples.html'),
        indic: resolve(__dirname,'indice.html'),
      }
    }
  }
})