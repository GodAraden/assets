import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import baseConfig from '../vite.config';

const clientConfig = defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:10086/',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: '../dist/client',
    copyPublicDir: true,
  },
});

export default mergeConfig(baseConfig, clientConfig);
