import { distPackage } from 'rolldown-plugin-dist-package';
import { defineConfig } from 'tsdown';

const outDir = 'dist';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.fetch.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  outDir: outDir,
  sourcemap: true,
  // Conditional exports (react-native/browser vs. Node) are maintained by hand in package.json
  exports: false,
  fixedExtension: false,
  // unbundle: true,
  plugins: [distPackage({ outDir, removeFields: ['packageManager', 'lint-staged', 'devDependencies', 'scripts'] })],
});

