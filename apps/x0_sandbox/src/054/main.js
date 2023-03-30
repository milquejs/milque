import { AssetManager } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { ButtonBinding, InputContext, KeyCodes } from '@milque/input';
import { ComponentClass, EntityManager, Query } from '@milque/scene';
import { Random } from '@milque/random';

import { Tia } from '../tia/Tia';
import { run, useContext, useCurrentAnimationFrameDetail, useWhenSystemUpdate } from '../runner';

import BunnyImage from './bunny';
import CarrotImage from './carrot';
import CarrotBitten1Image from './carrot_bitten_1';
import CarrotBitten2Image from './carrot_bitten_2';
import GroundImage from './ground';
import StoneImage from './stone';
import GrassImage from './grass';

import { main as BunnyRoom } from './BunnyRoom';

const MOVE_LEFT = new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
const MOVE_RIGHT = new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
const MOVE_UP = new ButtonBinding('move.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
const MOVE_DOWN = new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);

export async function main() {
    await BunnyRoom();
    /*
    await run(game, [
        AssetProvider,
        CanvasProvider,
        CanvasContextProvider,
        CanvasTiaProvider,
        EntityProvider,
        InputProvider,
    ]);
    */
}

const BunnyComponent = new ComponentClass('bunny', () => ({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
}));
const BunnyQuery = new Query(BunnyComponent);

const GrassComponent = new ComponentClass('grass', () => ({
    x: 0,
    y: 0,
    index: 0,
}));
const GrassQuery = new Query(GrassComponent);

const game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        await BunnyImage.load(assets);
        await CarrotImage.load(assets);
        await CarrotBitten1Image.load(assets);
        await CarrotBitten2Image.load(assets);
        await GroundImage.load(assets);
        await StoneImage.load(assets);
        await GrassImage.load(assets);
        let inputs = useContext(m, InputProvider);
        MOVE_LEFT.bindKeys(inputs);
        MOVE_RIGHT.bindKeys(inputs);
        MOVE_UP.bindKeys(inputs);
        MOVE_DOWN.bindKeys(inputs);
    },
    init(m) {
        let ents = useContext(m, EntityProvider);
        let e = ents.create();
        ents.attach(e, BunnyComponent);
        
        for(let i = 0; i < 5; ++i) {
            let entity = ents.create();
            let grass = ents.attach(entity, GrassComponent);
            grass.x = Random.rangeInt(40, 300);
            grass.y = Random.rangeInt(80, 120);
            grass.index = Random.rangeInt(0, 4);
        }
    },
    update(m) {
        let inputs = useContext(m, InputProvider);
        let ents = useContext(m, EntityProvider);

        if (MOVE_LEFT.current.down) {
            for(let [e, bunny] of BunnyQuery.findAll(ents)) {
                bunny.x -= 1;
                bunny.dx = -1;
            }
        }
        if (MOVE_RIGHT.current.down) {
            for(let [e, bunny] of BunnyQuery.findAll(ents)) {
                bunny.x += 1;
                bunny.dx = 1;
            }
        }
        if (MOVE_DOWN.current.down) {
            for(let [e, bunny] of BunnyQuery.findAll(ents)) {
                bunny.y += 1;
                bunny.dy = 1;
            }
        }
        if (MOVE_UP.current.down) {
            for(let [e, bunny] of BunnyQuery.findAll(ents)) {
                bunny.y -= 1;
                bunny.dy = -1;
            }
        }
    },
    draw(m) {
        let { currentTime } = useCurrentAnimationFrameDetail(m);
        let assets = useContext(m, AssetProvider);
        let ctx = useContext(m, CanvasContextProvider);
        let tia = useContext(m, CanvasTiaProvider);
        let ents = useContext(m, EntityProvider);

        tia.cls(ctx, 0xFFFFFF);
        tia.camera(0, 0, ctx.canvas.width, ctx.canvas.height);

        let index = Math.floor((currentTime / 1000) % 3);
        tia.push();
        tia.matPos(32, 100);
        if (index === 0) {
            tia.spr(ctx, CarrotImage.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        } else if (index === 1) {
            tia.spr(ctx, CarrotBitten1Image.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        } else if (index === 2) {
            tia.spr(ctx, CarrotBitten2Image.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        }
        tia.spr(ctx, GroundImage.get(assets), 0, -16, 8, 32, 32);
        tia.spr(ctx, GroundImage.get(assets), 0, 12, 10, 32, 32);
        tia.spr(ctx, GroundImage.get(assets), 0, 48, 6, 32, 32, true);

        tia.spr(ctx, StoneImage.get(assets), 0, -8, 11, 8, 8);
        tia.spr(ctx, StoneImage.get(assets), 1, -12, 12, 8, 8);
        tia.spr(ctx, StoneImage.get(assets), 0, 54, 6, 8, 8);

        tia.pop();

        tia.spr(ctx, CarrotImage.get(assets), Math.floor((currentTime / 100) % 3), 100, 16, 8, 32);

        for(let [e, grass] of GrassQuery.findAll(ents)) {
            tia.push();
            tia.matPos(grass.x, grass.y);
            tia.spr(ctx, GrassImage.get(assets), grass.index, 0, 0, 16, 16);
            tia.pop();
        }

        for(let [e, bunny] of BunnyQuery.findAll(ents)) {
            tia.push();
            tia.matPos(bunny.x, bunny.y);
            let facingX = bunny.dx > 0;
            tia.spr(ctx, BunnyImage.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 64, 64, facingX);
            tia.spr(ctx, BunnyImage.get(assets), 3 + Math.floor((currentTime / 100) % 2), 0, 0, 64, 64, facingX);
            tia.pop();
        }
        
        if (index === 0) {
            tia.spr(ctx, CarrotImage.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        } else if (index === 1) {
            tia.spr(ctx, CarrotBitten1Image.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        } else if (index === 2) {
            tia.spr(ctx, CarrotBitten2Image.get(assets), Math.floor((currentTime / 100) % 3), 0, 0, 8, 32);
        }
    }
};

export function InputProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    let inputs = new InputContext(canvas);
    useWhenSystemUpdate(m, -1, (e) => {
        inputs.poll(e.detail.currentTime);
    });
    return inputs;
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, () => {
        ents.flush();
    });
    return ents;
}

export function AssetProvider() {
    return new AssetManager();
}

export function CanvasProvider() {
    return FlexCanvas.create({ sizing: 'viewport' });
}

export function CanvasContextProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    let context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    return context;
}

export function CanvasTiaProvider() {
    return new Tia();
}
