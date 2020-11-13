import { mat4, quat, vec3 } from 'gl-matrix';
import { toRadians } from 'milque';

const UP = vec3.fromValues(0, 1, 0);
const HALF_PI = Math.PI / 2;
const PI2 = Math.PI * 2;

export function panTo(viewMatrix, x, y, z = 0, dt = 1)
{
    let position = vec3.create();
    mat4.getTranslation(position, viewMatrix);
    let translation = vec3.fromValues(
        (x - position[0]) * dt,
        (y - position[1]) * dt,
        (z - position[2]) * dt);
    mat4.translate(viewMatrix, viewMatrix, translation);
}

export function lookAt(viewMatrix, x, y, z = 0, dt = 1)
{
    let position = vec3.create();
    let rotation = quat.create();
    mat4.getTranslation(position, viewMatrix);
    mat4.getRotation(rotation, viewMatrix);
    let target = vec3.fromValues(x, y, z);
    
    mat4.lookAt(viewMatrix, position, target, UP);

    let targetRotation = quat.create();
    mat4.getRotation(viewMatrix, targetRotation);
    quat.slerp(rotation, rotation, targetRotation, dt);

    mat4.fromRotationTranslation(viewMatrix, rotation, position);
}

/**
 * Creates a camera controller that behaves like a traditional
 * first person camera. Pitch is restricted to prevent gimbal lock
 * and roll is ignored.
 * 
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */
export function createFirstPersonCameraController(opts = {})
{
    const { xzlock = false } = opts;

    return {
        position: vec3.create(),
        forward: vec3.fromValues(0, 0, -1),
        right: vec3.fromValues(1, 0, 0),
        up: vec3.fromValues(0, 1, 0),
        forwardAmount: 0,
        rightAmount: 0,
        upAmount: 0,
        pitch: 0,
        yaw: -90,
        look(dx, dy, dt = 1)
        {
            this.pitch = Math.min(90, Math.max(-90, this.pitch + dy * dt));
            this.yaw = (this.yaw + dx * dt) % 360;
            return this;
        },
        move(forward, right = 0, up = 0, dt = 1)
        {
            this.forwardAmount += forward * dt;
            this.rightAmount += right * dt;
            this.upAmount += up * dt;
            return this;
        },
        apply(out)
        {
            let {
                position,
                forward, right, up,
                forwardAmount, rightAmount, upAmount,
                pitch, yaw
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
            if (xzlock) position[1] = prevY;
            // Move up
            vec3.scale(move, up, upAmount);
            vec3.add(position, position, move);
            // Reset movement
            this.forwardAmount = 0;
            this.rightAmount = 0;
            this.upAmount = 0;
            
            let target = vec3.add(move, position, forward);
            mat4.lookAt(out, position, target, up);
            return out;
        }
    };
}
