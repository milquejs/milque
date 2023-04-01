import { AssetManager } from '@milque/asset';
import { FlexCanvas } from '@milque/display';
import { ButtonBinding, InputContext, KeyCodes } from '@milque/input';
import { ComponentClass, EntityManager, Query } from '@milque/scene';
import { Random } from '@milque/random';

import { Tia } from '../tia/Tia';
import { useContext, useCurrentAnimationFrameDetail, useWhenSystemUpdate } from '../runner';

import { main as BunnyRoom } from './BunnyRoom';

export async function main() {
    await BunnyRoom();
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

        tia.pop();

        tia.spr(ctx, CarrotImage.get(assets), Math.floor((currentTime / 100) % 3), 100, 16, 8, 32);
        
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
