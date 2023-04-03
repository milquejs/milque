import { ButtonBinding, KeyCodes } from '@milque/input';
import { AssetRef } from '@milque/asset';
import { lerp } from '@milque/util';

import { getObjectDef, getSpriteDef } from '../room2/Defs';
import { ObjectDef } from '../room2/object';
import { RoomDef } from '../room2/room';
import { SpriteDef } from '../room2/sprite';
import { run, useContext, useCurrentAnimationFrameDetail } from '../runner';
import { AssetProvider, CanvasProvider, DEPS, EntityProvider, InputProvider, RenderingProvider, SceneGraphProvider } from './Providers';

import * as defBunny from './def_bunny';
import * as defCarrot from './def_carrot';
import * as defFont from './def_font';
import * as defGround from './def_ground';
import * as defPants from './def_pants';

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

let objCamera = new AssetRef('obj_camera', async () => ObjectDef.create(null));

const Game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        await Promise.all([
            ...Object.values(defBunny),
            ...Object.values(defCarrot),
            ...Object.values(defFont),
            ...Object.values(defGround),
            ...Object.values(defPants),
            objCamera,
        ].map(ref => ref.load(assets)));

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
        spawn('obj_pants', -64, -64);
        spawn('obj_bunny_seated', 240, 60);
        spawn('obj_bunny', 64, 64);

        spawn('obj_camera', 0, 0);
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

        // Update bunny
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

        // Update camera
        let [_, bunny] = RoomDef.findAnyByObject(ents, room, 'obj_bunny');
        let cameraSpeed = 0.03;
        for(let [_, camera] of RoomDef.findAllByObject(ents, room, 'obj_camera')) {
            camera.x = lerp(camera.x, bunny.x, cameraSpeed);
            camera.y = lerp(camera.y, bunny.y, cameraSpeed);
        }
    },
    draw(m) {
        let ents = useContext(m, EntityProvider);
        let sceneGraph = useContext(m, SceneGraphProvider);
        let { ctx, tia } = useContext(m, RenderingProvider);
        let assets = useContext(m, AssetProvider);
        let canvas = useContext(m, CanvasProvider);
        let room = useRoom(m);

        tia.cls(ctx, room.background);
        for(let [_, camera] of RoomDef.findAllByObject(ents, room, 'obj_camera')) {
            tia.camera(camera.x - canvas.width / 2, camera.y - canvas.height / 2);
        }
        ObjectDef.walkSceneGraph(ents, sceneGraph, (instance) => {
            if (!instance.visible) {
                return;
            }
            let objectDef = getObjectDef(assets, instance.objectName);
            if (!objectDef.sprite) {
                return;
            }
            let spriteDef = getSpriteDef(assets, objectDef.sprite);
            let sprite = SpriteDef.getInstance(ents, instance.objectId);
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
