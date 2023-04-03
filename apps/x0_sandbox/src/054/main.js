import { AssetManager, ImageLoader } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager } from '@milque/scene';

import { RoomSystem, RoomSystemOptions, RoomSystemProviders, useRoom } from '../room/RoomSystem';
import { run, useContext, useWhenSystemInit, useWhenSystemUpdate } from '../runner';
import { newDefs } from '../room/Room';

import BunnyDefs from './BunnyDefs';
import CarrotDefs from './CarrotDefs';
import { GroundDefs, GrassDefs, StoneDefs, HovelDefs } from './GroundDefs';
import FontDefs from './FontDefs';
import PantsDef from './PantsDef';

const LOADERS = {
    image: ImageLoader,
};

const DEFS = newDefs()
    .fromJSON(BunnyDefs)
    .fromJSON(CarrotDefs)
    .fromJSON(GroundDefs)
    .fromJSON(StoneDefs)
    .fromJSON(GrassDefs)
    .fromJSON(HovelDefs)
    .fromJSON(FontDefs)
    .fromJSON(PantsDef)
    .room('rm_main')
        .background(0xFFFFFF)
        .boundingRect(0, 0, 400, 300)
        .addView('main', 0, 0, 300, 150)
        .addInstance('obj_ground', 16, 24)
        .addInstance('obj_ground', 28, 18)
        .addInstance('obj_ground', 42, 22, -1)
        .addInstance('obj_stone', 8, 27)
        .addInstance('obj_stone', 4, 28)
        .addInstance('obj_stone', 70, 22)
        .addInstance('obj_grass', 100, 50)
        .addInstance('obj_grass', 100, 50)
        .addInstance('obj_font', 200, 20)
        .addInstance('obj_carrot', 50, 50)
        .addInstance('obj_carrot_bitten', 60, 50)
        .addInstance('obj_carrot_bitten', 40, 80)
        .addInstance('obj_hovel', 100, 100)
        .addInstance('obj_hovel_occupied', 200, 100)
        .addInstance('obj_hovel', 150, 40)
        .addInstance('obj_bunny_occupied', 150, 40)
        .addInstance('obj_hovel', 240, 60)
        .addInstance('obj_pants', 64, 64)
        .addInstance('obj_bunny_seated', 240, 60)
        .addInstance('obj_bunny', 64, 64)
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

    useWhenSystemUpdate(m, 0, ({ detail: { deltaTime }}) => {
        let dt = deltaTime / 60;
        let speed = 8;
        for(let bunny of room.findAll('obj_bunny')) {
            if (MOVE_LEFT.current.down) {
                bunny.x -= speed * dt;
                bunny.scaleX = 1;
            }
            if (MOVE_RIGHT.current.down) {
                bunny.x += speed * dt;
                bunny.scaleX = -1;
            }
            if (MOVE_DOWN.current.down) {
                bunny.y += speed * dt;
            }
            if (MOVE_UP.current.down) {
                bunny.y -= speed * dt;
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
