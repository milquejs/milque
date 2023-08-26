/**
 * @typedef KeyModifier
 * @property {import('./KeyCode').KeyCode} key
 * @property {KeyModifierFunction} mod
 */

/**
 * @typedef {(keyCode: import('./KeyCode').KeyCode, prev: number, value: number) => number} KeyModifierTransformer
 */

/**
 * @typedef {((keyCode: import('./KeyCode').KeyCode) => KeyModifier) & {
 *  transform: KeyModifierTransformer
 * }} KeyModifierFunction
 */

/**
 * @param {any} obj
 */
export function isKeyModifier(obj) {
  return 'key' in obj && 'mod' in obj;  
}
