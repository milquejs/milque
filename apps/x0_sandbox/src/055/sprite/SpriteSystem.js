import { AssetManager } from '@milque/asset';
import { ComponentClass, EntityManager, Query } from '@milque/scene';

import { drawSprite, SpriteInstance, updateSprite } from './Sprite';

export const SpriteComponent = new ComponentClass('sprite', () => new SpriteInstance(null));
export const SpriteQuery = new Query(SpriteComponent);

/**
 * @param {EntityManager} ents
 * @param {import('@milque/scene').EntityId} entityId
 * @param {string} spriteName
 * @param {AssetManager} assets
 */
export function attachSprite(ents, entityId, spriteName, assets) {
    /** @type {import('./SpriteDef').SpriteDef} */
    let spriteDef = assets.get(spriteName);
    return ents.attach(entityId, SpriteComponent, SpriteInstance.fromDef(spriteName, spriteDef));
}

/**
 * @param {EntityManager} ents 
 * @param {AssetManager} assets 
 * @param {number} deltaTime 
 */
export function updateSprites(ents, assets, deltaTime) {
    for(let sprite of SpriteQuery.findComponents(ents, SpriteComponent)) {
        /** @type {import('./SpriteDef').SpriteDef} */
        let def = assets.get(sprite.spriteName);
        updateSprite(sprite, def, deltaTime);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {EntityManager} ents 
 * @param {AssetManager} assets 
 */
export function drawSprites(ctx, ents, assets) {
    for(let sprite of SpriteQuery.findComponents(ents, SpriteComponent)) {
        /** @type {import('./SpriteDef').SpriteDef} */
        let def = assets.get(sprite.spriteName);
        /** @type {HTMLImageElement} */
        let image = assets.get(def.image);
        drawSprite(ctx, sprite, def, image);
    }
}
