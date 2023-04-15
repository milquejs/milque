import { AssetRef, ImageLoader } from '@milque/asset';
import { createSpriteDefFromSpriteSheet } from '../../room3/sprite';

//@ts-ignore
import PATH_HAND_FONT from '../../054/hand_font.png';

export const imgFont    = new AssetRef('hand_font.png', ImageLoader, undefined, PATH_HAND_FONT);
export const spFont     = new AssetRef('sp_font', async () => createSpriteDefFromSpriteSheet(imgFont.uri, 16, 16, 0, 0, 8, 6, 0, 48));
