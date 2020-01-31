export * from './packages/core/dist/esm/milque.js';
export * from './packages/display/dist/esm/display.js';
export * from './packages/entity/dist/esm/entity.js';
export * from './packages/input/dist/esm/input.js';
export * from './packages/util/dist/esm/util.js';
export * from './packages/lib/dist/esm/lib.js';

// NOTE: To allow both named and default imports
import * as self from './index.js';
export default self;
