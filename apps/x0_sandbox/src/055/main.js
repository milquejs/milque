import { AssetManager, AssetRef, ImageLoader } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { EntityManager } from '@milque/scene';
import { run, useContext, useCurrentAnimationFrameDetail, useWhenSystemInit, useWhenSystemUpdate } from '../runner'
import { Tia } from '../tia/Tia'
import { SpriteDef, ObjectDef } from './Defs';
import { SpriteComponent, updateSprites } from './sprite/SpriteSystem';
import { ButtonBinding, InputContext, KeyCodes } from '@milque/input';
import { SceneGraph } from '../room';
import { createObject, ObjectComponent, ObjectManager } from './object/ObjectSystem';
import { drawSprite } from './sprite/Sprite';

export async function main() {
    run(Game, [
        CanvasProvider,
        RenderingProvider,
        AssetProvider,
        InputProvider,
        EntityProvider,
        SceneGraphProvider,
        ObjectProvider,
        PlayerSystem,
    ]);
}

// @ts-ignore
import BUNNY_PATH from '../054/bunny.png';
const BunnyImage = new AssetRef('bunny.png',
    ImageLoader, undefined, BUNNY_PATH);
const BunnySpriteDef = new AssetRef('sp_bunny',
    async () => {
        let result = SpriteDef.fromSpriteSheet(BunnyImage.uri,
            64, 64, 0, 0, 5, 1, 0, 3);
        result.originX = 32;
        result.originY = 32;
        result.initial.frameSpeed = 10;
        return result;
    });
const BunnyEyesSpriteDef = new AssetRef('sp_bunny_eyes',
    async () => {
        let result = SpriteDef.fromSpriteSheet(BunnyImage.uri,
            64, 64, 0, 0, 5, 1, 3, 5);
        result.originX = 32;
        result.originY = 32;
        result.initial.frameSpeed = 10;
        return result;
    });
const BunnyObjectDef = new AssetRef('obj_bunny',
    async () => ObjectDef.create('sp_bunny', ['obj_bunny_eyes']));
const BunnyEyesObjectDef = new AssetRef('obj_bunny_eyes',
    async () => ObjectDef.create('sp_bunny_eyes'));

const MoveLeft = new ButtonBinding('move.left',
    [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
const MoveRight = new ButtonBinding('move.right',
    [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
const MoveUp = new ButtonBinding('move.up',
    [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
const MoveDown = new ButtonBinding('move.down',
    [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);

const Game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        let axb = useContext(m, InputProvider);
        await BunnyImage.load(assets);
        await BunnySpriteDef.load(assets);
        await BunnyEyesSpriteDef.load(assets);
        await BunnyObjectDef.load(assets);
        await BunnyEyesObjectDef.load(assets);
        MoveLeft.bindKeys(axb);
        MoveRight.bindKeys(axb);
        MoveUp.bindKeys(axb);
        MoveDown.bindKeys(axb);
    },
    init(m) {
    },
    update(m) {
        let ents = useContext(m, EntityProvider);
        let assets = useContext(m, AssetProvider);
        let { deltaTime } = useCurrentAnimationFrameDetail(m);
        updateSprites(ents, assets, deltaTime);
    },
    draw(m) {
        let ents = useContext(m, EntityProvider);
        let assets = useContext(m, AssetProvider);
        let sceneGraph = useContext(m, SceneGraphProvider);
        let objectManager = useContext(m, ObjectProvider);
        let { tia, ctx } = useContext(m, RenderingProvider);
        tia.cls(ctx, 0xFFFFFF);

        SceneGraph.walk(sceneGraph, (nodeId) => {
            let inst = ents.get(nodeId, ObjectComponent);
            if (!inst.visible) {
                return;
            }
            let sprite = ents.get(nodeId, SpriteComponent);
            /** @type {import('./sprite/SpriteDef').SpriteDef} */
            let def = assets.get(sprite.spriteName);
            /** @type {HTMLImageElement} */
            let image = assets.get(def.image);
            tia.push();
            tia.mat(inst.x, inst.y, inst.scaleX, inst.scaleY, inst.rotation);
            tia.matBegin(ctx);
            drawSprite(ctx, sprite, def, image);
            tia.matEnd(ctx);
            return () => tia.pop();
        });
    }
};

export function PlayerSystem(m) {
    const axb = useContext(m, InputProvider);
    const ents = useContext(m, EntityProvider);
    const assets = useContext(m, AssetProvider);
    const sceneGraph = useContext(m, SceneGraphProvider);
    const objectManager = useContext(m, ObjectProvider);
    let bunny = null;

    useWhenSystemInit(m, 0, () => {
        bunny = createObject(ents, assets, sceneGraph, objectManager, BunnyObjectDef.uri);
    });

    useWhenSystemUpdate(m, 0, () => {
        if (MoveLeft.get(axb).down) {
            bunny.x -= 1;
            bunny.scaleX = 1;
        }
        if (MoveRight.get(axb).down) {
            bunny.x += 1;
            bunny.scaleX = -1;
        }
        if (MoveDown.get(axb).down) {
            bunny.y += 1;
        }
        if (MoveUp.get(axb).down) {
            bunny.y -= 1;
        }
    });
}

export function SceneGraphProvider() {
    return SceneGraph.create();
}

export function CanvasProvider() {
    return FlexCanvas.create({ scaling: 'scale' });
}

export function RenderingProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    canvas.width = 400;
    canvas.height = 300;
    let ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    let tia = new Tia();
    return {
        tia, ctx,
    };
}

export function AssetProvider() {
    return new AssetManager();
}

export function InputProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    let axb = new InputContext(canvas);
    useWhenSystemUpdate(m, 1, ({ detail: { currentTime }}) => axb.poll(currentTime));
    return axb;
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, () => ents.flush());
    return ents;
}

export function ObjectProvider() {
    return new ObjectManager();
}
