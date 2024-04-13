import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path, {resolve} from "path";
import libCss from 'vite-plugin-libcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), libCss()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: 'dahongpao-canvas',
      fileName: 'dahongpao-canvas',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          'react': 'React',
        },
        sourcemap: true,
      },
    },
    cssCodeSplit: true,
  }
})
