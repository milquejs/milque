import { AssetRef, ImageLoader } from '@milque/asset';
import { getSpriteDef } from '../room2/Defs';
import { ObjectDef } from '../room2/object';
import { RoomDef } from '../room2/room';
import { SpriteDef, SpriteDefLoader } from '../room2/sprite';
import { run, useContext, useCurrentAnimationFrameDetail } from '../runner';
import { AssetProvider, DEPS, EntityProvider, InputProvider, RenderingProvider, SceneGraphProvider } from './Providers';

export async function main() {
    await run(Game, [
        ...DEPS,
        RoomProvider,
    ]);
}

//@ts-ignore
import BUNNY_IMAGE_PATH from '../054/bunny.png';
//@ts-ignore
import BUNNY_SPRITE_PATH from '../056/bunny.sprite.json';
import { Query } from '@milque/scene';
import { ButtonBinding, KeyCodes } from '@milque/input';

const BunnyImage            = new AssetRef('bunny.png', ImageLoader, undefined, BUNNY_IMAGE_PATH);
const BunnySpriteDef        = new AssetRef('sp_bunny', SpriteDefLoader, undefined, BUNNY_SPRITE_PATH);
const BunnyEyesSpriteDef    = new AssetRef('sp_bunny_eyes', async () => SpriteDef.fromSpriteSheet('bunny.png', 64, 64, 0, 0, 5, 1, 3, 5));
const BunnyObjectDef        = new AssetRef('obj_bunny', async () => ObjectDef.fromJSON({ sprite: 'sp_bunny', children: ['obj_bunny_eyes'] }));
const BunnyEyesObjectDef    = new AssetRef('obj_bunny_eyes', async () => ObjectDef.fromJSON({ sprite: 'sp_bunny_eyes' }));
const ASSETS = [
    BunnyImage,
    BunnySpriteDef,
    BunnyEyesSpriteDef,
    BunnyObjectDef,
    BunnyEyesObjectDef,
];


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

const Game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        for(let asset of ASSETS) {
            await asset.load(assets);
        }
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
        RoomDef.spawn(ents, sceneGraph, assets, room, 'obj_bunny', 64, 64);
    },
    update(m) {
        let ents = useContext(m, EntityProvider);
        let assets = useContext(m, AssetProvider);
        let { deltaTime } = useCurrentAnimationFrameDetail(m);

        for(let [_, sprite] of SpriteDef.SpriteQuery.findAll(ents)) {
            let spriteDef = getSpriteDef(assets, sprite.spriteName);
            SpriteDef.updateInstance(deltaTime, sprite, spriteDef);
        }

        let room = useRoom(m);
        let axb = useContext(m, InputProvider);
        let dx = MoveRight.get(axb).value - MoveLeft.get(axb).value;
        let dy = MoveDown.get(axb).value - MoveUp.get(axb).value;
        for(let [_, bunny] of RoomDef.findAllByObject(ents, room, 'obj_bunny')) {
            bunny.x += dx;
            bunny.y += dy;
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

        tia.cls(ctx, 0xFFFFFF);
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
            return () => {
                tia.pop();
            };
        });
    }
};
