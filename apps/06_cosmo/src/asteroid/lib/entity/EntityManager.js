/**
 * @typedef {Record<number, object>} ComponentInstanceMap
 * @typedef {Record<string, ComponentInstanceMap>} ComponentClassMap
 * @typedef {number} EntityId
 * @typedef {string} ComponentName
 */

/**
 * @template {ComponentClass<any>[]} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ComponentInstancesOf<T>
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
 * @param {EntityManager} entityManager 
 * @param {ComponentName} componentName
 * @returns {ComponentInstanceMap} A map of entity ids to component instance data.
 */
function resetComponentInstanceMap(entityManager, componentName) {
    // @ts-ignore
    let components = entityManager.components;
    /** @type {ComponentInstanceMap} */
    let map = {};
    components[componentName] = map;
    return map;
}

/**
 * @template T
 * @param {EntityManager} entityManager 
 * @param {EntityId} entityId 
 * @param {ComponentClass<T>} componentClass
 * @param {T} instance
 * @returns {T}
 */
function attachComponent(entityManager, entityId, componentClass, instance) {
    let componentName = componentClass.name;
    let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
    instanceMap[entityId] = instance;
    return instance;
}

/**
 * @template T
 * @param {EntityManager} entityManager 
 * @param {EntityId} entityId 
 * @param {ComponentClass<T>} componentClass
 */
function detachComponent(entityManager, entityId, componentClass) {
    let componentName = componentClass.name;
    let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
    let instance = instanceMap[entityId];
    delete instanceMap[entityId];
    componentClass.delete(instance);
}

/**
 * @template T
 * @param {EntityManager} entityManager
 * @param {ComponentClass<T>} componentClass
 */
function clearComponents(entityManager, componentClass) {
    let componentName = componentClass.name;
    let instanceMap = resolveComponentInstanceMap(entityManager, componentName);
    let instances = Object.values(instanceMap);
    resetComponentInstanceMap(entityManager, componentName);
    for(let instance of instances) {
        componentClass.delete(instance);
    }
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
                    let [entityId, componentClass, instance] = args;
                    attachComponent(this, entityId, componentClass, instance);
                } break;
                case 'detach': {
                    let [entityId, componentClass] = args;
                    detachComponent(this, entityId, componentClass);
                } break;
                case 'clear': {
                    let [componentClass] = args;
                    clearComponents(this, componentClass);
                } break;
            }
        }
    }

    /**
     * @template {ComponentClass<any>[]}T
     * @param {T} componentClasses 
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    createAndAttach(...componentClasses) {
        let entityId = nextAvailableEntityId(this);
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (/** @type {unknown} */ ([entityId]));
        for (let componentClass of componentClasses) {
            let instance = this.attach(entityId, componentClass);
            result.push(instance);
        }
        return result;
    }

    /**
     * @returns {EntityId}
     */
    create() {
        return nextAvailableEntityId(this);
    }

    /**
     * @param {EntityId} entityId 
     */
    destroy(entityId) {
        for (let instanceMap of Object.values(this.components)) {
            if (entityId in instanceMap) {
                delete instanceMap[entityId];
            }
        }
    }

    /**
     * @param {EntityId} entityId 
     */
    exists(entityId) {
        for (let instanceMap of Object.values(this.components)) {
            if (entityId in instanceMap) {
                return true;
            }
        }
        return false;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     * @returns {T}
     */
    attach(entityId, componentClass) {
        let instance = componentClass.new();
        this.queue.push(['attach', entityId, componentClass, instance]);
        return instance;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    attachImmediately(entityId, componentClass) {
        let instance = componentClass.new();
        return attachComponent(this, entityId, componentClass, instance);
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
     */
    detachImmediately(entityId, componentClass) {
        detachComponent(this, entityId, componentClass);
    }

    /**
     * @template T
     * @param {ComponentClass<T>} componentClass 
     */
    clear(componentClass) {
        this.queue.push(['clear', componentClass]);
    }

    /**
     * @param {ComponentClass<any>} componentClass 
     */
    clearImmediately(componentClass) {
        clearComponents(this, componentClass);
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

    /**
     * @param {ComponentClass<?>} componentClass 
     * @returns {number}
     */
    count(componentClass) {
        let componentName = componentClass.name;
        let instanceMap = resolveComponentInstanceMap(this, componentName);
        if (instanceMap) {
            return 0;
        } else {
            return Object.keys(instanceMap).length;
        }
    }

    reset() {
        this.components = {};
        this[NEXT_AVAILABLE_ENTITY_ID] = 1;
        this.queue.length = 0;
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
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    create(entityManager) {
        let entityId = nextAvailableEntityId(entityManager);
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (/** @type {unknown} */ ([entityId]));
        for (let componentClass of this.componentClasses) {
            let instance = entityManager.attach(entityId, componentClass);
            result.push(instance);
        }
        return result;
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
     * @returns {number}
     */
    count(entityManager) {
        let count = 0;
        let iter = this.findAll(entityManager);
        while(!iter.next().done) {
            ++count;
        }
        return count;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    find(entityManager) {
        let entities = this.findAll(entityManager);
        let result = entities.next();
        if (result.done) {
            // @ts-ignore
            return [];
        } else {
            return result.value;
        }
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {Generator<[EntityId, ...ComponentInstancesOf<T>]>}
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
                let otherName = otherClass.name;
                let otherMap = resolveComponentInstanceMap(entityManager, otherName);
                if (!(entityId in otherMap)) {
                    flag = false;
                    break;
                }
                let other = otherMap[entityId];
                result[index++] = other;
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
