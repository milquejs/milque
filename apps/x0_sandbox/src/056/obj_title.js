import { AssetRef } from '@milque/asset';
import { Topic } from '@milque/scene';

import { ObjectDef } from '../room2/object';
import { useContext, useCurrentTopics, useWhen, useWhenAsync } from '../runner';
import { Init, PostInit, Preload } from './main';
import { AssetProvider, EntityProvider, RenderingProvider } from './Providers';
import { useSpawner } from './RoomSystem';
import { SpriteDef } from '../room2/sprite';
import { getSpriteDef } from '../room2/Defs';

/**
 * - I wanted to set sprite initials in object definition, but was unable to.
 * - Drawing sprites from object is hard. Too many params.
 * - Entity must be flushed before use. That might trip people up.
 * - Z-depth and spawn ordering is lost-- kind of.
 * - ObjectTopicRegistry should own update and draw calls.
 */

export const objTitle = new AssetRef('obj_title', async () => {
    let def = ObjectDef.create('sp_font');
    // def.initial.spriteIndex = 'space';
    return def;
});

export function stringToFrameIndex(text) {
    let result = [];
    for(let c of String(text)) {
        let code = c.charCodeAt(0);
        if (code >= 48 && code < 58) {
            let i = (code - 48) + 26;
            result.push(i);
        } else if (code >= 65 && code < 91) {
            let i = (code - 65) + 0;
            result.push(i);
        } else if (code >= 97 && code < 123) {
            let i = (code - 97) + 0;
            result.push(i);
        } else if (code === 46) {
            // .
            result.push(36);
        } else if (code === 32) {
            // SPACE
            result.push(47);
        } else if (code === 33) {
            // !
            result.push(37);
        } else if (code === 63) {
            // ?
            result.push(38);
        } else if (code === 45) {
            // -
            result.push(39);
        } else if (code === 43) {
            // +
            result.push(40);
        } else if (code === 61) {
            // =
            result.push(41);
        } else if (code === 58) {
            // :
            result.push(42);
        } else if (code === 59) {
            // ;
            result.push(43);
        } else if (code === 44) {
            // ,
            result.push(44);
        } else if (code === 40) {
            // (
            result.push(45);
        } else if (code === 41) {
            // )
            result.push(46);
        } else {
            // UNKNOWN
            result.push(38);
        }
    }
    return result;
}

export function TitleSystem(m) {
    const object = useObjectDef(m, objTitle, 100, 70, -1);
    let ents = useContext(m, EntityProvider);
    let assets = useContext(m, AssetProvider);
    let { ctx, tia } = useContext(m, RenderingProvider);
    let title = 'Pablo 4';
    let spaceIndex = stringToFrameIndex(' ')[0];
    let frames = stringToFrameIndex(title);

    useWhen(m, object.ObjectInit, 0, (self) => {
        let sprite = SpriteDef.getInstance(ents, self.spriteId);
        sprite.frameSpeed = 0;
        sprite.frameDelta = 0;
        sprite.spriteIndex = 1;
    });

    useWhen(m, object.ObjectDraw, 0, (self) => {
        let sprite = SpriteDef.getInstance(ents, self.spriteId);
        let spriteDef = getSpriteDef(assets, sprite.spriteName);
        let image = assets.get(spriteDef.image);
        let x = 0;
        for(let frame of frames) {
            sprite.spriteIndex = frame;
            tia.matPos(x, 0);
            tia.push();
            tia.matBegin(ctx);
            SpriteDef.drawInstance(ctx, sprite.spriteIndex, spriteDef, image);
            tia.matEnd(ctx);
            tia.pop();
            x += 14;
        }
        sprite.spriteIndex = spaceIndex;
    });
}

/**
 * @template M
 * @param {M} m 
 * @returns {Map<string, {
 *  update: Array<Topic<import('../room2/object/ObjectDef').ObjectInstance>>,
 *  draw: Array<Topic<import('../room2/object/ObjectDef').ObjectInstance>>,
 * }>}
 */
export function ObjectTopicRegistry(m) {
    return new Map();
}

/**
 * @template M
 * @param {M} m 
 * @param {AssetRef<import('../room2/object/ObjectDef').ObjectDef>} objectAssetRef 
 * @param {number} x 
 * @param {number} y 
 * @param {number} [z]
 */
export function useObjectDef(m, objectAssetRef, x, y, z = 0) {
    /** @type {Topic<import('../room2/object/ObjectDef').ObjectInstance>} */
    const ObjectInit = new Topic(`objectInit:${objectAssetRef.uri}`);
    /** @type {Topic<import('../room2/object/ObjectDef').ObjectInstance>} */
    const ObjectUpdate = new Topic(`objectUpdate:${objectAssetRef.uri}`);
    /** @type {Topic<import('../room2/object/ObjectDef').ObjectInstance>} */
    const ObjectDraw = new Topic(`objectDraw:${objectAssetRef.uri}`);

    let topics = useCurrentTopics(m);
    let objectTopicRegistry = useContext(m, ObjectTopicRegistry);
    let result = objectTopicRegistry.get(objectAssetRef.uri);
    if (!result) {
        objectTopicRegistry.set(objectAssetRef.uri, {
            update: [],
            draw: [],
        });
        result = objectTopicRegistry.get(objectAssetRef.uri);
    }
    result.update.push(ObjectUpdate);
    result.draw.push(ObjectDraw);

    let assets = useContext(m, AssetProvider);
    let spawn = useSpawner(m);
    let entityId = null;

    useWhenAsync(m, Preload, 0, async () => {
        await objectAssetRef.load(assets);
    });

    useWhen(m, Init, z, () => {
        entityId = spawn(objectAssetRef.uri, x, y);
    })

    useWhen(m, PostInit, 0, () => {
        ObjectInit.dispatchImmediately(topics, entityId);
    });

    return {
        ObjectInit,
        ObjectUpdate,
        ObjectDraw,
    };
}
