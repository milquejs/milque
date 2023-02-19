import { World } from '../World.js';

World.require('entityManager');

export class GameObject {
  static getGameObjectById(entityManager, entityId) {
    /**
     * # The Singleton Approach
     * function(entityId):
     *   const {entityManager} = World.getWorld();
     *   return entityManager.get('GameObject', entityId);
     *
     * ## Concerns
     * - What if there are multiple entityManagers?
     * - What if the original object was created with a different manager?
     * - What if this is called after a destroy? Or before a create?
     * - What if this was called outside of this thread (WebWorker)?
     */
    return entityManager.get('GameObject', entityId);
  }

  static create(props, entityId, entityManager) {
    if (props instanceof GameObject) {
      if (props.entityId === undefined && props.entityManager === undefined) {
        return props;
      } else {
        throw new Error(
          'Cannot allocate multiple entity ids for a GameObject.'
        );
      }
    } else {
      throw new Error(
        'Cannot create GameObject component without GameObject instance.'
      );
    }
  }

  static destroy(component, entityId, entityManager) {
    component.onDestroy();
  }

  constructor() {
    const { entityManager } = World.getWorld();
    const entityId = entityManager.create();
    entityManager.add('GameObject', entityId, this);

    this.entityId = entityId;
    this.entityManager = entityManager;
  }

  /** @abstract */
  onDestroy() {}

  get(componentName) {
    return this.entityManager.get(componentName, this.entityId);
  }

  has(componentName) {
    return this.entityManager.has(componentName, this.entityId);
  }

  add(componentName, props = undefined) {
    this.entityManager.add(componentName, this.entityId, props);
  }

  remove(componentName) {
    this.entityManager.remove(componentName, this.entityId);
  }
}
