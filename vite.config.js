import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // or any other framework plugin you're using

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ["**/*.glb", "**/*.hdr"], // Add this line if not already present
});
