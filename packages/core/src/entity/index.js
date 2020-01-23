/**
 * @module Entity
 * @version 1.2
 */

export * from './EntityManager.js';
export * from './query/EntityQuery.js';

import * as QueryOperator from './query/QueryOperator.js';
export { QueryOperator };

import * as ComponentFactory from './component/ComponentFactory.js';
export { ComponentFactory };

export * from './component/ComponentBase.js';
export * from './tag/TagComponent.js';
export * from './hybrid/EntityComponent.js';

export * from './hybrid/EntityBase.js';
export * from './hybrid/HybridEntity.js';

import * as Component from './component/ComponentHelper.js';
export { Component };

import * as Entity from './hybrid/EntityHelper.js';
export { Entity };

import * as EntityWrapper from './hybrid/EntityWrapper.js';
export { EntityWrapper };

// Hot entity replacement
import * as HotEntityReplacement from './hot/HotEntityReplacement.js';
export { HotEntityReplacement };
export * from './hot/HotEntityModule.js';
export * from './hot/strategies/FineDiffStrategy.js';
