/**
 * @template T
 * @param {string} name
 * @param {() => T} newCallback 
 * @param {(instance: T) => void} deleteCallback
 * @returns {import('./ComponentTypes').ComponentFactory<T>}
 */
export function create(name, newCallback, deleteCallback) {
  return {
    name,
    new: newCallback,
    delete: deleteCallback,
  };
}

/**
 * @template T
 * @param {import('./ComponentTypes').ComponentClass<T>} componentClass 
 */
export function newComponentInstance(componentClass) {
  if ('new' in componentClass) {
    return componentClass.new();
  } else {
    return new componentClass();
  }
}

/**
 * @template T
 * @param {import('./ComponentTypes').ComponentClass<T>} componentClass 
 * @param {T} instance 
 */
export function deleteComponentInstance(componentClass, instance) {
  if ('delete' in componentClass && typeof componentClass.delete === 'function') {
    componentClass.delete(instance);
  }
}

/**
 * @param {import('./ComponentTypes').ComponentClass<any>} componentClass 
 * @param {import('./ComponentTypes').ComponentClass<any>} otherClass
 */
export function isSameComponentClass(componentClass, otherClass) {
  return componentClass
    && otherClass
    && 'name' in componentClass
    && 'name' in otherClass
    && componentClass.name === otherClass.name;
}
