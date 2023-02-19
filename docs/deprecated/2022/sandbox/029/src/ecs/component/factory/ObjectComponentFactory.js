import { ComponentFactory } from './ComponentFactory.js';

/** @typedef {import('../EntityManager.js').EntityId} EntityId */

export class ObjectComponentFactory extends ComponentFactory {
  constructor(source) {
    super();

    /** @type {Record<EntityId, Component>} */
    this.instances = {};
    this.source = source;
  }

  /** @override */
  create(entityId) {
    let component = {};
    for (let key in this.source) {
      component[key] = this.source[key];
    }
    this.instances[entityId] = component;
  }

  /** @override */
  delete(entityId) {
    this.instances[entityId] = undefined;
  }

  /** @override */
  get(entityId) {
    return this.instances[entityId];
  }

  /** @override */
  has(entityId) {
    return Boolean(this.instances[entityId]);
  }

  /** @override */
  clear() {
    this.instances = {};
  }
}
