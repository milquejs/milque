import { mat4, vec3, quat } from 'gl-matrix';

export class Camera2D {
  static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix) {
    let mat = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
    mat4.invert(mat, mat);
    let result = vec3.fromValues(screenX, screenY, 0);
    vec3.transformMat4(result, result, mat);
    return result;
  }

  constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1) {
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);

    this.clippingPlane = {
      left,
      right,
      top,
      bottom,
      near,
      far,
    };

    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
  }

  get x() {
    return this.position[0];
  }
  set x(value) {
    this.position[0] = value;
  }
  get y() {
    return this.position[1];
  }
  set y(value) {
    this.position[1] = value;
  }
  get z() {
    return this.position[2];
  }
  set z(value) {
    this.position[2] = value;
  }

  /** Moves the camera. This is the only way to change the position. */
  moveTo(x, y, z = 0, dt = 1) {
    let nextPosition = vec3.fromValues(x, y, z);
    vec3.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
  }

  getViewMatrix(out = this._viewMatrix) {
    let viewX = -Math.round(this.x);
    let viewY = -Math.round(this.y);
    let viewZ = this.z === 0 ? 1 : 1 / this.z;
    let invPosition = vec3.fromValues(viewX, viewY, 0);
    let invScale = vec3.fromValues(
      this.scale[0] * viewZ,
      this.scale[1] * viewZ,
      1
    );
    mat4.fromRotationTranslationScale(
      out,
      this.rotation,
      invPosition,
      invScale
    );
    return out;
  }

  getProjectionMatrix(out = this._projectionMatrix) {
    let { left, right, top, bottom, near, far } = this.clippingPlane;
    mat4.ortho(out, left, right, top, bottom, near, far);
    return out;
  }
}
