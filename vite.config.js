import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  define: {
    // Make environment variables available in the app
    "process.env": JSON.stringify(process.env),
  },
});
