/**
 * @param {string} searchString
 * @returns {any}
 */
export function getURLParameters(searchString = window.location.search) {
  return Object.fromEntries(new URLSearchParams(searchString).entries());
}
