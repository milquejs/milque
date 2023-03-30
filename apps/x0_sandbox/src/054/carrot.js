import { AssetRef, ImageLoader } from '@milque/asset';
// @ts-ignore
import FILEPATH from './carrot.png';
export default new AssetRef('carrot.png', ImageLoader, { imageType: 'png' }, FILEPATH);
