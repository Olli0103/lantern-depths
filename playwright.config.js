import { defineConfig } from '@playwright/test';
const target=process.env.LANTERN_TEST_URL;
export default defineConfig({
  testDir:'./tests/browser',
  use:{baseURL:target??'http://127.0.0.1:4173', headless:true},
  webServer:target?undefined:{command:'npm run dev -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
});
