import { AssetRef } from '@milque/asset';
import { ButtonBinding, KeyCodes } from '@milque/input';
import { Toaster } from '@milque/scene';

import { clearScreen, fillCircle, fillTriangle } from './Canvas2d.js';
import { Canvas2dProvider, DisplayProvider, InputProvider } from './main.js';

export const Inputs = {
    MoveLeft: new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT]),
    MoveRight: new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT]),
    MoveUp: new ButtonBinding('move.up', [KeyCodes.ARROW_UP]),
    MoveDown: new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN]),
};

let x = 0;
let y = 0;

export const name = 'Fun Game';

export function init(m) {
    let { axb } = Toaster.useProvider(m, InputProvider);
    axb.bindBindings(Inputs);
}

export function update(m) {
    if (Inputs.MoveLeft.down) x -= 1;
    if (Inputs.MoveRight.down) x += 1;
    if (Inputs.MoveUp.down) y -= 1;
    if (Inputs.MoveDown.down) y += 1;
}

export function draw(m) {
    let { display } = Toaster.useProvider(m, DisplayProvider);
    let { ctx } = Toaster.useProvider(m, Canvas2dProvider);
    clearScreen(ctx, 0x000000);
    fillCircle(ctx, x, y, 16, 0xFFF000);

    let cx = display.width / 2;
    let cy = display.height / 2;

    fillCircle(ctx, cx, cy, 30, 0x00FF00);
    fillCircle(ctx, cx, cy, 25, 0x333333);

    drawPlayer(m, cx, cy);
}

function drawPlayer(m, x, y) {
    let { ctx } = Toaster.useProvider(m, Canvas2dProvider);
    let { detail } = Toaster.useProvider(m, Toaster.AnimationFrameLoopProvider);
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(detail.currentTime / 1000);
    fillTriangle(ctx, 0, 0, 30, 30, 0xFFFFFF);
    ctx.resetTransform();
}
