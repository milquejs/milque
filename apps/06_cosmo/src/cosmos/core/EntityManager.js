/**
 * @typedef {Record<number, object>} ComponentInstanceMap
 * @typedef {Record<string, ComponentInstanceMap>} ComponentClassMap
 * @typedef {ReturnType<resolveEntityManager>} EntityManager
 * @typedef {object} MilqueContext
 */

/** @param {MilqueContext} m */
function resolveEntityManager(m) {
    if ('components' in m) {
        /** @type {ComponentClassMap} */
        let result = m.components;
        return result;
    } else {
        /** @type {ComponentClassMap} */
        let result = {};
        m.components = result;
        return result;
    }
}

/**
 * @param {EntityManager} ents 
 * @param {ComponentClass} componentClass
 * @returns {string} Unique identifier for the component class.
 */
function resolveComponentName(ents, componentClass) {
    return componentClass.name;
}

/**
 * @param {EntityManager} ents 
 * @param {string} componentName
 * @returns {ComponentInstanceMap} A map of entity ids to component instance data.
 */
function resolveComponentInstanceMap(ents, componentName) {
    if (!(componentName in ents)) {
        /** @type {ComponentInstanceMap} */
        let map = {};
        ents[componentName] = map;
        return map;
    } else {
        return ents[componentName];
    }
}

const NEXT_AVAILABLE_ENTITY_ID = Symbol('nextAvailableEntityId');

/**
 * @param {EntityManager} ents 
 * @returns {number}
 */
function nextAvailableEntityId(ents) {
    if (NEXT_AVAILABLE_ENTITY_ID in ents) {
        // @ts-ignore
        return ents[NEXT_AVAILABLE_ENTITY_ID]++;
    } else {
        Object.defineProperty(ents, NEXT_AVAILABLE_ENTITY_ID, {
            value: 2,
            writable: true,
            enumerable: false,
        });
        return 1;
    }
}

/**
 * @param {EntityManager} ents
 * @param {number} entityId
 * @param {ComponentClass} componentClass
 */
function putComponent(ents, entityId, componentClass) {
    const componentName = resolveComponentName(ents, componentClass);
    let instanceMap = resolveComponentInstanceMap(ents, componentName);
    let instance = componentClass.new();
    instanceMap[entityId] = instance;
    return instance;
}

/**
 * @param {EntityManager} ents
 * @param {number} entityId
 * @param {ComponentClass} componentClass
 */
function removeComponent(ents, entityId, componentClass) {
    const componentName = resolveComponentName(ents, componentClass);
    let instanceMap = resolveComponentInstanceMap(ents, componentName);
    let instance = instanceMap[entityId];
    delete instanceMap[entityId];
    return instance;
}

export class EntityTemplate {
    /** @param {Array<ComponentClass>} componentClasses */
    constructor(componentClasses) {
        /** @private */
        this.componentClasses = componentClasses;
    }

    /**
     * @param {MilqueContext} m 
     * @returns {number}
     */
    instantiate(m) {
        let ents = resolveEntityManager(m);
        let entityId = nextAvailableEntityId(ents);
        for (let componentClass of this.componentClasses) {
            putComponent(ents, entityId, componentClass);
        }
        return entityId;
    }

    /**
     * @param {MilqueContext} m 
     * @param {number} entityId
     */
    destroy(m, entityId) {
        let ents = resolveEntityManager(m);
        for(let componentClass of this.componentClasses) {
            removeComponent(ents, entityId, componentClass);
        }
    }
}

export class EntityQuery {
    /**
     * @param {Array<ComponentClass>} componentClasses 
     */
    constructor(componentClasses) {
        /** @private */
        this.includes = componentClasses;
    }

    /**
     * @param {MilqueContext} m
     * @returns {number}
     */
    find(m) {
        let list = this.findAll(m);
        let result = list[Symbol.iterator]().next();
        return result.value;
    }

    /**
     * @param {MilqueContext} m
     * @returns {Array<number>}
     */
    findAll(m) {
        let ents = resolveEntityManager(m);
        let result = [];
        if (this.includes.length <= 0) {
            return result;
        }
        let componentClass = this.includes[0];
        let componentName = resolveComponentName(ents, componentClass);
        let instanceMap = resolveComponentInstanceMap(ents, componentName);
        for(let key of Object.keys(instanceMap)) {
            let entityId = Number(key);
            let flag = true;
            for(let otherClass of this.includes) {
                if (componentClass === otherClass) {
                    continue;
                }
                let otherName = resolveComponentName(ents, otherClass);
                let otherMap = resolveComponentInstanceMap(ents, otherName);
                if (!(entityId in otherMap)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(entityId);
            }
        }
        return result;
    }
}

/**
 * @template T
 */
export class ComponentQuery {
    /**
     * @param {ComponentClass<T>} componentClass 
     */
    constructor(componentClass) {
        /** @private */
        this.componentClass = componentClass;
    }

    /**
     * @param {MilqueContext} m
     * @returns {T}
     */
    find(m) {
        let list = this.findAll(m);
        let result = list[Symbol.iterator]().next();
        return result.value;
    }

    /**
     * @param {MilqueContext} m
     * @returns {Array<T>}
     */
    findAll(m) {
        let ents = resolveEntityManager(m);
        let componentName = resolveComponentName(ents, this.componentClass);
        let instanceMap = resolveComponentInstanceMap(ents, componentName);
        return Object.values(instanceMap);
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
    constructor(name, newCallback, deleteCallback = () => {}) {
        this.name = name;
        this.new = newCallback;
        this.delete = deleteCallback;
    }
}
