import { Block } from './Block.js';

const BLOCK_RADIUS = 8;
const BLOCK_SIZE = BLOCK_RADIUS * 2;

export const Air = new Block('air', 0);
export const Stone = new Block('stone', 1)
    .setRenderer((ctx, x, y, blockId) => {
        ctx.setColor(0xAAAAAA);
        ctx.drawBox(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_RADIUS, BLOCK_RADIUS);
    });
export const Gold = new Block('gold', 2)
    .setRenderer((ctx, x, y, blockId) => {
        ctx.setColor(0xCCAA00);
        ctx.drawBox(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_RADIUS, BLOCK_RADIUS);
    });
