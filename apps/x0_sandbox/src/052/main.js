import { FlexCanvas } from '@milque/display';
import { InputPort } from '@milque/input';
import { run, useWhenSystemUpdate } from '../runner';

import * as Game from './Game';

export async function main() {
    await run(Game, [
        DisplayProvider,
        InputProvider,
        ...Game.PROVIDERS,
    ]);
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
