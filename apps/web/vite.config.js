import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// In dev, the web app calls /tasks/* and Vite proxies to the Express server.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Default target is localhost so `npm run dev` works out of the box.
            // In Docker dev, docker-compose.dev.yml sets VITE_API_URL=http://tracker-server:3000
            // (the server container's service name on the compose network), which overrides this.
            '/tasks': {
                target: process.env.VITE_API_URL || 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
