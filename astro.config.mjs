import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  vite: {
    css: {
      postcss: {
        plugins: [
          // Tailwind v4 uses @import "tailwindcss" in the CSS file
          // No additional PostCSS config needed
        ],
      },
    },
  },
})
