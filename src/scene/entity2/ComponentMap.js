/**
 * @template T
 */
export class ComponentMap {
  /**
   * @param {import('./EntityManager').ComponentClass<T>} componentClass
   */
  constructor(componentClass) {
    this.componentClass = componentClass;
    /**
     * @private
     * @type {Record<number, number>}
     */
    this.entities = {};
    /**
     * @private
     * @type {Array<T>}
     */
    this.instances = [];
    /**
     * @private
     * @type {Array<number>}
     */
    this.indices = [];
    this.size = 0;
  }

  /**
   * @param {number} entityId
   * @param {T} [instance]
   */
  add(entityId, instance = undefined) {
    if (typeof instance === 'undefined') {
      instance = createComponentInstance(this.componentClass);
    }
    const index = this.instances.length;
    this.entities[entityId] = index;
    this.instances[index] = instance;
    this.indices[index] = entityId;
    this.size = index + 1;
    return instance;
  }

  /**
   * @param {number} entityId
   */
  delete(entityId) {
    const index = this.entities[entityId];
    let instance = this.instances[index];
    delete this.entities[entityId];
    deleteComponentInstance(this.componentClass, instance);
    const end = this.instances.length - 1;
    const endInstance = this.instances[end];
    const endEntityId = this.indices[end];
    this.instances[index] = endInstance;
    this.entities[index] = endEntityId;
    this.size = end;
  }

  /**
   * @param {number} entityId
   */
  get(entityId) {
    const index = this.entities[entityId];
    return this.instances[index];
  }

  /**
   * @param {number} entityId
   */
  has(entityId) {
    return entityId in this.entities;
  }

  entityIds() {
    return Object.keys(this.entities).map(Number);
  }
}

/**
 * @template T
 * @param {import('./EntityManager').ComponentClass<T>} componentClass
 * @returns {T}
 */
function createComponentInstance(componentClass) {
  try {
    // @ts-ignore
    if (typeof componentClass['new'] === 'function') {
      const factory =
        /** @type {import('./ComponentFactory').ComponentFactory<T>} */ (
          componentClass
        );
      return factory.new();
    } else {
      const constructor =
        /** @type {import('./EntityManager').ComponentConstructor<T>} */ (
          componentClass
        );
      return new constructor();
    }
  } catch (e) {
    throw new Error(
      `Cannot attach new instance for component class '${componentClass}' - must be a factory or constructor.`,
    );
  }
}

/**
 * @template T
 * @param {import('./EntityManager').ComponentClass<T>} componentClass
 * @param {T} instance
 */
function deleteComponentInstance(componentClass, instance) {
  // @ts-ignore
  if (typeof componentClass['delete'] === 'function') {
    const factory =
      /** @type {import('./ComponentFactory').ComponentFactory<T>} */ (
        componentClass
      );
    factory.delete(instance);
  }
}

/**
 * @param {import('./EntityManager').ComponentClass<any>} componentClass
 */
export function getComponentName(componentClass) {
  return componentClass.name;
}
