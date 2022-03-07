import { TemplateComponentFactory } from './TemplateComponentFactory.js';

import {
  addAllImpl,
  addImpl,
  addOneImpl,
  deleteImpl,
  flattenInstances,
  sliceImpl,
  removeImpl,
  resolvePropsOrCallback,
} from './MultiComponentFactoryHelper.js';

const DEFAULT_PROPS = {};

export class TemplateMultiComponentFactory extends TemplateComponentFactory {
  /** @override */
  add(entityId, props = DEFAULT_PROPS) {
    let component = this.create(props);
    return addImpl(this.instances, entityId, component);
  }

  /** @override */
  delete(entityId) {
    return deleteImpl(this.instances, entityId);
  }

  /** @override */
  get(entityId) {
    return this.instances[entityId][0];
  }

  /** @override */
  getAll(entityId) {
    return this.instances[entityId];
  }

  /** @override */
  values() {
    return flattenInstances([], this.instances);
  }

  addAll(entityId, addCount = 1, propsOrCallback = undefined) {
    const propsCallback = resolvePropsOrCallback(propsOrCallback);
    return addAllImpl(this.instances, entityId, addCount, () => {
      let props = propsCallback(entityId);
      return this.create(props);
    });
  }

  addOne(entityId, propsOrCallback = undefined) {
    const propsCallback = resolvePropsOrCallback(propsOrCallback);
    let props = propsCallback(entityId);
    let component = this.create(props);
    return addOneImpl(this.instances, entityId, component);
  }

  removeAll(entityId, startIndex = 0, removeCount = undefined) {
    let result = removeImpl(this.instances, entityId, startIndex, removeCount);
    return Boolean(result);
  }

  removeOne(entityId, index = 0) {
    return this.removeAll(entityId, index, 1);
  }

  slice(entityId, startIndex = 0, getCount = undefined) {
    return sliceImpl(this.instances, entityId, startIndex, getCount);
  }

  at(entityId, index = 0) {
    return this.instances[entityId][index];
  }
}
