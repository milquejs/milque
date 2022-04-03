import { ComponentClass } from './ComponentClass.js';

export class EntityTemplate {
  /**
   *
   * @param {string} name
   * @param {Array<ComponentClass<?>>} componentList
   */
  constructor(name, componentList) {
    this.name = name;
    this.componentList = componentList;
  }
}
