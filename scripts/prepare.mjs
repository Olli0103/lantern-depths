import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('public/licenses', { recursive: true });
copyFileSync('vendor/zork1/COMPILED/zork1.z3', 'public/story.z3');
copyFileSync('node_modules/ifvms/dist/zvm.js', 'public/zvm.js');
copyFileSync('vendor/zork1/LICENSE', 'public/licenses/zork1.txt');
copyFileSync('node_modules/ifvms/LICENSE', 'public/licenses/ifvms.txt');
