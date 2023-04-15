import { AssetManager } from '@milque/asset';
import { ComponentClass, EntityManager, Query, SceneGraph } from '@milque/scene';

import { ObjectInstance } from './Object';
import { attachSprite } from '../sprite/SpriteSystem';

export const ObjectComponent = new ComponentClass('object', () => new ObjectInstance(null));
export const ObjectQuery = new Query(ObjectComponent);

export class ObjectManager {
    constructor() {
        /** @type {Record<string, ComponentClass<ObjectInstance>>} */
        this.tags = {};
        /** @type {Record<string, Query>} */
        this.queries = {};
    }

    register(objectName) {
        if (objectName in this.tags) {
            return this;
        }
        let tag = new ComponentClass(`object:${objectName}`);
        this.tags[objectName] = tag;
        this.queries[objectName] = new Query(ObjectComponent, tag);
        return this;
    }

    /**
     * @param {EntityManager} ents 
     * @param {string} objectName
     */
    findAny(ents, objectName) {
        let { value } = this.queries[objectName].findComponents(ents, ObjectComponent).next();
        return value;
    }

    /**
     * @param {EntityManager} ents 
     * @param {string} objectName
     */
    *findAll(ents, objectName) {
        for(let inst of this.queries[objectName].findComponents(ents, ObjectComponent)) {
            yield /** @type {ObjectInstance} */ (inst);
        }
    }
}

/**
 * @param {EntityManager} ents
 * @param {AssetManager} assets
 * @param {SceneGraph} sceneGraph
 * @param {ObjectManager} objectManager
 * @param {string} objectName 
 */
export function createObject(ents, assets, sceneGraph, objectManager, objectName, parentObject = undefined) {
    /** @type {import('./ObjectDef').ObjectDef} */
    let objectDef = assets.get(objectName);
    let entityId = ents.create();
    let objectInst = ents.attach(entityId, ObjectComponent, ObjectInstance.fromDef(objectName, objectDef));
    objectInst.entityId = entityId;
    objectManager.register(objectName);
    let parentId = 0;
    if (typeof parentObject !== 'undefined') {
        parentId = parentObject.entityId;
        objectInst.parentName = parentObject.objectName;
        objectInst.parentId = parentId;
        objectInst.childIds.push(entityId);
    }
    SceneGraph.add(sceneGraph, entityId, parentId);
    attachSprite(ents, entityId, objectDef.sprite, assets);
    for(let childName of objectDef.children) {
        // TODO: Check for cyclic dependencies.
        createObject(ents, assets, sceneGraph, objectManager, childName, objectInst);
    }
    return objectInst;
}
