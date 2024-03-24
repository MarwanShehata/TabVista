const postcssPruneVar = require('postcss-prune-var');
const postcssSorting = require('postcss-sorting');

module.exports = {
  plugins: {
    'postcss-nesting': {},
    autoprefixer: {},
    cssnano: {
      preset: 'advanced',
    },
    'postcss-prune-var': postcssPruneVar(),
    'postcss-sorting': postcssSorting(),
  },
};
