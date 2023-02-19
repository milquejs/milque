export class EntityManager {
  constructor() {
    /** @private */
    this.nextEntityId = 1;

    /** @private */
    this.entities = new Set();
    /** @private */
    this.components = new Map();
  }

  nextAvailableEntityId() {
    return this.nextEntityId++;
  }

  createEntity() {
    let entityId = this.nextAvailableEntityId();
    this.entities.add(entityId);
    return entityId;
  }

  destroyEntity(entityId) {
    let result = this.entities.delete(entityId);
    if (result) {
      for (let instances of this.components.values()) {
        instances.delete(entityId);
      }
    }
    return result;
  }

  getEntityIds() {
    return this.entities;
  }

  addComponent(entityId, componentType) {
    const { name, create } = componentType;
    if (!this.components.has(name)) {
      this.components.set(name, new Map());
    }
    let instances = this.components.get(name);
    if (instances.has(entityId)) {
      throw new Error('Component of same type already exists for entity.');
    }
    let instance = create();
    instances.set(entityId, instance);
  }

  removeComponent(entityId, componentType) {
    const { name } = componentType;
    if (!this.components.has(name)) {
      return;
    }
    let instances = this.components.get(name);
    if (!instances.has(entityId)) {
      return;
    }
    instances.delete(entityId);
  }

  getComponent(entityId, componentType) {
    const { name } = componentType;
    if (!this.components.has(name)) {
      return null;
    }
    let instances = this.components.get(name);
    if (!instances.has(entityId)) {
      return null;
    }
    return instances.get(entityId);
  }

  hasComponent(entityId, componentType) {
    const { name } = componentType;
    if (!this.components.has(name)) {
      return false;
    }
    let instances = this.components.get(name);
    return instances.has(entityId);
  }

  getComponentInstances(componentType) {
    return this.components.get(componentType.name).values();
  }
}
