import { AssetRef, ImageLoader } from '@milque/asset';

import { AssetProvider, DisplayProvider } from './main';
import { useContext } from './runner';
import * as BoySystem from './boy/BoySystem';

import { Tia } from './Tia';

// @ts-ignore
import STAR_PATH from './star.png';
const StarImage = new AssetRef('star.png', ImageLoader, { imageType: 'png' }, STAR_PATH);

export const PROVIDERS = [
    GameProvider
];

export function GameProvider(m) {
    const { canvas } = useContext(m, DisplayProvider);
    const ctx = canvas.getContext('2d');
    const tia = new Tia();
    return {
        tia,
        ctx,
    };
}

export async function preload(m) {
    await BoySystem.preload(m);

    const { assets } = useContext(m, AssetProvider);
    await StarImage.load(assets);

    const { display } = useContext(m, DisplayProvider);
    display.width = 350;
    display.height = 250;
    display.mode = 'scale';
}

export function init(m) {
    BoySystem.init(m);
}

export function update(m) {
    BoySystem.update(m);
}

export function draw(m) {
    const { ctx, tia } = useContext(m, GameProvider);
    const { display } = useContext(m, DisplayProvider);
    const { assets } = useContext(m, AssetProvider);

    tia.cls(ctx, 0xFFFFFF);
    tia.camera(display.width / 2 - 0.5, display.height / 2 - 0.5, 3, 3);

    let img = StarImage.get(assets);
    tia.spr(ctx, img, 0, 10, 10, img.width, img.height);

    BoySystem.draw(m);
}
