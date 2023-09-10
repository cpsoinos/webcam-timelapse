import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['./src/main.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
  target: 'node10',
  noExternal: ['@anthonylzq/node-webcam', '@aws-sdk/client-s3'],
  // minify: !options.watch
}))
