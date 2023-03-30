import { AssetManager, ImageLoader } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager } from '@milque/scene';

import { RoomSystem, RoomSystemOptions, RoomSystemProviders, useRoom } from '../room/RoomSystem';
import { run, useContext, useWhenSystemInit, useWhenSystemUpdate } from '../runner';
import { newDefs } from '../room/Room';

// @ts-ignore
import BUNNY_PATH from './bunny.png';
// @ts-ignore
import CARROT_PATH from './carrot.png';
// @ts-ignore
import CARROT_BITTEN_1_PATH from './carrot_bitten_1.png';
// @ts-ignore
import CARROT_BITTEN_2_PATH from './carrot_bitten_2.png';
// @ts-ignore
import GROUND_PATH from './ground.png';
// @ts-ignore
import STONE_PATH from './stone.png';
// @ts-ignore
import GRASS_PATH from './grass.png';

const LOADERS = {
    image: ImageLoader,
};
const DEFS = newDefs()
    .asset('bunny.png').filepath(BUNNY_PATH).build()
    .asset('carrot.png').filepath(CARROT_PATH).build()
    .asset('carrot_bitten_1.png').filepath(CARROT_BITTEN_1_PATH).build()
    .asset('carrot_bitten_2.png').filepath(CARROT_BITTEN_2_PATH).build()
    .asset('ground.png').filepath(GROUND_PATH).build()
    .asset('stone.png').filepath(STONE_PATH).build()
    .asset('grass.png').filepath(GRASS_PATH).build()
    .sprite('sp_bunny')
        .image('bunny.png', 64, 64)
        .origin(32, 32)
        .frameSpeed(10)
        .addFrames(0, 0, 64, 64, 3)
        .build()
    .sprite('sp_bunny_eyes')
        .image('bunny.png', 64, 64)
        .origin(32, 32)
        .frameSpeed(10)
        .addFrames(64 * 3, 0, 64 * 4, 64, 2)
        .build()
    .sprite('sp_carrot').image('carrot.png', 8, 32).build()
    .sprite('sp_carrot_bitten_1').image('carrot_bitten_1.png', 8, 32).build()
    .sprite('sp_carrot_bitton_2').image('carrot_bitten_2.png', 8, 32).build()
    .sprite('sp_ground').image('ground.png', 32, 32).build()
    .sprite('sp_stone').image('stone.png', 8, 8).build()
    .sprite('sp_grass').image('grass.png', 16, 16).build()
    .object('obj_bunny')
        .sprite('sp_bunny')
        .addChild('obj_bunny_eyes')
        .build()
    .object('obj_bunny_eyes').sprite('sp_bunny_eyes').build()
    .object('obj_ground').sprite('sp_ground').build()
    .object('obj_stone').sprite('sp_stone').build()
    .object('obj_grass').sprite('sp_grass').build()
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
