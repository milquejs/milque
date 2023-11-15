import { mat4 } from 'gl-matrix';

export class Camera {

  /**
   * @param {mat4} projectionMatrix 
   * @param {mat4} viewMatrix 
   */
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
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    return this;
  }

  /**
   * @param {mat4} out 
   */
  toProjectionViewMatrix(out) {
    return mat4.mul(out, this.projectionMatrix, this.viewMatrix);
  }
}
