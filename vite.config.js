import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-core",
              test: /node_modules[\\/](?:@reduxjs|react|react-dom|react-redux|react-router|react-router-dom)[\\/]/,
              priority: 20,
            },
            {
              name: "react-icons",
              test: /node_modules[\\/]react-icons[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
