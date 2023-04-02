import { AssetManager, ImageLoader } from '@milque/asset';
import { ComponentClass, EntityManager, Query } from '@milque/scene';
import { useContext, useCurrentAnimationFrameDetail, useWhenSystemPreload, useWhenSystemUpdate } from '../runner';

/**
 * @typedef {ReturnType<createSpriteDef>} SpriteDef
 * @typedef {ReturnType<createSpriteInitial>} SpriteInitial
 * @typedef {ReturnType<createSpriteFrame>} SpriteFrame
 * @typedef {ReturnType<createSpriteImageDef>} SpriteImageDef
 */

export class SpriteImageLoaderManager {
    constructor() {
        /**
         * @private
         * @type {Record<string, import('@milque/asset').AssetLoader<?, CanvasImageSource>>}
         */
        this.defs = {};
    }

    define(name, def) {
        this.defs[name] = def;
    }

    get(name) {
        return this.defs[name];
    }

    keys() {
        return Object.keys(this.defs);
    }
}

export class SpriteImageManager {
    constructor() {
        /**
         * @private
         * @type {Record<string, SpriteImageDef>}
         */
        this.defs = {};
    }

    define(name, def) {
        this.defs[name] = def;
    }

    get(name) {
        return this.defs[name];
    }

    keys() {
        return Object.keys(this.defs);
    }
}

export class SpriteManager {
    constructor() {
        /**
         * @private
         * @type {Record<string, SpriteDef>}
         */
        this.defs = {};
    }

    /**
     * @param {string} name 
     * @param {SpriteDef} def 
     */
    define(name, def) {
        this.defs[name] = def;
    }

    /**
     * @param {string} name 
     * @returns {SpriteDef}
     */
    get(name) {
        return this.defs[name];
    }

    keys() {
        return Object.keys(this.defs);
    }
}

/**
 * @param {string} uri 
 * @param {string} filepath
 * @param {string} loader 
 * @param {object} opts
 */
export function createSpriteImageDef(uri, filepath, loader, opts) {
    return {
        uri,
        filepath,
        loader,
        opts,
    };
}

/**
 * @param {number} u 
 * @param {number} v 
 * @param {number} s 
 * @param {number} t
 */
export function createSpriteFrame(u, v, s, t) {
    return [u, v, s, t];
}

/**
 * @param {number} u 
 * @param {number} v 
 * @param {number} s 
 * @param {number} t 
 * @param {number} cols 
 * @param {number} rows 
 * @param {number} from 
 * @param {number} to
 */
export function createSpriteFramesFromSheet(u, v, s, t, cols, rows, from = 0, to = cols * rows) {
    let results = [];
    let dx = s - u;
    let dy = t - v;
    for (let i = from; i < to; ++i) {
        let x = (i % cols) * dx;
        let y = Math.floor(i / cols) * dy;
        results.push(createSpriteFrame(u + x, v + y, s + x, t + y));
    }
    return results;
}

/**
 * @param {Partial<SpriteDef>} json
 */
export function createSpriteDefFromJSON(json) {
    let {
        name,
        image,
        width = 0,
        height = 0,
        originX = 0,
        originY = 0,
        frames = [createSpriteFrame(0, 0, width, height)],
        frameCount = frames.length,
        initial = {},
    } = json;
    const {
        frameSpeed = 0,
        spriteIndex = 0,
    } = /** @type {Partial<SpriteInitial>} */ (initial);
    return createSpriteDef(
        name, image, width, height,
        originX, originY,
        frameCount, frames,
        createSpriteInitial(frameSpeed, spriteIndex));
}

/**
 * @param {string} name 
 * @param {string} image 
 * @param {number} width 
 * @param {number} height 
 * @param {number} originX 
 * @param {number} originY 
 * @param {number} frameCount 
 * @param {Array<SpriteFrame>} frames 
 * @param {SpriteInitial} initial
 */
export function createSpriteDef(
    name, image,
    width, height,
    originX, originY,
    frameCount, frames,
    initial) {
    return {
        name,
        image,
        width,
        height,
        originX,
        originY,
        frameCount,
        frames,
        initial,
    };
}

/**
 * @param {number} frameSpeed 
 * @param {number} spriteIndex
 */
export function createSpriteInitial(frameSpeed = 0, spriteIndex = 0) {
    return {
        frameSpeed,
        spriteIndex,
    };
}

export const SpriteProviders = {
    EntityManagerForSpriteSystem() {
        throw new Error('Not yet implemented.');
        return new EntityManager();
    },
    AssetManagerForSpriteSystem() {
        throw new Error('Not yet implemented.');
        return new AssetManager();
    },
    SpriteManagerForSpriteSystem() {
        return new SpriteManager();
    },
    SpriteImageManagerForSpriteSystem() {
        return new SpriteImageManager();
    },
    SpriteImageLoaderManagerForSpriteSystem() {
        let result = new SpriteImageLoaderManager();
        result.define('image', ImageLoader);
        return result;
    },
    OptionsForSpriteSystem() {
        return {
            assetTimeout: 5_000,
        };
    },
};

export const SpriteComponent = new ComponentClass('sprite', () => ({
    spriteName: null,
    spriteIndex: 0,
    frameSpeed: 0,
    frameDelta: 0,
}));
export const SpriteQuery = new Query(SpriteComponent);

/**
 * @param {SpriteImageManager} imageManager 
 * @param {SpriteImageDef} imageDef
 */
export function registerImageDef(imageManager, imageDef) {
    imageManager.define(imageDef.name, imageDef);
    return imageDef;
}

/**
 * @param {SpriteManager} spriteManager 
 * @param {SpriteDef} spriteDef 
 */
export function registerSpriteDef(spriteManager, spriteDef) {
    spriteManager.define(spriteDef.name, spriteDef);
    return spriteDef;
}

/**
 * @param {EntityManager} ents 
 * @param {import('@milque/scene').EntityId} entityId 
 * @param {SpriteDef} spriteDef 
 */
export function attachSprite(ents, entityId, spriteDef) {
    let sprite = ents.attach(entityId, SpriteComponent);
    sprite.spriteName = spriteDef.name;
    return sprite;
}

export function SpriteSystem(m) {
    let ents = useContext(m, SpriteProviders.EntityManagerForSpriteSystem);
    let sprs = useContext(m, SpriteProviders.SpriteManagerForSpriteSystem);
    let assets = useContext(m, SpriteProviders.AssetManagerForSpriteSystem);
    let images = useContext(m, SpriteProviders.SpriteImageManagerForSpriteSystem);
    let loaders = useContext(m, SpriteProviders.SpriteImageLoaderManagerForSpriteSystem);
    let opts = useContext(m, SpriteProviders.OptionsForSpriteSystem);
    let frameDetail = useCurrentAnimationFrameDetail(m);

    useWhenSystemPreload(m, 0, async () => {
        // Preload all images for pre-registered sprites.
        let results = [];
        for(let spriteName of sprs.keys()) {
            let def = sprs.get(spriteName);
            let imageDef = images.get(def.image);
            let loader = loaders.get(imageDef.loader);
            results.push(assets.load(imageDef.uri, imageDef.filepath, loader, imageDef.opts, opts.assetTimeout));
        }
        await Promise.all(results);
    });

    useWhenSystemUpdate(m, 0, () => {
        // Animate sprites.
        for(let [_, sprite] of SpriteQuery.findAll(ents)) {
            let def = sprs.get(sprite.spriteName);
            if (sprite.frameSpeed === 0) {
                continue;
            }
            sprite.frameDelta += (frameDetail.deltaTime / 1_000) * sprite.frameSpeed;
            let framesSkipped = Math.floor(sprite.frameDelta);
            sprite.frameDelta -= framesSkipped;
            let nextIndex = (sprite.spriteIndex + framesSkipped) % def.frameCount;
            if (nextIndex < 0) {
                nextIndex += def.frameCount;
            }
            sprite.spriteIndex = nextIndex;
        }
    });
}
