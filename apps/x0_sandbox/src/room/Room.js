import { AssetManager } from '@milque/asset';
import { ComponentClass, EntityManager, Query } from '@milque/scene';

import { Tia } from '../tia/Tia';
import * as SceneGraph from './SceneGraph';

/** @typedef {import('@milque/asset').AssetLoader<?, ?>} AssetLoader */

/**
 * @typedef {ReturnType<createSpriteDef>} SpriteDef
 * @typedef {ReturnType<createObjectDef>} ObjectDef
 * @typedef {ReturnType<createAssetDef>} AssetDef
 * @typedef {ReturnType<createRoomDef>} RoomDef
 * @typedef {ReturnType<createViewDef>} ViewDef
 * @typedef {ReturnType<createInstanceDef>} InstanceDef
 */

/**
 * @typedef Defs
 * @property {Record<string, RoomDef>} rooms
 * @property {Record<string, AssetDef>} assets
 * @property {Record<string, SpriteDef>} sprites
 * @property {Record<string, ObjectDef>} objects
 */

/**
 * @param {string} roomName
 * @param {Record<string, AssetLoader>} loaders
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
     * @param {Record<string, AssetLoader>} loaders
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

        /** @type {Record<string, { component: ComponentClass<?>, query: Query<?> }>} */
        this.objectComponentClasses = {};
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
            for(let [_, inst] of this.objectComponentClasses[objectName].query.findAll(this.ents)) {
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
        for(let view of def.views) {
            // TODO: Add views :)
        }
    }

    /**
     * @param {number} deltaTime 
     */
    step(deltaTime) {
        for(let [_, inst] of this.componentQuery.findAll(this.ents)) {
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
        // TODO: Rooms should have background color (and images?)
        tia.cls(ctx, 0xFFFFFF);
        tia.matPos(64, 64);
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
            // Scaling doesn't quite work yet...
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

        for(let [_, inst] of this.componentQuery.findAll(this.ents)) {
            if (!inst.visible) {
                // Not visible. Don't draw.
                continue;
            }
            if (!inst.sprite) {
                // No sprite. It's invisible.
                continue;
            }
        }
    }
}

/**
 * @param {Defs} defs 
 * @param {string} parentName 
 */
function getChildrenObjectNames(out, defs, parentName) {
    for(let objectName of getObjectNames(defs)) {
        if (getObjectDef(defs, objectName).parent === parentName) {
            out.push(objectName);
        }
    }
    return out;
}

/**
 * @param {string} name 
 * @param {BoundingRect} boundingRect 
 * @param {Array<ViewDef>} views 
 * @param {Array<InstanceDef>} instances
 */
function createRoomDef(name, boundingRect, views, instances) {
    return {
        name,
        boundingRect,
        views,
        instances,
    };
}

/**
 * @typedef {ReturnType<createBoundingRect>} BoundingRect
 */

/**
 * @param {'aabb'} maskType
 * @param {BoundingRect} boundingRect
 */
function createMaskDef(maskType, boundingRect) {
    return {
        type: maskType,
        boundingRect,
    };
}

/**
 * @param {number} left
 * @param {number} top 
 * @param {number} right 
 * @param {number} bottom
 */
function createBoundingRect(left, top, right, bottom) {
    return {
        left,
        top,
        right,
        bottom,
    };
}

/**
 * @param {string} name 
 * @param {string} image
 * @param {number} imageWidth 
 * @param {number} imageHeight 
 * @param {number} originX 
 * @param {number} originY 
 * @param {ReturnType<createMaskDef>} mask
 * @param {number} frameSpeed 
 * @param {Array<[u: number, v: number, s: number, t: number]>} frames 
 */
function createSpriteDef(name, image, imageWidth, imageHeight, originX, originY, mask, frameSpeed, frames) {
    return {
        name,
        image,
        width: imageWidth,
        height: imageHeight,
        length: frames.length,
        originX,
        originY,
        mask,
        frameSpeed,
        frames,
    };
}

/**
 * @param {string} name 
 * @param {string} sprite
 * @param {string} [collider] 
 * @param {Array<string>} [children] 
 * @param {ReturnType<createObjectInit>} [initial]
 */
function createObjectDef(name, sprite, collider = sprite, children = [], initial = createObjectInit(true)) {
    return {
        name,
        sprite,
        collider,
        children,
        initial,
    };
}

/**
 * @param {boolean} visible
 * @param {ReturnType<createTransform>} transform
 */
function createObjectInit(visible = true, transform = createTransform(0, 0, 1, 1, 0)) {
    return {
        visible,
        transform,
    };
}

/**
 * @param {string} object
 * @param {ReturnType<createTransform>} transform
 */
function createInstanceDef(object, transform) {
    return {
        object,
        transform,
    };
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} [scaleX] 
 * @param {number} [scaleY] 
 * @param {number} [rotation]
 */
function createTransform(x, y, scaleX = 1, scaleY = 1, rotation = 0) {
    return {
        x, y,
        scaleX, scaleY,
        rotation,
    };
}

/**
 * @param {string} name 
 * @param {string} loaderType 
 * @param {string} [uri]
 * @param {string} [filepath] 
 * @param {object} [options]
 */
function createAssetDef(name, loaderType, uri = name, filepath = uri, options = {}) {
    return {
        name,
        type: loaderType,
        uri,
        filepath,
        options,
    };
}

/**
 * @param {string} name 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} width 
 * @param {number} height 
 */
function createViewDef(name, offsetX, offsetY, width, height) {
    return {
        name,
        offsetX,
        offsetY,
        width,
        height,
    };
}

class RoomBuilder {

    /**
     * @param {DefsBuilder} parentBuilder 
     * @param {string} roomName 
     */
    constructor(parentBuilder, roomName) {
        /** @private */
        this.parentBuilder = parentBuilder;
        /** @private */
        this.roomName = roomName;

        /** @private */
        this._boundingRect = undefined;
        /** @private */
        this._views = [];
        /** @private */
        this._instances = [];
    }

    /**
     * @param {number} left 
     * @param {number} top 
     * @param {number} right 
     * @param {number} bottom
     */
    boundingRect(left, top, right, bottom) {
        this._boundingRect = createBoundingRect(left, top, right, bottom);
        return this;
    }


    /**
     * @param {string} name 
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @param {number} width 
     * @param {number} height 
     */
    addView(name, offsetX, offsetY, width, height) {
        let def = createViewDef(name, offsetX, offsetY, width, height);
        this._views.push(def);
        return this;
    }

    /**
     * @param {string} object 
     * @param {number} x 
     * @param {number} y 
     * @param {number} scaleX 
     * @param {number} scaleY 
     * @param {number} rotation 
     */
    addInstance(object, x, y, scaleX = 1, scaleY = 1, rotation = 0) {
        let def = createInstanceDef(object, createTransform(x, y, scaleX, scaleY, rotation));
        this._instances.push(def);
        return this;
    }

    reset() {
        this._boundingRect = undefined;
        this._views = [];
        this._instances = [];
    }

    build() {
        let boundingRect = this._boundingRect || createBoundingRect(0, 0, 0, 0);
        let views = this._views;
        let instances = this._instances;
        this.reset();
        let result = createRoomDef(this.roomName, boundingRect, views, instances);
        // @ts-ignore
        this.parentBuilder.rooms[this.roomName] = result;
        return this.parentBuilder;
    }
}

class AssetBuilder {

    /**
     * @param {DefsBuilder} parentBuilder 
     * @param {string} assetName 
     */
    constructor(parentBuilder, assetName) {
        /** @private */
        this.parentBuilder = parentBuilder;
        /** @private */
        this.assetName = assetName;

        /** @private */
        this._loaderType = undefined;
        /** @private */
        this._uri = undefined;
        /** @private */
        this._filepath = undefined;
        /** @private */
        this._options = undefined;
    }

    type(type) {
        this._loaderType = type;
        return this;
    }

    uri(uri) {
        this._uri = uri;
        return this;
    }

    filepath(filepath) {
        this._filepath = filepath;
        return this;
    }

    options(options) {
        this._options = options;
        return this;
    }

    reset() {
        this._loaderType = undefined;
        this._uri = undefined;
        this._filepath = undefined;
        this._options = undefined;
    }

    build() {
        let loaderType = this._loaderType || 'image';
        let uri = this._uri || this.assetName;
        let filepath = this._filepath || uri;
        let options = this._options || {};
        this.reset();
        let result = createAssetDef(this.assetName, loaderType, uri, filepath, options);
        // @ts-ignore
        this.parentBuilder.assets[this.assetName] = result;
        return this.parentBuilder;
    }
}

class SpriteBuilder {

    /**
     * @param {DefsBuilder} parentBuilder 
     * @param {string} spriteName 
     */
    constructor(parentBuilder, spriteName) {
        /** @private */
        this.parentBuilder = parentBuilder;
        /** @private */
        this.spriteName = spriteName;

        /** @private */
        this._image = undefined;
        /** @private */
        this._width = undefined;
        /** @private */
        this._height = undefined;
        /** @private */
        this._originX = undefined;
        /** @private */
        this._originY = undefined;
        /** @private */
        this._mask = undefined;
        /** @private */
        this._frameSpeed = undefined;
        /** @private */
        this._frames = [];
    }

    /**
     * @param {string} assetName 
     * @param {number} width 
     * @param {number} height
     */
    image(assetName, width, height) {
        this._image = assetName;
        this._width = width;
        this._height = height;
        return this;
    }

    origin(x, y) {
        this._originX = x;
        this._originY = y;
        return this;
    }

    mask(type, left, top, right, bottom) {
        this._mask = createMaskDef(type, createBoundingRect(left, top, right, bottom));
        return this;
    }

    frameSpeed(speed) {
        this._frameSpeed = speed;
        return this;
    }

    addFrame(u, v, s, t) {
        this._frames.push([u, v, s, t]);
        return this;
    }
    
    addFrames(u, v, s, t, frameCount, rowLength = frameCount) {
        let dx = s - u;
        let dy = t - v;
        for(let i = 0; i < frameCount; ++i) {
            let x = i * dx;
            let y = Math.floor(i / rowLength) * dy;
            this.addFrame(u + x, v + y, s + x, t + y);
        }
        return this;
    }

    reset() {
        this._image = undefined;
        this._width = undefined;
        this._height = undefined;
        this._originX = undefined;
        this._originY = undefined;
        this._mask = undefined;
        this._frameSpeed = undefined;
        this._frames = [];
    }

    build() {
        let image = this._image || null;
        let imageWidth = this._width || 0;
        let imageHeight = this._height || 0;
        let originX = this._originX || 0;
        let originY = this._originY || 0;
        let mask = this._mask || createMaskDef('aabb', createBoundingRect(0, 0, 0, 0));
        let frameSpeed = this._frameSpeed || 0;
        let frames = this._frames;
        if (frames.length <= 0) {
            frames.push([0, 0, imageWidth, imageHeight]);
        }
        this.reset();
        let result = createSpriteDef(this.spriteName, image, imageWidth, imageHeight, originX, originY, mask, frameSpeed, frames);
        // @ts-ignore
        this.parentBuilder.sprites[this.spriteName] = result;
        return this.parentBuilder;
    }
}

class ObjectBuilder {
    
    /**
     * @param {DefsBuilder} parentBuilder 
     * @param {string} objectName 
     */
    constructor(parentBuilder, objectName) {
        /** @private */
        this.parentBuilder = parentBuilder;
        /** @private */
        this.objectName = objectName;

        /** @private */
        this._sprite = undefined;
        /** @private */
        this._collider = undefined;
        /** @private */
        this._children = [];
        /** @private */
        this._initialVisible = undefined;
        /** @private */
        this._initialTransform = undefined;
    }

    /**
     * @param {string} spriteName
     */
    sprite(spriteName) {
        this._sprite = spriteName;
        return this;
    }

    /**
     * @param {string} spriteName
     */
    collider(spriteName) {
        this._collider = spriteName;
        return this;
    }

    /**
     * @param {string} objectName
     */
    addChild(objectName) {
        this._children.push(objectName);
        return this;
    }

    /**
     * @param {boolean} visible
     */
    visible(visible) {
        this._initialVisible = visible;
        return this;
    }

    /**
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @param {number} scaleX 
     * @param {number} scaleY 
     * @param {number} rotation
     */
    offset(offsetX, offsetY, scaleX = 1, scaleY = 1, rotation = 0) {
        this._initialTransform = createTransform(offsetX, offsetY, scaleX, scaleY, rotation);
        return this;
    }

    reset() {
        this._sprite = undefined;
        this._collider = undefined;
        this._children = [];
        this._initialVisible = undefined;
        this._initialTransform = undefined;
    }

    build() {
        let sprite = this._sprite || null;
        let collider = this._collider || this._sprite;
        let children = this._children || [];
        let initial = createObjectInit(
            this._initialVisible || true,
            this._initialTransform || createTransform(0, 0, 1, 1, 0));
        this.reset();
        let result = createObjectDef(this.objectName, sprite, collider, children, initial);
        // @ts-ignore
        this.parentBuilder.objects[this.objectName] = result;
        return this.parentBuilder;
    }
}

class DefsBuilder {

    constructor() {
        /** @protected */
        this.assets = {};
        /** @protected */
        this.sprites = {};
        /** @protected */
        this.objects = {};
        /** @protected */
        this.rooms = {};
    }

    /**
     * @param {string} assetName
     */
    asset(assetName) {
        return new AssetBuilder(this, assetName);
    }

    /**
     * @param {string} spriteName
     */
    sprite(spriteName) {
        return new SpriteBuilder(this, spriteName);
    }

    /**
     * @param {string} objectName
     */
    object(objectName) {
        return new ObjectBuilder(this, objectName);
    }

    /**
     * @param {string} roomName
     */
    room(roomName) {
        return new RoomBuilder(this, roomName);
    }

    reset() {
        this.assets = {};
        this.sprites = {};
        this.objects = {};
        this.rooms = {};
    }

    build() {
        let assets = this.assets;
        let sprites = this.sprites;
        let objects = this.objects;
        let rooms = this.rooms;
        this.reset();
        return {
            assets,
            sprites,
            objects,
            rooms,
        };
    }
}
