import { vec3, quat, mat4 } from 'gl-matrix';

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
