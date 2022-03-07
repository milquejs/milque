import { ComponentRegistryReadOnly } from './ComponentRegistryReadOnly.js';
import { ComponentFactory } from './factory/ComponentFactory.js';

function validateComponentType(componentType) {
  let t = typeof componentType;
  if (t !== 'string' && t !== 'symbol' && t !== 'number') {
    throw new Error(
      'Component type is not in a supported format - must be either a string, symbol, or number.'
    );
  }
}

function validateComponentFactory(componentFactory) {
  if (!(componentFactory instanceof ComponentFactory)) {
    throw new Error(
      'Unexpected factory type - must be a descendent of ComponentFactory.'
    );
  }
}

export class ComponentRegistry extends ComponentRegistryReadOnly {
  constructor() {
    super({});
  }

  registerComponent(componentType, componentFactory) {
    validateComponentType(componentType);
    validateComponentFactory(componentFactory);

    this.factories[componentType] = componentFactory;
  }

  unregisterComponent(componentType) {
    validateComponentType(componentType);

    this.factories[componentType].clear();
    delete this.factories[componentType];
  }
}
