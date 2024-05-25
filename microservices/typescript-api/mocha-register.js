/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const { register } = require('ts-node');

register({
  files: true,
  transpileOnly: true,
  project: './test/tsconfig.json',
  moduleTypes: ['esm'],
});
