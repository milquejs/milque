import { ComponentClass, EntityManager, Query, SceneGraph } from '@milque/scene';
import { AssetManager } from '@milque/asset';
import { getObjectDef, getSpriteDef } from '../Defs';
import { SpriteDef } from '../sprite';

/** @module ObjectDef */

/**
 * @typedef {ReturnType<create>} ObjectDef
 * @typedef {ReturnType<createObjectInstance>} ObjectInstance
 */

/**
 * @param {string} sprite
 * @param {Array<string>} [children]
 */
export function create(sprite, children = []) {
    return {
        sprite,
        children,
        initial: {
            visible: true,
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        }
    };
}

/**
 * @param {Partial<ObjectDef>} json
 */
export function fromJSON(json) {
    let {
        sprite,
        children = [],
        initial = undefined,
    } = json;
    const {
        visible = true,
        offsetX = 0,
        offsetY = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0,
    } = initial || {};
    let result = create(sprite, children);
    result.initial.visible = visible;
    result.initial.offsetX = offsetX;
    result.initial.offsetY = offsetY;
    result.initial.scaleX = scaleX;
    result.initial.scaleY = scaleY;
    result.initial.rotation = rotation;
    return result;
}

export const ObjectComponent = new ComponentClass('object', () => createObjectInstance(null, 0, 0, 0, 0, 1, 1, 0, false));
export const ObjectQuery = new Query(ObjectComponent);

/**
 * @param {string} objectName 
 * @param {import('@milque/scene').EntityId} objectId 
 * @param {import('@milque/scene').EntityId} spriteId
 * @param {number} x 
 * @param {number} y 
 * @param {number} scaleX 
 * @param {number} scaleY 
 * @param {number} rotation 
 * @param {boolean} visible
 */
function createObjectInstance(objectName, objectId, spriteId, x, y, scaleX, scaleY, rotation, visible) {
    return {
        objectName,
        objectId,
        spriteId,
        x, y,
        scaleX,
        scaleY,
        rotation,
        visible,
    };
}

/**
 * @param {EntityManager} ents
 * @param {SceneGraph} sceneGraph
 * @param {AssetManager} assets
 * @param {ObjectDef} objectDef
 * @param {string} objectName 
 * @returns {ObjectInstance}
 */
export function newInstance(ents, sceneGraph, assets, objectDef, objectName, objectId = ents.create()) {
    let spriteId = 0;
    if (objectDef.sprite) {
        let spriteDef = getSpriteDef(assets, objectDef.sprite);
        let sprite = SpriteDef.newInstance(ents, spriteDef, objectDef.sprite);
        spriteId = sprite.spriteId;
    }
    let object = createObjectInstance(
        objectName, objectId, spriteId,
        objectDef.initial.offsetX, objectDef.initial.offsetY,
        objectDef.initial.scaleX, objectDef.initial.scaleY,
        objectDef.initial.rotation, objectDef.initial.visible);
    ents.attach(objectId, ObjectComponent, object);
    SceneGraph.add(sceneGraph, objectId);
    for(let childName of objectDef.children) {
        let childDef = getObjectDef(assets, childName);
        let child = newInstance(ents, sceneGraph, assets, childDef, childName);
        SceneGraph.parent(sceneGraph, child.objectId, objectId);
    }
    return object;
}

/**
 * @param {EntityManager} ents 
 * @param {import('@milque/scene').EntityId} objectId
 */
export function getInstance(ents, objectId) {
    return ents.get(objectId, ObjectComponent);
}

/**
 * @param {SceneGraph} sceneGraph
 * @param {import('@milque/scene').EntityId} objectId
 * @param {import('@milque/scene').EntityId} parentId
 */
export function setInstanceParentId(sceneGraph, objectId, parentId) {
    SceneGraph.parent(sceneGraph, objectId, parentId);
}

/**
 * @param {SceneGraph} sceneGraph
 * @param {import('@milque/scene').EntityId} objectId
 * @returns {import('@milque/scene').EntityId}
 */
export function getInstanceParentId(sceneGraph, objectId) {
    return SceneGraph.getParent(sceneGraph, objectId);
}

/**
 * @param {SceneGraph} sceneGraph
 * @param {import('@milque/scene').EntityId} objectId
 * @returns {Array<import('@milque/scene').EntityId>}
 */
export function getInstanceChildIds(sceneGraph, objectId) {
    return SceneGraph.getChildren(sceneGraph, objectId);
}

/**
 * @param {EntityManager} ents
 * @param {SceneGraph} sceneGraph
 * @param {(instance: ObjectInstance) => (() => void)|void} callback 
 */
export function walkSceneGraph(ents, sceneGraph, callback) {
    SceneGraph.walk(sceneGraph, (nodeId) => {
        let object = ents.get(nodeId, ObjectComponent);
        let result = callback(object);
        return result;
    });
}
