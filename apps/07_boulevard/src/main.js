import './reload';
import './error';

import { FlexCanvas } from '@milque/display';
import { AnimationFrameLoop } from '@milque/scene';
import { AxisBinding, InputPort, KeyCodes } from '@milque/input';
import { AssetManager, AssetRef, ImageLoader, preloadAssetRefs } from '@milque/asset';

import { Tia } from './Tia';

import CAR_IMAGE_FILE from './car.png';

const assets = {
    carImage: new AssetRef('carImage', ImageLoader, { imageType: 'png' }, CAR_IMAGE_FILE),
};

const bindings = {
    cursorX: new AxisBinding('cursorX', KeyCodes.MOUSE_POS_X),
    cursorY: new AxisBinding('cursorY', KeyCodes.MOUSE_POS_Y),
};

window.addEventListener('DOMContentLoaded', main);

async function main() {
    const { canvas } = FlexCanvas.create({ id: 'display', sizing: 'container' });
    const ctx = canvas.getContext('2d');

    const asm = new AssetManager();
    await preloadAssetRefs(asm, Object.values(assets));
    
    const inputs = InputPort.create({ for: 'display' });
    const axb = inputs.getContext('axisbutton');
    axb.bindKeys(bindings);
    
    const tia = new Tia();

    const loop = new AnimationFrameLoop(frame => {
        axb.poll(frame.detail.currentTime);

        tia.camera(0, 0, canvas.width, canvas.height);
        tia.cls(ctx, 0x000000);
        tia.rectFill(ctx, 0, 0, 10, 10, 0xFFFFFF);
        tia.trigFill(ctx, 100, 100, 10, 10, 0, 0xFF0000);

        tia.spr(ctx, assets.carImage.current, 0, 10, 10, 32, 32);

        tia.push();
        tia.matPos(60, 30);
        tia.matRot((performance.now() / 100) % 180);
        tia.spr(ctx, assets.carImage.current, 0, -16, -16, 32, 32);
        tia.pop();

        drawCart(ctx, tia, 20, 100, 10);
    });
    loop.start();
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Tia} tia 
 */
function drawCart(ctx, tia, x, y, size) {
    tia.trigFill(ctx, x, y, size, size, Math.PI / 4, 0xFF0000);
}
