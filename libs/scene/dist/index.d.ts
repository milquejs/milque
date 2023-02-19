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
 * @typedef {Number} SceneNode
 *
 * @typedef SceneNodeInfo
 * @property {SceneNode} parent The parent node. If the node does not have a parent,
 * it will be 0.
 * @property {Array<SceneNode>} children The list of child nodes.
 *
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
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
     * @param {Number} count The number of scene nodes to create.
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
     * @param {Object} [opts={}] Any additional options.
     * @param {SceneNode|Array<SceneNode>} [opts.from] The parent node to
     * start walking from, inclusive. By default, it will start from the root
     * nodes.
     * @param {WalkChildrenCallback} [opts.childfilter] The function called before
     * walking through the children. This is usually used to determine the
     * visiting order.
     */
    walk(callback: WalkCallback, opts?: {
        from?: SceneNode | Array<SceneNode>;
        childfilter?: WalkChildrenCallback;
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
type WalkCallback = (sceneNode: SceneNode, sceneGraph: SceneGraph) => WalkBackCallback | boolean;
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
     * @param {() => T} newCallback
     * @param {(component: T) => void} [deleteCallback]
     */
    constructor(name: string, newCallback?: () => T, deleteCallback?: (component: T) => void);
    name: string;
    new: () => T;
    delete: (component: T) => void;
}

declare class EntityManager {
    /**
     * @protected
     * @type {ComponentClassMap}
     */
    protected components: ComponentClassMap;
    /**
     * @protected
     * @type {Array<[string, ...any]>}
     */
    protected queue: Array<[string, ...any]>;
    flush(): void;
    /**
     * @template {ComponentClass<any>[]}T
     * @param {T} componentClasses
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    createAndAttach<T extends ComponentClass<any>[]>(...componentClasses: T): [number, ...ComponentInstancesOf<T>];
    /**
     * @returns {EntityId}
     */
    create(): EntityId;
    /**
     * @param {EntityId} entityId
     */
    destroy(entityId: EntityId): void;
    /**
     * @param {EntityId} entityId
     */
    exists(entityId: EntityId): boolean;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     * @returns {T}
     */
    attach<T_1>(entityId: EntityId, componentClass: ComponentClass<T_1>): T_1;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     * @returns {T}
     */
    attachImmediately<T_2>(entityId: EntityId, componentClass: ComponentClass<T_2>): T_2;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     */
    detach<T_3>(entityId: EntityId, componentClass: ComponentClass<T_3>): void;
    /**
     * @template T
     * @param {EntityId} entityId
     * @param {ComponentClass<T>} componentClass
     */
    detachImmediately<T_4>(entityId: EntityId, componentClass: ComponentClass<T_4>): void;
    /**
     * @template T
     * @param {ComponentClass<T>} componentClass
     */
    clear<T_5>(componentClass: ComponentClass<T_5>): void;
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
    get<T_6>(entityId: EntityId, componentClass: ComponentClass<T_6>): T_6;
    /**
     * @param {ComponentClass<?>} componentClass
     * @returns {number}
     */
    count(componentClass: ComponentClass<unknown>): number;
    reset(): void;
    /** @type {EntityId} */
    [NEXT_AVAILABLE_ENTITY_ID]: EntityId;
}
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
    create(entityManager: EntityManager): [EntityId, ...ComponentInstancesOf<T>];
    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     */
    destroy(entityManager: EntityManager, entityId: EntityId): void;
}
/**
 * @template {ComponentClass<any>[]} T
 */
declare class EntityQuery<T extends ComponentClass<any>[]> {
    /**
     * @param {T} selectors
     */
    constructor(...selectors: T);
    /** @private */
    private selectors;
    /**
     * @param {EntityManager} entityManager
     * @returns {number}
     */
    count(entityManager: EntityManager): number;
    /**
     * @param {EntityManager} entityManager
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    find(entityManager: EntityManager): [EntityId, ...ComponentInstancesOf<T>];
    /**
     * @param {EntityManager} entityManager
     * @returns {Generator<[EntityId, ...ComponentInstancesOf<T>]>}
     */
    findAll(entityManager: EntityManager): Generator<[EntityId, ...ComponentInstancesOf<T>]>;
}
type ComponentInstanceMap = Record<number, object>;
type ComponentClassMap = Record<string, ComponentInstanceMap>;
type EntityId = number;
type ComponentName = string;
/**
 * <T>
 */
type ComponentInstancesOf<T extends ComponentClass<any>[]> = { [K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never; };

declare const NEXT_AVAILABLE_ENTITY_ID: unique symbol;

/**
 * @template T
 */
declare class Topic<T> {
    /**
     * @abstract
     * @param {T} [attachment]
     */
    dispatch(attachment?: T): void;
    /**
     * @abstract
     * @param {T} [attachment]
     */
    dispatchImmediately(attachment?: T): void;
    /**
     * @abstract
     * @param {number} max
     */
    flush(max?: number): void;
}

/**
 * @template T
 */
declare class CommandTopic<T> extends Topic<any> {
    /**
     * @private
     * @type {Array<T>}
     */
    private messages;
    /**
     * @private
     * @type {Array<T>}
     */
    private queued;
    /**
     * @override
     * @param {T} message
     */
    override dispatch(message: T): void;
    /**
     * @override
     * @param {T} message
     */
    override dispatchImmediately(message: T): void;
    /**
     * @param {number} [max]
     * @return {Iterable<T>}
     */
    poll(max?: number): Iterable<T>;
}

/**
 * @template T
 * @typedef {(t: T) => void|boolean} EventTopicCallback
 */
/** @template T */
declare class EventTopic<T> extends Topic<any> {
    /**
     * @private
     * @type {Array<EventTopicCallback<T>>}
     */
    private listeners;
    /**
     * @private
     * @type {Array<T>}
     */
    private queued;
    /**
     * @param {EventTopicCallback<T>} callback
     */
    on(callback: EventTopicCallback<T>): EventTopic<T>;
    /**
     * @param {EventTopicCallback<T>} callback
     */
    off(callback: EventTopicCallback<T>): EventTopic<T>;
    /**
     * @param {EventTopicCallback<T>} callback
     */
    once(callback: EventTopicCallback<T>): EventTopic<T>;
    /**
     * @override
     * @param {T} [attachment]
     */
    override dispatch(attachment?: T): void;
    /**
     * @override
     * @param {T} [attachment]
     */
    override dispatchImmediately(attachment?: T): void;
    count(): number;
}
type EventTopicCallback<T> = (t: T) => void | boolean;

/**
 * @template T
 */
declare class PriorityEventTopic<T> extends Topic<any> {
    /**
     * @private
     * @type {Array<PriorityTopicOptions<T>>}
     */
    private listeners;
    /**
     * @private
     * @type {Array<T>}
     */
    private queued;
    /**
     * @param {number} priority
     * @param {PriorityTopicCallback<T>} callback
     */
    on(priority: number, callback: PriorityTopicCallback<T>): PriorityEventTopic<T>;
    /**
     * @param {PriorityTopicCallback<T>} callback
     */
    off(callback: PriorityTopicCallback<T>): PriorityEventTopic<T>;
    /**
     * @param {number} priority
     * @param {PriorityTopicCallback<T>} callback
     */
    once(priority: number, callback: PriorityTopicCallback<T>): PriorityEventTopic<T>;
    count(): number;
    /**
     * @override
     * @param {T} [attachment]
     */
    override dispatch(attachment?: T): PriorityEventTopic<T>;
    /**
     * @override
     * @param {T} [attachment]
     */
    override dispatchImmediately(attachment?: T): PriorityEventTopic<T>;
    /** @override */
    override flush(max?: number): PriorityEventTopic<T>;
}
/**
 * <T>
 */
type PriorityTopicCallback<T> = (t: T) => void | boolean;
type PriorityTopicOptions<T> = {
    priority: number;
    callback: PriorityTopicCallback<T>;
};

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

export { AnimationFrameLoop, AnimationFrameLoopCallback, Camera, CommandTopic, ComponentClass, ComponentClassMap, ComponentInstanceMap, ComponentInstancesOf, ComponentName, EntityId, EntityManager, EntityQuery, EntityTemplate, EventTopic, EventTopicCallback, FirstPersonCameraController, OrthographicCamera, PerspectiveCamera, PriorityEventTopic, PriorityTopicCallback, PriorityTopicOptions, SceneGraph, SceneNode, SceneNodeInfo, Topic, WalkBackCallback, WalkCallback, WalkChildrenCallback, lookAt, panTo, screenToWorldRay };
