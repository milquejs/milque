import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { AssetManager } from '@milque/asset';
import { EntityManager } from '@milque/scene';

import { run, useWhenSystemUpdate } from './runner';

//import * as Game from './hustle/HustleGame';
import * as Game from './Game';

export async function main() {
    await run(Game, [
        DisplayProvider,
        InputProvider,
        AssetProvider,
        EntityProvider,
        ...Game.PROVIDERS,
    ]);
}

export function DisplayProvider(m) {
    let display = DisplayPort.create({ id: 'display', debug: true });
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

export function AssetProvider(m) {
    let assets = new AssetManager();
    return {
        assets,
    };
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, (e) => {
        ents.flush();
    });
    return {
        ents,
    };
}
