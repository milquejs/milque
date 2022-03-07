import {
  Parameter,
  IncludedParameter,
  ExcludedParameter,
  OptionalParameter,
} from './Parameter.js';

export function Not(componentType) {
  return new ExcludedParameter(componentType);
}

export function Optional(componentType) {
  return new OptionalParameter(componentType);
}

export class Query {
  static from(componentParameters) {
    let result = componentParameters.map((componentParameter) => {
      if (componentParameter instanceof Parameter) {
        return componentParameter;
      } else {
        return new IncludedParameter(componentParameter);
      }
    });
    return new Query(result);
  }

  constructor(parameters) {
    /**
     * @private
     * @readonly
     */
    this.components = parameters.reduce((prev, current) => {
      prev[current.type] = current;
    }, {});
    /**
     * @private
     * @readonly
     */
    this.parameters = Object.values(this.components);

    /** @private */
    this.entityManager = null;
    /** @private */
    this.entities = new Set();

    /** @private */
    this.onComponentAdded = this.onComponentAdded.bind(this);
    /** @private */
    this.onComponentRemoved = this.onComponentRemoved.bind(this);
    /** @private */
    this.onEntityChanged = this.onEntityChanged.bind(this);
  }

  onEntityChanged(entityId, componentType, prev, value) {
    if (!value) {
      this.onComponentRemoved(
        this.entityManager,
        entityId,
        componentType,
        prev
      );
    } else {
      this.onComponentAdded(this.entityManager, entityId, componentType, value);
    }
  }

  /** @private */
  onComponentAdded(entityManager, entityId, componentType, component) {
    if (componentType in this.parameters) {
      if (this.parameters[componentType].reject(componentType)) {
        this.entities.delete(entityId);
      } else {
        if (this.matches(entityManager, entityId)) {
          if (!this.entities.has(entityId)) {
            this.entities.add(entityId);
          }
        } else {
          if (this.entities.has(entityId)) {
            this.entities.delete(entityId);
          }
        }
      }
    }
  }

  /** @private */
  onComponentRemoved(entityManager, entityId, componentType, component) {
    if (componentType in this.parameters) {
      if (!this.matches(entityManager, entityId)) {
        if (this.entities.has(entityId)) {
          this.entities.delete(entityId);
        }
      } else {
        if (!this.entities.has(entityId)) {
          this.entities.add(entityId);
        }
      }
    }
  }

  matches(entityManager, entityId) {
    for (let parameter of this.parameters) {
      let accepted = parameter.accept(parameter.type);
      let rejected = parameter.reject(parameter.type);
      let current = entityManager.hasComponent(entityId, parameter.type);

      let result = (!accepted || current) && (!rejected || !current);
      if (!result) {
        return false;
      }
    }
    return true;
  }

  execute(entityManager) {
    if (this.entityManager !== entityManager) {
      let prevEntityManager = this.entityManager;
      if (prevEntityManager) {
        prevEntityManager.removeEventListener(
          'entitychanged',
          this.onEntityChanged
        );
      }

      let entities = new Set();

      for (let entity of entityManager.getEntities()) {
        if (this.matches(entityManager, entity)) {
          entities.add(entity);
        }
      }

      this.entities = entities;
      this.entityManager = entityManager;
      entityManager.addEventListener('entitychanged', this.onEntityChanged);
    }

    const parameters = this.parameters;
    const entities = this.entities;

    return {
      *[Symbol.iterator]() {
        let params = new Array(parameters.length + 1);
        for (let entity of entities) {
          params[0] = entity;
          let i = 1;
          for (let parameter of parameters) {
            params[i++] = entityManager.getComponent(entity, parameter.type);
          }
          yield params;
        }
      },
    };
  }
}
