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
declare class MatchFilter<Name extends "SomeOf" | "NoneOf", Components extends MatchClass<any>[], OutputType> {
    /**
     * Match some or none of the matching components.
     *
     * @template {import('./MatchTypes').MatchClass<any>[]} T
     * @param {T} componentClasses
     * @returns {MatchFilterSomeOf<T>}
     */
    static SomeOf<T extends MatchClass<any>[]>(...componentClasses: T): MatchFilterSomeOf<T>;
    /**
     * Match none of the matching components.
     *
     * @template {import('./MatchTypes').MatchClass<any>[]} T
     * @param {T} componentClasses
     * @returns {MatchFilterNoneOf<T>}
     */
    static NoneOf<T extends MatchClass<any>[]>(...componentClasses: T): MatchFilterNoneOf<T>;
    /**
     * @param {Name} name
     * @param {Components} keys
     * @param {OutputType} output
     */
    constructor(name: Name, keys: Components, output: OutputType);
    /** @readonly */
    readonly name: Name;
    /** @readonly */
    readonly keys: Components;
    /** @readonly */
    readonly output: OutputType;
}
type MatchFilterSomeOf<Components extends MatchClass<any>[]> = MatchFilter<"SomeOf", Components, InstanceType<Components[number]> | null>;
type MatchFilterNoneOf<Components extends MatchClass<any>[]> = MatchFilter<"NoneOf", Components, null>;

type MatchClass<T extends abstract new (...args: any) => any> = T & {
    name: string;
};
type MatchTemplate = Record<string, MatchClass<any> | MatchFilter<any, any, any>>;
/**
 * <T>
 */
type MatchTemplateInstancesOf<T extends MatchTemplate> = { [K in keyof T]: T[K] extends EntityId ? EntityId : T[K] extends MatchFilter<any, any, any> ? T[K]["output"] : T[K] extends MatchClass<infer V> ? InstanceType<V> : never; };
type MatchResult<T extends MatchTemplate> = MatchTemplateInstancesOf<T>;

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @param {EntityId} [entityId]
 * @returns {import('./MatchTypes').MatchResult<T>|null}
 */
declare function find<T extends MatchTemplate>(entityPool: EntityPoolLike, selector: T, entityId?: EntityId): MatchResult<T> | null;
/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @returns {Generator<import('./MatchTypes').MatchResult<T>>}
 */
declare function findAll<T extends MatchTemplate>(entityPool: EntityPoolLike, selector: T): Generator<MatchResult<T>>;

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
 * @returns {Iterable<EntityId> & ArrayLike<EntityId>}
 */
declare function keysOf<T>(entityPool: EntityPoolLike, componentClass: ComponentClass<T>): Iterable<EntityId> & ArrayLike<EntityId>;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {Iterable<T> & ArrayLike<T>}
 */
declare function instancesOf<T>(entityPool: EntityPoolLike, componentClass: ComponentClass<T>): Iterable<T> & ArrayLike<T>;
/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {number}
 */
declare function countComponents<T>(entityPool: EntityPoolLike, componentClass: ComponentClass<T>): number;

declare const LocalEntityPool_attachComponent: typeof attachComponent;
declare const LocalEntityPool_countComponents: typeof countComponents;
declare const LocalEntityPool_createPool: typeof createPool;
declare const LocalEntityPool_deleteEntity: typeof deleteEntity;
declare const LocalEntityPool_detachComponent: typeof detachComponent;
declare const LocalEntityPool_find: typeof find;
declare const LocalEntityPool_findAll: typeof findAll;
declare const LocalEntityPool_instancesOf: typeof instancesOf;
declare const LocalEntityPool_keysOf: typeof keysOf;
declare const LocalEntityPool_lookupComponent: typeof lookupComponent;
declare const LocalEntityPool_lookupEntity: typeof lookupEntity;
declare const LocalEntityPool_newEntity: typeof newEntity;
declare const LocalEntityPool_resetPool: typeof resetPool;
declare namespace LocalEntityPool {
  export {
    LocalEntityPool_attachComponent as attachComponent,
    LocalEntityPool_countComponents as countComponents,
    LocalEntityPool_createPool as createPool,
    LocalEntityPool_deleteEntity as deleteEntity,
    LocalEntityPool_detachComponent as detachComponent,
    LocalEntityPool_find as find,
    LocalEntityPool_findAll as findAll,
    LocalEntityPool_instancesOf as instancesOf,
    LocalEntityPool_keysOf as keysOf,
    LocalEntityPool_lookupComponent as lookupComponent,
    LocalEntityPool_lookupEntity as lookupEntity,
    LocalEntityPool_newEntity as newEntity,
    LocalEntityPool_resetPool as resetPool,
  };
}

declare class EntityManager {
    /** @type {import('./local').EntityPoolLike['components']} */
    components: EntityPoolLike["components"];
    /** @type {import('./local').EntityPoolLike['nextAvailableEntityId']} */
    nextAvailableEntityId: EntityPoolLike["nextAvailableEntityId"];
    /** @type {import('./local').EntityPoolLike['unclaimedEntityIds']} */
    unclaimedEntityIds: EntityPoolLike["unclaimedEntityIds"];
    /** @type {import('./local').EntityPoolLike['deadEntityIds']} */
    deadEntityIds: EntityPoolLike["deadEntityIds"];
    newEntity(): number;
    /**
     * @param {EntityId} entityId
     */
    deleteEntity(entityId: EntityId): void;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    attachComponent<T>(entityId: EntityId, componentClass: ComponentClass<T>): T;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    detachComponent<T>(entityId: EntityId, componentClass: ComponentClass<T>): boolean;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    lookupComponent<T>(entityId: EntityId, componentClass: ComponentClass<T>): T | null;
    /**
     * @template T
     * @param {import('./component').ComponentClass<T>} componetClass
     * @param {T} instance
     */
    lookupEntity<T>(componetClass: ComponentClass<T>, instance: T): number;
    /**
     * @template T
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    countComponents<T>(componentClass: ComponentClass<T>): number;
    /**
     * @template T
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    keysOf<T>(componentClass: ComponentClass<T>): Iterable<number> & ArrayLike<number>;
    /**
     * @template T
     * @param {import('./component').ComponentClass<T>} componentClass
     */
    instancesOf<T>(componentClass: ComponentClass<T>): Iterable<T> & ArrayLike<T>;
    /**
     * @template {import('./match').MatchTemplate} T
     * @param {T} selector
     * @param {EntityId} [entityId]
     */
    find<T extends MatchTemplate>(selector: T, entityId?: EntityId): MatchTemplateInstancesOf<T> | null;
    /**
     * @template {import('./match').MatchTemplate} T
     * @param {T} selector
     */
    findAll<T extends MatchTemplate>(selector: T): Generator<MatchTemplateInstancesOf<T>, void, any>;
    resetPool(): void;
}

export { ComponentFactory, EntityId, EntityManager, LocalEntityPool, MatchFilter };
export type { ComponentClass, ComponentConstructor, EntityPoolLike, MatchClass, MatchFilterNoneOf, MatchFilterSomeOf, MatchResult, MatchTemplate, MatchTemplateInstancesOf };
