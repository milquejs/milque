/** @typedef {number} EntityId */
/**
 * Used to match for entity id in query result.
 *
 * @param {number} [value]
 */
declare function EntityId(value?: number): EntityId;
type EntityId = number;
declare namespace EntityId {
    let NONE: number;
}

type ComponentConstructor<T> = {
    name: string;
    new (): T;
};
type ComponentFactory$1<T> = {
    name: string;
    new: () => T;
    reset?: (instance: T) => void;
    delete?: (instance: T) => void;
};
type ComponentClass<T> = ComponentFactory$1<T> | ComponentConstructor<T>;

/**
 * @template T
 * @param {string} name
 * @param {() => T} newCallback
 * @param {(instance: T) => void} deleteCallback
 * @returns {import('./ComponentTypes').ComponentFactory<T>}
 */
declare function create<T>(name: string, newCallback: () => T, deleteCallback: (instance: T) => void): ComponentFactory$1<T>;
/**
 * @template T
 * @param {import('./ComponentTypes').ComponentClass<T>} componentClass
 */
declare function newComponentInstance<T>(componentClass: ComponentClass<T>): T;
/**
 * @template T
 * @param {import('./ComponentTypes').ComponentClass<T>} componentClass
 * @param {T} instance
 */
declare function deleteComponentInstance<T>(componentClass: ComponentClass<T>, instance: T): void;
/**
 * @param {import('./ComponentTypes').ComponentClass<any>} componentClass
 * @param {import('./ComponentTypes').ComponentClass<any>} otherClass
 */
declare function isSameComponentClass(componentClass: ComponentClass<any>, otherClass: ComponentClass<any>): boolean;

declare const ComponentFactory_create: typeof create;
declare const ComponentFactory_deleteComponentInstance: typeof deleteComponentInstance;
declare const ComponentFactory_isSameComponentClass: typeof isSameComponentClass;
declare const ComponentFactory_newComponentInstance: typeof newComponentInstance;
declare namespace ComponentFactory {
  export {
    ComponentFactory_create as create,
    ComponentFactory_deleteComponentInstance as deleteComponentInstance,
    ComponentFactory_isSameComponentClass as isSameComponentClass,
    ComponentFactory_newComponentInstance as newComponentInstance,
  };
}

/**
 * A sparse map of entityId-to-component instances (for a component class).
 *
 * @see https://skypjack.github.io/2019-03-07-ecs-baf-part-2/
 * @template T
 */
declare class ComponentInstanceMap<T> {
    /**
     * @param {import('../component').ComponentClass<T>} componentClass
     * @param {number} [initialCapacity]
     * @param {number} [maxCapacity]
     */
    constructor(componentClass: ComponentClass<T>, initialCapacity?: number, maxCapacity?: number);
    /**
     * @readonly
     * @type {import('../component').ComponentClass<T>}
     */
    readonly componentClass: ComponentClass<T>;
    /**
     * The sparse array of entityId-to-index
     *
     * @private
     */
    private sparse;
    /**
     * The dense array of index-to-entityId
     * @private
     */
    private entityIds;
    /** @private */
    private entityIdArrayType;
    /**
     * The dense array of instance objects by index
     *
     * @private
     * @type {Array<T>}
     */
    private instances;
    size: number;
    /** @readonly */
    readonly maxCapacity: number;
    get capacity(): number;
    /**
     * @param {number} newIndex
     * @param {import('./EntityId').EntityId} newEntityId
     */
    ensureCapacity(newIndex: number, newEntityId: EntityId): void;
    /**
     * @param {number} entityId
     * @param {T} [instance]
     */
    insert(entityId: number, instance?: T): T;
    /**
     * @param {number} entityId
     */
    delete(entityId: number): boolean;
    clear(): void;
    /**
     * Assumes the entity id exists in this map, otherwise you must check has() before this call.
     *
     * @param {number} entityId
     */
    lookup(entityId: number): T;
    /**
     * @param {T} instance
     * @returns {import('./EntityId').EntityId}
     */
    keyOf(instance: T): EntityId;
    /**
     * @param {number} entityId
     */
    has(entityId: number): boolean;
    /** @returns {Iterable<import('./EntityId').EntityId> & ArrayLike<import('./EntityId').EntityId>} Iterable of entity ids */
    keys(): Iterable<EntityId> & ArrayLike<EntityId>;
    /** @returns {Iterable<T> & ArrayLike<T>} Iterable of component instances */
    values(): Iterable<T> & ArrayLike<T>;
    /** @private */
    private createEntityIdBufferView;
}

type EntityPoolLike = {
    components: Record<string, ComponentInstanceMap<any>>;
    nextAvailableEntityId: EntityId;
    unclaimedEntityIds: Array<EntityId>;
    deadEntityIds: Array<EntityId>;
};

/** @returns {import('./EntityTypes').EntityPoolLike} */
declare function createPool(): EntityPoolLike;
/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 */
declare function resetPool(entityPool: EntityPoolLike): void;
/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @returns {import('./EntityId').EntityId}
 */
declare function newEntity(entityPool: EntityPoolLike): EntityId;
/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('./EntityId').EntityId} entityId
 */
declare function deleteEntity(entityPool: EntityPoolLike, entityId: EntityId): void;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T}
 */
declare function attachComponent<T>(entityPool: EntityPoolLike, entityId: EntityId, componentClass: ComponentClass<T>): T;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 */
declare function detachComponent<T>(entityPool: EntityPoolLike, entityId: EntityId, componentClass: ComponentClass<T>): boolean;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T|null}
 */
declare function lookupComponent<T>(entityPool: EntityPoolLike, entityId: EntityId, componentClass: ComponentClass<T>): T | null;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @param {T} componentInstance
 * @returns {import('./EntityId').EntityId}
 */
declare function lookupEntity<T>(entityPool: EntityPoolLike, componentClass: ComponentClass<T>, componentInstance: T): EntityId;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {Iterable<T>}
 */
declare function values<T>(entityPool: EntityPoolLike, componentClass: ComponentClass<T>): Iterable<T>;

declare const LocalEntityPool_attachComponent: typeof attachComponent;
declare const LocalEntityPool_createPool: typeof createPool;
declare const LocalEntityPool_deleteEntity: typeof deleteEntity;
declare const LocalEntityPool_detachComponent: typeof detachComponent;
declare const LocalEntityPool_lookupComponent: typeof lookupComponent;
declare const LocalEntityPool_lookupEntity: typeof lookupEntity;
declare const LocalEntityPool_newEntity: typeof newEntity;
declare const LocalEntityPool_resetPool: typeof resetPool;
declare const LocalEntityPool_values: typeof values;
declare namespace LocalEntityPool {
  export {
    LocalEntityPool_attachComponent as attachComponent,
    LocalEntityPool_createPool as createPool,
    LocalEntityPool_deleteEntity as deleteEntity,
    LocalEntityPool_detachComponent as detachComponent,
    LocalEntityPool_lookupComponent as lookupComponent,
    LocalEntityPool_lookupEntity as lookupEntity,
    LocalEntityPool_newEntity as newEntity,
    LocalEntityPool_resetPool as resetPool,
    LocalEntityPool_values as values,
  };
}

type MatchClass<T extends abstract new (...args: any) => any> = T & {
    name: string;
};
type Match<T> = {
    matchId: string;
    template: T;
    all: Array<MatchClass<any>>;
    any: Array<MatchClass<any>>;
    none: Array<MatchClass<any>>;
    maybe: Array<MatchClass<any>>;
};
type MatchTemplate = Record<string, MatchClass<any>>;
/**
 * <T>
 */
type MatchTemplateInstancesOf<T extends MatchTemplate> = { [K in keyof T]: T[K] extends EntityId ? EntityId : T[K] extends MatchClass<infer V> ? InstanceType<V> : never; };
type MatchResult<T extends MatchTemplate> = MatchTemplateInstancesOf<T>;

/**
 * @template {Record<string, import('./MatchTypes').MatchClass<any>>} T
 * @param {T} template
 * @returns {import('./MatchTypes').Match<T>}
 */
declare function createMatch<T extends Record<string, MatchClass<any>>>(template: T): Match<T>;

declare const MatchFactory_createMatch: typeof createMatch;
declare namespace MatchFactory {
  export {
    MatchFactory_createMatch as createMatch,
  };
}

/**
 * @template {object} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('./MatchTypes').Match<T>} match
 * @param {EntityId} [entityId]
 * @returns {import('./MatchTypes').MatchResult<T>|null}
 */
declare function queryMatch<T extends object>(entityPool: EntityPoolLike, match: Match<T>, entityId?: EntityId): MatchResult<T> | null;
/**
 * @template {object} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('./MatchTypes').Match<T>} match
 * @returns {Generator<import('./MatchTypes').MatchResult<T>>}
 */
declare function queryMatchAll<T extends object>(entityPool: EntityPoolLike, match: Match<T>): Generator<MatchResult<T>>;

/**
 * @template {import('../match').MatchTemplate} T
 */
declare class Archetype<T extends MatchTemplate> {
    /**
     * @template {import('../match').MatchTemplate} T
     * @param {T} components
     */
    static from<T_1 extends MatchTemplate>(components: T_1): Archetype<T_1>;
    /**
     * @private
     * @param {T} components
     */
    private constructor();
    /** @private */
    private components;
    match: Match<T>;
    /**
     * @param {import('../local').EntityPoolLike} entityPool
     * @returns {import('../match').MatchResult<T>}
     */
    newEntity(entityPool: EntityPoolLike): MatchResult<T>;
    /**
     * @param {import('../local').EntityPoolLike} entityPool
     * @param {EntityId} [entityId]
     */
    query(entityPool: EntityPoolLike, entityId?: EntityId): MatchTemplateInstancesOf<T> | null;
    /**
     * @param {import('../local').EntityPoolLike} entityPool
     */
    queryAll(entityPool: EntityPoolLike): Generator<MatchTemplateInstancesOf<T>, any, any>;
    asMatch(): Match<T>;
}

export { Archetype, ComponentFactory, EntityId, LocalEntityPool, MatchFactory, queryMatch, queryMatchAll };
export type { ComponentClass, ComponentConstructor, EntityPoolLike, Match, MatchClass, MatchResult, MatchTemplate, MatchTemplateInstancesOf };
