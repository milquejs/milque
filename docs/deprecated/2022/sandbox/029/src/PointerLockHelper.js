export function enablePointerLockBehavior(targetElement) {
  targetElement.addEventListener('focus', () => {
    if (document.pointerLockElement !== targetElement) {
      targetElement.requestPointerLock();
    }
  });
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== targetElement) {
      targetElement.blur();
    }
  });
}
