import { mat4, quat, vec3, vec4 } from 'gl-matrix';

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
export function screenToWorldRay(normalizedScreenCoordX, normalizedScreenCoordY, projectionMatrix, viewMatrix)
{
    // https://antongerdelan.net/opengl/raycasting.html
    // To homogeneous clip coords
    let v = vec4.fromValues(normalizedScreenCoordX, normalizedScreenCoordY, -1, 1);
    // To camera coords
    let m = mat4.create();
    mat4.invert(m, projectionMatrix);
    vec4.transformMat4(v, v, m);
    v[2] = -1;
    v[3] = 0;
    // To world coords
    mat4.invert(m, viewMatrix);
    vec4.transformMat4(v, v, m);
    // Normalized as directional ray
    let result = vec3.fromValues(v[0], v[1], v[2]);
    vec3.normalize(result, result);
    return result;
}
