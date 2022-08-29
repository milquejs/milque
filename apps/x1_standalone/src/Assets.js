import { AssetRef } from '@milque/asset';

import { loadImage as ImageLoader } from './loaders/ImageLoader.js';

export const ASSETS = {
    ImageToast: new AssetRef('toast', 'res/toast.png', ImageLoader),
};
