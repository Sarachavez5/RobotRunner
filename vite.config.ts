import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'www',
    assetsDir: 'assets',
    minify: 'esbuild',
    target: 'es2020'
  },
  server: {
    port: 3000,
    host: true
  }
});

