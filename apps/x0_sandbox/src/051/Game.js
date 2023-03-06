import { AssetRef } from '@milque/asset';
import { ButtonBinding, KeyCodes } from '@milque/input';
import { useProvider } from '@milque/scene';

import { clearScreen, fillCircle } from './Canvas2d.js';
import { Canvas2dProvider, InputProvider } from './main.js';

export const Inputs = {
    MoveLeft: new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT]),
    MoveRight: new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT]),
    MoveUp: new ButtonBinding('move.up', [KeyCodes.ARROW_UP]),
    MoveDown: new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN]),
};

let x = 0;
let y = 0;

export const name = 'Fun Game';

export async function load(m) {
}

export function init(m) {
    let { axb } = useProvider(m, InputProvider);
    axb.bindBindings(Inputs);
}

export function update(m) {
    if (Inputs.MoveLeft.down) x -= 1;
    if (Inputs.MoveRight.down) x += 1;
    if (Inputs.MoveUp.down) y -= 1;
    if (Inputs.MoveDown.down) y += 1;
}

export function draw(m) {
    let { ctx } = useProvider(m, Canvas2dProvider);
    clearScreen(ctx, 0x000000);
    fillCircle(ctx, x, y, 16, 0xFFF000);
}

export function dead(m) {
}

export async function unload(m) {
}
