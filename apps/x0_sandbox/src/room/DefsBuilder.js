import { createAssetDef, createBoundingRect, createInstanceDef, createMaskDef, createObjectDef, createObjectInit, createRoomDef, createSpriteDef, createTransform, createViewDef } from './Defs';

export class DefsBuilder {

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

    /**
     * @param {DefsBuilder} defsBuilder 
     */
    fromBuilder(defsBuilder) {
        this.assets = {
            ...this.assets,
            ...defsBuilder.assets,
        };
        this.sprites = {
            ...this.sprites,
            ...defsBuilder.sprites,
        };
        this.objects = {
            ...this.objects,
            ...defsBuilder.objects,
        };
        this.rooms = {
            ...this.rooms,
            ...defsBuilder.rooms,
        };
        return this;
    }

    /**
     * @param {Partial<import('./Defs').Defs>} json 
     */
    fromJSON(json) {
        if (typeof json.assets !== 'undefined') {
            this.assets = {
                ...this.assets,
                ...json.assets,
            };
        }
        if (typeof json.sprites !== 'undefined') {
            this.sprites = {
                ...this.sprites,
                ...json.sprites,
            };
        }
        if (typeof json.objects !== 'undefined') {
            this.objects = {
                ...this.objects,
                ...json.objects,
            };
        }
        if (typeof json.rooms !== 'undefined') {
            this.rooms = {
                ...this.rooms,
                ...json.rooms,
            };
        }
        return this;
    }

    reset() {
        this.assets = {};
        this.sprites = {};
        this.objects = {};
        this.rooms = {};
    }

    /** @returns {import('./Defs').Defs} */
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

export class RoomBuilder {

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
        this._background = undefined;
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
     * @param {number} color
     */
    background(color) {
        this._background = color;
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

    /**
     * @param {Partial<import('./Defs').RoomDef>} json
     */
    fromJSON(json) {
        const {
            boundingRect,
            views,
            instances,
        } = json;
        if (typeof boundingRect !== 'undefined') this._boundingRect = boundingRect;
        if (typeof views !== 'undefined') this._views = views;
        if (typeof instances !== 'undefined') this._instances = instances;
        return this;
    }

    reset() {
        this._boundingRect = undefined;
        this._background = undefined;
        this._views = [];
        this._instances = [];
    }

    build() {
        let boundingRect = this._boundingRect || createBoundingRect(0, 0, 0, 0);
        let background = this._background || 0x000000;
        let views = this._views;
        let instances = this._instances;
        this.reset();
        let result = createRoomDef(this.roomName, boundingRect, background, views, instances);
        // @ts-ignore
        this.parentBuilder.rooms[this.roomName] = result;
        return this.parentBuilder;
    }
}

export class AssetBuilder {

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

    /**
     * @param {Partial<import('./Defs').AssetDef>} json
     */
    fromJSON(json) {
        const {
            type,
            uri,
            filepath,
            options,
        } = json;
        if (typeof type !== 'undefined') this._loaderType = type;
        if (typeof uri !== 'undefined') this._uri = uri;
        if (typeof filepath !== 'undefined') this._filepath = filepath;
        if (typeof options !== 'undefined') this._options = options;
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

export class SpriteBuilder {

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
        /** @private */
        this._originCentered = false;
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

    centered() {
        this._originCentered = true;
        return this;
    }

    origin(x, y) {
        this._originX = x;
        this._originY = y;
        this._originCentered = false;
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
        for (let i = 0; i < frameCount; ++i) {
            let x = (i % rowLength) * dx;
            let y = Math.floor(i / rowLength) * dy;
            this.addFrame(u + x, v + y, s + x, t + y);
        }
        return this;
    }

    /**
     * @param {Partial<import('./Defs').SpriteDef>} json
     */
    fromJSON(json) {
        const {
            image,
            width,
            height,
            originX,
            originY,
            mask,
            frameSpeed,
            frames,
        } = json;
        if (typeof image !== 'undefined') this._image = image;
        if (typeof width !== 'undefined') this._width = width;
        if (typeof height !== 'undefined') this._height = height;
        if (typeof originX !== 'undefined') this._originX = originX;
        if (typeof originY !== 'undefined') this._originY = originY;
        if (typeof originX !== 'undefined' || typeof originY !== 'undefined') this._originCentered = false;
        if (typeof mask !== 'undefined') this._mask = mask;
        if (typeof frameSpeed !== 'undefined') this._frameSpeed = frameSpeed;
        if (typeof frames !== 'undefined') this._frames = frames;
        return this;
    }

    reset() {
        this._image = undefined;
        this._width = undefined;
        this._height = undefined;
        this._originX = undefined;
        this._originY = undefined;
        this._originCentered = false;
        this._mask = undefined;
        this._frameSpeed = undefined;
        this._frames = [];
    }

    build() {
        let image = this._image || null;
        let imageWidth = this._width || 0;
        let imageHeight = this._height || 0;
        let originX = this._originX || (this._originCentered ? imageWidth / 2 : 0);
        let originY = this._originY || (this._originCentered ? imageHeight / 2 : 0);
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

export class ObjectBuilder {

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

    /**
     * @param {Partial<import('./Defs').ObjectDef>} json
     */
    fromJSON(json) {
        const {
            sprite,
            collider,
            children,
            initial,
        } = json;
        if (typeof sprite !== 'undefined') this._sprite = sprite;
        if (typeof collider !== 'undefined') this._collider = collider;
        if (typeof children !== 'undefined') this._children = children;
        if (typeof initial !== 'undefined') {
            const {
                visible,
                transform,
            } = initial;
            if (typeof visible !== 'undefined') this._initialVisible = visible;
            if (typeof transform !== 'undefined') this._initialTransform = transform;
        }
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
