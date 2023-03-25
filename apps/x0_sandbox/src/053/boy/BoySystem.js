import { ComponentClass, Query } from '@milque/scene';
import { AssetRef, ImageLoader } from '@milque/asset';

import { AssetProvider, EntityProvider, InputProvider } from '../main';
import { GameProvider } from '../Game'
import { useContext, useCurrentAnimationFrameDetail } from '../../runner';

import { ButtonBinding, KeyCodes } from '@milque/input';

// ASSETS
// @ts-ignore
import BOY_PATH from './boy.png';
const BoyImage = new AssetRef('boy.png', ImageLoader, { imageType: 'png' }, BOY_PATH);
// @ts-ignore
import EYES1_PATH from './eyes1.png';
const Eyes1Image = new AssetRef('eyes1.png', ImageLoader, { imageType: 'png' }, EYES1_PATH);
// @ts-ignore
import EYES2_PATH from './eyes2.png';
const Eyes2Image = new AssetRef('eyes2.png', ImageLoader, { imageType: 'png' }, EYES2_PATH);
// @ts-ignore
import WORK_PATH from './work.png';
const WorkImage = new AssetRef('work.png', ImageLoader, { imageType: 'png' }, WORK_PATH);
export const ASSETS = [
    BoyImage,
    Eyes1Image,
    Eyes2Image,
];

// INPUTS
const MoveLeft = new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
const MoveRight = new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
const MoveUp = new ButtonBinding('move.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
const MoveDown = new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);
export const INPUTS = [
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown,
];

// OBJECTS
const BoyClass = new ComponentClass('boy', () => ({
    x: 0,
    y: 0,
    motionY: 0,
    facing: 1,
    spriteIndex: 0,
}));
const BoyQuery = new Query(BoyClass);

export function instantiate(ents) {
    let entity = ents.create();
    ents.attach(entity, BoyClass);
}

// SYSTEMS
export async function preload(m) {
    const assets = useContext(m, AssetProvider);
    await BoyImage.load(assets);
    await Eyes1Image.load(assets);
    await Eyes2Image.load(assets);
    await WorkImage.load(assets);

    const axb = useContext(m, InputProvider);
    MoveLeft.bindTo(axb);
    MoveRight.bindTo(axb);
    MoveUp.bindTo(axb);
    MoveDown.bindTo(axb);
}

export function init(m) {
    const ents = useContext(m, EntityProvider);
    instantiate(ents);
}

export function update(m) {
    const { deltaTime } = useCurrentAnimationFrameDetail(m);
    const ents = useContext(m, EntityProvider);
    let dx = MoveRight.value - MoveLeft.value;
    let dy = MoveDown.value - MoveUp.value;
    let sx = Math.sign(dx);
    let [_, boy] = BoyQuery.findAny(ents);
    boy.x += dx;
    boy.y += dy;
    if (sx !== 0) {
        boy.facing = sx;
    }
    boy.spriteIndex += 0.5 * deltaTime / 60;
    boy.spriteIndex %= 20;
}

export function draw(m) {
    const { ctx, tia } = useContext(m, GameProvider);
    const assets = useContext(m, AssetProvider);
    const ents = useContext(m, EntityProvider);
    const { currentTime } = useCurrentAnimationFrameDetail(m);
    for(let [_, boy] of BoyQuery.findAll(ents)) {
        tia.spr(ctx, WorkImage.get(assets), Math.floor(currentTime / 100) % 6, boy.x, boy.y, 32, 32, boy.facing > 0);
        if (boy.spriteIndex < 19) {
            tia.spr(ctx, Eyes1Image.get(assets), 0, boy.x, boy.y, 32, 32, boy.facing > 0);
        } else {
            tia.spr(ctx, Eyes2Image.get(assets), 0, boy.x, boy.y, 32, 32, boy.facing > 0);
        }
    }

    tia.print(ctx, 'hello', 0, 0, 0x000000);
}
