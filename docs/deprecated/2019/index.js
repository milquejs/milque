export * from './packages/core/dist/esm/milque.js';
export * from './packages/display/dist/esm/display.js';
export * from './packages/entity/dist/esm/entity.js';
export * from './packages/input/dist/esm/input.js';
export * from './packages/util/dist/esm/util.js';
export * from './packages/lib/dist/esm/lib.js';
export * from './packages/random/dist/esm/random.js';
export * from './packages/game/dist/esm/game.js';
export * from './packages/math/dist/esm/math.js';

// NOTE: To allow both named and default imports
import * as self from './index.js';
export default self;
