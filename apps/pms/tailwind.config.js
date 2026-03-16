const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const tailwindConfig = require('../../tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindConfig],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
