/**
 * @param {import('./KeyCode').KeyCode} keyCode
 */
export function Inverted(keyCode) {
  return Modifier(keyCode, Inverted);
}
/** @type {import('./KeyModifier').KeyModifierTransformer} */
Inverted.transform = function transform(keyCode, prev, value) {
  return prev + (1 - value);
}

/**
 * @param {import('./KeyCode').KeyCode} keyCode
 */
export function Negated(keyCode) {
  return Modifier(keyCode, Negated);
}
/** @type {import('./KeyModifier').KeyModifierTransformer} */
Negated.transform = function transform(keyCode, prev, value) {
  return prev - value;
}

/**
 * @template T
 * @param {import('./KeyCode').KeyCode} keyCode
 * @param {T} keyModifier
 */
function Modifier(keyCode, keyModifier) {
  return {
    key: keyCode,
    mod: keyModifier,
  };
}
