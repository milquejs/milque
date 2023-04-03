import { AssetManager, AssetRef, ImageLoader } from '@milque/asset';

import { ObjectDef } from '../room2/object';
import { SpriteDef } from '../room2/sprite';

//@ts-ignore
import PATH_PANTS from '../054/pants.png';

export const imgPants       = new AssetRef('pants.png', ImageLoader, undefined, PATH_PANTS);
export const spPants        = new AssetRef('sp_pants', async () => SpriteDef.create(imgPants.uri, 128, 128));
export const objPants       = new AssetRef('obj_pants', async () => ObjectDef.fromJSON({ sprite: spPants.uri }));

const REFS = [
    imgPants,
    spPants,
    objPants,
];

/**
 * @param {AssetManager} assets 
 */
export async function loadPantsAssets(assets) {
    await Promise.all(REFS.map(ref => ref.load(assets)));
}
