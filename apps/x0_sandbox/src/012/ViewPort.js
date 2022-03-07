/**
 * A viewport for a display output. This serves as the output dimensions of a view.
 * @param {HTMLElement} canvasElement The output canvas (or the display).
 * @param {RenderingContext} canvasContext The output canvas context.
 */
export class ViewPort {
  constructor(canvasElement, canvasContext) {
    this._canvas = canvasElement;
    this._context = canvasContext;
  }

  // NOTE: We use function getters instead of property getters here because
  // this can easily be overridden for a different implementation. These
  // values are expected to support both computed and stored values. Whereas
  // property getters imply a static, or stored, value.

  /** The x position offset in the output. */
  getX() {
    return 0;
  }
  /** The y position offset in the output. */
  getY() {
    return 0;
  }
  /** The width of the viewport in the output. */
  getWidth() {
    return this._canvas.clientWidth;
  }
  /** The height of the viewport in the output. */
  getHeight() {
    return this._canvas.clientHeight;
  }

  /** The output canvas element. */
  getCanvas() {
    return this._canvas;
  }
  /** The output canvas context. */
  getContext() {
    return this._context;
  }
}
