import { AssetRef, ImageLoader } from '@milque/asset';

import { ObjectDef } from '../room2/object';
import { SpriteDef } from '../room2/sprite';

// @ts-ignore
import PATH_GROUND from '../054/ground.png';
// @ts-ignore
import PATH_GRASS from '../054/grass.png';
// @ts-ignore
import PATH_STONE from '../054/stone.png';
// @ts-ignore
import PATH_HOVEL from '../054/hovel.png';
// @ts-ignore
import PATH_HOVEL_OCCUPIED from '../054/hovel_occupied.png';
// @ts-ignore
import PATH_TUFT from '../054/tuft.png';

export const imgGround           = new AssetRef('ground.png', ImageLoader, undefined, PATH_GROUND);
export const imgGrass            = new AssetRef('grass.png', ImageLoader, undefined, PATH_GRASS);
export const imgStone            = new AssetRef('stone.png', ImageLoader, undefined, PATH_STONE);
export const imgHovel            = new AssetRef('hovel.png', ImageLoader, undefined, PATH_HOVEL);
export const imgHovelOccupied    = new AssetRef('hovel_occupied.png', ImageLoader, undefined, PATH_HOVEL_OCCUPIED);
export const imgTuft             = new AssetRef('tuft.png', ImageLoader, undefined, PATH_TUFT);

export const spGround            = new AssetRef('sp_ground', async () => SpriteDef.create(imgGround.uri, 32, 32));
export const spGrass             = new AssetRef('sp_grass', async () => SpriteDef.create(imgGrass.uri, 16, 16));
export const spStone             = new AssetRef('sp_stone', async () => SpriteDef.create(imgStone.uri, 8, 8));
export const spHovel             = new AssetRef('sp_hovel', async () => SpriteDef.create(imgHovel.uri, 48, 48));
export const spHovelOccupied     = new AssetRef('sp_hovel_occupied', async () => SpriteDef.create(imgHovelOccupied.uri, 48, 48));
export const spTuft              = new AssetRef('sp_tuft', async () => SpriteDef.fromSpriteSheet('tuft.png', 16, 16, 0, 0, 4, 1, 0, 4, 5));

export const objGround           = new AssetRef('obj_ground', async () => ObjectDef.create(spGround.uri));
export const objGrass            = new AssetRef('obj_grass', async () => ObjectDef.create(spGrass.uri));
export const objStone            = new AssetRef('obj_stone', async () => ObjectDef.create(spStone.uri));
export const objHovel            = new AssetRef('obj_hovel', async () => ObjectDef.create(spHovel.uri));
export const objHovelOccupied    = new AssetRef('obj_hovel_occupied', async () => ObjectDef.create(spHovelOccupied.uri));
export const objTuft             = new AssetRef('obj_tuft', async () => ObjectDef.create(spTuft.uri));
