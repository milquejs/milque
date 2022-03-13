import {
  BufferHelper,
  BufferInfoBuilder,
  ProgramInfoBuilder,
} from '@milque/mogli';
import { mat3, mat4, quat, vec3 } from 'gl-matrix';
import { DrawContextFixedGLBase } from './DrawContextFixedGLBase.js';

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main() {
    gl_Position = u_projection_view * u_model * vec4(a_position.xy, 0.0, 1.0);
}`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform vec3 u_color;
uniform float u_opacity_inv;

void main() {
    gl_FragColor = vec4(u_color.rgb, 1.0 - u_opacity_inv);
}`;

export const CIRCLE_ITERATIONS = 16;
export const CIRCLE_VERTICES = (() => {
  let result = [];
  let iterations = CIRCLE_ITERATIONS;
  let rads = (Math.PI * 2) / iterations;
  let prevX = 1,
    prevY = 0;
  let nextX, nextY;
  for (let i = 0; i <= iterations; ++i) {
    nextX = Math.cos(i * rads);
    nextY = Math.sin(i * rads);
    result.push(0, 0);
    result.push(prevX, prevY);
    result.push(nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  }
  return result;
})();
export const CIRCLE_VERTEX_COUNT = Math.trunc(CIRCLE_VERTICES.length / 2);
export const LINE_CIRCLE_VERTICES = (() => {
  let result = [];
  let iterations = CIRCLE_ITERATIONS;
  let rads = (Math.PI * 2) / iterations;
  let prevX = 1,
    prevY = 0;
  let nextX, nextY;
  for (let i = 0; i <= iterations; ++i) {
    nextX = Math.cos(i * rads);
    nextY = Math.sin(i * rads);
    result.push(prevX, prevY);
    result.push(nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  }
  return result;
})();
export const LINE_CIRCLE_VERTEX_COUNT = Math.trunc(
  LINE_CIRCLE_VERTICES.length / 2
);
export const HALF_CIRCLE_ITERATIONS = CIRCLE_ITERATIONS / 2;
export const HALF_CIRCLE_VERTICES = (() => {
  let result = [];
  let iterations = HALF_CIRCLE_ITERATIONS;
  let rads = Math.PI / iterations;
  let prevX = 1,
    prevY = 0;
  let nextX, nextY;
  for (let i = 0; i <= iterations; ++i) {
    nextX = Math.cos(i * rads);
    nextY = Math.sin(i * rads);
    result.push(0, 0);
    result.push(prevX, prevY);
    result.push(nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  }
  return result;
})();
export const HALF_CIRCLE_VERTEX_COUNT = Math.trunc(HALF_CIRCLE_VERTICES.length / 2);
export const QUAD_VERTICES = [
  // Top-Left
  0, 0, 1, 0, 0, 1,
  // Bottom-Right
  1, 1, 1, 0, 0, 1,
];
export const LINE_VERTICES = [0, 0, 1, 1];

export class DrawContextFixedGLShape extends DrawContextFixedGLBase {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} [canvas]
   * @param {import('@milque/scene').Camera} [camera]
   */
  constructor(gl, canvas = undefined, camera = undefined) {
    super(gl, canvas, camera);
    /** @protected */
    this.shapeProgram = new ProgramInfoBuilder(gl)
      .shader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
      .shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)
      .link();
    /** @protected */
    this.meshQuad = new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
      .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
      .build();
    /** @protected */
    this.meshLine = new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
      .data(BufferHelper.createBufferSource(gl, gl.FLOAT, LINE_VERTICES))
      .build();
    /** @protected */
    this.meshCircle = new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
      .data(BufferHelper.createBufferSource(gl, gl.FLOAT, CIRCLE_VERTICES))
      .build();
    /** @protected */
    this.meshLineCircle = new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
      .data(BufferHelper.createBufferSource(gl, gl.FLOAT, LINE_CIRCLE_VERTICES))
      .build();
    /** @protected */
    this.meshHalfCircle = new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
      .data(BufferHelper.createBufferSource(gl, gl.FLOAT, HALF_CIRCLE_VERTICES))
      .build();
  }

  /** @override */
  resize() {
    super.resize();
    this.shapeProgram
      .bind(this.gl)
      .uniform('u_projection_view', this.projectionViewMatrix);
  }

  /** @override */
  setColorVector(redf, greenf, bluef) {
    super.setColorVector(redf, greenf, bluef);
    this.shapeProgram.bind(this.gl).uniform('u_color', this.colorVector);
    return this;
  }

  /** @override */
  setOpacityFloat(opacity) {
    super.setOpacityFloat(opacity);
    this.shapeProgram
      .bind(this.gl)
      .uniform('u_opacity_inv', 1 - this.opacityFloat);
    return this;
  }

  drawLine(fromX = 0, fromY = 0, toX = fromX + 16, toY = fromY) {
    const gl = this.gl;
    let z = this.depthFloat;
    let dx = toX - fromX;
    let dy = toY - fromY;
    let modelMatrix = this.modelMatrix;
    mat4.fromRotationTranslationScale(
      modelMatrix,
      quat.create(),
      vec3.fromValues(fromX, fromY, z),
      vec3.fromValues(dx, dy, 1)
    );
    this.applyTransform(modelMatrix);
    this.shapeProgram
      .bind(gl)
      .attribute('a_position', gl.FLOAT, this.meshLine.handle)
      .uniform('u_model', modelMatrix)
      .draw(gl, gl.LINES, 0, 2);
    return this;
  }

  drawQuadratic(fromX = 0, fromY = 0, toX = fromX + 16, toY = fromY, height = 16, segments = 9) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const centerX = dx / 2 + fromX;
    const centerY = dy / 2 + fromY + height;
    let p = [
      fromX, fromY, centerX, centerY, toX, toY
    ];
    findQuadraticPoints(p, p, segments);
    let l = p.length;
    for(let i = 2; i <= l - 2; i += 2) {
      this.drawLine(p[i - 2], p[i - 1], p[i], p[i + 1]);
    }
  }

  drawRay(x = 0, y = 0, angle = 0, length = 16) {
    let radians = (Math.PI * angle) / 180;
    return this.drawLine(
      x,
      y,
      x + Math.cos(radians) * length,
      y + Math.sin(radians) * length
    );
  }

  drawBox(x = 0, y = 0, rx = 8, ry = rx) {
    return this.drawBoxImpl(this.gl.TRIANGLES, x, y, this.depthFloat, rx, ry);
  }

  drawLineBox(x = 0, y = 0, rx = 8, ry = rx) {
    return this.drawBoxImpl(this.gl.LINE_LOOP, x, y, this.depthFloat, rx, ry);
  }

  drawRect(left = 0, top = 0, right = 16, bottom = 16) {
    let halfw = (right - left) / 2;
    let halfh = (bottom - top) / 2;
    return this.drawBox(left + halfw, top + halfh, halfw, halfh);
  }

  drawLineRect(left = 0, top = 0, right = 16, bottom = 16) {
    let halfw = (right - left) / 2;
    let halfh = (bottom - top) / 2;
    return this.drawLineBox(left + halfw, top + halfh, halfw, halfh);
  }

  drawCircle(x = 0, y = 0, r = 8) {
    return this.drawCircleImpl(
      this.meshCircle,
      CIRCLE_VERTEX_COUNT,
      this.gl.TRIANGLES,
      x,
      y,
      this.depthFloat,
      r
    );
  }

  drawLineCircle(x = 0, y = 0, r = 8) {
    return this.drawCircleImpl(
      this.meshLineCircle,
      LINE_CIRCLE_VERTEX_COUNT,
      this.gl.LINE_LOOP,
      x,
      y,
      this.depthFloat,
      r
    );
  }

  drawHalfCircle(x = 0, y = 0, r = 8) {
    return this.drawCircleImpl(
      this.meshHalfCircle, HALF_CIRCLE_VERTEX_COUNT,
      this.gl.TRIANGLES, x, y, this.depthFloat, r);
  }

  /** @private */
  drawBoxImpl(drawMode, x, y, z, rx, ry) {
    const gl = this.gl;
    let modelMatrix = this.modelMatrix;
    mat4.fromRotationTranslationScaleOrigin(
      modelMatrix,
      quat.create(),
      vec3.fromValues(x, y, z),
      vec3.fromValues(rx * 2, ry * 2, 1),
      vec3.fromValues(0.5, 0.5, 0)
    );
    this.applyTransform(modelMatrix);
    this.shapeProgram
      .bind(gl)
      .attribute('a_position', gl.FLOAT, this.meshQuad.handle)
      .uniform('u_model', modelMatrix)
      .draw(gl, drawMode, 0, 6);
    return this;
  }

  /** @private */
  drawCircleImpl(mesh, vertexCount, drawMode, x, y, z, r) {
    const gl = this.gl;
    let modelMatrix = this.modelMatrix;
    mat4.fromRotationTranslationScale(
      modelMatrix,
      quat.create(),
      vec3.fromValues(x, y, z),
      vec3.fromValues(r, r, 1)
    );
    this.applyTransform(modelMatrix);
    this.shapeProgram
      .bind(gl)
      .attribute('a_position', gl.FLOAT, mesh.handle)
      .uniform('u_model', modelMatrix)
      .draw(gl, drawMode, 0, vertexCount);
    return this;
  }
}

/**
 * @param {Array<number>} out
 * @param {Array<number>} points 
 * @param {number} segments 
 * @returns {Array<number>}
 */
function findQuadraticPoints(out, points, segments) {
  if (points.length < 6) {
    throw new Error('Cannot find quadratic points from less than 3 points.');
  }
  let [fromX, fromY, centerX, centerY, toX, toY] = points;
  // A * x^2 + B * x + C = y
  let mat = mat3.fromValues(
    fromX * fromX,
    centerX * centerX,
    toX * toX,
    fromX, centerX, toX,
    1, 1, 1);
  let vec = vec3.fromValues(fromY, centerY, toY);
  mat3.invert(mat, mat);
  let coeffs = vec3.transformMat3(vec, vec, mat);
  out.length = 0;
  out.push(fromX, fromY);
  let dx = toX - fromX;
  for(let i = 1; i < segments - 1; ++i) {
    let j = i / segments;
    let x = dx * j + fromX;
    let y = coeffs[0] * x * x + coeffs[1] * x + coeffs[2];
    out.push(x, y);
  }
  out.push(toX, toY);
  return out;
}
