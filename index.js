export * from './packages/core/src/index.js';
export * from './packages/display/src/index.js';
export * from './packages/entity/src/index.js';
export * from './packages/input/src/index.js';
export * from './packages/util/src/index.js';

// NOTE: To allow both named and default imports
import * as self from './index.js';
export default self;
