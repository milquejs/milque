/**
 * @typedef {Record<number, object>} ComponentInstanceMap
 * @typedef {Record<string, ComponentInstanceMap>} ComponentClassMap
 * @typedef {number} EntityId
 * @typedef {string} ComponentName
 */

/**
 * @param {EntityManager} entityManager 
 * @param {ComponentName} componentName
 * @returns {ComponentInstanceMap} A map of entity ids to component instance data.
 */
function resolveComponentInstanceMap(entityManager, componentName) {
    // @ts-ignore
    let components = entityManager.components;
    if (!(componentName in components)) {
        /** @type {ComponentInstanceMap} */
        let map = {};
        components[componentName] = map;
        return map;
    } else {
        return components[componentName];
    }
}

/**
 * @template T
 * @param {EntityManager} entityManager 
 * @param {EntityId} entityId 
 * @param {ComponentClass<T>} componentClass
 * @returns {T}
 */
function attachComponent(entityManager, entityId, componentClass) {
    let componentName = componentClass.name;
    let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
    let instance = componentClass.new();
    instanceMap[entityId] = instance;
    return instance;
}

/**
 * @template T
 * @param {EntityManager} entityManager 
 * @param {EntityId} entityId 
 * @param {ComponentClass<T>} componentClass 
 * @returns {T}
 */
function detachComponent(entityManager, entityId, componentClass) {
    let componentName = componentClass.name;
    let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
    let instance = instanceMap[entityId];
    delete instanceMap[entityId];
    return instance;
}

const NEXT_AVAILABLE_ENTITY_ID = Symbol('nextAvailableEntityId');

/**
 * @param {EntityManager} entityManager 
 * @returns {EntityId}
 */
function nextAvailableEntityId(entityManager) {
    return ++entityManager[NEXT_AVAILABLE_ENTITY_ID];
}

export class EntityManager {
    constructor() {
        /**
         * @protected
         * @type {ComponentClassMap}
         */
        this.components = {};
        /** @type {EntityId} */
        this[NEXT_AVAILABLE_ENTITY_ID] = 1;
        /**
         * @protected
         * @type {Array<[string, ...any]>}
         */
        this.queue = [];
    }

    flush() {
        while (this.queue.length > 0) {
            let [type, ...args] = this.queue.shift();
            switch (type) {
                case 'attach': {
                    let [entityId, componentClass] = args;
                    this.attachImmediately(entityId, componentClass);
                } break;
                case 'detach': {
                    let [entityId, componentClass] = args;
                    this.detachImmediately(entityId, componentClass);
                } break;
            }
        }
    }

    /**
     * @param  {...ComponentClass<?>} componentClasses 
     * @returns {EntityId}
     */
    create(...componentClasses) {
        let entityId = nextAvailableEntityId(this);
        for (let componentClass of componentClasses) {
            this.attach(entityId, componentClass);
        }
        return entityId;
    }

    /**
     * @param {EntityId} entityId 
     */
    delete(entityId) {
        for (let instanceMap of Object.values(this.components)) {
            if (entityId in instanceMap) {
                delete instanceMap[entityId];
            }
        }
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     */
    attach(entityId, componentClass) {
        this.queue.push(['attach', entityId, componentClass]);
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    attachImmediately(entityId, componentClass) {
        return attachComponent(this, entityId, componentClass);
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     */
    detach(entityId, componentClass) {
        this.queue.push(['detach', entityId, componentClass]);
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    detachImmediately(entityId, componentClass) {
        return detachComponent(this, entityId, componentClass);
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    get(entityId, componentClass) {
        let componentName = componentClass.name;
        let instanceMap = resolveComponentInstanceMap(this, componentName);
        if (instanceMap) {
            return null;
        } else {
            return instanceMap[entityId] || null;
        }
    }
}

/**
 * @template {ComponentClass<any>[]} T
 */
export class EntityTemplate {
    /**
     * @param {T} componentClasses 
     */
    constructor(...componentClasses) {
        /** @private */
        this.componentClasses = componentClasses;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {EntityId}
     */
    instantiate(entityManager) {
        let entityId = nextAvailableEntityId(entityManager);
        for (let componentClass of this.componentClasses) {
            entityManager.attach(entityId, componentClass);
        }
        return entityId;
    }

    /**
     * @param {EntityManager} entityManager 
     * @param {EntityId} entityId 
     */
    destroy(entityManager, entityId) {
        for (let componentClass of this.componentClasses) {
            entityManager.detach(entityId, componentClass);
        }
    }
}

/**
 * @template {ComponentClass<any>[]} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ComponentInstancesOf<T>
 */

/**
 * @template {ComponentClass<any>[]} T
 */
export class EntityQuery {
    /**
     * @param {T} selectors 
     */
    constructor(...selectors) {
        /** @private */
        this.selectors = selectors;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    find(entityManager) {
        let entities = this.findAll(entityManager);
        let result = entities[Symbol.iterator]().next();
        return result.value;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {Iterable<[EntityId, ...ComponentInstancesOf<T>]>}
     */
    *findAll(entityManager) {
        if (this.selectors.length <= 0) {
            return;
        }
        let componentClass = this.selectors[0];
        let componentName = componentClass.name;
        let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (new Array(this.selectors.length + 1));
        for (let key of Object.keys(instanceMap)) {
            let entityId = Number(key);
            let flag = true;
            result[0] = entityId;
            let index = 1;
            for (let otherClass of this.selectors) {
                if (componentClass === otherClass) {
                    continue;
                }
                let otherName = otherClass.name;
                let otherMap = resolveComponentInstanceMap(entityManager, otherName);
                if (!(entityId in otherMap)) {
                    flag = false;
                    break;
                }
                result[index++] = otherMap[entityId];
            }
            if (flag) {
                yield result;
            }
        }
    }
}

/**
 * @template T
 */
export class ComponentClass {
    /**
     * @param {string} name 
     * @param {() => T} newCallback
     * @param {(component: T) => void} [deleteCallback] 
     */
    constructor(name, newCallback = () => null, deleteCallback = () => { }) {
        this.name = name;
        this.new = newCallback;
        this.delete = deleteCallback;
    }
}
