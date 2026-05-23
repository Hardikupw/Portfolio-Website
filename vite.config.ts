import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDev = mode === 'development';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Force HMR websocket to use the Vite dev server port.
        // This prevents accidental attempts to connect to unrelated ports (e.g. 8081).
        hmr: isDev
          ? {
              protocol: 'ws',
              host: 'localhost',
              port: 3000,
              clientPort: 3000,
            }
          : false,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
