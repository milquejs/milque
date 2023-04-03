import { AssetManager, AssetRef, ImageLoader } from '@milque/asset';

import { ObjectDef } from '../room2/object';
import { SpriteDef } from '../room2/sprite';

//@ts-ignore
import PATH_HAND_FONT from '../054/hand_font.png';

export const imgFont    = new AssetRef('hand_font.png', ImageLoader, undefined, PATH_HAND_FONT);
export const spFont     = new AssetRef('sp_font', async () => SpriteDef.fromSpriteSheet(imgFont.uri, 16, 16, 0, 0, 8, 6, 0, 48, 5));
export const objFont    = new AssetRef('obj_font', async () => ObjectDef.fromJSON({ sprite: spFont.uri }));

/**
 * @param {AssetManager} assets 
 */
export async function loadFontAssets(assets) {
    await Promise.all([
        imgFont.load(assets),
        spFont.load(assets),
        objFont.load(assets),
    ]);
}
