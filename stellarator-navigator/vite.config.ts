import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    // base: "/~jsoules/QUASR",
    // base: "/~jsoules/test",
    server: {
        watch: {
            ignored: ['**/public/**']
        }
    }
})
