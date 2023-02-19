import { vec3, mat4 } from 'gl-matrix';
import { toRadians } from 'milque';

/**
 * Creates a camera controller that behaves like a traditional
 * first person camera. Pitch is restricted to prevent gimbal lock
 * and roll is ignored.
 *
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */
export function createFirstPersonCameraController(opts = {}) {
  return new FirstPersonCameraController(opts);
}

export class FirstPersonCameraController {
  constructor(opts = { locky: false }) {
    this.locky = opts.locky;

    this.position = vec3.create();
    this.forward = vec3.fromValues(0, 0, -1);
    this.right = vec3.fromValues(1, 0, 0);
    this.up = vec3.fromValues(0, 1, 0);

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
      yaw,
    } = this;

    // Calculate forward and right vectors
    let rady = toRadians(yaw);
    let radp = toRadians(pitch);
    let cosy = Math.cos(rady);
    let cosp = Math.cos(radp);
    let siny = Math.sin(rady);
    let sinp = Math.sin(radp);
    let dx = cosy * cosp;
    let dy = sinp;
    let dz = siny * cosp;
    vec3.normalize(forward, vec3.set(forward, dx, dy, dz));
    vec3.normalize(right, vec3.cross(right, forward, up));

    let move = vec3.create();
    let prevY = position[1];
    // Move forward
    vec3.scale(move, forward, forwardAmount);
    vec3.add(position, position, move);
    // Move right
    vec3.scale(move, right, rightAmount);
    vec3.add(position, position, move);
    if (this.locky) position[1] = prevY;
    // Move up
    vec3.scale(move, up, upAmount);
    vec3.add(position, position, move);
    // Reset movement
    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;

    let target = vec3.add(move, position, forward);
    mat4.lookAt(viewMatrix, position, target, up);
    return viewMatrix;
  }
}
