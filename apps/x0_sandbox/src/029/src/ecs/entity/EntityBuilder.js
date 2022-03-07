export class EntityBuilder {
  constructor() {
    this.components = {};
  }

  component(componentType, callback) {
    this.components[componentType] = callback;
    return this;
  }

  build(entityManager, entityId = undefined) {
    let result = entityManager.createEntity(entityId);
    for (let [componentType, callback] of Object.entries(this.components)) {
      let component = entityManager.addComponent(result, componentType);
      if (callback) {
        callback(component, entityId, componentType, entityManager);
      }
    }
    return result;
  }
}
