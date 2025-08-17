/**
 * @template T
 * @param {string} name
 * @param {() => T} newCallback 
 * @param {(instance: T) => void} deleteCallback
 * @returns {import('./ComponentTypes').ComponentFactory<T>}
 */
function create(name, newCallback, deleteCallback) {
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
function newComponentInstance(componentClass) {
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
function deleteComponentInstance(componentClass, instance) {
  if ('delete' in componentClass && typeof componentClass.delete === 'function') {
    componentClass.delete(instance);
  }
}

/**
 * @param {import('./ComponentTypes').ComponentClass<any>} componentClass 
 * @param {import('./ComponentTypes').ComponentClass<any>} otherClass
 */
function isSameComponentClass(componentClass, otherClass) {
  return componentClass
    && otherClass
    && 'name' in componentClass
    && 'name' in otherClass
    && componentClass.name === otherClass.name;
}

var ComponentFactory = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  deleteComponentInstance: deleteComponentInstance,
  isSameComponentClass: isSameComponentClass,
  newComponentInstance: newComponentInstance
});

/** @type {import('./EntityId').EntityId} */
const MAX_ENTITY_ID = 4_294_967_295;

/**
 * A sparse map of entityId-to-component instances (for a component class).
 *
 * @see https://skypjack.github.io/2019-03-07-ecs-baf-part-2/
 * @template T
 */
class ComponentInstanceMap {
  /**
   * @param {import('../component').ComponentClass<T>} componentClass
   * @param {number} [initialCapacity]
   * @param {number} [maxCapacity]
   */
  constructor(componentClass, initialCapacity = 16, maxCapacity = 10_000) {
    /**
     * @readonly
     * @type {import('../component').ComponentClass<T>}
     */
    this.componentClass = componentClass;

    if (maxCapacity <= 0) {
      throw new Error(
        `Max capacity must be positive, but was "${maxCapacity}".`
      );
    }
    if (initialCapacity > maxCapacity) {
      throw new Error(`Cannot initialize capacity over max "${maxCapacity}".`);
    }

    const SparseTypedArray = typeOfUnsignedTypedArrayByMaxValue(maxCapacity);
    const sparseBuffer = new ArrayBuffer(initialCapacity, {
      maxByteLength: SparseTypedArray.BYTES_PER_ELEMENT * MAX_ENTITY_ID,
    });
    /**
     * The sparse array of entityId-to-index
     *
     * @private
     */
    this.sparse = new SparseTypedArray(sparseBuffer);

    const EntityIdTypedArray =
      typeOfUnsignedTypedArrayByMaxValue(MAX_ENTITY_ID);
    const entityIdBuffer = new ArrayBuffer(initialCapacity, {
      maxByteLength: EntityIdTypedArray.BYTES_PER_ELEMENT * maxCapacity,
    });
    /**
     * The dense array of index-to-entityId
     * @private
     */
    this.entityIds = new EntityIdTypedArray(entityIdBuffer);
    /** @private */
    this.entityIdArrayType = EntityIdTypedArray;

    /**
     * The dense array of instance objects by index
     *
     * @private
     * @type {Array<T>}
     */
    this.instances = new Array();

    this.size = 0;

    /** @readonly */
    this.maxCapacity = maxCapacity;
  }

  get capacity() {
    return Math.trunc(
      this.entityIds.buffer.byteLength /
        this.entityIdArrayType.BYTES_PER_ELEMENT
    );
  }

  /**
   * @param {number} newIndex
   * @param {import('./EntityId').EntityId} newEntityId
   */
  ensureCapacity(newIndex, newEntityId) {
    if (newEntityId >= this.sparse.length) {
      const nearestByteLength = Math.pow(2, Math.ceil(Math.log2(newEntityId + 1)));
      const currentByteLength = this.sparse.byteLength;
      const byteLength = Math.min(
        this.sparse.buffer.maxByteLength,
        Math.max(this.sparse.BYTES_PER_ELEMENT, Math.max(currentByteLength * 2, nearestByteLength))
      );
      this.sparse.buffer.resize(byteLength);
    }
    const newSize = Math.max(this.size, newIndex + 1);
    if (newSize > this.maxCapacity) {
      throw new Error(
        `Exceeded max capacity - cannot insert more objects than "${this.maxCapacity}".`
      );
    }
    if (newSize > this.instances.length) {
      this.size = newSize;
      this.instances.length = newSize;
    }
    if (newSize >= this.entityIds.length) {
      const nearestByteLength = Math.pow(2, Math.ceil(Math.log2(newSize)));
      const currentByteLength = this.entityIds.byteLength;
      const byteLength = Math.min(
        this.entityIds.buffer.maxByteLength,
        Math.max(this.entityIds.BYTES_PER_ELEMENT, Math.max(currentByteLength * 2, nearestByteLength))
      );
      this.entityIds.buffer.resize(byteLength);
    }
  }

  /**
   * @param {number} entityId
   * @param {T} [instance]
   */
  insert(entityId, instance = undefined) {
    if (typeof instance === 'undefined') {
      instance = newComponentInstance(this.componentClass);
    }
    const prev = this.sparse[entityId];
    if (prev >= 0 && this.entityIds[prev] === entityId) {
      // This entity is already in this set, so just replace the instance.
      this.instances[prev] = instance;
      return instance;
    }
    // ...increase by 1 size...
    const index = this.size;
    this.ensureCapacity(index, entityId);
    // ...and insert it at the end...
    this.sparse[entityId] = index;
    this.instances[index] = instance;
    this.entityIds[index] = entityId;
    return instance;
  }

  /**
   * @param {number} entityId
   */
  delete(entityId) {
    if (this.size <= 0) {
      // Cannot delete from empty.
      return false;
    }
    const prev = this.sparse[entityId];
    if (!(prev >= 0 && this.entityIds[prev] === entityId)) {
      // This entity is NOT in this set. Skip it.
      return false;
    }
    let prevInstance = this.instances[prev];
    this.sparse[entityId] = 0;
    deleteComponentInstance(this.componentClass, prevInstance);
    if (this.size > 1) {
      const end = this.size - 1;
      const endInstance = this.instances[end];
      const endEntityId = this.entityIds[end];
      // ...move last object to replace deleted entity...
      this.sparse[endEntityId] = prev;
      this.instances[prev] = endInstance;
      this.entityIds[prev] = endEntityId;
    }
    // ...reduce by 1 size.
    this.size -= 1;
    this.instances.length = this.size;
    return true;
  }

  clear() {
    let result = Array.from(this.entityIds);
    for(let entityId of result) {
      this.delete(entityId);
    }
  }

  /**
   * Assumes the entity id exists in this map, otherwise you must check has() before this call.
   * 
   * @param {number} entityId
   */
  lookup(entityId) {
    return this.instances[this.sparse[entityId]];
  }

  /**
   * @param {T} instance 
   * @returns {import('./EntityId').EntityId}
   */
  keyOf(instance) {
    return this.entityIds[this.instances.indexOf(instance)];
  }

  /**
   * @param {number} entityId
   */
  has(entityId) {
    return this.entityIds[this.sparse[entityId]] === entityId;
  }

  /** @returns {Iterable<import('./EntityId').EntityId> & ArrayLike<import('./EntityId').EntityId>} Iterable of entity ids */
  keys() {
    return this.createEntityIdBufferView();
  }

  /** @returns {Iterable<T> & ArrayLike<T>} Iterable of component instances */
  values() {
    return this.instances;
  }

  /** @private */
  createEntityIdBufferView() {
    const TypedArray = this.entityIdArrayType;
    return new TypedArray(this.entityIds.buffer, 0, this.size);
  }
}

/**
 * @param {number} maxValue
 */
function typeOfUnsignedTypedArrayByMaxValue(maxValue) {
  if (maxValue <= 256) {
    return Uint8Array;
  } else if (maxValue <= 65_536) {
    return Uint16Array;
  } else if (maxValue <= 4_294_967_296) {
    return Uint32Array;
  } else {
    throw new Error(
      `Max value is too big - no typed uint array big enough for value "${maxValue}".`
    );
  }
}

/** @typedef {number} EntityId */

/**
 * Used to match for entity id in query result.
 * 
 * @param {number} [value]
 */
function EntityId(value) {
  return /** @type {EntityId} */ (Math.trunc(Number(value ?? 0)));
}

EntityId.NONE = EntityId(0);

/**
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @typedef {MatchFilter<'SomeOf', Components, InstanceType<Components[number]> | null>} MatchFilterSomeOf
 */

/**
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @typedef {MatchFilter<'NoneOf', Components, null>} MatchFilterNoneOf
 */

/**
 * @template {'SomeOf'|'NoneOf'} Name
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @template OutputType
 */
class MatchFilter {

  /**
   * Match some or none of the matching components.
   * 
   * @template {import('./MatchTypes').MatchClass<any>[]} T
   * @param {T} componentClasses 
   * @returns {MatchFilterSomeOf<T>}
   */
  static SomeOf(...componentClasses) {
    return new MatchFilter('SomeOf', componentClasses, /** @type {InstanceType<T[number]> | null} */ (null));
  }

  /**
   * Match none of the matching components.
   * 
   * @template {import('./MatchTypes').MatchClass<any>[]} T
   * @param {T} componentClasses 
   * @returns {MatchFilterNoneOf<T>}
   */
  static NoneOf(...componentClasses) {
    return new MatchFilter('NoneOf', componentClasses, null);
  }

  /** @readonly */
  name;
  /** @readonly */
  keys;
  /** @readonly */
  output;

  /**
   * @param {Name} name 
   * @param {Components} keys
   * @param {OutputType} output
   */
  constructor(name, keys, output) {
    this.name = name;
    this.keys = keys;
    this.output = output;
  }
}

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @param {EntityId} [entityId]
 * @returns {import('./MatchTypes').MatchResult<T>|null}
 */
function find(entityPool, selector, entityId = undefined) {
  const allKeys = Object.keys(selector);
  if (allKeys.length <= 0) {
    return null;
  }
  const allEntries = Object.entries(selector);
  const allValues = Object.values(selector);
  if (typeof entityId === 'undefined') {
    const smallest = findSmallestComponentClassByMapSize(
      entityPool,
      allValues
    );
    if (!smallest) {
      return null;
    }
    entityId = entityPool.components[smallest.name]?.keys()[0];
  }
  /** @type {any} */
  let result = {};
  // Prepare this early...
  for(let key of allKeys) {
    result[key] = null;
  }
  forComponents:
  for (let [key, componentClass] of allEntries) {
    const componentName = componentClass.name;
    switch(componentName) {
      case EntityId.name:
        result[key] = entityId;
        // This is processed now. Next component...
        continue forComponents;
      case MatchFilter.NoneOf.name:
        for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterNoneOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
          const matchedName = matchedKey.name;
          const instanceMap = entityPool.components[matchedName];
          if (instanceMap.has(entityId)) {
            // This is a none matcher! Exclude this entity...
            return null;
          }
        }
        break;
      case MatchFilter.SomeOf.name:
        for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterSomeOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
          const matchedName = matchedKey.name;
          const instanceMap = entityPool.components[matchedName];
          if (instanceMap.has(entityId)) {
            // This is an optional matcher and we found something! Next required component...
            result[key] = instanceMap.lookup(entityId);
            continue forComponents;
          }
        }
        // ...or we did not find anything, but okay since optional. Next component...
        result[key] = null;
        break;
      default:
        const instanceMap = entityPool.components[componentName];
        if (!instanceMap.has(entityId)) {
          // This is not a matching entity :( Skip this entity...
          return null;
        }
        result[key] = instanceMap.lookup(entityId);
    }
  }
  return asMatchResult(result);
}

/**
 * @template T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @param {EntityId} [entityId]
 * @returns {T|null}
 */
function findOne(entityPool, componentClass, entityId = undefined) {
  const map = entityPool.components[componentClass.name];
  if (!map) {
    return null;
  }
  const keys = map.keys();
  if (keys.length <= 0) {
    return null;
  }
  if (typeof entityId === 'undefined') {
    entityId = keys[0];
  }
  return map.lookup(entityId);
}

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @returns {Generator<import('./MatchTypes').MatchResult<T>>}
 */
function* findAll(entityPool, selector) {
  const templateKeys = Object.keys(selector);
  if (templateKeys.length <= 0) {
    return;
  }
  const templateEntries = Object.entries(selector);
  const templateValues = Object.values(selector);
  const smallest = findSmallestComponentClassByMapSize(
    entityPool,
    templateValues
  );
  if (!smallest) {
    return;
  }
  /** @type {any} */
  let result = {};
  // Prepare this early...
  for(let key of templateKeys) {
    result[key] = null;
  }
  forEntityIds:
  for (let entityId of entityPool.components[smallest.name]?.keys()) {
    forComponents:
    for (let [key, componentClass] of templateEntries) {
      const componentName = componentClass.name;
      switch(componentName) {
        case EntityId.name:
          result[key] = entityId;
          // This is processed now. Next component...
          continue forComponents;
        case MatchFilter.NoneOf.name:
          for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterNoneOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
            const matchedName = matchedKey.name;
            const instanceMap = entityPool.components[matchedName];
            if (instanceMap.has(entityId)) {
              // This is a none matcher! Exclude this entity...
              continue forEntityIds;
            }
          }
          break;
        case MatchFilter.SomeOf.name:
          for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterSomeOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
            const matchedName = matchedKey.name;
            const instanceMap = entityPool.components[matchedName];
            if (instanceMap.has(entityId)) {
              // This is an optional matcher and we found something! Next required component...
              result[key] = instanceMap.lookup(entityId);
              continue forComponents;
            }
          }
          // ...or we did not find anything, but okay since optional. Next component...
          result[key] = null;
          break;
        default:
          const instanceMap = entityPool.components[componentName];
          if (!instanceMap.has(entityId)) {
            // This is not a matching entity :( Skip this entity...
            continue forEntityIds;
          }
          result[key] = instanceMap.lookup(entityId);
      }
    }
    yield asMatchResult(result);
  }
}

/**
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {Array<import('../component').ComponentClass<any>>} componentClasses
 */
function findSmallestComponentClassByMapSize(
  entityPool,
  componentClasses
) {
  let smallest = null;
  let smallestSize = Number.POSITIVE_INFINITY;
  for (let nextClass of componentClasses) {
    const nextClassName = nextClass.name;
    if (nextClassName === EntityId.name) {
      continue;
    }
    let instanceMap = entityPool.components[nextClassName];
    if (!instanceMap) {
      // NOTE: There's a component class with NO entities. This query will never succeed with results.
      return null;
    }
    let nextSize = instanceMap.size;
    if (nextSize < smallestSize) {
      smallest = nextClass;
      smallestSize = nextSize;
    }
  }
  if (!smallest) {
    // This was an empty or only-entity-id query. This should not happen since we checked during construction.
    throw new Error(
      'Cannot find any non-EntityId component class to match for query.'
    );
  }
  return smallest;
}

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {Record<string, any>} out
 * @returns {import('./MatchTypes').MatchResult<T>}
 */
function asMatchResult(out) {
  return /** @type {import('./MatchTypes').MatchResult<any>} */ (out);
}

/** @returns {import('./EntityTypes').EntityPoolLike} */
function createPool() {
  return {
    components: {},
    nextAvailableEntityId: 1,
    unclaimedEntityIds: [],
    deadEntityIds: [],
  };
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 */
function resetPool(entityPool) {
  for(let instanceMap of Object.values(entityPool.components)) {
    instanceMap.clear();
  }
  entityPool.nextAvailableEntityId = 1;
  entityPool.unclaimedEntityIds.length = 0;
  entityPool.deadEntityIds.length = 0;
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @returns {import('./EntityId').EntityId}
 */
function newEntity(entityPool) {
  let result = entityPool.unclaimedEntityIds.pop();
  if (typeof result === 'undefined') {
    result = entityPool.nextAvailableEntityId;
    entityPool.nextAvailableEntityId += 1;
  }
  return result;
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId 
 */
function deleteEntity(entityPool, entityId) {
  entityPool.deadEntityIds.push(entityId);
  for (let instanceMap of Object.values(entityPool.components)) {
    instanceMap.delete(entityId);
  }
  entityPool.deadEntityIds.splice(entityPool.deadEntityIds.indexOf(entityId), 1);
  entityPool.unclaimedEntityIds.push(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T}
 */
function attachComponent(entityPool, entityId, componentClass) {
  if (entityPool.deadEntityIds.includes(entityId)) {
    // NOTE: This makes sure that when executing clean-up code, we don't re-add anything back in.
    throw new Error('Cannot attach components to a dead entity.');
  }
  if (!(componentClass.name in entityPool.components)) {
    let result = new ComponentInstanceMap(componentClass);
    entityPool.components[componentClass.name] = /** @type {any} */ (result);
  }
  return entityPool.components[componentClass.name].insert(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 */
function detachComponent(entityPool, entityId, componentClass) {
  if (!(componentClass.name in entityPool.components)) {
    throw new Error(`Cannot detach component - no mapping exists for component class "${componentClass.name}".`);
  }
  return entityPool.components[componentClass.name].delete(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T|null}
 */
function lookupComponent(entityPool, entityId, componentClass) {
  let instanceMap = entityPool.components[componentClass.name];
  if (!instanceMap?.has(entityId)) {
    return null;
  }
  return instanceMap.lookup(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass
 * @param {T} componentInstance
 * @returns {import('./EntityId').EntityId}
 */
function lookupEntity(entityPool, componentClass, componentInstance) {
  let instanceMap = entityPool.components[componentClass.name];
  return instanceMap.keyOf(componentInstance);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass 
 * @returns {Iterable<EntityId> & ArrayLike<EntityId>}
 */
function keysOf(entityPool, componentClass) {
  return entityPool.components[componentClass.name]?.keys() ?? [];
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass 
 * @returns {Iterable<T> & ArrayLike<T>}
 */
function instancesOf(entityPool, componentClass) {
  return entityPool.components[componentClass.name]?.values() ?? [];
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass 
 * @returns {number}
 */
function countComponents(entityPool, componentClass) {
  return entityPool.components[componentClass.name]?.values().length ?? 0;
}

var LocalEntityPool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  attachComponent: attachComponent,
  countComponents: countComponents,
  createPool: createPool,
  deleteEntity: deleteEntity,
  detachComponent: detachComponent,
  find: find,
  findAll: findAll,
  findOne: findOne,
  instancesOf: instancesOf,
  keysOf: keysOf,
  lookupComponent: lookupComponent,
  lookupEntity: lookupEntity,
  newEntity: newEntity,
  resetPool: resetPool
});

class EntityManager {

  /** @type {import('./local').EntityPoolLike['components']} */
  components = {};
  /** @type {import('./local').EntityPoolLike['nextAvailableEntityId']} */
  nextAvailableEntityId = 1;
  /** @type {import('./local').EntityPoolLike['unclaimedEntityIds']} */
  unclaimedEntityIds = [];
  /** @type {import('./local').EntityPoolLike['deadEntityIds']} */
  deadEntityIds = [];

  newEntity() {
    return newEntity(this);
  }

  /**
   * @param {EntityId} entityId
   */
  deleteEntity(entityId) {
    deleteEntity(this, entityId);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  attachComponent(entityId, componentClass) {
    return attachComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  detachComponent(entityId, componentClass) {
    return detachComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  lookupComponent(entityId, componentClass) {
    return lookupComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componetClass 
   * @param {T} instance 
   */
  lookupEntity(componetClass, instance) {
    return lookupEntity(this, componetClass, instance);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  countComponents(componentClass) {
    return countComponents(this, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass
   */
  keysOf(componentClass) {
    return keysOf(this, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass
   */
  instancesOf(componentClass) {
    return instancesOf(this, componentClass);
  }

  /**
   * @template {import('./match').MatchTemplate} T
   * @param {T} selector 
   * @param {EntityId} [entityId]
   */
  find(selector, entityId) {
    return find(this, selector, entityId);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass 
   * @param {EntityId} [entityId]
   */
  findOne(componentClass, entityId) {
    return findOne(this, componentClass, entityId);
  }

  /**
   * @template {import('./match').MatchTemplate} T
   * @param {T} selector 
   */
  *findAll(selector) {
    yield* findAll(this, selector);
  }

  resetPool() {
    resetPool(this);
  }
}

export { ComponentFactory, EntityId, EntityManager, LocalEntityPool, MatchFilter };
//# sourceMappingURL=index.js.map
