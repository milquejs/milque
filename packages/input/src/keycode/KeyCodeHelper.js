import { KeyCode } from './KeyCode.js';
import { KeyCodes } from './index.js';

/**
 * @param {string|Array<string>} strings
 * @returns {Array<KeyCode>}
 */
export function stringsToKeyCodes(strings) {
  if (!Array.isArray(strings)) {
    strings = [strings];
  }
  let result = [];
  for (let str of strings) {
    let keyCode;
    try {
      keyCode = KeyCode.parse(str);
    } catch (e) {
      let keyName = camelToSnakeCase(str).toUpperCase();
      if (!(keyName in KeyCodes)) {
        throw new Error('Invalid key code string - ' + e);
      }
      keyCode = KeyCodes[keyName];
    }
    result.push(keyCode);
  }
  return result;
}

/**
 * @param {string} str
 * @returns {string}
 */
function camelToSnakeCase(str) {
  return str
    .replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g, function (_, a, b) {
      return a + (b && '_' + b);
    })
    .toLowerCase();
}
