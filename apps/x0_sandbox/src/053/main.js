import { FlexCanvas } from '@milque/display';
import { InputPort } from '@milque/input';
import { AssetManager, ImageLoader } from '@milque/asset';

import { run, useWhenSystemUpdate } from '../runner';

// @ts-ignore
import STAR_PATH from './star.png';

import { newDefs } from '../room/Room';
import { RoomSystem, RoomSystemOptions, RoomSystemProviders } from '../room/RoomSystem';
import { EntityManager } from '@milque/scene';

const loaders = {
    image: ImageLoader,
};
const defs = newDefs()
    .room('main')
        .boundingRect(0, 0, 400, 300)
        .addInstance('boy', 100, 100)
        .addInstance('boy', 0, 0)
        .build()
    .asset('star.png').filepath(STAR_PATH).build()
    .sprite('boy').image('star.png', 32, 32).addFrame(0, 0, 32, 32).build()
    .object('boy').sprite('boy').build()
    .build();

export async function main() {
    await run(() => {}, [
        CanvasProvider,
        EntityProvider,
        AssetProvider,
        InputProvider,
        RoomSystemOptions({ AssetProvider, EntityProvider, CanvasProvider, loaders, defs }),
        RoomSystemProviders,
        RoomSystem,
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

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, () => ents.flush());
    return ents;
}

export function AssetProvider(m) {
    return new AssetManager();
}
