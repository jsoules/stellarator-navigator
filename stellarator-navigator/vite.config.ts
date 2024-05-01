import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, coverageConfigDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        // note for test: mockReset clears all spies/mocks and resets to empty function,
        // while restoreMocks: true calls .mockRestore() thereby clearing spies & mock
        // history and resets implementations to original implementation.
        // consider logHeapUsage flag/key to diagnose memory leaks.
        mockReset: true,
        coverage: {
            enabled: true,
            exclude: [
                ...coverageConfigDefaults.exclude,
                "**/*Types.ts",
                "index.ts",
                "service/*",
                "dev-dist/*",
                "vite*ts",
                "**/DataDictionary.ts",
                "**/Defaults.ts",
            ],
            include: [
                "src/**/*.ts",
                "src/**/*.tsx"
            ],
            reporter: ['text', 'lcov']
        },
        exclude: [...configDefaults.exclude],
    
    },
    plugins: [react(), tsconfigPaths()],
    // base: "/~jsoules/QUASR",
    // base: "/~jsoules/test",
    server: {
        watch: {
            ignored: ['**/public/**', '**/publicX/**']
        }
    }
})
