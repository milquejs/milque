'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var glMatrix = require('gl-matrix');

const UP = glMatrix.vec3.fromValues(0, 1, 0);
function panTo(viewMatrix, x, y, z = 0, dt = 1) {
  let position = glMatrix.vec3.create();
  glMatrix.mat4.getTranslation(position, viewMatrix);
  let translation = glMatrix.vec3.fromValues((x - position[0]) * dt, (y - position[1]) * dt, (z - position[2]) * dt);
  glMatrix.mat4.translate(viewMatrix, viewMatrix, translation);
}
function lookAt(viewMatrix, x, y, z = 0, dt = 1) {
  let position = glMatrix.vec3.create();
  let rotation = glMatrix.quat.create();
  glMatrix.mat4.getTranslation(position, viewMatrix);
  glMatrix.mat4.getRotation(rotation, viewMatrix);
  let target = glMatrix.vec3.fromValues(x, y, z);
  glMatrix.mat4.lookAt(viewMatrix, position, target, UP);
  let targetRotation = glMatrix.quat.create();
  glMatrix.mat4.getRotation(viewMatrix, targetRotation);
  glMatrix.quat.slerp(rotation, rotation, targetRotation, dt);
  glMatrix.mat4.fromRotationTranslation(viewMatrix, rotation, position);
}
/**
 * Gets a directional ray in the world space from the given normalized
 * screen coordinates and camera matrices.
 * 
 * NOTE: In addition to some scaling, the y component from a pointer's
 * position usually has to be flipped to match the normalized screen
 * coordinate space, which assumes a range of [-1, 1] for both x and y,
 * where (0, 0) is the CENTER and (-1, -1) is the BOTTOM-LEFT of the
 * screen.
 * 
 * Typical Device Screen Coordinate Space:
 * 
 * (0,0)------------(w,0)
 *    |               |
 *    |   (w/2,h/2)   |
 *    |               |
 * (0,w)------------(w,h)
 * 
 * Normalized Screen Coordinate Space:
 * 
 * (-1,+1)---------(+1,+1)
 *    |               |
 *    |     (0,0)     |
 *    |               |
 * (-1,-1)---------(+1,-1)
 * 
 * @param {Number} normalizedScreenCoordX The X screen coordinate normalized to [-1, 1], where 0 is the left side of the screen.
 * @param {Number} normalizedScreenCoordY The Y screen coordinate normalized to [-1, 1], where 0 is the bottom side of the screen.
 * @param {mat4} projectionMatrix The projection matrix of the world camera.
 * @param {mat4} viewMatrix The view matrix of the world camera.
 * @returns {vec3} The normalized ray direction in the world space.
 */

function screenToWorldRay(normalizedScreenCoordX, normalizedScreenCoordY, projectionMatrix, viewMatrix) {
  // https://antongerdelan.net/opengl/raycasting.html
  // To homogeneous clip coords
  let v = glMatrix.vec4.fromValues(normalizedScreenCoordX, normalizedScreenCoordY, -1, 1); // To camera coords

  let m = glMatrix.mat4.create();
  glMatrix.mat4.invert(m, projectionMatrix);
  glMatrix.vec4.transformMat4(v, v, m);
  v[2] = -1;
  v[3] = 0; // To world coords

  glMatrix.mat4.invert(m, viewMatrix);
  glMatrix.vec4.transformMat4(v, v, m); // Normalized as directional ray

  let result = glMatrix.vec3.fromValues(v[0], v[1], v[2]);
  glMatrix.vec3.normalize(result, result);
  return result;
}

class Camera {
  constructor(canvas, projectionMatrix, viewMatrix) {
    this.canvas = canvas;
    this.projectionMatrix = projectionMatrix;
    this.viewMatrix = viewMatrix;
    this.resize = this.resize.bind(this);
    canvas.addEventListener('resize', this.resize);
    setTimeout(this.resize, 0);
  }

  destroy() {
    this.canvas.removeEventListener('resize', this.resize);
  }
  /** @abstract */


  resize() {}

}

const DEFAULT_FOVY = Math.PI / 3;
function createPerspectiveCamera(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
  return new PerspectiveCamera(canvas, fieldOfView, near, far);
}
class PerspectiveCamera extends Camera {
  constructor(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
    super(canvas, glMatrix.mat4.create(), glMatrix.mat4.create());
    this.fieldOfView = fieldOfView;
    this.clippingPlane = {
      near,
      far
    };
  }
  /** @override */


  resize() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const {
      near,
      far
    } = this.clippingPlane;
    glMatrix.mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
  }

}

function createOrthographicCamera(canvas, left, top, right, bottom, near = -1000, far = 1000) {
  return new OrthographicCamera(canvas, left, top, right, bottom, near, far);
}
class OrthographicCamera extends Camera {
  constructor(canvas, left, top, right, bottom, near, far) {
    super(canvas, glMatrix.mat4.create(), glMatrix.mat4.create());
    this.bounds = {
      left,
      top,
      right,
      bottom
    };
    this.clippingPlane = {
      near,
      far
    };
  }
  /** @override */


  resize() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const {
      near,
      far
    } = this.clippingPlane;
    const {
      left,
      top,
      right,
      bottom
    } = this.bounds;
    glMatrix.mat4.ortho(this.projectionMatrix, left * aspectRatio, right * aspectRatio, bottom, top, near, far);
  }

}

const TO_RAD_FACTOR = Math.PI / 180;
/**
 * Creates a camera controller that behaves like a traditional
 * first person camera. Pitch is restricted to prevent gimbal lock
 * and roll is ignored.
 * 
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */

function createFirstPersonCameraController(opts = {}) {
  return new FirstPersonCameraController(opts);
}
class FirstPersonCameraController {
  constructor(opts = {
    locky: false
  }) {
    this.locky = opts.locky;
    this.position = glMatrix.vec3.create();
    this.forward = glMatrix.vec3.fromValues(0, 0, -1);
    this.right = glMatrix.vec3.fromValues(1, 0, 0);
    this.up = glMatrix.vec3.fromValues(0, 1, 0);
    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;
    this.pitch = 0;
    this.yaw = -90;
  }

  look(dx, dy, dt = 1) {
    this.pitch = Math.min(89.9, Math.max(-89.9, this.pitch + dy * dt));
    this.yaw = (this.yaw + dx * dt) % 360;
    return this;
  }

  move(forward, right = 0, up = 0, dt = 1) {
    this.forwardAmount += forward * dt;
    this.rightAmount += right * dt;
    this.upAmount += up * dt;
    return this;
  }

  apply(viewMatrix) {
    let {
      position,
      forward,
      right,
      up,
      forwardAmount,
      rightAmount,
      upAmount,
      pitch,
      yaw
    } = this; // Calculate forward and right vectors

    let rady = yaw * TO_RAD_FACTOR;
    let radp = pitch * TO_RAD_FACTOR;
    let cosy = Math.cos(rady);
    let cosp = Math.cos(radp);
    let siny = Math.sin(rady);
    let sinp = Math.sin(radp);
    let dx = cosy * cosp;
    let dy = sinp;
    let dz = siny * cosp;
    glMatrix.vec3.normalize(forward, glMatrix.vec3.set(forward, dx, dy, dz));
    glMatrix.vec3.normalize(right, glMatrix.vec3.cross(right, forward, up));
    let move = glMatrix.vec3.create();
    let prevY = position[1]; // Move forward

    glMatrix.vec3.scale(move, forward, forwardAmount);
    glMatrix.vec3.add(position, position, move); // Move right

    glMatrix.vec3.scale(move, right, rightAmount);
    glMatrix.vec3.add(position, position, move);
    if (this.locky) position[1] = prevY; // Move up

    glMatrix.vec3.scale(move, up, upAmount);
    glMatrix.vec3.add(position, position, move); // Reset movement

    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;
    let target = glMatrix.vec3.add(move, position, forward);
    glMatrix.mat4.lookAt(viewMatrix, position, target, up);
    return viewMatrix;
  }

}

exports.Camera = Camera;
exports.FirstPersonCameraController = FirstPersonCameraController;
exports.OrthographicCamera = OrthographicCamera;
exports.PerspectiveCamera = PerspectiveCamera;
exports.createFirstPersonCameraController = createFirstPersonCameraController;
exports.createOrthographicCamera = createOrthographicCamera;
exports.createPerspectiveCamera = createPerspectiveCamera;
exports.lookAt = lookAt;
exports.panTo = panTo;
exports.screenToWorldRay = screenToWorldRay;
