/** @param {boolean} condition */
export function assert(condition) {
  if (!condition) {
    window.alert('Assertion failed!');
    throw new Error('Assertion failed!');
  }
}
