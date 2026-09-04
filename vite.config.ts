import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Honors an assigned PORT (e.g. from a dev harness) so parallel servers can coexist
const PORT = Number(process.env.PORT) || 5173;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: PORT,
    hmr: {
      clientPort: PORT,
    },
    watch: {
      usePolling: false,
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
