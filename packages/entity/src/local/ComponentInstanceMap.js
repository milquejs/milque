import { deleteComponentInstance, newComponentInstance } from '../component/ComponentFactory';

/** @type {import('./EntityId').EntityId} */
export const MIN_ENTITY_ID = 1;
/** @type {import('./EntityId').EntityId} */
export const MAX_ENTITY_ID = 4_294_967_295;

/**
 * A sparse map of entityId-to-component instances (for a component class).
 *
 * @see https://skypjack.github.io/2019-03-07-ecs-baf-part-2/
 * @template T
 */
export class ComponentInstanceMap {
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
