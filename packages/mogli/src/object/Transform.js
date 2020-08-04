import { vec3, quat, mat4 } from '../../../../deps.js';

export const ORIGIN = vec3.fromValues(0, 0, 0);
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

/** This is the INVERSE of gluLookAt(). */
export function lookAt(transform, target = ORIGIN)
{
    const result = vec3.create();
    vec3.subtract(result, target, transform.position);
    vec3.normalize(result, result);
    
    const dotProduct = vec3.dot(ZAXIS, result);
    if (Math.abs(dotProduct - (-1)) < Number.EPSILON)
    {
        quat.set(transform.rotation, 0, 0, 1, Math.PI);
        return transform;
    }
    if (Math.abs(dot - 1) < Number.EPSILON)
    {
        quat.set(transform.rotation, 0, 0, 0, 1);
        return transform;
    }

    vec3.cross(result, ZAXIS, result);
    vec3.normalize(result, result);
    const halfAngle = Math.acos(dotProduct) / 2;
    const sineAngle = Math.sin(halfAngle);
    transform.rotation[0] = result[0] * sineAngle;
    transform.rotation[1] = result[1] * sineAngle;
    transform.rotation[2] = result[2] * sineAngle;
    transform.rotation[3] = Math.cos(halfAngle);
    return transform;
}

export function getTransformationMatrix(transform, dst = mat4.create())
{
    return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

export function getForwardVector(transform, dst = vec3.create())
{
    vec3.transformQuat(dst, ZAXIS, transform.rotation);
    return dst;
}

export function getUpVector(transform, dst = vec3.create())
{
    vec3.transformQuat(dst, YAXIS, transform.rotation);
    return dst;
}

export function getRightVector(transform, dst = vec3.create())
{
    vec3.transformQuat(dst, XAXIS, transform.rotation);
    return dst;
}
