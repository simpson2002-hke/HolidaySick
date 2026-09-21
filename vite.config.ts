import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  // Project Pages are served from /<repository>/; local development stays at /.
  base: process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : '/',
  plugins: [react()],
})
