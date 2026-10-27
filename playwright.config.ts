import { defineConfig, devices } from "@playwright/test";

const AUTH_FILE = "e2e/.auth/user.json";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    retries: 0,
    workers: 1,
    reporter: [["list"], ["html", { open: "never" }]],
    globalSetup: "./e2e/global-setup.ts",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        storageState: AUTH_FILE,
    },
    projects: [
        {
            name: "desktop",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1280, height: 720 },
                storageState: AUTH_FILE,
            },
        },
        {
            name: "tablet",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 768, height: 1024 },
                storageState: AUTH_FILE,
            },
        },
        {
            name: "mobile",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 375, height: 667 },
                storageState: AUTH_FILE,
            },
        },
    ],
});
