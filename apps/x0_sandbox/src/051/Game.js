import { ButtonBinding, KeyCodes } from '@milque/input';
import { useContext, useCurrentAnimationFrameDetail } from '../runner/Runner.js';

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
    let { axb } = useContext(m, InputProvider);
    axb.bindKeys(Inputs);
}

export function update(m) {
    if (Inputs.MoveLeft.current.down) x -= 1;
    if (Inputs.MoveRight.current.down) x += 1;
    if (Inputs.MoveUp.current.down) y -= 1;
    if (Inputs.MoveDown.current.down) y += 1;
}

export function draw(m) {
    let { display } = useContext(m, DisplayProvider);
    let { ctx } = useContext(m, Canvas2dProvider);
    clearScreen(ctx, 0x000000);
    fillCircle(ctx, x, y, 16, 0xFFF000);

    let cx = display.width / 2;
    let cy = display.height / 2;

    fillCircle(ctx, cx, cy, 30, 0x00FF00);
    fillCircle(ctx, cx, cy, 25, 0x333333);

    drawPlayer(m, cx, cy);
}

function drawPlayer(m, x, y) {
    let { ctx } = useContext(m, Canvas2dProvider);
    let { currentTime } = useCurrentAnimationFrameDetail(m);
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(currentTime / 1000);
    fillTriangle(ctx, 0, 0, 30, 30, 0xFFFFFF);
    ctx.resetTransform();
}
