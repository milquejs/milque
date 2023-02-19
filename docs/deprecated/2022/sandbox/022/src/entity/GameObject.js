export class GameObject {
  static create(props, entityId) {
    let instance = props;
    if (!(instance instanceof GameObject)) {
      throw new Error('GameObject cannot be created without new.');
    }
    instance.onCreate();
    return instance;
  }

  static destroy(component, entityId) {
    component.onDestroy();
  }

  /**
   * @param {import('./EntityManager.js').EntityManager} entityManager The entity manager to own this object.
   * @param {Array<import('./EntityManager.js').ComponentType>} [componentTypes]
   * @param {Object} [initialValues]
   */
  constructor(entityManager, componentTypes = [], initialValues = {}) {
    let { entityId = undefined, ...props } = initialValues;
    entityId = entityManager.create(entityId);

    this.entityManager = entityManager;
    this.entityId = entityId;
    this.listeners = {};

    // Setup components
    for (let componentType of componentTypes) {
      entityManager.add(componentType, entityId);
    }

    // Setup initial values
    if ('listeners' in props) {
      throw new Error(`Cannot override 'listeners' property in GameObject.`);
    }
    Object.assign(this, props);

    // Setup entity
    entityManager.add(GameObject, entityId, this);
  }

  onCreate() {
    this.emit('create', this);
  }

  onDestroy() {
    this.emit('destroy', this);
    this.listeners = {};
  }

  /**
   * @template T
   * @param {import('./EntityBuilder.js').ComponentType<T>} componentType
   * @param {Object} [props]
   * @returns {T}
   */
  add(componentType, props = undefined) {
    return this.entityManager.add(componentType, this.entityId, props);
  }

  remove(componentType) {
    return this.entityManager.remove(componentType, this.entityId);
  }

  get(componentType) {
    return this.entityManager.get(componentType, this.entityId);
  }

  has(componentType) {
    return this.entityManager.has(componentType, this.entityId);
  }

  emit(event, args = {}) {
    if (event in this.listeners) {
      for (let listener of this.listeners[event]) {
        listener(args);
      }
    }
  }

  on(event, listener) {
    if (event in this.listeners) {
      this.listeners[event].unshift(listener);
    } else {
      this.listeners[event] = [listener];
    }
    return this;
  }

  off(event, listener) {
    if (event in this.listeners) {
      let list = this.listeners[event];
      let i = list.indexOf(listener);
      if (i >= 0) {
        list.splice(i, 1);
      }
    }
    return this;
  }

  once(event, listener) {
    let callback = (args) => {
      listener(args);
      this.off(event, callback);
    };
    this.on(event, callback);
    return this;
  }
}
