import { AssetManager, AssetRef, ImageLoader } from '@milque/asset';

import { ObjectDef } from '../room2/object';
import { SpriteDef, SpriteDefLoader } from '../room2/sprite';

//@ts-ignore
import PATH_BUNNY from '../054/bunny.png';
//@ts-ignore
import PATH_BUNNY_OCCUPIED from '../054/bunny_occupied.png';
//@ts-ignore
import PATH_BUNNY_SEATED from '../054/bunny_seated.png';
//@ts-ignore
import PATH_SP_BUNNY from '../056/sp_bunny.json';

export const imgBunny              = new AssetRef('bunny.png', ImageLoader, undefined, PATH_BUNNY);
export const imgBunnyOccupied      = new AssetRef('bunny_occupied.png', ImageLoader, undefined, PATH_BUNNY_OCCUPIED);
export const imgBunnySeated        = new AssetRef('bunny_seated.png', ImageLoader, undefined, PATH_BUNNY_SEATED);

export const spBunny               = new AssetRef('sp_bunny', SpriteDefLoader, undefined, PATH_SP_BUNNY);
export const spBunnyEyes           = new AssetRef('sp_bunny_eyes', async () => SpriteDef.fromSpriteSheet(imgBunny.uri, 64, 64, 0, 0, 5, 1, 3, 5, 10));
export const spBunnyOccupied       = new AssetRef('sp_bunny_occupied', async () => SpriteDef.fromSpriteSheet(imgBunnyOccupied.uri, 64, 64, 0, 0, 2, 1, 0, 2, 0.6));
export const spBunnySeated         = new AssetRef('sp_bunny_seated', async () => SpriteDef.fromSpriteSheet(imgBunnySeated.uri, 64, 64, 0, 0, 4, 1, 0, 2, 0.6));
export const spBunnySeatedEyes     = new AssetRef('sp_bunny_seated_eyes', async () => SpriteDef.fromSpriteSheet(imgBunnySeated.uri, 64, 64, 0, 0, 4, 1, 2, 4, 0.6));

export const objBunnyEyes          = new AssetRef('obj_bunny_eyes', async () => ObjectDef.fromJSON({ sprite: spBunnyEyes.uri }));
export const objBunny              = new AssetRef('obj_bunny', async () => ObjectDef.fromJSON({ sprite: spBunny.uri, children: [objBunnyEyes.uri] }));
export const objBunnyOccupied      = new AssetRef('obj_bunny_occupied', async () => ObjectDef.fromJSON({ sprite: spBunnyOccupied.uri }));
export const objBunnySeatedEyes    = new AssetRef('obj_bunny_seated_eyes', async () => ObjectDef.fromJSON({ sprite: spBunnySeatedEyes.uri }));
export const objBunnySeated        = new AssetRef('obj_bunny_seated', async () => ObjectDef.fromJSON({ sprite: spBunnySeated.uri, children: [objBunnySeatedEyes.uri] }));

const REFS = [
    imgBunny,
    imgBunnyOccupied,
    imgBunnySeated,
    spBunny,
    spBunnyEyes,
    spBunnyOccupied,
    spBunnySeated,
    spBunnySeatedEyes,
    objBunnyEyes,
    objBunny,
    objBunnyOccupied,
    objBunnySeatedEyes,
    objBunnySeated,
];

/**
 * @param {AssetManager} assets 
 */
export async function loadBunnyAssets(assets) {
    await Promise.all(REFS.map(ref => ref.load(assets)));
}
