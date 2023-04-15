import { AssetRef, ImageLoader } from '@milque/asset';
import { createSpriteDef } from '../../room3/sprite';

//@ts-ignore
import PATH_PANTS from '../../054/pants.png';

export const imgPants       = new AssetRef('pants.png', ImageLoader, undefined, PATH_PANTS);
export const spPants        = new AssetRef('sp_pants', async () => createSpriteDef(imgPants.uri, 128, 128));
