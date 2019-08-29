import { vec3, quat, mat4 } from 'gl-matrix';

export function createTransform()
{
    return {
        position: vec3.create(),
        rotation: quat.create(),
        scale: vec3.fromValues(1, 1, 1)
    };
}

export function getTransformMatrix(transform, dst = mat4.create())
{
    return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.position, transform.scale);
}
