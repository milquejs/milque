import { FlexCanvas } from '@milque/display';
import { InputPort } from '@milque/input';
import { AssetManager } from '@milque/asset';
import { EntityManager } from '@milque/scene';

import { run, useWhenSystemUpdate } from '../runner';

import * as Game from './Game';

export async function main() {
    await run(Game, [
        CanvasProvider,
        InputProvider,
        AssetProvider,
        EntityProvider,
        ...Game.PROVIDERS,
    ]);
}

export function CanvasProvider(m) {
    let flexCanvas = FlexCanvas.create({ id: 'canvas', sizing: 'viewport' });
    return flexCanvas;
}

export function InputProvider(m) {
    let input = InputPort.create({ for: 'canvas' });
    let context = input.getContext('axisbutton');
    useWhenSystemUpdate(m, 0, (e) => {
        context.poll(e.detail.currentTime);
    });
    return context;
}

export function AssetProvider(m) {
    return new AssetManager();
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, (e) => {
        ents.flush();
    });
    return ents;
}
