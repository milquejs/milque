export function createSpawner(entityFactory) {
  return {
    entities: new Set(),
    factory: entityFactory,
    create(...args) {
      return this.factory.apply(null, args);
    },
    destroy(entity) {
      this.entities.delete(entity);
    },
    spawn(...args) {
      let entity = this.create(...args);
      this.entities.add(entity);
      return entity;
    },
    clear() {
      this.entities.clear();
    },
    [Symbol.iterator]() {
      return this.entities.values();
    },
  };
}
