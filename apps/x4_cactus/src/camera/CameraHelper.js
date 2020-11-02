import { mat4, quat, vec3 } from 'gl-matrix';

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
    mat4.getRotation(viewMatrix, targetRotation);
    quat.slerp(rotation, rotation, targetRotation, dt);

    mat4.fromRotationTranslation(viewMatrix, rotation, position);
}
