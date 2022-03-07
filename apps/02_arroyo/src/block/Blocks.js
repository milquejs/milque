import { BLOCKS } from './BlockRegistry.js';

export const AIR = BLOCKS.register(0, 'air');
export const WATER = BLOCKS.register(
  1,
  'fluid',
  ['color', 'dodgerblue'],
  ['material', 'fluid']
);

export const DIRT = BLOCKS.register(
  3,
  'solid',
  'grassSoil',
  ['color', 'saddlebrown'],
  ['material', 'dirt']
);
export const GOLD = BLOCKS.register(
  4,
  'solid',
  ['color', 'gold'],
  ['material', 'metal']
);
export const GRASS = BLOCKS.register(
  5,
  'solid',
  ['color', 'limegreen'],
  ['material', 'dirt']
);
export const STONE = BLOCKS.register(
  6,
  'solid',
  ['color', 'slategray'],
  ['material', 'stone']
);
export const CLAY = BLOCKS.register(
  7,
  'solid',
  ['color', 'salmon'],
  ['material', 'stone']
);
export const STONE2 = BLOCKS.register(
  8,
  'solid',
  ['color', 'powderblue'],
  ['material', 'metal']
);
export const STONE3 = BLOCKS.register(
  9,
  'solid',
  ['color', 'rebeccapurple'],
  ['material', 'stone']
);
export const STONE4 = BLOCKS.register(
  10,
  'solid',
  ['color', 'teal'],
  ['material', 'stone']
);
export const STONE5 = BLOCKS.register(
  11,
  'solid',
  ['color', 'mediumvioletred'],
  ['material', 'stone']
);
export const SAND = BLOCKS.register(
  12,
  'solid',
  ['color', 'navajowhite'],
  ['material', 'dirt']
);
