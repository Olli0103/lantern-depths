import {defineConfig} from '@playwright/test';
import base from './playwright.config.js';
export default defineConfig({...base,
 testMatch:['responsive.spec.js','opening.spec.js','staging.spec.js','cinematic.spec.js','visual-regressions.spec.js'],
 use:{...base.use,browserName:'webkit'},
});
