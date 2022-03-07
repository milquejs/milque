export class Camera {
  constructor(projectionMatrix, viewMatrix) {
    this.projectionMatrix = projectionMatrix;
    this.viewMatrix = viewMatrix;
  }

  /**
   * @abstract
   * @param {number} [viewportWidth]
   * @param {number} [viewportHeight]
   * @returns {Camera}
   */
  // eslint-disable-next-line no-unused-vars
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    return this;
  }
}
