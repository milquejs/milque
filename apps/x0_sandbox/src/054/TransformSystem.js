import { AssetManager, ImageLoader } from '@milque/asset';
import { ComponentClass, EntityManager, Query } from '@milque/scene';
import { useContext, useCurrentAnimationFrameDetail, useWhenSystemPreload, useWhenSystemUpdate } from '../runner';

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
 * @param {number} entityId 
 * @param {number} x 
 * @param {number} y 
 * @param {number} scaleX 
 * @param {number} scaleY 
 * @param {number} rotation 
 */
export function attachTransform(ents, entityId, x, y, scaleX = 1, scaleY = 1, rotation = 0) {
    let transform = ents.attach(entityId, TransformComponent);
    transform.x = x;
    transform.y = y;
    transform.scaleX = scaleX;
    transform.scaleY = scaleY;
    transform.rotation = rotation;
    return transform;
}
