import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4180",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    headless: true,
  },
  webServer: process.env.PLAYWRIGHT_EXISTING_SERVER
    ? undefined
    : {
        command: "npm run dev -- --port 4180",
        url: "http://127.0.0.1:4180/api/health",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
  reporter: "list",
});
