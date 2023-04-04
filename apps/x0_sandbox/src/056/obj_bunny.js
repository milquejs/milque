import { AssetRef } from '@milque/asset';

import { useContext, useWhen, useWhenAsync } from '../runner';
import { AssetProvider, EntityProvider, InputProvider, SceneGraphProvider } from './Providers';
import { RoomDef } from '../room2/room';
import { ObjectDef } from '../room2/object';
import { RoomProvider, useSpawner } from './RoomSystem';
import { Init, PostUpdate, Preload } from './main';

import * as defBunny from './def_bunny';
import { ButtonBinding, KeyCodes } from '@milque/input';

export const MoveLeft = new ButtonBinding('move.left',
    [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
export const MoveRight = new ButtonBinding('move.right',
    [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
export const MoveUp = new ButtonBinding('move.up',
    [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
export const MoveDown = new ButtonBinding('move.down',
    [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);
export const MoveCrouch = new ButtonBinding('move_crouch',
    [KeyCodes.SPACE]);

export function BunnySystem(m) {
    let assets = useContext(m, AssetProvider);
    let ents = useContext(m, EntityProvider);
    let sceneGraph = useContext(m, SceneGraphProvider);
    let axb = useContext(m, InputProvider);
    let room = useContext(m, RoomProvider);
    let spawn = useSpawner(m);

    useWhenAsync(m, Preload, 0, async() => {
        await Promise.all(Object.values(defBunny)
            .map(ref => ref instanceof AssetRef && ref.load(assets)));
        
        [MoveLeft, MoveRight, MoveUp, MoveDown, MoveCrouch]
            .map(input => input.bindKeys(axb));
    });

    useWhen(m, Init, 0, () => {
        spawn('obj_bunny', 64, 64);
    });

    useWhen(m, PostUpdate, 0, (frameDetail) => {
        let dt = frameDetail.deltaTime / 60;
        let speed = 8;
        let dx = MoveRight.get(axb).value - MoveLeft.get(axb).value;
        let dy = MoveDown.get(axb).value - MoveUp.get(axb).value;
        for(let [entityId, bunny] of RoomDef.findAllByObject(ents, room, 'obj_bunny')) {
            bunny.x += dx * speed * dt;
            bunny.y += dy * speed * dt;
            if (dx !== 0) {
                bunny.scaleX = -Math.sign(dx);
            }
            if (MoveCrouch.get(axb).pressed) {
                ObjectDef.changeSprite(ents, assets, entityId, 'sp_bunny_seated');
                let [childId] = ObjectDef.getInstanceChildIds(sceneGraph, entityId);
                ObjectDef.changeSprite(ents, assets, childId, 'sp_bunny_seated_eyes');
            } else if (MoveCrouch.get(axb).released) {
                ObjectDef.changeSprite(ents, assets, entityId, 'sp_bunny');
                let [childId] = ObjectDef.getInstanceChildIds(sceneGraph, entityId);
                ObjectDef.changeSprite(ents, assets, childId, 'sp_bunny_eyes');
            }
        }
    });
}
