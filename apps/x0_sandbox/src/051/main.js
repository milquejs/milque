import { FlexCanvas } from '@milque/display';
import { InputPort } from '@milque/input';
import { run, useContext, useWhenSystemUpdate } from '../runner/Runner.js';
import * as Toast from './Game.js';

export async function main() {
    await run(Toast, [
        DisplayProvider,
        InputProvider,
        Canvas2dProvider,
    ]);
}

export function Canvas2dProvider(m) {
    let { canvas } = useContext(m, DisplayProvider);
    return {
        ctx: canvas.getContext('2d'),
    };
}

export function DisplayProvider(m) {
    let display = FlexCanvas.create({ id: 'display', sizing: 'container' });
    let canvas = display.canvas;
    return {
        display,
        canvas,
    };
}

export function InputProvider(m) {
    let input = InputPort.create({ for: 'display' });
    let context = input.getContext('axisbutton');
    useWhenSystemUpdate(m, 0, (e) => {
        context.poll(e.detail.currentTime);
    });
    return {
        axb: context,
    };
}
