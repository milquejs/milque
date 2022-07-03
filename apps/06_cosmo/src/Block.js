/** @type {Record<number, Block>} */
const BLOCK_REGISTRY = {};

export class Block {
    constructor(name, blockId) {
        this.name = name;
        this.blockId = blockId;
        this.renderer = (ctx, x, y, blockId) => {};

        BLOCK_REGISTRY[blockId] = this;
    }

    setRenderer(renderer) {
        this.renderer = renderer;
        return this;
    }
}

export function getBlockById(blockId) {
    return BLOCK_REGISTRY[blockId];
}

export function getBlockIds() {
    return Object.keys(BLOCK_REGISTRY);
}
