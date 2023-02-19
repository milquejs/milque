import { mat4 } from 'gl-matrix';
import { Camera } from './Camera.js';

const DEFAULT_FOVY = Math.PI / 3;

export function createPerspectiveCamera(
  canvas,
  fieldOfView = DEFAULT_FOVY,
  near = 0.1,
  far = 1000
) {
  return new PerspectiveCamera(canvas, fieldOfView, near, far);
}

export class PerspectiveCamera extends Camera {
  constructor(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
    super(canvas, mat4.create(), mat4.create());

    this.fieldOfView = fieldOfView;
    this.clippingPlane = {
      near,
      far,
    };
  }

  /** @override */
  resize() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const { near, far } = this.clippingPlane;
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      aspectRatio,
      near,
      far
    );
  }
}
