import { mat4 } from 'gl-matrix';
import { Component } from './Component.js';

export const TransformComponent = Component.fromFactory('transform', () => ({
  localMatrix: mat4.create(),
  worldMatrix: mat4.create(),
}));

export function move(transform, x, y, z = 0) {
  mat4.translate(transform.localMatrix, transform.localMatrix, [x, y, z]);
}
