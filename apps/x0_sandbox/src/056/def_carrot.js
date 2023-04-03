import { AssetRef, ImageLoader } from '@milque/asset';

import { ObjectDef } from '../room2/object';
import { SpriteDef } from '../room2/sprite';

// @ts-ignore
import PATH_CARROT from '../054/carrot.png';
// @ts-ignore
import PATH_CARROT_BITTEN_1 from '../054/carrot_bitten_1.png';
// @ts-ignore
import PATH_CARROT_BITTEN_2 from '../054/carrot_bitten_2.png';

export const imgCarrot           = new AssetRef('carrot.png', ImageLoader, undefined, PATH_CARROT);
export const imgCarrotBitten1    = new AssetRef('carrot_bitten_1.png', ImageLoader, undefined, PATH_CARROT_BITTEN_1);
export const imgCarrotBitten2    = new AssetRef('carrot_bitten_2.png', ImageLoader, undefined, PATH_CARROT_BITTEN_2);

export const spCarrot            = new AssetRef('sp_carrot', async () => SpriteDef.create(imgCarrot.uri, 8, 32));
export const spCarrotBitten1     = new AssetRef('sp_carrot_bitten_1', async () => SpriteDef.fromSpriteSheet(imgCarrotBitten1.uri, 8, 32, 0, 0, 3, 1, 0, 3, 10));
export const spCarrotBitten2     = new AssetRef('sp_carrot_bitten_2', async () => SpriteDef.fromSpriteSheet(imgCarrotBitten2.uri, 8, 32, 0, 0, 3, 1, 0, 3, 10));

export const objCarrot           = new AssetRef('obj_carrot', async () => ObjectDef.create(spCarrot.uri));
export const objCarrotBitten1    = new AssetRef('obj_carrot_bitten_1', async () => ObjectDef.create(spCarrotBitten1.uri));
export const objCarrotBitten2    = new AssetRef('obj_carrot_bitten_2', async () => ObjectDef.create(spCarrotBitten2.uri));
