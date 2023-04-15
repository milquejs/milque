import { AssetRef, ImageLoader } from '@milque/asset';
import { createSpriteDef, createSpriteDefFromSpriteSheet } from '../../room3/sprite';

// @ts-ignore
import PATH_GROUND from '../../054/ground.png';
// @ts-ignore
import PATH_GRASS from '../../054/grass.png';
// @ts-ignore
import PATH_STONE from '../../054/stone.png';
// @ts-ignore
import PATH_HOVEL from '../../054/hovel.png';
// @ts-ignore
import PATH_HOVEL_OCCUPIED from '../../054/hovel_occupied.png';
// @ts-ignore
import PATH_TUFT from '../../054/tuft.png';

export const imgGround           = new AssetRef('ground.png', ImageLoader, undefined, PATH_GROUND);
export const imgGrass            = new AssetRef('grass.png', ImageLoader, undefined, PATH_GRASS);
export const imgStone            = new AssetRef('stone.png', ImageLoader, undefined, PATH_STONE);
export const imgHovel            = new AssetRef('hovel.png', ImageLoader, undefined, PATH_HOVEL);
export const imgHovelOccupied    = new AssetRef('hovel_occupied.png', ImageLoader, undefined, PATH_HOVEL_OCCUPIED);
export const imgTuft             = new AssetRef('tuft.png', ImageLoader, undefined, PATH_TUFT);

export const spGround            = new AssetRef('sp_ground', async () => createSpriteDef(imgGround.uri, 32, 32));
export const spGrass             = new AssetRef('sp_grass', async () => createSpriteDef(imgGrass.uri, 16, 16));
export const spStone             = new AssetRef('sp_stone', async () => createSpriteDef(imgStone.uri, 8, 8));
export const spHovel             = new AssetRef('sp_hovel', async () => createSpriteDef(imgHovel.uri, 48, 48));
export const spHovelOccupied     = new AssetRef('sp_hovel_occupied', async () => createSpriteDef(imgHovelOccupied.uri, 48, 48));
export const spTuft              = new AssetRef('sp_tuft', async () => createSpriteDefFromSpriteSheet('tuft.png', 16, 16, 0, 0, 4, 1, 0, 4));
