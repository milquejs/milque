/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "plugins": [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-package-json"
  ],
  "importOrder": [
    "<TYPES>",
    "",
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@(/.*)$",
    "",
    "^src(/.*)$",
    "",
    "^res(/.*)$",
    "",
    "^[.]"
  ]
}

export default config;
