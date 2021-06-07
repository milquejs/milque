import { mat4, quat, vec3, vec4 } from 'gl-matrix';

const UP = vec3.fromValues(0, 1, 0);

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
    mat4.getRotation(targetRotation, viewMatrix);
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
 * where (0, 0) is the center and (-1, -1) is the bottom-left of the
 * screen.
 * 
 * ### Typical Device Screen Coordinate Space:
 * ```
 * (0,0)------------(w,0)
 *    |               |
 *    |   (w/2,h/2)   |
 *    |               |
 * (0,w)------------(w,h)
 * ```
 * 
 * ### Normalized Screen Coordinate Space:
 * ```
 * (-1,+1)---------(+1,+1)
 *    |               |
 *    |     (0,0)     |
 *    |               |
 * (-1,-1)---------(+1,-1)
 * ```
 * 
 * ### Example Conversion from Device to Normalized:
 * ```
 * let normalizedScreenX = (canvasClientX / canvasWidth) * 2 - 1;
 * let normalizedScreenY = 1 - (canvasClientY / canvasHeight) * 2;
 * ```
 * 
 * @param {vec3} out The output vector.
 * @param {number} normalizedScreenCoordX The X screen coordinate normalized to [-1, 1], where -1 is the left side of the screen.
 * @param {number} normalizedScreenCoordY The Y screen coordinate normalized to [-1, 1], where -1 is the bottom side of the screen.
 * @param {mat4} projectionMatrix The projection matrix of the world camera.
 * @param {mat4} viewMatrix The view matrix of the world camera.
 * @param {boolean} [normalized=false] Whether to normalize the result. Usually true for non-orthogonal projections.
 * @returns {vec3} The ray direction in the world space. By default, this is not normalized.
 */
export function screenToWorldRay(out, normalizedScreenCoordX, normalizedScreenCoordY, projectionMatrix, viewMatrix, normalized = false)
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
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    // Normalized as directional ray
    if (normalized)
    {
        vec3.normalize(out, out);
    }
    return out;
}
