import { distPackage } from 'rolldown-plugin-dist-package';
import { defineConfig } from 'tsdown';

const outDir = 'dist';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  outDir: outDir,
  sourcemap: true,
  exports: true,
  fixedExtension: false,
  // unbundle: true,
  plugins: [distPackage({ outDir, removeFields: ['packageManager', 'lint-staged', 'devDependencies', 'scripts'] })],
});

