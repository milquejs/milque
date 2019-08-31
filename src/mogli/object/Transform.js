import { vec3, quat, mat4 } from 'gl-matrix';

export const XAXIS = vec3.fromValues(1, 0, 0);
export const YAXIS = vec3.fromValues(0, 1, 0);
export const ZAXIS = vec3.fromValues(0, 0, 1);

export function create()
{
    return {
        translation: vec3.create(),
        rotation: quat.create(),
        scale: vec3.fromValues(1, 1, 1)
    };
}

export function getTransformationMatrix(transform, dst = mat4.create())
{
    return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

// NOTE: From Mr.Dobbs himself...
// https://www.gamedev.net/forums/topic/56471-extracting-direction-vectors-from-quaternion/
export function getForwardVector(transform, dst = vec3.create())
{
    const q = transform.rotation;
    dst[0] = 2 * (q[0] * q[2] + q[3] * q[1]);
    dst[1] = 2 * (q[1] * q[2] + q[3] * q[0]);
    dst[2] = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
    return dst;
}

export function getUpVector(transform, dst = vec3.create())
{
    const q = transform.rotation;
    dst[0] = 2 * (q[0] * q[1] + q[3] * q[2]);
    dst[1] = 1 - 2 * (q[0] * q[0] + q[2] * q[2]);
    dst[2] = 2 * (q[1] * q[2] + q[3] * q[0]);
    return dst;
}

export function getRightVector(transform, dst = vec3.create())
{
    const q = transform.rotation;
    dst[0] = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
    dst[1] = 2 * (q[0] * q[1] + q[3] * q[2]);
    dst[2] = 2 * (q[0] * q[2] + q[3] * q[1]);
    return dst;
}
