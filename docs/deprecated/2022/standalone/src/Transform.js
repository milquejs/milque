import { vec3 } from 'gl-matrix';
import { ComponentClass } from './ecs/EntityManager.js';

export const Transform = new ComponentClass('Transform', () => ({
    position: vec3.create(),
    rotation: vec3.create(),
    scale: vec3.create(),
}));
