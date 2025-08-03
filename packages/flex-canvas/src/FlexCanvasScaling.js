/**
 * @param {import('./FlexCanvas').ScalingMode} scalingMode
 * @param {HTMLElement} element
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
export function resizeFor(
  scalingMode,
  element,
  canvas,
  canvasWidth,
  canvasHeight
) {
  const clientRect = element.getBoundingClientRect();
  const clientWidth = clientRect.width;
  const clientHeight = clientRect.height;
  switch (scalingMode) {
    case 'fill':
      resizeForFill(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'fit':
      resizeForFill(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'scale':
      resizeForScale(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'stretch':
      resizeForStretch(
        canvas,
        clientWidth,
        clientHeight
      );
      return;
    case 'noscale':
    default:
      resizeForNoScale(
        element,
        canvasWidth,
        canvasHeight
      );
      return;
  }
}

/**
 * @param {HTMLElement} element
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
export function resizeForNoScale(
  element,
  canvasWidth,
  canvasHeight,
) {
  element.style.setProperty('--width', `${canvasWidth}px`);
  element.style.setProperty('--height', `${canvasHeight}px`);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
export function resizeForScale(
  canvas,
  canvasWidth,
  canvasHeight,
  clientWidth,
  clientHeight
) {
  const ratioX = clientWidth / canvasWidth;
  const ratioY = clientHeight / canvasHeight;
  if (ratioX < ratioY) {
    canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
    canvas.style.setProperty(
      'height',
      `${Math.floor(canvasHeight * ratioX)}px`
    );
  } else {
    canvas.style.setProperty('width', `${Math.floor(canvasWidth * ratioY)}px`);
    canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
export function resizeForStretch(
  canvas,
  clientWidth,
  clientHeight
) {
  canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
  canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
export function resizeForFit(
  canvas,
  canvasWidth,
  canvasHeight,
  clientWidth,
  clientHeight
) {
  const ratioX = clientWidth / canvasWidth;
  const ratioY = clientHeight / canvasHeight;
  if (ratioX < ratioY) {
    canvasWidth = Math.floor(clientWidth);
    canvasHeight = Math.floor(canvasHeight * ratioX);
    canvas.style.setProperty('width', `${canvasWidth}px`);
    canvas.style.setProperty('height', `${canvasHeight}px`);
  } else {
    canvasWidth = Math.floor(canvasWidth * ratioY);
    canvasHeight = Math.floor(clientHeight);
    canvas.style.setProperty('width', `${canvasWidth}px`);
    canvas.style.setProperty('height', `${canvasHeight}px`);
  }
  if (canvas.width !== canvasWidth) {
    canvas.width = canvasWidth;
  }
  if (canvas.height !== canvasHeight) {
    canvas.height = canvasHeight;
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
export function resizeForFill(
  canvas,
  canvasWidth,
  canvasHeight,
  clientWidth,
  clientHeight
) {
  const ratioX = clientWidth / canvasWidth;
  const ratioY = clientHeight / canvasHeight;
  if (ratioX < ratioY) {
    canvasWidth = Math.floor(clientWidth);
    canvasHeight = Math.floor(clientHeight);
    canvas.style.setProperty('width', `${canvasWidth}px`);
    canvas.style.setProperty('height', `${canvasHeight}px`);
  } else {
    canvasWidth = Math.floor(clientWidth);
    canvasHeight = Math.floor(clientHeight);
    canvas.style.setProperty('width', `${canvasWidth}px`);
    canvas.style.setProperty('height', `${canvasHeight}px`);
  }
  if (canvas.width !== canvasWidth) {
    canvas.width = canvasWidth;
  }
  if (canvas.height !== canvasHeight) {
    canvas.height = canvasHeight;
  }
}
