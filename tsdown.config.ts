import { defineConfig } from 'tsdown';
import { copyAndFixPackageJson } from './package-json-fix.rolldown';

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
  plugins: [copyAndFixPackageJson({ outDir, removeFields: ['packageManager', 'lint-staged', 'devDependencies', 'scripts'] })],
});

