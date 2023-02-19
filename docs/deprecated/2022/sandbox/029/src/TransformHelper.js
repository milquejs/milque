import { mat4 } from 'gl-matrix';

export function createTransform() {
  return {
    worldMatrix: mat4.create(),
    localMatrix: mat4.create(),
  };
}

export function computeTransform(transform, parentTransform) {
  if (parentTransform) {
    mat4.multiply(
      transform.worldMatrix,
      parentTransform.worldMatrix,
      transform.localMatrix
    );
  } else {
    mat4.copy(transform.worldMatrix, transform.localMatrix);
  }
}
