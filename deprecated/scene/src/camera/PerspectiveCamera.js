import { mat4 } from 'gl-matrix';

import { Camera } from './Camera.js';

const DEFAULT_FOVY = Math.PI / 3;

export class PerspectiveCamera extends Camera {
  constructor(fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
    super(mat4.create(), mat4.create());

    this.fieldOfView = Number(fieldOfView);
    this.clippingPlane = {
      near: Number(near),
      far: Number(far),
    };
  }

  /** @override */
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    const aspectRatio =
      typeof viewportWidth === 'undefined' ? 1 : viewportWidth / viewportHeight;
    const { near, far } = this.clippingPlane;
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      aspectRatio,
      near,
      far,
    );
    return this;
  }
}
