/**
 * @param {import('./FlexCanvas').SizingMode} containerType 
 * @param {HTMLElement} element
 */
export function matchDimensionTo(containerType, element) {
  switch(containerType) {
    case 'none':
      matchDimensionToNone(element);
      return;
    case 'container':
      matchDimensionToContainer(element);
      return;
    case 'viewport':
      matchDimensionToViewport(element);
      return;
    default:
      // NOTE: This is not a known sizing value, skip it.
  }
}

/**
 * @param {HTMLElement} element 
 */
export function matchDimensionToNone(element) {
  element.style.removeProperty('width');
  element.style.removeProperty('height');
}

/**
 * @param {HTMLElement} element 
 */
export function matchDimensionToContainer(element) {
  element.style.setProperty('width', '100%');
  element.style.setProperty('height', '100%');
}

/**
 * @param {HTMLElement} element 
 */
export function matchDimensionToViewport(element) {
  element.style.setProperty('width', '100vw');
  element.style.setProperty('height', '100vh');
}
