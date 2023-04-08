import { AssetManager } from '@milque/asset';
import { ComponentClass, EntityManager, Query } from '@milque/scene';

import { Tia } from '../tia/Tia';
import * as SceneGraph from './SceneGraph';
import { DefsBuilder } from './DefsBuilder';

/**
 * @typedef {Record<string, import('@milque/asset').AssetLoader<?, ?>>} LoaderMap
 * @typedef {import('./Defs').Defs} Defs
 */

/**
 * @param {string} roomName
 * @param {LoaderMap} loaders
 * @param {AssetManager} assets 
 * @param {EntityManager} ents 
 * @param {Defs} defs 
 */
export function newRoom(roomName, loaders, assets, ents, defs) {
    return new RoomInstance(roomName, loaders, assets, ents, defs);
}

export function newDefs() {
    return new DefsBuilder();
}

/**
 * @param {Defs} defs 
 * @param {string} roomName
 */
export function getRoomDef(defs, roomName) {
    return defs.rooms[roomName];
}

/**
 * @param {Defs} defs 
 * @param {string} assetName
 */
export function getAssetDef(defs, assetName) {
    return defs.assets[assetName];
}

/**
 * @param {Defs} defs 
 * @param {string} spriteName 
 * @returns 
 */
export function getSpriteDef(defs, spriteName) {
    return defs.sprites[spriteName];
}

/**
 * @param {Defs} defs 
 * @param {string} objectName 
 * @returns 
 */
export function getObjectDef(defs, objectName) {
    return defs.objects[objectName];
}

/**
 * @param {Defs} defs
 */
export function getRoomNames(defs) {
    return Object.keys(defs.rooms);
}

/**
 * @param {Defs} defs
 */
export function getAssetNames(defs) {
    return Object.keys(defs.assets);
}

/**
 * @param {Defs} defs
 */
export function getSpriteNames(defs) {
    return Object.keys(defs.sprites);
}

/**
 * @param {Defs} defs
 */
export function getObjectNames(defs) {
    return Object.keys(defs.objects);
}

class ObjectInstance {
    /**
     * @param {RoomInstance} room 
     */
    constructor(room) {
        this.room = room;

        this.objectName = null;
        this.spriteName = null;
        this.colliderName = null;
        this.parentName = null;
        this.childNames = [];
        
        this.entityId = 0;
        this.parentId = 0;
        this.childIds = [];

        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;

        this.visible = true;

        this.spriteIndex = 0;
        this.frameDelta = 0;
    }

    get object() {
        return getObjectDef(this.room.defs, this.objectName);
    }

    get sprite() {
        return getSpriteDef(this.room.defs, this.spriteName);
    }

    get collider() {
        return getSpriteDef(this.room.defs, this.colliderName);
    }

    get parent() {
        return getObjectDef(this.room.defs, this.parentName);
    }

    get children() {
        // TODO: Add look up for child defs
        throw new Error('Not yet implemented.');
    }
}

class RoomInstance {
    
    /**
     * @param {string} roomName
     * @param {LoaderMap} loaders
     * @param {AssetManager} assets 
     * @param {EntityManager} ents 
     * @param {Defs} defs 
     */
    constructor(roomName, loaders, assets, ents, defs) {
        this.roomName = roomName;
        this.loaders = loaders;
        this.assets = assets;
        this.ents = ents;
        this.defs = defs;

        this.sceneGraph = SceneGraph.create();
        this.tia = new Tia();

        this.componentClass = new ComponentClass(`${roomName}:instance`, () => new ObjectInstance(this));
        this.componentQuery = new Query(this.componentClass);

        /** @type {Record<string, { component: ComponentClass<?>, query: Query }>} */
        this.objectComponentClasses = {};

        this.prevViewIndex = -1;
        this.viewIndex = 0;
    }

    get room() {
        return getRoomDef(this.defs, this.roomName);
    }

    /**
     * @param {string} assetName 
     * @param {number} timeout
     */
    async load(assetName, timeout) {
        const def = getAssetDef(this.defs, assetName);
        if (def.type in this.loaders) {
            const loader = this.loaders[def.type];
            return await this.assets.load(def.name, def.filepath, loader, def.options, timeout);
        } else {
            throw new Error(`Unknown loader type '${def.type}' - ${Object.keys(this.loaders)}`);
        }
    }

    /**
     * @param {string} objectName 
     * @param {number} x 
     * @param {number} y 
     * @param {number} [scaleX] 
     * @param {number} [scaleY] 
     * @param {number} [rotation]
     * @param {ObjectInstance} [parentInstance]
     */
    instantiate(objectName, x, y, scaleX = 1, scaleY = 1, rotation = 0, parentInstance = undefined) {
        const def = getObjectDef(this.defs, objectName);
        const entityId = this.ents.create();
        if (!(objectName in this.objectComponentClasses)) {
            let component = new ComponentClass(`${this.roomName}:${objectName}`);
            this.objectComponentClasses[objectName] = {
                component,
                query: new Query(this.componentClass, component),
            };
        }
        this.ents.attach(entityId, this.objectComponentClasses[objectName].component);
        let inst = this.ents.attach(entityId, this.componentClass);
        inst.entityId = entityId;
        inst.colliderName = def.collider;
        inst.objectName = objectName;
        inst.rotation = rotation;
        inst.scaleX = scaleX;
        inst.scaleY = scaleY;
        inst.spriteName = def.sprite;
        inst.visible = def.initial.visible;
        inst.x = x;
        inst.y = y;
        // Setup own parent
        let parentId = 0;
        if (typeof parentInstance !== 'undefined') {
            // TODO: Parent wasn't flushed so, so we can't validate it's the same object yet.
            parentId = parentInstance.entityId;
            inst.parentName = parentInstance.objectName;
            inst.parentId = parentId;
        }
        SceneGraph.add(this.sceneGraph, entityId, parentId);
        // Setup own children
        for(let childName of def.children) {
            // TODO: This could mean a cyclic dependency. Maybe we should validate that.
            let childDef = getObjectDef(this.defs, childName);
            let offsetTransform = childDef.initial.transform;
            this.instantiate(childName,
                offsetTransform.x, offsetTransform.y,
                offsetTransform.scaleX, offsetTransform.scaleY,
                offsetTransform.rotation,
                inst);
        }
        return inst;
    }

    /**
     * @param {string} objectName
     */
    findAll(objectName) {
        if (objectName in this.objectComponentClasses) {
            let result = [];
            for(let inst of this.objectComponentClasses[objectName].query.findComponents(this.ents, this.componentClass)) {
                result.push(inst);
            }
            return /** @type {Array<ObjectInstance>} */ (result);
        }
        return [];
    }

    /**
     * @param {number} [timeout] 
     */
    async preload(timeout = 5_000) {
        await Promise.all(getAssetNames(this.defs)
            .map(assetName => this.load(assetName, timeout)));
    }

    init() {
        const def = this.room;
        for(let instance of def.instances) {
            const { x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0 } = instance.transform;
            this.instantiate(instance.object, x, y, scaleX, scaleY, rotation);
        }
    }

    /**
     * @param {number} deltaTime 
     */
    step(deltaTime) {
        for(let inst of this.componentQuery.findComponents(this.ents, this.componentClass)) {
            if (!inst.sprite) {
                // No sprite. Not animated.
                continue;
            }

            // Animate sprites.
            const spriteDef = inst.sprite;
            if (spriteDef.frameSpeed > 0) {
                inst.frameDelta += (deltaTime / 1_000) * spriteDef.frameSpeed;
                let framesSkipped = Math.floor(inst.frameDelta);
                inst.frameDelta -= framesSkipped;
                inst.spriteIndex = (inst.spriteIndex + framesSkipped) % spriteDef.length;
                // TODO: Negative frame speed?
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        let tia = this.tia;
        let roomDef = this.room;
        let currentView = this.room.views[this.viewIndex];
        ctx.canvas.width = currentView.width;
        ctx.canvas.height = currentView.height;
        tia.cls(ctx, roomDef.background);
        tia.camera(currentView.offsetX, currentView.offsetY, currentView.width, currentView.height);

        // Traverse the scene graph to build world and local transforms
        SceneGraph.walk(this.sceneGraph, (node, graph) => {
            let inst = this.ents.get(node, this.componentClass);
            if (!inst.visible) {
                // Not visible. Don't draw.
                return;
            }
            if (!inst.sprite) {
                // No sprite. It's invisible.
                return;
            }
            const spriteDef = inst.sprite;
            const assetDef = getAssetDef(this.defs, spriteDef.image);
            if (!assetDef) {
                throw new Error(`Missing asset def for '${spriteDef.image}'.`);
            }
            /** @type {CanvasImageSource} */
            const image = this.assets.get(assetDef.uri);
            if (!image) {
                throw new Error(`Cannot use asset '${assetDef.name}' not yet loaded.`);
            }
            tia.push();
            tia.mat(inst.x, inst.y, inst.scaleX, inst.scaleY, inst.rotation);
            let frame = spriteDef.frames[inst.spriteIndex % spriteDef.length];
            tia.sprUV(
                ctx,
                image,
                frame[0],
                frame[1],
                frame[2],
                frame[3],
                -spriteDef.originX,
                -spriteDef.originY,
                spriteDef.width,
                spriteDef.height);
            return () => {
                tia.pop();
            };
        });
    }
}
