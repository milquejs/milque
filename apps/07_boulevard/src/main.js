import './reload';
import './error';

import { FlexCanvas } from '@milque/display';
import { AnimationFrameLoop } from '@milque/scene';
import { AxisBinding, InputPort, KeyCodes } from '@milque/input';

import { Tia } from './Tia';

window.addEventListener('DOMContentLoaded', main);

const bindings = {
    cursorX: new AxisBinding('cursorX', KeyCodes.MOUSE_POS_X),
    cursorY: new AxisBinding('cursorY', KeyCodes.MOUSE_POS_Y),
};

async function main() {
    const { canvas } = FlexCanvas.create({ id: 'display', sizing: 'container' });
    const ctx = canvas.getContext('2d');
    
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
    });
    loop.start();
}
