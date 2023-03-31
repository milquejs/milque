/**
 * @typedef Defs
 * @property {Record<string, RoomDef>} rooms
 * @property {Record<string, AssetDef>} assets
 * @property {Record<string, SpriteDef>} sprites
 * @property {Record<string, ObjectDef>} objects
 */

/**
 * @typedef {ReturnType<createSpriteDef>} SpriteDef
 * @typedef {ReturnType<createObjectDef>} ObjectDef
 * @typedef {ReturnType<createAssetDef>} AssetDef
 * @typedef {ReturnType<createRoomDef>} RoomDef
 * @typedef {ReturnType<createViewDef>} ViewDef
 * @typedef {ReturnType<createMaskDef>} MaskDef
 * @typedef {ReturnType<createInstanceDef>} InstanceDef
 */

/**
 * @typedef {ReturnType<createBoundingRect>} BoundingRect
 * @typedef {ReturnType<createTransform>} Transform
 * @typedef {ReturnType<createObjectInit>} ObjectInit
 * @typedef {[u: number, v: number, s: number, t: number]} SpriteFrame
 */

/**
 * @param {string} name 
 * @param {BoundingRect} boundingRect 
 * @param {Array<ViewDef>} views 
 * @param {Array<InstanceDef>} instances
 */
export function createRoomDef(name, boundingRect, views, instances) {
    return {
        name,
        boundingRect,
        views,
        instances,
    };
}

/**
 * @param {'aabb'} maskType
 * @param {BoundingRect} boundingRect
 */
export function createMaskDef(maskType, boundingRect) {
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
export function createBoundingRect(left, top, right, bottom) {
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
 * @param {MaskDef} mask
 * @param {number} frameSpeed 
 * @param {Array<SpriteFrame>} frames 
 */
export function createSpriteDef(name, image, imageWidth, imageHeight, originX, originY, mask, frameSpeed, frames) {
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
 * @param {ObjectInit} [initial]
 */
export function createObjectDef(name, sprite, collider = sprite, children = [], initial = createObjectInit(true)) {
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
 * @param {Transform} transform
 */
export function createObjectInit(visible = true, transform = createTransform(0, 0, 1, 1, 0)) {
    return {
        visible,
        transform,
    };
}

/**
 * @param {string} object
 * @param {Transform} transform
 */
export function createInstanceDef(object, transform) {
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
export function createTransform(x, y, scaleX = 1, scaleY = 1, rotation = 0) {
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
export function createAssetDef(name, loaderType, uri = name, filepath = uri, options = {}) {
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
export function createViewDef(name, offsetX, offsetY, width, height) {
    return {
        name,
        offsetX,
        offsetY,
        width,
        height,
    };
}
