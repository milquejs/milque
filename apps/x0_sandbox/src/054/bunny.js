import { AssetRef, ImageLoader } from '@milque/asset';
// @ts-ignore
import FILEPATH from './bunny.png';
export default new AssetRef('bunny.png', ImageLoader, { imageType: 'png' }, FILEPATH);
