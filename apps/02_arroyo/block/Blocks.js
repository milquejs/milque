import { BLOCKS } from './BlockRegistry.js';

export const AIR = BLOCKS.register(0, 'air');
export const WATER = BLOCKS.register(1, 'fluid', ['color', 'dodgerblue']);

export const DIRT = BLOCKS.register(3, 'solid', ['color', 'saddlebrown']);
export const GOLD = BLOCKS.register(4, 'solid', ['color', 'gold']);
export const GRASS = BLOCKS.register(5, 'solid', ['color', 'limegreen']);
export const STONE = BLOCKS.register(6, 'solid', ['color', 'slategray']);
