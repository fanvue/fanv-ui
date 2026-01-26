import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), dts({include: ['lib'],
    tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
  })],
  build: {
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    },
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'fanv-ui',
      fileName: 'index',
    },
  },
})
