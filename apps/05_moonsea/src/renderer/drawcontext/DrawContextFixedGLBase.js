import { OrthographicCamera } from '@milque/scene';
import { mat4, quat, vec3 } from 'gl-matrix';
import { hex } from '../color.js';

export class DrawContextFixedGLBase {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} [canvas]
   * @param {import('@milque/scene').Camera} [camera]
   */
  constructor(gl, canvas = gl.canvas, camera = new OrthographicCamera()) {
    /** @protected */
    this.gl = gl;
    /** @protected */
    this.canvas = canvas;
    /** @protected */
    this.camera = camera;
    /** @protected */
    this.projectionViewMatrix = mat4.create();
    /** @protected */
    this.modelMatrix = mat4.create();
    /** @protected */
    this.colorVector = vec3.create();
    /** @protected */
    this.depthFloat = 0;
    /** @protected */
    this.opacityFloat = 1;

    /** @protected */
    this.transformStack = [];
    /** @protected */
    this.transformMatrix = mat4.create();
    /** @protected */
    this.translationVector = vec3.create();
    /** @protected */
    this.rotationQuat = quat.create();
    /** @protected */
    this.scaleVector = vec3.fromValues(1, 1, 1);

    // Initialize webgl state machine
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  reset() {
    this.resize();
    this.clear(0, 0, 0, 1);
    this.setColorVector(1, 1, 1);
    this.setDepthFloat(0);
    this.setOpacityFloat(1);
    this.resetTransform();
    this.transformStack.length = 0;
  }

  /**
   * To be called every frame to clear screen buffer and
   * resize camera matrices to fit.
   */
  resize() {
    const gl = this.gl;
    const viewportWidth = gl.canvas.width;
    const viewportHeight = gl.canvas.height;
    gl.viewport(0, 0, viewportWidth, viewportHeight);

    let camera = this.camera;
    camera.resize(viewportWidth, viewportHeight);

    let projViewMatrix = this.projectionViewMatrix;
    mat4.mul(projViewMatrix, camera.projectionMatrix, camera.viewMatrix);
  }

  /**
   * @param {number} redf
   * @param {number} greenf
   * @param {number} bluef
   * @param {number} [alphaf=1]
   */
  clear(redf, greenf, bluef, alphaf = 1) {
    const gl = this.gl;
    gl.clearColor(redf, greenf, bluef, alphaf);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * @param {number} redf
   * @param {number} greenf
   * @param {number} bluef
   */
  setColorVector(redf, greenf, bluef) {
    vec3.set(this.colorVector, redf, greenf, bluef);
    return this;
  }

  /**
   * @param {number} colorHex
   */
  setColor(colorHex) {
    return this.setColorVector(
      hex.redf(colorHex),
      hex.greenf(colorHex),
      hex.bluef(colorHex)
    );
  }

  /** @param {number} z */
  setDepthFloat(z) {
    this.depthFloat = z;
    return this;
  }

  /** @param {number} opacity */
  setOpacityFloat(opacity) {
    this.opacityFloat = opacity;
    return this;
  }

  setTranslation(x, y, z = 0) {
    vec3.set(this.translationVector, x, y, z);
    return this;
  }

  setRotation(angleX, angleY, angleZ) {
    quat.fromEuler(this.rotationQuat, angleX, angleY, angleZ);
    return this;
  }

  setScale(x, y) {
    vec3.set(this.scaleVector, x, y, 1);
    return this;
  }

  resetTransform() {
    vec3.zero(this.translationVector);
    quat.identity(this.rotationQuat);
    vec3.set(this.scaleVector, 1, 1, 1);
  }

  pushTransform() {
    let matrix = mat4.fromRotationTranslationScale(
      mat4.create(),
      this.rotationQuat,
      this.translationVector,
      this.scaleVector
    );
    this.transformStack.push(matrix);
    this.resetTransform();
  }

  popTransform() {
    let matrix = this.transformStack.pop();
    mat4.getRotation(this.rotationQuat, matrix);
    mat4.getTranslation(this.translationVector, matrix);
    mat4.getScaling(this.scaleVector, matrix);
  }

  applyTransform(out) {
    for (let i = this.transformStack.length - 1; i >= 0; --i) {
      mat4.mul(out, this.transformStack[i], out);
    }
    mat4.mul(
      out,
      mat4.fromRotationTranslationScale(
        this.transformMatrix,
        this.rotationQuat,
        this.translationVector,
        this.scaleVector
      ),
      out
    );
    return out;
  }
}
