declare function panTo(viewMatrix: any, x: any, y: any, z?: number, dt?: number): void;
declare function lookAt(viewMatrix: any, x: any, y: any, z?: number, dt?: number): void;
/**
 * Gets a directional ray in the world space from the given normalized
 * screen coordinates and camera matrices.
 *
 * NOTE: In addition to some scaling, the y component from a pointer's
 * position usually has to be flipped to match the normalized screen
 * coordinate space, which assumes a range of [-1, 1] for both x and y,
 * where (0, 0) is the center and (-1, -1) is the bottom-left of the
 * screen.
 *
 * ### Typical Device Screen Coordinate Space:
 * ```
 * (0,0)------------(w,0)
 *    |               |
 *    |   (w/2,h/2)   |
 *    |               |
 * (0,w)------------(w,h)
 * ```
 *
 * ### Normalized Screen Coordinate Space:
 * ```
 * (-1,+1)---------(+1,+1)
 *    |               |
 *    |     (0,0)     |
 *    |               |
 * (-1,-1)---------(+1,-1)
 * ```
 *
 * ### Example Conversion from Device to Normalized:
 * ```
 * let normalizedScreenX = (canvasClientX / canvasWidth) * 2 - 1;
 * let normalizedScreenY = 1 - (canvasClientY / canvasHeight) * 2;
 * ```
 *
 * @param {vec3} out The output vector.
 * @param {number} normalizedScreenCoordX The X screen coordinate normalized to [-1, 1], where -1 is the left side of the screen.
 * @param {number} normalizedScreenCoordY The Y screen coordinate normalized to [-1, 1], where -1 is the bottom side of the screen.
 * @param {mat4} projectionMatrix The projection matrix of the world camera.
 * @param {mat4} viewMatrix The view matrix of the world camera.
 * @param {boolean} [normalized=false] Whether to normalize the result. Usually true for non-orthogonal projections.
 * @returns {vec3} The ray direction in the world space. By default, this is not normalized.
 */
declare function screenToWorldRay(out: vec3, normalizedScreenCoordX: number, normalizedScreenCoordY: number, projectionMatrix: mat4, viewMatrix: mat4, normalized?: boolean): vec3;

declare class Camera {
    constructor(projectionMatrix: any, viewMatrix: any);
    projectionMatrix: any;
    viewMatrix: any;
    /**
     * @abstract
     * @param {number} [viewportWidth]
     * @param {number} [viewportHeight]
     * @returns {Camera}
     */
    resize(viewportWidth?: number, viewportHeight?: number): Camera;
}

declare class PerspectiveCamera extends Camera {
    constructor(fieldOfView?: number, near?: number, far?: number);
    fieldOfView: number;
    clippingPlane: {
        near: number;
        far: number;
    };
    /** @override */
    override resize(viewportWidth?: any, viewportHeight?: any): PerspectiveCamera;
}

declare class OrthographicCamera extends Camera {
    /**
     * @param {number} [left]
     * @param {number} [top]
     * @param {number} [right]
     * @param {number} [bottom]
     * @param {number} [near]
     * @param {number} [far]
     */
    constructor(left?: number, top?: number, right?: number, bottom?: number, near?: number, far?: number);
    orthoBounds: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    clippingPlane: {
        near: number;
        far: number;
    };
    /**
     * If both the bounds and viewport dimensions are defined, the orthographic
     * projection will be set the defined bounds adjusted with respect to
     * the aspect ratio. This is usually the desired behavior.
     *
     * If the bounds are `undefined`, the orthographic projection will
     * be set to the viewport dimensions. This is useful for pixel-perfect
     * projections.
     *
     * If viewport dimensions are `undefined`, the orthographic projection
     * will only use the defined bounds. This is useful if you are already
     * performing your own calculations for the bounds or desire a static
     * projection.
     *
     * @override
     * @param {number} [viewportWidth]
     * @param {number} [viewportHeight]
     */
    override resize(viewportWidth?: number, viewportHeight?: number): OrthographicCamera;
}

/**
 * A camera controller that behaves like a traditional first person camera.
 * Pitch is restricted to prevent gimbal lock and roll is ignored.
 *
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */
declare class FirstPersonCameraController {
    constructor(opts?: {
        locky: boolean;
    });
    locky: boolean;
    position: any;
    forward: any;
    right: any;
    up: any;
    forwardAmount: number;
    rightAmount: number;
    upAmount: number;
    pitch: number;
    yaw: number;
    look(dx: any, dy: any, dt?: number): FirstPersonCameraController;
    move(forward: any, right?: number, up?: number, dt?: number): FirstPersonCameraController;
    apply(viewMatrix: any): any;
}

/**
 * @typedef {number} SceneNode
 *
 * @typedef SceneNodeInfo
 * @property {SceneNode} parent The parent node. If the node does not have a parent,
 * it will be 0.
 * @property {Array<SceneNode>} children The list of child nodes.
 *
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {WalkBackCallback|boolean|void} If false, the walk will skip
 * the current node's children and all of its descendents. If a function,
 * it will be called after traversing down all of its children.
 *
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 *
 * @callback WalkChildrenCallback Called for each level of children, before
 * traversing them. This is usually used to determine visit order.
 * @param {Array<SceneNode>} childNodes A list of child nodes to be visited.
 * @param {SceneNode} parentNode The current parent node of these children.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {Array<SceneNode>} The list of children to traverse for this parent.
 */
/**
 * A tree-like graph of nodes with n-children.
 */
declare class SceneGraph {
    nodes: {};
    roots: any[];
    _nextAvailableSceneNodeId: number;
    /**
     * Creates a scene node in the scene graph.
     *
     * @param {SceneNode} [parentNode] The parent node for the created scene
     * node.
     * @returns {SceneNode} The created scene node.
     */
    createSceneNode(parentNode?: SceneNode): SceneNode;
    /**
     * Creates multiple scene nodes in the scene graph.
     *
     * @param {number} count The number of scene nodes to create.
     * @param {SceneNode} [parentNode] The parent node for the created scene
     * nodes.
     * @returns {Array<SceneNode>} A list of created scene nodes.
     */
    createSceneNodes(count: number, parentNode?: SceneNode): Array<SceneNode>;
    /**
     * Deletes a scene node from the scene graph, along with all
     * of its descendents.
     *
     * @param {SceneNode} sceneNode The scene node to remove.
     */
    deleteSceneNode(sceneNode: SceneNode): void;
    /**
     * Deletes all given scene nodes from the scene graph, along with all
     * of their descendents.
     *
     * @param {Array<SceneNode>} sceneNodes A list of scene nodes to remove.
     */
    deleteSceneNodes(sceneNodes: Array<SceneNode>): void;
    /**
     * Get the scene node's info.
     *
     * @param {SceneNode} sceneNode The scene node to get info for.
     * @returns {SceneNodeInfo} The info for the given scene node.
     */
    getSceneNodeInfo(sceneNode: SceneNode): SceneNodeInfo;
    /**
     * Changes the parent of the scene node with the new parent node in
     * the graph.
     *
     * @param {SceneNode} sceneNode The target scene node to change.
     * @param {SceneNode} parentNode The scene node to set as the parent.
     */
    parentSceneNode(sceneNode: SceneNode, parentNode: SceneNode): void;
    /**
     * Replaces the scene node with the new replacement node in the graph,
     * inheriting its parent and children.
     *
     * @param {SceneNode} sceneNode The target scene node to replace.
     * @param {SceneNode} replacementNode The scene node to replace with. If falsey,
     * it will remove the target scene node and the target's parent will adopt
     * its grandchildren. If the target did not have parents, the grandchildren will
     * become root nodes in the graph.
     */
    replaceSceneNode(sceneNode: SceneNode, replacementNode: SceneNode): void;
    /**
     * Walks through every child node in the graph.
     *
     * @param {WalkCallback} callback The function called for each node
     * in the graph, in ordered traversal from parent to child.
     * @param {object} [opts] Any additional options.
     * @param {SceneNode|Array<SceneNode>} [opts.from] The parent node to
     * start walking from, inclusive. By default, it will start from the root
     * nodes.
     * @param {WalkChildrenCallback} [opts.childFilter] The function called before
     * walking through the children. This is usually used to determine the
     * visiting order.
     */
    walk(callback: WalkCallback, opts?: {
        from?: SceneNode | Array<SceneNode>;
        childFilter?: WalkChildrenCallback;
    }): void;
}
type SceneNode = number;
type SceneNodeInfo = {
    /**
     * The parent node. If the node does not have a parent,
     * it will be 0.
     */
    parent: SceneNode;
    /**
     * The list of child nodes.
     */
    children: Array<SceneNode>;
};
/**
 * Called for each node, before traversing its children.
 */
type WalkCallback = (sceneNode: SceneNode, sceneGraph: SceneGraph) => WalkBackCallback | boolean | void;
/**
 * Called if returned by {@link WalkCallback }, after
 * traversing the current node's children.
 */
type WalkBackCallback = (sceneNode: SceneNode, sceneGraph: SceneGraph) => any;
/**
 * Called for each level of children, before
 * traversing them. This is usually used to determine visit order.
 */
type WalkChildrenCallback = (childNodes: Array<SceneNode>, parentNode: SceneNode, sceneGraph: SceneGraph) => Array<SceneNode>;

/**
 * @template T
 */
declare class ComponentClass<T> {
    /**
     * @param {string} name
     * @param {() => T} [newCallback]
     * @param {(component: T) => void} [deleteCallback]
     */
    constructor(name: string, newCallback?: () => T, deleteCallback?: (component: T) => void);
    name: string;
    new: () => T;
    delete: (component: T) => void;
}

/** @typedef {import('./EntityManager').EntityId} EntityId */
/**
 * @template {ComponentClass<any>[]} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ComponentInstancesOf<T>
 */
/**
 * @template {ComponentClass<any>[]} T
 */
declare class EntityTemplate<T extends ComponentClass<any>[]> {
    /**
     * @param {T} componentClasses
     */
    constructor(...componentClasses: T);
    /** @private */
    private componentClasses;
    /**
     * @param {EntityManager} entityManager
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    create(entityManager: EntityManager): [number, ...ComponentInstancesOf$1<T>];
    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     */
    destroy(entityManager: EntityManager, entityId: EntityId$3): void;
}
type EntityId$3 = EntityId;
/**
 * <T>
 */
type ComponentInstancesOf$1<T extends ComponentClass<any>[]> = { [K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never; };

/** @typedef {import('./EntityManager').EntityId} EntityId */
/**
 * @template T
 * @typedef {import('./QueryManager').Selector<T>} Selector<T>
 */
/**
 * @template T
 * @typedef {import('./QueryManager').SelectorNot<T>} SelectorNot<T>
 */
/**
 * @template T
 * @typedef {import('./EntityTemplate').ComponentInstancesOf<T>} ComponentInstancesOf<T>
 */
/**
 * @template {ComponentClass<any>[]} T
 */
declare class Query$1<T extends ComponentClass<any>[]> {
    /**
     * @param {T} selectors
     */
    constructor(...selectors: T);
    selectors: T;
    key: string;
    /**
     * @param {Selector<?>} selector
     */
    hasSelector(selector: Selector$2<unknown>): boolean;
    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     */
    test(entityManager: EntityManager, entityId: EntityId$2): boolean;
    /**
     * @param {EntityManager} entityManager
     * @param {Array<EntityId>} result
     */
    hydrate(entityManager: EntityManager, result: Array<EntityId$2>): number[];
    /**
     * @param {EntityManager} entityManager
     * @returns {number}
     */
    count(entityManager: EntityManager): number;
    /**
     * @param {EntityManager} entityManager
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    findAny(entityManager: EntityManager): [EntityId$2, ...ComponentInstancesOf<T>];
    /**
     * @param {EntityManager} entityManager
     * @returns {Generator<[EntityId, ...ComponentInstancesOf<T>]>}
     */
    findAll(entityManager: EntityManager): Generator<[EntityId$2, ...ComponentInstancesOf<T>]>;
}
type EntityId$2 = EntityId;
/**
 * <T>
 */
type Selector$2<T> = Selector$1<T>;
/**
 * <T>
 */
type ComponentInstancesOf<T> = ComponentInstancesOf$1<T>;

/**
 * @template T
 * @typedef {SelectorNot<T>|ComponentClass<T>} Selector<T>
 */
/**
 * @template T
 * @typedef SelectorNot<T>
 * @property {'not'} type
 * @property {string} name
 * @property {ComponentClass<T>} value
 */
/**
 * @template T
 * @param {ComponentClass<T>} componentClass
 * @returns {ComponentClass<T>}
 */
declare function Not<T>(componentClass: ComponentClass<T>): ComponentClass<T>;
declare function isSelectorNot(selector: any): boolean;
/** @typedef {import('./EntityManager').EntityManager} EntityManager */
/** @typedef {import('./EntityManager').EntityId} EntityId */
/**
 * @template T
 * @typedef {import('./Query').Query<T>} Query<T>
 */
declare class QueryManager {
    /**
     * @protected
     * @type {Record<string, Array<EntityId>>}
     */
    protected cachedResults: Record<string, Array<EntityId$1>>;
    /**
     * @private
     * @type {Record<string, Query<?>>}
     */
    private keyQueryMapping;
    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} added
     * @param {ComponentClass<?>} removed
     * @param {boolean} dead
     */
    onEntityComponentChanged(entityManager: EntityManager$1, entityId: EntityId$1, added: ComponentClass<unknown>, removed: ComponentClass<unknown>, dead: boolean): void;
    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query
     * @returns {EntityId}
     */
    findAny(entityManager: EntityManager$1, query: Query<unknown>): EntityId$1;
    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query
     * @returns {Array<EntityId>}
     */
    findAll(entityManager: EntityManager$1, query: Query<unknown>): Array<EntityId$1>;
    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query
     */
    count(entityManager: EntityManager$1, query: Query<unknown>): number;
    /**
     * @param {Query<?>} query
     */
    clear(query: Query<unknown>): void;
    reset(): void;
}
/**
 * <T>
 */
type Selector$1<T> = SelectorNot$1<T> | ComponentClass<T>;
/**
 * <T>
 */
type SelectorNot$1<T> = {
    type: 'not';
    name: string;
    value: ComponentClass<T>;
};
type EntityManager$1 = EntityManager;
type EntityId$1 = EntityId;
/**
 * <T>
 */
type Query<T> = Query$1<T>;

/**
 * @template T
 * @typedef {Record<number, T>} ComponentInstanceMap<T>
 */
/**
 * @typedef {Record<string, ComponentInstanceMap<?>>} ComponentClassMap
 * @typedef {number} EntityId
 * @typedef {string} ComponentName
 */
/**
 * @callback EntityComponentChangedCallback
 * @param {EntityManager} entityManager
 * @param {EntityId} entityId
 * @param {ComponentClass<?>} attached
 * @param {ComponentClass<?>} detached
 * @param {boolean} dead
 */
declare class EntityManager {
    /**
     * @protected
     * @type {ComponentClassMap}
     */
    protected components: ComponentClassMap;
    /** @private */
    private nameClassMapping;
    /**
     * @private
     * @type {EntityId}
     */
    private nextAvailableEntityId;
    /**
     * @protected
     * @type {Array<[string, ...any]>}
     */
    protected queue: Array<[string, ...any]>;
    /** @private */
    private listeners;
    queries: QueryManager;
    /**
     * @protected
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} attached
     * @param {ComponentClass<?>} detached
     * @param {boolean} dead
     */
    protected entityComponentChangedCallback(entityId: EntityId, attached: ComponentClass<unknown>, detached: ComponentClass<unknown>, dead: boolean): void;
    /**
     * @param {'change'} event
     * @param {EntityComponentChangedCallback} callback
     */
    addEventListener(event: 'change', callback: EntityComponentChangedCallback$1): void;
    /**
     * @param {'change'} event
     * @param {EntityComponentChangedCallback} callback
     */
    removeEventListener(event: 'change', callback: EntityComponentChangedCallback$1): void;
    flush(): void;
    /**
     * @returns {EntityId}
     */
    create(): EntityId;
    /**
     * @param {EntityId} entityId
     */
    destroy(entityId: EntityId): void;
    /**
     * Whether the entity exists with all provided component classes.
     *
     * @param {EntityId} entityId
     * @param {...ComponentClass<?>} componentClasses
     */
    exists(entityId: EntityId, ...componentClasses: ComponentClass<unknown>[]): boolean;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     * @param {T} [instance]
     * @returns {T}
     */
    attach<T>(entityId: EntityId, componentClass: ComponentClass<T>, instance?: T): T;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     * @param {T} [instance]
     * @returns {T}
     */
    attachImmediately<T_1>(entityId: EntityId, componentClass: ComponentClass<T_1>, instance?: T_1): T_1;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     */
    detach<T_2>(entityId: EntityId, componentClass: ComponentClass<T_2>): void;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     */
    detachImmediately<T_3>(entityId: EntityId, componentClass: ComponentClass<T_3>): void;
    /**
     * @param {ComponentClass<?>} componentClass
     */
    clear(componentClass: ComponentClass<unknown>): void;
    /**
     * @param {ComponentClass<any>} componentClass
     */
    clearImmediately(componentClass: ComponentClass<any>): void;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     * @returns {T}
     */
    get<T_4>(entityId: EntityId, componentClass: ComponentClass<T_4>): T_4;
    /**
     * @param {ComponentClass<?>} componentClass
     * @returns {number}
     */
    count(componentClass: ComponentClass<unknown>): number;
    /**
     * @param {ComponentClass<?>} componentClass
     */
    keysOf(componentClass: ComponentClass<unknown>): number[];
    /**
     * @template T
     * @param {ComponentClass<T>} componentClass
     * @returns {Array<T>}
     */
    valuesOf<T_5>(componentClass: ComponentClass<T_5>): T_5[];
    /**
     * @protected
     * @template T
     * @param {ComponentClass<T>} componentClass
     * @returns {ComponentInstanceMap<T>} A map of entity ids to component instance data.
     */
    protected mapOf<T_6>(componentClass: ComponentClass<T_6>): ComponentInstanceMap<T_6>;
    /** @returns {Set<EntityId>} */
    entityIds(): Set<EntityId>;
    /** @returns {Array<ComponentClass<?>>} */
    componentClasses(): Array<ComponentClass<unknown>>;
    reset(): void;
}
/**
 * <T>
 */
type ComponentInstanceMap<T> = Record<number, T>;
type ComponentClassMap = Record<string, ComponentInstanceMap<unknown>>;
type EntityId = number;
type ComponentName = string;
type EntityComponentChangedCallback$1 = (entityManager: EntityManager, entityId: EntityId, attached: ComponentClass<unknown>, detached: ComponentClass<unknown>, dead: boolean) => any;

/**
 * <T>
 */
type Selector<T> = Selector$1<T>;
/**
 * <T>
 */
type SelectorNot<T> = SelectorNot$1<T>;
type EntityComponentChangedCallback = EntityComponentChangedCallback$1;

/** @typedef {import('./TopicManager').TopicManager} TopicManager */
/**
 * @template T
 * @typedef {import('./TopicManager').TopicCallback<T>} TopicCallback<T>
 */
/**
 * @template T
 */
declare class Topic$1<T> {
    /**
     * @param {string} name
     */
    constructor(name: string);
    name: string;
    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatch(topicManager: TopicManager$1, attachment: T): void;
    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatchImmediately(topicManager: TopicManager$1, attachment: T): void;
    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatchImmediatelyAndWait(topicManager: TopicManager$1, attachment: T): Promise<void>;
    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    on(topicManager: TopicManager$1, priority: number, callback: TopicCallback$2<T>): Topic$1<T>;
    /**
     * @param {TopicManager} topicManager
     * @param {TopicCallback<T>} callback
     */
    off(topicManager: TopicManager$1, callback: TopicCallback$2<T>): Topic$1<T>;
    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    once(topicManager: TopicManager$1, priority: number, callback: TopicCallback$2<T>): Topic$1<T>;
    /**
     * @param {TopicManager} topicManager
     * @param {number} amount
     */
    poll(topicManager: TopicManager$1, amount: number): Generator<T, void, unknown>;
    /**
     * @param {TopicManager} topicManager
     * @param {number} amount
     */
    retain(topicManager: TopicManager$1, amount: number): void;
    /**
     * @param {TopicManager} topicManager
     * @param {number} amount
     */
    pollAndRetain(topicManager: TopicManager$1, amount: number): Generator<T, void, unknown>;
}
type TopicManager$1 = TopicManager;
/**
 * <T>
 */
type TopicCallback$2<T> = TopicCallback$1<T>;

/**
 * A manager for topic states. You should call `flush()` regularly to
 * process dispatched events or use `dispatchImmediately()`.
 */
declare class TopicManager {
    /**
     * @protected
     * @type {Record<string, Array<object>>}
     */
    protected cachedIn: Record<string, Array<object>>;
    /**
     * @protected
     * @type {Record<string, Array<object>>}
     */
    protected cachedOut: Record<string, Array<object>>;
    /**
     * @protected
     * @type {Record<string, Array<TopicCallbackEntry<?>>>}
     */
    protected callbacks: Record<string, Array<TopicCallbackEntry<unknown>>>;
    /**
     * @protected
     * @type {Record<string, number>}
     */
    protected maxRetains: Record<string, number>;
    /**
     * @private
     * @type {Record<string, Topic<?>>}
     */
    private nameTopicMapping;
    /**
     * @template T
     * @param {Topic<T>} topic
     * @param {TopicCallback<T>} callback
     * @param {object} [opts]
     * @param {number} [opts.priority]
     */
    addEventListener<T>(topic: Topic$1<T>, callback: TopicCallback$1<T>, opts?: {
        priority?: number;
    }): void;
    /**
     * @template T
     * @param {Topic<T>} topic
     * @param {TopicCallback<T>} callback
     */
    removeEventListener<T_1>(topic: Topic$1<T_1>, callback: TopicCallback$1<T_1>): void;
    /**
     * @param {Topic<?>} topic
     */
    countEventListeners(topic: Topic<unknown>): number;
    /**
     * @template T
     * @param {Topic<T>} topic
     * @param {T} attachment
     */
    dispatch<T_2>(topic: Topic$1<T_2>, attachment: T_2): void;
    /**
     * @template T
     * @param {Topic<T>} topic
     * @param {T} attachment
     */
    dispatchImmediately<T_3>(topic: Topic$1<T_3>, attachment: T_3): void;
    /**
     * @template T
     * @param {Topic<T>} topic
     * @param {T} attachment
     */
    dispatchImmediatelyAndWait<T_4>(topic: Topic$1<T_4>, attachment: T_4): Promise<void>;
    /**
     * @param {Topic<?>} topic
     */
    count(topic: Topic<unknown>): number;
    /**
     * @template T
     * @param {Topic<T>} topic
     */
    poll<T_5>(topic: Topic$1<T_5>): T_5;
    /**
     * @param {Topic<?>} topic
     * @param {number} amount
     */
    retain(topic: Topic<unknown>, amount: number): void;
    /**
     * @param {number} [maxPerTopic]
     */
    flush(maxPerTopic?: number): void;
    /**
     * @param {Topic<?>} topic
     */
    getPendingRetainCount(topic: Topic<unknown>): number;
    /**
     * @param {Topic<?>} topic
     */
    getPendingFlushCount(topic: Topic<unknown>): number;
    reset(): void;
    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic
     * @returns {Array<T>}
     */
    protected incomingOf<T_6>(topic: Topic$1<T_6>): T_6[];
    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic
     * @returns {Array<T>}
     */
    protected outgoingOf<T_7>(topic: Topic$1<T_7>): T_7[];
    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic
     * @returns {Array<TopicCallbackEntry<T>>}
     */
    protected callbacksOf<T_8>(topic: Topic$1<T_8>): TopicCallbackEntry<T_8>[];
}
/**
 * <T>
 */
type Topic<T> = Topic$1<T>;
/**
 * <T>
 */
type TopicCallback$1<T> = (attachment: T) => void | boolean;
type TopicCallbackEntry<T> = {
    callback: TopicCallback$1<T>;
    priority: number;
};

/**
 * <T>
 */
type TopicCallback<T> = TopicCallback$1<T>;

/** @typedef {(frameDetail: AnimationFrameLoop) => void} AnimationFrameLoopCallback */
declare class AnimationFrameLoop {
    /**
     * @param {AnimationFrameLoopCallback} callback
     * @param {object} [opts]
     * @param {Window} [opts.animationFrameHandler]
     */
    constructor(callback: AnimationFrameLoopCallback, opts?: {
        animationFrameHandler?: Window;
    });
    /** @type {ReturnType<requestAnimationFrame>} */
    handle: ReturnType<typeof requestAnimationFrame>;
    detail: {
        prevTime: number;
        currentTime: number;
        deltaTime: number;
    };
    /** @protected */
    protected animationFrameHandler: Window;
    /** @protected */
    protected callback: AnimationFrameLoopCallback;
    next(now?: number): void;
    start(): AnimationFrameLoop;
    cancel(): AnimationFrameLoop;
}
type AnimationFrameLoopCallback = (frameDetail: AnimationFrameLoop) => void;

export { AnimationFrameLoop, AnimationFrameLoopCallback, Camera, ComponentClass, ComponentClassMap, ComponentInstanceMap, ComponentName, EntityComponentChangedCallback, EntityId, EntityManager, EntityTemplate, FirstPersonCameraController, Not, OrthographicCamera, PerspectiveCamera, Query$1 as Query, QueryManager, SceneGraph, SceneNode, SceneNodeInfo, Selector, SelectorNot, Topic$1 as Topic, TopicCallback, TopicManager, WalkBackCallback, WalkCallback, WalkChildrenCallback, isSelectorNot, lookAt, panTo, screenToWorldRay };
