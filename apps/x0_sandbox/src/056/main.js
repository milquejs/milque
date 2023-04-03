import { ButtonBinding, KeyCodes } from '@milque/input';
import { getSpriteDef } from '../room2/Defs';
import { ObjectDef } from '../room2/object';
import { RoomDef } from '../room2/room';
import { SpriteDef } from '../room2/sprite';
import { run, useContext, useCurrentAnimationFrameDetail } from '../runner';
import { AssetProvider, DEPS, EntityProvider, InputProvider, RenderingProvider, SceneGraphProvider } from './Providers';

import { loadBunnyAssets } from './BunnyDefs';
import { loadCarrotAssets } from './CarrotDefs';
import { loadGroundAssets } from './GroundDefs';
import { loadPantsAssets } from './PantsDef';
import { loadFontAssets } from './FontDefs';

export async function main() {
    await run(Game, [
        ...DEPS,
        RoomProvider,
    ]);
}

const MoveLeft = new ButtonBinding('move.left',
    [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
const MoveRight = new ButtonBinding('move.right',
    [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
const MoveUp = new ButtonBinding('move.up',
    [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
const MoveDown = new ButtonBinding('move.down',
    [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);
const INPUTS = [
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown,
];

function useRoom(m) {
    return useContext(m, RoomProvider);
}

function RoomProvider(m) {
    let ents = useContext(m, EntityProvider);
    let sceneGraph = useContext(m, SceneGraphProvider);
    let assets = useContext(m, AssetProvider);
    return RoomDef.newInstance(ents, sceneGraph, assets, RoomDef.fromJSON({ initial: { background: 0xFFFFFF }}), 'rm_main');
}

/*
function Bunny(m) {
    let def = useObjectDef(m, 'obj_bunny');
    let s = null;
    s = s.when();
    s = s.orWhen();
    s = s.andWhen();
    s = s.then();
    seq.andThen();
    seq.finally();

    whenCreate(m, (self) => {
    });
    whenUpdate(m, (self, dt) => {
        self.x += dx;
    });
    whenDestroy(m, (self) => {

    });
}
*/

const Game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        await loadBunnyAssets(assets);
        await loadCarrotAssets(assets);
        await loadGroundAssets(assets);
        await loadFontAssets(assets);
        await loadPantsAssets(assets);
        let axb = useContext(m, InputProvider);
        for(let input of INPUTS) {
            input.bindKeys(axb);
        }
    },
    init(m) {
        let ents = useContext(m, EntityProvider);
        let sceneGraph = useContext(m, SceneGraphProvider);
        let assets = useContext(m, AssetProvider);
        let room = useRoom(m);

        function spawn(objectName, x, y) {
            RoomDef.spawn(ents, sceneGraph, assets, room, objectName, x, y);
        }
        
        spawn('obj_bunny', 64, 64);
        spawn('obj_ground', 16, 24);
        spawn('obj_ground', 28, 18);
        spawn('obj_ground', 42, 22);
        spawn('obj_stone', 8, 27);
        spawn('obj_stone', 4, 28);
        spawn('obj_stone', 70, 22);
        spawn('obj_grass', 100, 50);
        spawn('obj_grass', 100, 50);
        spawn('obj_font', 200, 20);
        spawn('obj_carrot', 50, 50);
        spawn('obj_carrot_bitten_1', 60, 50);
        spawn('obj_carrot_bitten_2', 40, 80);
        spawn('obj_hovel', 100, 100);
        spawn('obj_hovel_occupied', 200, 100);
        spawn('obj_hovel', 150, 40);
        spawn('obj_bunny_occupied', 150, 40);
        spawn('obj_hovel', 240, 60);
        // spawn('obj_pants', 64, 64);
        spawn('obj_bunny_seated', 240, 60);
        spawn('obj_bunny', 64, 64);
        // Fire create event.
    },
    update(m) {
        let ents = useContext(m, EntityProvider);
        let assets = useContext(m, AssetProvider);
        let { deltaTime } = useCurrentAnimationFrameDetail(m);

        for(let [_, sprite] of SpriteDef.SpriteQuery.findAll(ents)) {
            let spriteDef = getSpriteDef(assets, sprite.spriteName);
            SpriteDef.updateInstance(deltaTime, sprite, spriteDef);
            // Fire update event.
        }

        let room = useRoom(m);
        let axb = useContext(m, InputProvider);
        let dt = deltaTime / 60;
        let speed = 8;
        let dx = MoveRight.get(axb).value - MoveLeft.get(axb).value;
        let dy = MoveDown.get(axb).value - MoveUp.get(axb).value;
        for(let [_, bunny] of RoomDef.findAllByObject(ents, room, 'obj_bunny')) {
            bunny.x += dx * speed * dt;
            bunny.y += dy * speed * dt;
            if (dx !== 0) {
                bunny.scaleX = -Math.sign(dx);
            }
        }
    },
    draw(m) {
        let ents = useContext(m, EntityProvider);
        let sceneGraph = useContext(m, SceneGraphProvider);
        let { ctx, tia } = useContext(m, RenderingProvider);
        let assets = useContext(m, AssetProvider);
        let room = useRoom(m);

        tia.cls(ctx, room.background);
        ObjectDef.walkSceneGraph(ents, sceneGraph, (instance) => {
            if (!instance) {
                return;
            }
            if (!instance.visible) {
                return;
            }
            let sprite = SpriteDef.getInstance(ents, instance.objectId);
            let spriteDef = getSpriteDef(assets, sprite.spriteName);
            let image = assets.get(spriteDef.image);
            tia.mat(instance.x, instance.y, instance.scaleX, instance.scaleY, instance.rotation);
            tia.push();
            tia.matBegin(ctx);
            SpriteDef.drawInstance(ctx, sprite, spriteDef, image);
            tia.matEnd(ctx);
            // Fire draw event.
            return () => {
                tia.pop();
            };
        });
    }
};
