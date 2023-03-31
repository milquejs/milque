import { AssetManager, ImageLoader } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager } from '@milque/scene';

import { RoomSystem, RoomSystemOptions, RoomSystemProviders, useRoom } from '../room/RoomSystem';
import { run, useContext, useWhenSystemInit, useWhenSystemUpdate } from '../runner';
import { newDefs } from '../room/Room';

import BunnyDefs from './BunnyDefs';
import CarrotDefs from './CarrotDefs';
import { GroundDefs, GrassDefs, StoneDefs } from './GroundDefs';

const LOADERS = {
    image: ImageLoader,
};

const DEFS = newDefs()
    .fromJSON(BunnyDefs)
    .fromJSON(CarrotDefs)
    .fromJSON(GroundDefs)
    .fromJSON(StoneDefs)
    .fromJSON(GrassDefs)
    .room('rm_main')
        .boundingRect(0, 0, 400, 300)
        .addInstance('obj_bunny', 64, 64)
        .addInstance('obj_ground', 64, 14)
        .addInstance('obj_ground', 100, 14)
        .addInstance('obj_grass', 100, 50)
        .addInstance('obj_grass', 100, 50)
        .build()
    .build();

export async function main() {
    await run(() => {}, [
        CanvasProvider,
        EntityProvider,
        AssetProvider,
        InputProvider,
        RoomSystemOptions({ AssetProvider, EntityProvider, CanvasProvider, loaders: LOADERS, defs: DEFS }),
        RoomSystemProviders,
        RoomSystem,
        BunnySystem,
    ]);
}

const MOVE_LEFT = new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
const MOVE_RIGHT = new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
const MOVE_UP = new ButtonBinding('move.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
const MOVE_DOWN = new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);

function BunnySystem(m) {
    let room = useRoom(m);
    let inputs = useContext(m, InputProvider);

    useWhenSystemInit(m, 0, () => {
        MOVE_LEFT.bindKeys(inputs);
        MOVE_RIGHT.bindKeys(inputs);
        MOVE_UP.bindKeys(inputs);
        MOVE_DOWN.bindKeys(inputs);
    });

    useWhenSystemUpdate(m, 0, () => {
        for(let bunny of room.findAll('obj_bunny')) {
            if (MOVE_LEFT.current.down) {
                bunny.x -= 1;
                bunny.scaleX = 1;
            }
            if (MOVE_RIGHT.current.down) {
                bunny.x += 1;
                bunny.scaleX = -1;
            }
            if (MOVE_DOWN.current.down) {
                bunny.y += 1;
            }
            if (MOVE_UP.current.down) {
                bunny.y -= 1;
            }
        }
    });
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
