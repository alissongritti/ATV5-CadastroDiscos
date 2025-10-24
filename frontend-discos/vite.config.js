import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // Redireciona qualquer requisição que comece com /api
      "/api": {
        target: "http://localhost:3000", // A URL do seu backend
        changeOrigin: true, // Necessário para o proxy funcionar
        // Reescreve a URL: remove /api antes de enviar para o backend
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
