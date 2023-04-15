import { AssetRef, ImageLoader } from '@milque/asset';
import { SpriteLoader, createSpriteDefFromSpriteSheet } from '../../room3/sprite';
import { createMaskDef } from '../../room3/mask';

//@ts-ignore
import PATH_BUNNY from '../../054/bunny.png';
//@ts-ignore
import PATH_BUNNY_OCCUPIED from '../../054/bunny_occupied.png';
//@ts-ignore
import PATH_BUNNY_SEATED from '../../054/bunny_seated.png';
//@ts-ignore
import PATH_SP_BUNNY from '../../056/sp_bunny.json';

export const imgBunny              = new AssetRef('bunny.png', ImageLoader, undefined, PATH_BUNNY);
export const imgBunnyOccupied      = new AssetRef('bunny_occupied.png', ImageLoader, undefined, PATH_BUNNY_OCCUPIED);
export const imgBunnySeated        = new AssetRef('bunny_seated.png', ImageLoader, undefined, PATH_BUNNY_SEATED);

export const spBunny               = new AssetRef('sp_bunny', SpriteLoader, undefined, PATH_SP_BUNNY);
export const spBunnyEyes           = new AssetRef('sp_bunny_eyes', async () => createSpriteDefFromSpriteSheet(imgBunny.uri, 64, 64, 0, 0, 5, 1, 3, 5));
export const spBunnyOccupied       = new AssetRef('sp_bunny_occupied', async () => createSpriteDefFromSpriteSheet(imgBunnyOccupied.uri, 64, 64, 0, 0, 2, 1, 0, 2));
export const spBunnySeated         = new AssetRef('sp_bunny_seated', async () => createSpriteDefFromSpriteSheet(imgBunnySeated.uri, 64, 64, 0, 0, 4, 1, 0, 2));
export const spBunnySeatedEyes     = new AssetRef('sp_bunny_seated_eyes', async () => createSpriteDefFromSpriteSheet(imgBunnySeated.uri, 64, 64, 0, 0, 4, 1, 2, 4));

export const mskBunny              = new AssetRef('msk_bunny', async () => createMaskDef('box', 0, 0, 64, 64));
