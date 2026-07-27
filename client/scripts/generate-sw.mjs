import { generateSW } from 'workbox-build';

const OUT_DIR = 'dist/client';

const { count, size, warnings } = await generateSW({
  globDirectory: OUT_DIR,
  globPatterns: ['**/*.{js,css,woff2,png,svg,ico,webmanifest}'],
  swDest: `${OUT_DIR}/sw.js`,
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
});

warnings.forEach((warning) => console.warn(warning));
console.log(`Service worker generated, precaching ${count} files (${size} bytes).`);
