import { AssetRef, ImageLoader } from '@milque/asset';
import { createSpriteDefFromSpriteSheet } from '../../room3/sprite';

// @ts-ignore
import PATH_DUST from '../../058/dust.png';

export const imgDust           = new AssetRef('dust.png', ImageLoader, undefined, PATH_DUST);
export const spDust            = new AssetRef('sp_dust', async () => createSpriteDefFromSpriteSheet(imgDust.uri, 16, 16, 0, 0, 4, 1));
