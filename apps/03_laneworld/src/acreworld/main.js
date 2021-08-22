import * as AcreWorld from './AcreWorld.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 */

/**
 * @param {DisplayPort} display 
 * @param {InputContext} inputs 
 * @param {AssetPack} assets 
 */
export async function main(display, inputs, assets)
{
    inputs.bindAxis('cursorX', 'Mouse', 'PosX');
    inputs.bindAxis('cursorY', 'Mouse', 'PosY');
    inputs.bindButton('activate', 'Mouse', 'Button0');
    inputs.bindButton('deactivate', 'Mouse', 'Button2');
    const ctx = display.getContext('2d');

    let world = AcreWorld.createWorld();
    display.addEventListener('frame', e => {
        const { now } = e.detail;
        inputs.poll(now);
        AcreWorld.updateWorld(display, inputs, world);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        AcreWorld.drawWorld(ctx, world);
    });
}
