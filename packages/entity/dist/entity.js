(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Entity = {}));
}(this, (function (exports) { 'use strict';

    function getComponentTypeName$1(componentType)
    {
        return componentType.name || componentType.toString();
    }

    var ComponentHelper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getComponentTypeName: getComponentTypeName$1
    });

    const OPERATOR$1 = Symbol('operator');
    const HANDLER$1 = Symbol('handler');

    /**
     * NOTE: Intentionally does not depend on the "entityManager" to exist in order to be created.
     */
    class EntityQuery
    {
        static select(entityManager, components)
        {
            return new EntityQuery(components, false).select(entityManager);
        }

        static computeKey(components)
        {
            let result = [];
            for(let component of components)
            {
                if (typeof component === 'object' && OPERATOR$1 in component)
                {
                    result.push(component[OPERATOR$1].toString() + getComponentTypeName$1(component));
                }
                else
                {
                    result.push(getComponentTypeName$1(component));
                }
            }
            return result.sort().join('-');
        }

        constructor(components, persistent = true)
        {
            this._included = [];
            this._operated = {};

            for(let component of components)
            {
                if (typeof component === 'object' && OPERATOR$1 in component)
                {
                    const operator = component[OPERATOR$1];
                    if (operator in this._operated)
                    {
                        this._operated[operator].components.push(component.component);
                    }
                    else
                    {
                        this._operated[operator] = {
                            components: [component.component],
                            handler: component[HANDLER$1],
                        };
                    }
                }
                else
                {
                    this._included.push(component);
                }
            }

            this.entityManager = null;
            this.persistent = persistent;
            this.entityIds = new Set();

            this.key = EntityQuery.computeKey(components);

            this.onEntityCreate = this.onEntityCreate.bind(this);
            this.onEntityDestroy = this.onEntityDestroy.bind(this);
            this.onComponentAdd = this.onComponentAdd.bind(this);
            this.onComponentRemove = this.onComponentRemove.bind(this);
        }

        matches(entityManager, entityId)
        {
            if (this.entityManager !== entityManager) return false;
            if (!entityManager.hasComponent(entityId, ...this._included)) return false;
            for(let operatedInfo of Object.getOwnPropertyNames(this._operated))
            {
                if (!operatedInfo[HANDLER$1].call(this, entityManager, entityId, operatedInfo.components))
                {
                    return false;
                }
            }
            return true;
        }

        select(entityManager)
        {
            let flag = this.entityManager === entityManager;
            if (this.persistent && flag) return this.entityIds;
            
            const prevEntityManager = this.entityManager;
            this.entityManager = entityManager;
            this.entityIds.clear();

            for(let entityId of entityManager.getEntityIds())
            {
                if (this.matches(entityManager, entityId))
                {
                    this.entityIds.add(entityId);
                }
            }

            if (this.persistent && !flag)
            {
                if (prevEntityManager)
                {
                    prevEntityManager.entityHandler.off('create', this.onEntityCreate);
                    prevEntityManager.entityHandler.off('destroy', this.onEntityDestroy);
                    prevEntityManager.componentHandler.off('add', this.onComponentAdd);
                    prevEntityManager.componentHandler.off('remove', this.onComponentRemove);
                }

                this.entityManager.entityHandler.on('create', this.onEntityCreate);
                this.entityManager.entityHandler.on('destroy', this.onEntityDestroy);
                this.entityManager.componentHandler.on('add', this.onComponentAdd);
                this.entityManager.componentHandler.on('remove', this.onComponentRemove);
            }

            return this.entityIds;
        }

        selectComponent(entityManager, component = this._included[0])
        {
            let result = this.select(entityManager);
            let dst = [];
            for(let entityId of result)
            {
                dst.push(entityManager.getComponent(entityId, component));
            }
            return dst;
        }

        clear()
        {
            if (this.persistent)
            {
                this.entityManager.entityHandler.off('create', this.onEntityCreate);
                this.entityManager.entityHandler.off('destroy', this.onEntityDestroy);
                this.entityManager.componentHandler.off('add', this.onComponentAdd);
                this.entityManager.componentHandler.off('remove', this.onComponentRemove);
            }

            this.entityIds.clear();
            this.entityManager = null;
        }

        onEntityCreate(entityId)
        {
            if (this.matches(this.entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
        }

        onEntityDestroy(entityId)
        {
            if (this.entityIds.has(entityId))
            {
                this.entityIds.delete(entityId);
            }
        }

        onComponentAdd(entityId, componentType, component, initialValues)
        {
            this.onComponentRemove(entityId, componentType, component);
        }
        
        // NOTE: Could be further optimized if we know it ONLY contains includes, etc.
        onComponentRemove(entityId, componentType, component)
        {
            if (this.matches(this.entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
            else if (this.entityIds.has(entityId))
            {
                this.entityIds.delete(entityId);
            }
        }
    }

    /**
     * @fires destroy
     */
    class EntityHandler
    {
        constructor()
        {
            this._entities = new Set();
            this._nextAvailableEntityId = 1;
            this._listeners = new Map();
        }

        /**
         * Adds a listener for entity events that occur for the passed-in id.
         * 
         * @param {EntityId} entityId The associated id for the entity to listen to.
         * @param {String} eventType The event type to listen for.
         * @param {Function} listener The listener function that will be called when the event occurs.
         * @param {Object} [opts] Additional options.
         * @param {Boolean} [opts.once=false] Whether the listener should be invoked at most once after being
         * added. If true, the listener would be automatically removed when invoked.
         * @param {Function|String|*} [opts.handle=listener] The handle to uniquely identify the listener. If set,
         * this will be used instead of the function instance. This is usful for anonymous functions, since
         * they are always unique and therefore cannot be removed, causing an unfortunate memory leak.
         */
        addEntityListener(entityId, eventType, listener, opts = undefined)
        {
            const handle = opts && typeof opts.handle !== 'undefined' ? opts.handle : listener;
            
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    let listeners = eventMap[eventType];
                    listeners.set(handle, listener);
                }
                else
                {
                    let listeners = new Map();
                    listeners.set(handle, listener);
                    eventMap[eventType] = listeners;
                }
            }
            else
            {
                let onces = new Set();
                let listeners = new Map();
                listeners.set(handle, listener);
                if (opts.once) onces.add(handle);
                let eventMap = {
                    onces,
                    [eventType]: listeners
                };
                this._listeners.set(entityId, eventMap);
            }
        }

        /**
         * Removes the listener from the entity with the passed-in id.
         * 
         * @param {EntityId} entityId The associated id for the entity to remove from.
         * @param {String} eventType The event type to remove from.
         * @param {Function|String|*} handle The listener handle that will be called when the event occurs.
         * Usually, this is the function itself.
         * @param {Object} [opts] Additional options.
         */
        removeEntityListener(entityId, eventType, handle, opts = undefined)
        {
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    eventMap[eventType].delete(handle);
                    if (eventMap.onces.has(handle))
                    {
                        eventMap.onces.delete(handle);
                    }
                }
            }
        }

        /**
         * Dispatches an event to all the entity's listeners.
         * 
         * @param {EntityId} entityId The id of the entity.
         * @param {String} eventType The type of the dispatched event.
         * @param {Array} [eventArgs] An array of arguments to be passed to the listeners.
         */
        dispatchEntityEvent(entityId, eventType, eventArgs = undefined)
        {
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    let onces = eventMap.onces;
                    let listeners = eventMap[eventType];
                    for(let [handle, listener] of listeners.entries())
                    {
                        listener.apply(undefined, eventArgs);
                        if (onces.has(handle))
                        {
                            listeners.delete(handle);
                        }
                    }
                }
            }
        }

        addEntityId(entityId)
        {
            this._entities.add(entityId);
        }

        deleteEntityId(entityId)
        {
            this._entities.delete(entityId);
            this.dispatchEntityEvent(entityId, 'destroy', [ entityId ]);
        }
        
        getNextAvailableEntityId()
        {
            return this._nextAvailableEntityId++;
        }

        getEntityIds()
        {
            return this._entities;
        }
    }

    /** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
    class EntityComponent$1
    {
        constructor(world)
        {
            if (!world)
            {
                throw new Error('Cannot create entity in null world.');
            }

            const id = world.createEntity();

            // Skip component creation, as we will be using ourselves :D
            world.componentHandler.putComponent(id, EntityComponent$1, this, undefined);
            
            this.id = id;
        }

        /** @override */
        copy(values) { throw new Error('Unsupported operation; cannot be initialized by existing values.'); }
        
        /** @override */
        reset() { return false; }
    }

    /**
     * @fires componentadd
     * @fires componentremove
     */
    class ComponentHandler
    {
        constructor(entityHandler)
        {
            this._entityHandler = entityHandler;
            this.componentTypeInstanceMap = new Map();
        }

        createComponent(componentType, initialValues)
        {
            let component;

            // Instantiate the component...
            let type = typeof componentType;
            if (type === 'object')
            {
                // NOTE: Although this checks the prototype chain on EVERY add, it only
                // checks on the class object, which should NOT have a chain.
                if (!('create' in componentType))
                {
                    throw new Error(`Instanced component class '${getComponentTypeName(componentType)}' must at least have a create() function.`);
                }

                component = componentType.create(this);
            }
            else if (type === 'function')
            {
                // HACK: This is a hack debugging tool to stop wrong use.
                if (componentType.prototype instanceof EntityComponent$1)
                {
                    throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
                }

                component = new componentType(this);
            }
            else if (type === 'symbol')
            {
                // NOTE: Symbols lose their immutability when converted into a component
                // (their equality is checked by their toString() when computing its key)
                throw new Error('Symbols are not yet supported as components.');
            }
            else
            {
                // NOTE: This means that these can be numbers and strings.
                // HOWEVER, I caution against using numbers. Numbers can often be confused
                // with other operations (particularly when computation is involved).
                component = componentType;
            }

            // Initialize the component...
            if (initialValues)
            {
                this.copyComponent(componentType, component, initialValues);
            }
            
            return component;
        }

        putComponent(entityId, componentType, component, initialValues)
        {
            let componentInstanceMap;
            if (this.componentTypeInstanceMap.has(componentType))
            {
                componentInstanceMap = this.componentTypeInstanceMap.get(componentType);
            }
            else
            {
                this.componentTypeInstanceMap.set(componentType, componentInstanceMap = new Map());
            }

            if (componentInstanceMap.has(entityId))
            {
                throw new Error(`Cannot add more than one instance of component class '${getComponentTypeName(componentType)}' for entity '${entityId}'.`);
            }

            componentInstanceMap.set(entityId, component);

            this._entityHandler.dispatchEntityEvent(entityId, 'componentadd', [entityId, componentType, component, initialValues]);
        }

        deleteComponent(entityId, componentType, component)
        {
            this.componentTypeInstanceMap.get(componentType).delete(entityId);
        
            let reusable;
            // It's a tag. No reuse.
            if (componentType === component)
            {
                reusable = false;
            }
            // Try user-defined static reset...
            else if ('reset' in componentType)
            {
                reusable = componentType.reset(component);
            }
            // Try user-defined instance reset...
            else if ('reset' in component)
            {
                reusable = component.reset();
            }
            // Try default reset...
            else
            {
                // Do nothing. It cannot be reset.
                reusable = false;
            }

            this._entityHandler.dispatchEntityEvent(entityId, 'componentremove', [entityId, componentType, component]);
            return component;
        }

        copyComponent(componentType, component, targetValues)
        {
            // It's a tag. No need to copy.
            if (componentType === component)
            {
                return;
            }
            // Try user-defined static copy...
            else if ('copy' in componentType)
            {
                componentType.copy(component, targetValues);
            }
            // Try user-defined instance copy...
            else if ('copy' in component)
            {
                component.copy(targetValues);
            }
            // Try default copy...
            else
            {
                for(let key of Object.getOwnPropertyNames(targetValues))
                {
                    component[key] = targetValues[key];
                }
            }
        }

        hasComponentType(componentType)
        {
            return this.componentTypeInstanceMap.has(componentType);
        }

        getComponentTypes()
        {
            return this.componentTypeInstanceMap.keys();
        }

        getComponentInstanceMapByType(componentType)
        {
            return this.componentTypeInstanceMap.get(componentType);
        }

        getComponentInstanceMaps()
        {
            return this.componentTypeInstanceMap.values();
        }
    }

    /**
     * @typedef EntityId
     * The unique id for every entity in a world.
     */

    /**
     * Manages all entities.
     */
    class EntityManager
    {
        constructor()
        {
            this.entityHandler = new EntityHandler();
            this.componentHandler = new ComponentHandler(this.entityHandler);
        }

        clear()
        {
            for(let entityId of this.entityHandler.getEntityIds())
            {
                this.destroyEntity(entityId);
            }
        }

        /** Creates a unique entity with passed-in components (without initial values). */
        createEntity(...components)
        {
            const entityId = this.entityHandler.getNextAvailableEntityId();
            this.entityHandler.addEntityId(entityId);

            for(let component of components)
            {
                this.addComponent(entityId, component);
            }
            return entityId;
        }

        /** Destroys the passed-in entity (and its components). */
        destroyEntity(entityId)
        {
            // Remove entity components from world
            for(let componentType of this.componentHandler.getComponentTypes())
            {
                if (this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId))
                {
                    this.removeComponent(entityId, componentType);
                }
            }

            // Remove entity from world
            this.entityHandler.deleteEntityId(entityId);
        }

        getEntityIds()
        {
            return this.entityHandler.getEntityIds();
        }
        
        /**
         * 
         * @param {import('./Entity.js').EntityId} entityId The id of the entity to add to.
         * @param {FunctionConstructor|import('./Component.js').ComponentFactory|String|Number} componentType The component type.
         * Can either be a component class or a component factory.
         * @param {Object} [initialValues] The initial values for the component. Can be an object
         * map of all defined key-value pairs or another instance of the same component. This
         * must be undefined for tag-like components.
         */
        addComponent(entityId, componentType, initialValues = undefined)
        {
            try
            {
                let component = this.componentHandler.createComponent(componentType, initialValues);
                this.componentHandler.putComponent(entityId, componentType, component, initialValues);
                return component;
            }
            catch(e)
            {
                console.error(`Failed to add component '${getComponentTypeName$1(componentType)}' to entity '${entityId}'.`);
                console.error(e);
            }
        }
        
        removeComponent(entityId, componentType)
        {
            try
            {
                let component = this.getComponent(entityId, componentType);
                this.componentHandler.deleteComponent(entityId, componentType, component);
                return component;
            }
            catch(e)
            {
                console.error(`Failed to remove component '${getComponentTypeName$1(componentType)}' from entity '${entityId}'.`);
                console.error(e);
            }
        }

        clearComponents(entityId)
        {
            for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
            {
                if (componentInstanceMap.has(entityId))
                {
                    let component = componentInstanceMap.get(entityId);
                    this.componentHandler.deleteComponent(entityId, componentType, component);
                }
            }
        }

        getComponentTypesByEntityId(entityId)
        {
            let dst = [];
            for(let componentType of this.componentHandler.getComponentTypes())
            {
                let componentInstanceMap = this.componentHandler.getComponentInstanceMapByType(componentType);
                if (componentInstanceMap.has(entityId))
                {
                    dst.push(componentType);
                }
            }
            return dst;
        }

        getComponent(entityId, componentType)
        {
            return this.componentHandler.getComponentInstanceMapByType(componentType).get(entityId);
        }

        hasComponent(entityId, ...componentTypes)
        {
            for(let componentType of componentTypes)
            {
                if (!this.componentHandler.hasComponentType(componentType)) return false;
                if (!this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId)) return false;
            }
            return true;
        }

        countComponents(entityId)
        {
            let count = 0;
            for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
            {
                if (componentInstanceMap.has(entityId))
                {
                    ++count;
                }
            }
            return count;
        }

        /**
         * Immediately find entity ids by its components. This is simply an alias for Query.select().
         * @param {Array<Component>} components The component list to match entities to.
         * @returns {Iterable<EntityId>} A collection of all matching entity ids.
         */
        find(components)
        {
            return EntityQuery.select(this, components);
        }

        [Symbol.iterator]()
        {
            return this.getEntityIds()[Symbol.iterator]();
        }
    }

    function createQueryOperator(handler, key = Symbol(handler.name))
    {
        let result = function(componentType) {
            return { [OPERATOR]: key, [HANDLER]: handler, component: componentType };
        };
        // Dynamic renaming of function for debugging purposes
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
        Object.defineProperty(result, 'name', {
            value: name,
            configurable: true,
        });
        return result;
    }

    const Not = createQueryOperator(
        function NotOperator(world, entityId, componentTypees)
        {
            return !(world.hasComponent(entityId, ...componentTypees));
        },
        Symbol('!')
    );

    var QueryOperator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createQueryOperator: createQueryOperator,
        Not: Not
    });

    /**
     * Creates a new component instance for this component type.
     * @callback create
     * @param {import('../World.js').World} world The world the component will be added to.
     * @param {import('../entity/Entity.js').EntityId} entityId The id of the entity this component is added to.
     */

    /**
     * Copies a component instance from values.
     * @callback copy
     * @param {Object} dst The target component instance to modify.
     * @param {Object} values The source values to copy from.
     */

    /**
     * Resets a component instance to be re-used or deleted.
     * @callback reset
     * @param {Object} dst The target component instance to reset.
     */

    /**
     * @typedef ComponentFactory
     * A component factory handles the creation, modification, and deletion of component instances.
     * 
     * @property {create} create Creates a new component instance for this type.
     * @property {copy} [copy] Copies a component instance from values.
     * @property {reset} [reset] Resets a component instance to be re-used or deleted.
     */

    /**
     * Creates a component factory given the passed-in handlers. This is not required
     * to create a component factory; any object with create(), copy(), and reset() can
     * be considered a component factory and used as is without this function. This
     * function is mostly for ease of use and readability.
     * 
     * @param {String} name The name of the component. This should be unique; it is used as its hash key.
     * @param {create} [create=defaultCreate] The function to create new components.
     * @param {copy} [copy=defaultCopy] The function to copy new components from values.
     * @param {reset} [reset=defaultReset] The function to reset a component to be re-used or deleted.
     * @returns {ComponentFactory} The created component factory.
     */
    function createComponentFactory(name, create = defaultCreate, copy = defaultCopy, reset = defaultReset)
    {
        return {
            name,
            create,
            copy,
            reset
        };
    }

    function defaultCreate(world, entityId) { return {}; }
    function defaultCopy(dst, values) { Object.assign(dst, values); }
    function defaultReset(dst) { Object.getOwnPropertyNames(dst).forEach(value => delete dst[value]); }

    var ComponentFactory = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createComponentFactory: createComponentFactory
    });

    /**
     * A class to represent a component. This class is not required to
     * create a component; any class can be considered a component. To
     * override reset or copy behavior, simply implement the reset()
     * or copy() functions respectively for that class.
     * 
     * This class serves mostly as a quick and dirty default fallback. It
     * has defaults for all functionality except its properties (which are
     * usually unique to each component type).
     * 
     * Usually, you will use this class like so:
     * @example
     * class MyComponent extends ComponentBase
     * {
     *   constructor()
     *   {
     *     super();
     *     this.myValue = true;
     *     this.myString = 'Hello World';
     *   }
     * 
     *   // Feel free to override any default functionality when needed...
     * }
     */
    const DEFAULT_UNDEFINED = Symbol('defaultUndefined');
    class ComponentBase
    {
        static get defaultValues() { return null; }

        constructor(world, entityId, resetAsSelfConstructor = true)
        {
            if (!('defaultValues' in this.constructor))
            {
                if (resetAsSelfConstructor)
                {
                    // NOTE: Must make sure 'defaultValues' exists before recursing into the constructor.
                    this.constructor.defaultValues = null;
                    this.constructor.defaultValues = new (this.constructor)();
                }
                else
                {
                    this.constructor.defaultValues = DEFAULT_UNDEFINED;
                }
            }
        }
        
        copy(values)
        {
            for(let key of Object.getOwnPropertyNames(values))
            {
                this[key] = values[key];
            }
        }

        reset()
        {
            if ('defaultValues' in this.constructor)
            {
                let defaultValues = this.constructor.defaultValues;
                if (defaultValues === DEFAULT_UNDEFINED)
                {
                    for(let key of Object.getOwnPropertyNames(this))
                    {
                        this[key] = undefined;
                    }
                    return true;
                }
                else if (defaultValues)
                {
                    this.copy(this, this.constructor.defaultValues);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }

    /**
     * A class to represent a component with no data, also known as a tag.
     * This class is not required to create a tag component; any class is
     * considered a tag, if:
     * 
     * - It does not implement reset() or reset() always returns false.
     * - And its instances do not own any properties.
     * 
     * This class is mostly for ease of use and readability.
     */
    class TagComponent {}

    class EntityBase extends EntityComponent$1
    {
        constructor(entityManager)
        {
            super(entityManager);

            this.entityManager = entityManager;
        }

        destroy()
        {
            this.entityManager.destroyEntity(this.entityId);
            this.entityManager = null;
        }

        addComponent(componentType, initialValues = undefined)
        {
            this.entityManager.addComponent(this.id, componentType, initialValues);
            return this;
        }

        removeComponent(componentType)
        {
            this.entityManager.removeComponent(this.id, componentType);
            return this;
        }

        hasComponent(componentType)
        {
            return this.entityManager.hasComponent(this.id, componentType);
        }

        getComponent(componentType)
        {
            return this.entityManager.getComponent(this.id, componentType);
        }
    }

    class HybridEntity extends EntityBase
    {
        constructor(entityManager)
        {
            super(entityManager);

            this.onComponentAdd = this.onComponentAdd.bind(this);
            this.onComponentRemove = this.onComponentRemove.bind(this);

            this.entityManager.entityHandler.addEntityListener(this.id, 'componentadd', this.onComponentAdd);
            this.entityManager.entityHandler.addEntityListener(this.id, 'componentremove', this.onComponentRemove);
        }
        
        /** @abstract */
        onDestroy() {}

        onComponentAdd(entityId, componentType, component, initialValues)
        {
            if (entityId === this.id)
            {
                // NOTE: Since this callback is connected only AFTER EntityComponent has been added
                // we can safely assume that it cannot be added again.
                addComponentProperties(this, componentType, component);
            }
        }

        onComponentRemove(entityId, componentType, component)
        {
            if (componentType === EntityComponent)
            {
                this.entityManager.entityHandler.removeEntityListener(this.id, 'componentadd', this.onComponentAdd);
                this.entityManager.entityHandler.removeEntityListener(this.id, 'componentremove', this.onComponentRemove);
                
                this.onDestroy();
            }
            else
            {
                removeComponentProperties(this, componentType, component);
            }
        }
    }

    function addComponentProperties(target, componentType, component)
    {
        if (typeof component === 'object')
        {
            let ownProps = Object.getOwnPropertyNames(target);
            let newProps = {};
            for(let prop of Object.getOwnPropertyNames(component))
            {
                if (ownProps.includes(prop))
                {
                    throw new Error(`Conflicting property names in entity for component '${getComponentTypeName(componentType)}'.`);
                }

                newProps[prop] = {
                    get() { return component[prop]; },
                    set(value) { component[prop] = value; },
                    configurable: true,
                };
            }
            Object.defineProperties(target, newProps);
        }
    }

    function removeComponentProperties(target, componentType, component)
    {
        if (typeof component === 'object')
        {
            for(let prop of Object.getOwnPropertyNames(component))
            {
                delete target[prop];
            }
        }
    }

    function getEntityById(world, entityId)
    {
        return getComponent(entityId, EntityComponent);
    }

    function getEntities(world)
    {
        let dst = [];
        let entityIds = world.query([EntityComponent]);
        for(let entityId of entityIds)
        {
            let component = world.getComponent(entityId, EntityComponent);
            dst.push(component);
        }
        return dst;
    }

    var EntityHelper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getEntityById: getEntityById,
        getEntities: getEntities
    });

    class EntityWrapperBase
    {
        constructor(entityManager)
        {
            this.entityManager = entityManager;

            this.id = entityManager.createEntity();
        }

        add(componentType, initialValues = undefined)
        {
            this.entityManager.addComponent(this.id, componentType, initialValues);
            return this;
        }

        remove(componentType)
        {
            this.entityManager.removeComponent(this.id, componentType);
            return this;
        }

        has(...componentTypes)
        {
            return this.entityManager.hasComponent(this.id, ...componentTypes);
        }

        destroy()
        {
            this.entityManager.destroyEntity(this.id);
        }

        getEntityId() { return this.id; }
    }

    function create(entityManager)
    {
        return new EntityWrapperBase(entityManager);
    }

    var EntityWrapper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EntityWrapperBase: EntityWrapperBase,
        create: create
    });

    const FUNCTION_NAME = Symbol('functionName');
    const FUNCTION_ARGS = Symbol('functionArguments');

    function resolveObject(target, path = [])
    {
        let node = target;
        for(let p of path)
        {
            if (typeof p === 'object' && FUNCTION_NAME in p)
            {
                node = node[p[FUNCTION_NAME]](...p[FUNCTION_ARGS]);
            }
            else
            {
                node = node[p];
            }
        }
        return node;
    }

    function nextProperty(parentPath, nextKey)
    {
        return [
            ...parentPath,
            nextKey,
        ];
    }

    function nextFunction(parentPath, functionName, functionArguments = [])
    {
        return [
            ...parentPath,
            {
                [FUNCTION_NAME]: functionName,
                [FUNCTION_ARGS]: functionArguments,
            }
        ];
    }

    class DiffList extends Array
    {
        static createRecord(type, key, value = undefined, path = [])
        {
            return {
                type,
                path,
                key,
                value,
            };
        }

        addRecord(type, key, value = undefined, path = [])
        {
            let result = DiffList.createRecord(type, key, value, path);
            this.push(result);
            return result;
        }

        addRecords(records)
        {
            this.push(...records);
        }
    }

    function applyDiff(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'new':
            case 'edit':
                sourceProp[diff.key] = diff.value;
                return true;
            case 'delete':
                delete sourceProp[diff.key];
                return true;
        }
        return false;
    }

    function computeDiff(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        let sourceKeys = new Set(Object.getOwnPropertyNames(source));
        for(let key of Object.getOwnPropertyNames(target))
        {
            if (!sourceKeys.has(key))
            {
                dst.addRecord('new', key, target[key], path);
            }
            else
            {
                sourceKeys.delete(key);
                let result = computeDiff$4(source[key], target[key], nextProperty(path, key), opts);
                if (!result)
                {
                    dst.addRecord('edit', key, target[key], path);
                }
                else
                {
                    dst.addRecords(result);
                }
            }
        }
        if (!opts.preserveSource)
        {
            for(let sourceKey of sourceKeys)
            {
                dst.addRecord('delete', sourceKey, undefined, path);
            }
        }
        return dst;
    }

    function isType(arg)
    {
        return Array.isArray(arg);
    }

    function applyDiff$1(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'arrayObjectEdit':
                sourceProp[diff.key] = diff.value;
                return true;
            case 'arrayObjectAppend':
                ensureCapacity(diff.key);
                sourceProp[diff.key] = diff.value;
                return true;
            case 'arrayObjectSplice':
                sourceProp.splice(diff.key, diff.value);
                return true;
        }
        return false;
    }

    function computeDiff$1(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        const length = Math.min(source.length, target.length);
        for(let i = 0; i < length; ++i)
        {
            let result = computeDiff$4(source[i], target[i], nextProperty(path, i), opts);
            if (!result)
            {
                dst.addRecord('arrayObjectEdit', i, target[i], path);
            }
            else
            {
                dst.addRecords(result);
            }
        }

        if (!opts.preserveSource && source.length > target.length)
        {
            dst.addRecord('arrayObjectSplice', target.length, source.length - target.length, path);
        }
        else if (target.length > source.length)
        {
            for(let i = source.length; i < target.length; ++i)
            {
                dst.addRecord('arrayObjectAppend', i, target[i], path);
            }
        }
        return dst;
    }

    function ensureCapacity(array, capacity)
    {
        if (array.length < capacity)
        {
            array.length = capacity;
        }
    }

    var ArrayObjectDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType,
        applyDiff: applyDiff$1,
        computeDiff: computeDiff$1
    });

    function isType$1(arg)
    {
        return arg instanceof Set;
    }

    function applyDiff$2(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'setAdd':
                sourceProp.add(diff.key);
                return true;
            case 'setDelete':
                sourceProp.delete(diff.key);
                return true;
        }
        return false;
    }

    // NOTE: If the set's contents are objects, there is no way to "update" that object.
    // Therefore, this diff only works if NEW objects are added. This is the case for
    // any object with indexed with keys. Keys MUST be checked with '===' and CANNOT be diffed.
    function computeDiff$2(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        for(let value of target)
        {
            if (!source.has(value))
            {
                dst.addRecord('setAdd', value, undefined, path);
            }
        }
        if (!opts.preserveSource)
        {
            for(let value of source)
            {
                if (!target.has(value))
                {
                    dst.addRecord('setDelete', value, undefined, path);
                }
            }
        }
        return dst;
    }

    var SetDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType$1,
        applyDiff: applyDiff$2,
        computeDiff: computeDiff$2
    });

    function isType$2(arg)
    {
        return arg instanceof Map;
    }

    function applyDiff$3(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'mapNew':
            case 'mapSet':
                sourceProp.set(diff.key, diff.value);
                return true;
            case 'mapDelete':
                sourceProp.delete(diff.key);
                return true;
        }
        return false;
    }

    // NOTE: Same as set diffing, keys MUST be checked with '===' and CANNOT be diffed.
    // Although values can.
    function computeDiff$3(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        for(let [key, value] of target)
        {
            if (!source.has(key))
            {
                dst.addRecord('mapNew', key, value, path);
            }
            else
            {
                let result = computeDiff$4(source.get(key), value, nextFunction(path, 'get', [ key ]), opts);
                if (!result)
                {
                    dst.addRecord('mapSet', key, value, path);
                }
                else
                {
                    dst.addRecords(result);
                }
            }
        }
        if (!opts.preserveSource)
        {
            for(let key of source.keys())
            {
                if (!target.has(key))
                {
                    dst.addRecord('mapDelete', key, undefined, path);
                }
            }
        }
        return dst;
    }

    var MapDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType$2,
        applyDiff: applyDiff$3,
        computeDiff: computeDiff$3
    });

    const DEFAULT_HANDLERS = [
        ArrayObjectDiff,
        MapDiff,
        SetDiff,
    ];

    const DEFAULT_OPTS = {
        handlers: DEFAULT_HANDLERS,
        preserveSource: true,
        maxDepth: 1000,
    };

    function computeDiff$4(source, target, path = [], opts = DEFAULT_OPTS)
    {
        // Force replacement since we have reached maximum depth...
        if (path.length >= opts.maxDepth) return null;
        // Check if type at least matches...
        if (typeof source !== typeof target) return null;
        // If it's an object...(which there are many kinds)...
        if (typeof source === 'object')
        {
            for(let handler of opts.handlers)
            {
                let type = handler.isType(source);
                if (type ^ (handler.isType(target))) return null;
                if (type) return handler.computeDiff(source, target, path, opts);
            }

            // It's probably just a simple object...
            return computeDiff(source, target, path, opts);
        }
        else
        {
            // Any other primitive types...
            if (source === target) return [];
            else return null;
        }
    }

    function applyDiff$4(source, diffList, opts = DEFAULT_OPTS)
    {
        let sourceProp = source;
        for(let diff of diffList)
        {
            // Find property...
            sourceProp = resolveObject(source, diff.path);

            // Apply property diff...
            let flag = false;
            for(let handler of opts.handlers)
            {
                flag = handler.applyDiff(source, sourceProp, diff);
                if (flag) break;
            }

            // Apply default property diff...
            if (!flag)
            {
                applyDiff(source, sourceProp, diff);
            }
        }
        return source;
    }

    /**
     * Performs a fine diff on the entities and reconciles any changes with the current world state.
     * It respects the current world state with higher precedence over the modified changes. In other
     * words, any properties modified by the running program will be preserved. Only properties that
     * have not changed will be modified to reflect the new changes.
     * 
     * This assumes entity constructors are deterministic, non-reflexive, and repeatable in a blank
     * test world.
     * 
     * @param {HotEntityModule} prevHotEntityModule The old source hot entity module instance.
     * @param {HotEntityModule} nextHotEntityModule The new target hot entity module instance.
     * @param {Object} [opts] Any additional options.
     * @param {Function} [opts.worldObjectWrapper] If defined, the function will allow you wrap the create EntityManager
     * and specify the shape of the "world" parameter given to the entity constructors. The function takes in an instance
     * of EntityManager and returns an object to pass to the constructors.
     */
    function FineDiffStrategy(prevHotEntityModule, nextHotEntityModule, opts = undefined)
    {
        const prevEntityConstructor = prevHotEntityModule.entityConstructor;
        const prevEntityManagers = prevHotEntityModule.entityManagers;
        const nextEntityConstructor = nextHotEntityModule.entityConstructor;
        const nextEntityManagers = nextHotEntityModule.entityManagers;

        let cacheEntityManager = new EntityManager();
        let cacheWorld = (opts && opts.worldObjectWrapper)
            ? opts.worldObjectWrapper(cacheEntityManager)
            : cacheEntityManager;
        let oldEntity = prevEntityConstructor(cacheWorld);
        let newEntity = nextEntityConstructor(cacheWorld);

        // Diff the old and new components...only update what has changed...
        let componentValues = new Map();
        for(let componentType of cacheEntityManager.getComponentTypesByEntityId(newEntity))
        {
            let newComponent = cacheEntityManager.getComponent(newEntity, componentType);
            let oldComponent = cacheEntityManager.getComponent(oldEntity, componentType);

            if (!oldComponent)
            {
                // ...it's an addition!
                componentValues.set(componentType, true);
            }
            else
            {
                // ...it's an update!
                let result = computeDiff$4(oldComponent, newComponent);
                componentValues.set(componentType, result);
            }
        }
        for(let componentType of cacheEntityManager.getComponentTypesByEntityId(oldEntity))
        {
            if (!componentValues.has(componentType))
            {
                // ...it's a deletion!
                componentValues.set(componentType, false);
            }
        }

        // Clean up cache entity manager...
        cacheEntityManager.clear();

        // Update all existing entity managers to the new entities...
        for(let entityManager of prevEntityManagers)
        {
            // Update entities...
            for(let entity of prevHotEntityModule.entities.get(entityManager).values())
            {
                for(let [componentType, values] of componentValues.entries())
                {
                    if (typeof values === 'boolean')
                    {
                        if (values)
                        {
                            // Addition!
                            entityManager.addComponent(entity, componentType);
                        }
                        else
                        {
                            // Deletion!
                            entityManager.removeComponent(entity, componentType);
                        }
                    }
                    else
                    {
                        // Update!
                        let component = entityManager.getComponent(entity, componentType);
                        applyDiff$4(component, values);
                    }
                }
            }
        }
    }

    class HotEntityModule
    {
        constructor(entityModule, entityConstructor)
        {
            this.moduleId = entityModule.id;
            this.entityConstructor = entityConstructor;

            this.entities = new Map();
        }

        addEntity(entityManager, entityId)
        {
            if (this.entities.has(entityManager))
            {
                this.entities.get(entityManager).add(entityId);
            }
            else
            {
                let entitySet = new Set();
                entitySet.add(entityId);
                this.entities.set(entityManager, entitySet);
            }

            // Add listener...
            entityManager.entityHandler.addEntityListener(
                entityId,
                'destroy',
                this.removeEntity.bind(this, entityManager, entityId),
                { handle: `${this.moduleId}:${entityId}` }
            );
        }

        removeEntity(entityManager, entityId)
        {
            // Remove listener...(just in case this was not triggered by a destroy event)...
            entityManager.entityHandler.removeEntityListener(
                entityId,
                'destroy',
                `${this.moduleId}:${entityId}`);
            
            let entitySet = this.entities.get(entityManager);
            entitySet.delete(entityId);
            if (entitySet.size <= 0) this.entities.delete(entityManager);
        }

        /**
         * Replaces the current state of with the next one. This includes all entities and entity managers.
         * However, it assumes both hot entity replacements are for the same module.
         * 
         * @param {HotEntityModule} nextHotEntityModule The new hot entity module object to replace this with.
         * @param {Object} [opts] Any additional options.
         * @param {Function} [opts.replaceStrategy] If defined, replacement will be handled by the passed in
         * function. It takes 3 arguemtns: the hot entity replacement instance, the target instance, and the replaceOpts if defined.
         * @param {Object} [opts.replaceOpts] This is given to the replacement strategy function, if defined.
         */
        replaceWith(nextHotEntityModule, opts = undefined)
        {
            // NOTE: Assumes more than one instance can exist at the same time.
            // NOTE: Assumes components do not store self references (nor their own entity id).
            // NOTE: Assumes you don't use objects in sets (unless they are immutable)...cause those are evil.

            const replaceStrategy = (opts && opts.replaceStrategy) || FineDiffStrategy;
            replaceStrategy.call(
                undefined,
                this,
                nextHotEntityModule,
                opts && opts.replaceOpts,
            );

            // Copy the new constructor over...
            this.entityConstructor = nextHotEntityModule.entityConstructor;

            // Copy any new entities over...
            for(let entityManager of nextHotEntityModule.entityManagers)
            {
                for(let entity of nextHotEntityModule.entities.get(entityManager).values())
                {
                    nextHotEntityModule.removeEntity(entityManager, entity);
                    this.addEntity(entityManager, entity);
                }
            }
        }

        isEmpty()
        {
            return this.entities.size <= 0;
        }

        get entityManagers()
        {
            return this.entities.keys();
        }
    }

    const HOT_ENTITY_MODULES = new Map();

    function enableForEntity(entityModule, entityManager, entityId)
    {
        if (!HOT_ENTITY_MODULES.has(entityModule.id))
        {
            throw new Error('Module must be accepted first for HER to enable hot entity replacement.');
        }

        let hotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
        hotEntityModule.addEntity(entityManager, entityId);
        return entityId;
    }

    function acceptForModule(entityModule, entityConstructor, worldConstructor = undefined)
    {
        let newHotEntityModule = new HotEntityModule(entityModule, entityConstructor);
        if (HOT_ENTITY_MODULES.has(entityModule.id))
        {
            console.log(`Reloading '${entityModule.id}'...`);
            let oldHotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
            oldHotEntityModule.replaceWith(newHotEntityModule, worldConstructor);
        }
        else
        {
            console.log(`Preparing '${entityModule.id}'...`);
            HOT_ENTITY_MODULES.set(entityModule.id, newHotEntityModule);
        }

        return entityModule;
    }

    function getInstanceForModuleId(entityModuleId)
    {
        return HER_MODULES.get(entityModuleId);
    }

    var HotEntityReplacement = /*#__PURE__*/Object.freeze({
        __proto__: null,
        enableForEntity: enableForEntity,
        acceptForModule: acceptForModule,
        getInstanceForModuleId: getInstanceForModuleId
    });

    exports.Component = ComponentHelper;
    exports.ComponentBase = ComponentBase;
    exports.ComponentFactory = ComponentFactory;
    exports.Entity = EntityHelper;
    exports.EntityBase = EntityBase;
    exports.EntityComponent = EntityComponent$1;
    exports.EntityManager = EntityManager;
    exports.EntityQuery = EntityQuery;
    exports.EntityWrapper = EntityWrapper;
    exports.FineDiffStrategy = FineDiffStrategy;
    exports.HotEntityModule = HotEntityModule;
    exports.HotEntityReplacement = HotEntityReplacement;
    exports.HybridEntity = HybridEntity;
    exports.QueryOperator = QueryOperator;
    exports.TagComponent = TagComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
