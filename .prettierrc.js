module.exports = {
  semi: true,
  singleQuote: true,
  bracketSameLine: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    './common/autoinstallers/rush-prettier/node_modules/@trivago/prettier-plugin-sort-imports/lib/src/index.js',
  ],
};
