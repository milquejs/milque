import { ComponentClass, EntityManager, Query } from '@milque/scene';

export const TransformComponent = new ComponentClass('transform', () => ({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
}));
export const TransformQuery = new Query(TransformComponent);

/**
 * @param {EntityManager} ents 
 * @param {import('@milque/scene').EntityId} entityId
 * @param {number} x 
 * @param {number} y 
 * @param {number} [scaleX] 
 * @param {number} [scaleY] 
 * @param {number} [rotation] 
 */
export function attachTransform(ents, entityId, x, y, scaleX = 1, scaleY = 1, rotation = 0) {
    return ents.attach(entityId, TransformComponent, { x, y, scaleX, scaleY, rotation });
}
