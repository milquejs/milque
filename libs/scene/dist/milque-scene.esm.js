import { vec3, mat4, quat, vec4 } from 'gl-matrix';

const UP = vec3.fromValues(0, 1, 0);

function panTo(viewMatrix, x, y, z = 0, dt = 1) {
  let position = vec3.create();
  mat4.getTranslation(position, viewMatrix);
  let translation = vec3.fromValues(
    (x - position[0]) * dt,
    (y - position[1]) * dt,
    (z - position[2]) * dt
  );
  mat4.translate(viewMatrix, viewMatrix, translation);
}

function lookAt(viewMatrix, x, y, z = 0, dt = 1) {
  let position = vec3.create();
  let rotation = quat.create();
  mat4.getTranslation(position, viewMatrix);
  mat4.getRotation(rotation, viewMatrix);
  let target = vec3.fromValues(x, y, z);

  mat4.lookAt(viewMatrix, position, target, UP);

  let targetRotation = quat.create();
  mat4.getRotation(targetRotation, viewMatrix);
  quat.slerp(rotation, rotation, targetRotation, dt);

  mat4.fromRotationTranslation(viewMatrix, rotation, position);
}

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
function screenToWorldRay(
  out,
  normalizedScreenCoordX,
  normalizedScreenCoordY,
  projectionMatrix,
  viewMatrix,
  normalized = false
) {
  // https://antongerdelan.net/opengl/raycasting.html
  // To homogeneous clip coords
  let v = vec4.fromValues(
    normalizedScreenCoordX,
    normalizedScreenCoordY,
    -1,
    1
  );
  // To camera coords
  let m = mat4.create();
  mat4.invert(m, projectionMatrix);
  vec4.transformMat4(v, v, m);
  v[2] = -1;
  v[3] = 0;
  // To world coords
  mat4.invert(m, viewMatrix);
  vec4.transformMat4(v, v, m);
  out[0] = v[0];
  out[1] = v[1];
  out[2] = v[2];
  // Normalized as directional ray
  if (normalized) {
    vec3.normalize(out, out);
  }
  return out;
}

class Camera {
  constructor(projectionMatrix, viewMatrix) {
    this.projectionMatrix = projectionMatrix;
    this.viewMatrix = viewMatrix;
  }

  /**
   * @abstract
   * @param {number} [viewportWidth]
   * @param {number} [viewportHeight]
   * @returns {Camera}
   */
  // eslint-disable-next-line no-unused-vars
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    return this;
  }
}

const DEFAULT_FOVY = Math.PI / 3;

class PerspectiveCamera extends Camera {
  constructor(fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
    super(mat4.create(), mat4.create());

    this.fieldOfView = Number(fieldOfView);
    this.clippingPlane = {
      near: Number(near),
      far: Number(far),
    };
  }

  /** @override */
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    const aspectRatio =
      typeof viewportWidth === 'undefined' ? 1 : viewportWidth / viewportHeight;
    const { near, far } = this.clippingPlane;
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      aspectRatio,
      near,
      far
    );
    return this;
  }
}

class OrthographicCamera extends Camera {
  /**
   * @param {number} [left]
   * @param {number} [top]
   * @param {number} [right]
   * @param {number} [bottom]
   * @param {number} [near]
   * @param {number} [far]
   */
  constructor(
    left = undefined,
    top = undefined,
    right = undefined,
    bottom = undefined,
    near = -1000,
    far = 1000
  ) {
    super(mat4.create(), mat4.create());

    this.orthoBounds = {
      left: typeof left === 'undefined' ? undefined : Number(left),
      top: typeof top === 'undefined' ? undefined : Number(top),
      right: typeof right === 'undefined' ? undefined : Number(right),
      bottom: typeof bottom === 'undefined' ? undefined : Number(bottom),
    };
    this.clippingPlane = {
      near: Number(near),
      far: Number(far),
    };
  }

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
  resize(viewportWidth = undefined, viewportHeight = undefined) {
    const { near, far } = this.clippingPlane;
    const { left, top, right, bottom } = this.orthoBounds;

    let projectionMatrix = this.projectionMatrix;
    let hasViewport = typeof viewportWidth !== 'undefined';
    let hasBounds = typeof left !== 'undefined';

    if (hasViewport) {
      if (hasBounds) {
        // Use the defined bounds with respect to the viewport aspect ratio
        const aspectRatio = viewportWidth / viewportHeight;
        mat4.ortho(
          projectionMatrix,
          left * aspectRatio,
          right * aspectRatio,
          bottom,
          top,
          near,
          far
        );
      } else {
        // Use the viewport dimensions as bounds
        mat4.ortho(
          projectionMatrix,
          0,
          viewportWidth,
          viewportHeight,
          0,
          near,
          far
        );
      }
    } else {
      if (hasBounds) {
        // Use the defined bounds as-is
        mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
      } else {
        // Use default bounds (since nothing else exists)
        mat4.ortho(projectionMatrix, -1, 1, 1, -1, -1, 1);
      }
    }
    return this;
  }
}

const TO_RAD_FACTOR = Math.PI / 180;

/**
 * A camera controller that behaves like a traditional first person camera.
 * Pitch is restricted to prevent gimbal lock and roll is ignored.
 *
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */
class FirstPersonCameraController {
  constructor(opts = { locky: false }) {
    this.locky = opts.locky;

    this.position = vec3.create();
    this.forward = vec3.fromValues(0, 0, -1);
    this.right = vec3.fromValues(1, 0, 0);
    this.up = vec3.fromValues(0, 1, 0);

    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;

    this.pitch = 0;
    this.yaw = -90;
  }

  look(dx, dy, dt = 1) {
    // NOTE: Increase sensitivity to relatively match movement.
    dt *= 1000;
    this.pitch = Math.min(89.9, Math.max(-89.9, this.pitch + dy * dt));
    this.yaw = (this.yaw + dx * dt) % 360;
    return this;
  }

  move(forward, right = 0, up = 0, dt = 1) {
    this.forwardAmount += forward * dt;
    this.rightAmount += right * dt;
    this.upAmount += up * dt;
    return this;
  }

  apply(viewMatrix) {
    let {
      position,
      forward,
      right,
      up,
      forwardAmount,
      rightAmount,
      upAmount,
      pitch,
      yaw,
    } = this;

    // Calculate forward and right vectors
    let rady = yaw * TO_RAD_FACTOR;
    let radp = pitch * TO_RAD_FACTOR;
    let cosy = Math.cos(rady);
    let cosp = Math.cos(radp);
    let siny = Math.sin(rady);
    let sinp = Math.sin(radp);
    let dx = cosy * cosp;
    let dy = sinp;
    let dz = siny * cosp;

    // Set forward for move vector
    vec3.normalize(forward, vec3.set(forward, dx, this.locky ? 0 : dy, dz));
    vec3.normalize(right, vec3.cross(right, forward, up));

    let move = vec3.create();
    // Move forward
    vec3.scale(move, forward, forwardAmount);
    vec3.add(position, position, move);
    // Move right
    vec3.scale(move, right, rightAmount);
    vec3.add(position, position, move);
    // Move up
    vec3.scale(move, up, upAmount);
    vec3.add(position, position, move);
    // Reset movement
    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;

    // Reset forward for look vector
    if (this.locky) vec3.set(forward, dx, dy, dz);

    let target = vec3.add(move, position, forward);
    mat4.lookAt(viewMatrix, position, target, up);
    return viewMatrix;
  }
}

const MAX_DEPTH_LEVEL = 100;

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
class SceneGraph {
  /**
   * Constructs an empty scene graph.
   */
  constructor() {
    this.nodes = {};
    this.roots = [];

    this._nextAvailableSceneNodeId = 1;
  }

  /**
   * Creates a scene node in the scene graph.
   *
   * @param {SceneNode} [parentNode] The parent node for the created scene
   * node.
   * @returns {SceneNode} The created scene node.
   */
  createSceneNode(parentNode = undefined) {
    let sceneNode = this._nextAvailableSceneNodeId++;
    let info = createSceneNodeInfo();
    this.nodes[sceneNode] = info;
    attach(parentNode, sceneNode, this);
    return sceneNode;
  }

  /**
   * Creates multiple scene nodes in the scene graph.
   *
   * @param {Number} count The number of scene nodes to create.
   * @param {SceneNode} [parentNode] The parent node for the created scene
   * nodes.
   * @returns {Array<SceneNode>} A list of created scene nodes.
   */
  createSceneNodes(count, parentNode = undefined) {
    let result = [];
    for (let i = 0; i < count; ++i) {
      result.push(this.createSceneNode(parentNode));
    }
    return result;
  }

  /**
   * Deletes a scene node from the scene graph, along with all
   * of its descendents.
   *
   * @param {SceneNode} sceneNode The scene node to remove.
   */
  deleteSceneNode(sceneNode) {
    if (sceneNode in this.nodes) {
      let info = this.nodes[sceneNode];
      detach(info.parent, sceneNode, this);
      walkImpl(this, sceneNode, 0, walkDeleteCallback);
    } else {
      throw new Error('Cannot delete non-existant scene node for scene graph.');
    }
  }

  /**
   * Deletes all given scene nodes from the scene graph, along with all
   * of their descendents.
   *
   * @param {Array<SceneNode>} sceneNodes A list of scene nodes to remove.
   */
  deleteSceneNodes(sceneNodes) {
    for (let sceneNode of sceneNodes) {
      this.deleteSceneNode(sceneNode);
    }
  }

  /**
   * Get the scene node's info.
   *
   * @param {SceneNode} sceneNode The scene node to get info for.
   * @returns {SceneNodeInfo} The info for the given scene node.
   */
  getSceneNodeInfo(sceneNode) {
    return this.nodes[sceneNode];
  }

  /**
   * Changes the parent of the scene node with the new parent node in
   * the graph.
   *
   * @param {SceneNode} sceneNode The target scene node to change.
   * @param {SceneNode} parentNode The scene node to set as the parent.
   */
  parentSceneNode(sceneNode, parentNode) {
    let info = this.nodes[sceneNode];
    detach(info.parent, sceneNode, this);
    attach(parentNode, sceneNode, this);
  }

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
  replaceSceneNode(sceneNode, replacementNode) {
    let info = this.nodes[sceneNode];
    let parentNode = info.parent;
    let grandChildren = info.children.slice();

    // Remove the target node from graph
    detach(parentNode, sceneNode, this);

    // Begin grafting the grandchildren by removing them...
    info.children.length = 0;

    if (replacementNode) {
      // Reattach all grandchildren to new replacement node.
      let replacementInfo = this.nodes[replacementNode];
      let replacementParent = replacementInfo.parent;

      // Remove replacement node from previous parent
      detach(replacementParent, replacementNode, this);

      // ...and graft them back.
      replacementInfo.children.push(...grandChildren);

      // And reattach target parent to new child.
      attach(parentNode, replacementNode, this);
    } else {
      // Reattach all grandchildren to target parent...
      if (parentNode) {
        //...as regular children.
        let parentInfo = this.nodes[parentNode];
        parentInfo.children.push(...grandChildren);
      } else {
        //...as root children.
        this.roots.push(...grandChildren);
      }
    }

    // ...and repair their parent relations.
    for (let childNode of grandChildren) {
      this.nodes[childNode].parent = parentNode;
    }
  }

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
  walk(callback, opts = {}) {
    const { from = undefined, childFilter = undefined } = opts;

    let fromNodes;
    if (!from) fromNodes = this.roots;
    else if (!Array.isArray(from)) fromNodes = [from];
    else fromNodes = from;

    if (childFilter) fromNodes = childFilter(fromNodes, 0, this);
    for (let fromNode of fromNodes) {
      walkImpl(this, fromNode, 0, callback, childFilter);
    }
  }
}

/**
 * @param {SceneNode} key The scene node handle.
 * @returns {SceneNodeInfo} The scene node metadata.
 */
function createSceneNodeInfo() {
  return {
    parent: 0,
    children: [],
  };
}

/**
 * Attaches a child node to a parent in the scene graph. If parentNode is
 * null, then it will attach as a root node.
 *
 * @param {SceneNode} parentNode The parent node to attach to. Can be null.
 * @param {SceneNode} childNode The child node to attach from.
 * @param {SceneGraph} sceneGraph The scene graph to attach in.
 */
function attach(parentNode, childNode, sceneGraph) {
  if (parentNode) {
    // Has new parent; attach to parent. It is now in the graph.
    sceneGraph.nodes[parentNode].children.push(childNode);
    sceneGraph.nodes[childNode].parent = parentNode;
  } else {
    // No parent; move to root. It is now in the graph.
    sceneGraph.roots.push(childNode);
    sceneGraph.nodes[childNode].parent = 0;
  }
}

/**
 * Detaches a child node from its parent in the scene graph. If parentNode is
 * null, then it will detach as a root node.
 *
 * @param {SceneNode} parentNode The parent node to attach to. Can be null.
 * @param {SceneNode} childNode The child node to attach from.
 * @param {SceneGraph} sceneGraph The scene graph to attach in.
 */
function detach(parentNode, childNode, sceneGraph) {
  if (parentNode) {
    // Has parent; detach from parent. It is now a free node.
    let children = sceneGraph.nodes[parentNode].children;
    let childIndex = children.indexOf(childNode);
    children.splice(childIndex, 1);
    sceneGraph.nodes[childNode].parentNode = 0;
  } else {
    // No parent; remove from root. It is now a free node.
    let roots = sceneGraph.roots;
    let rootIndex = roots.indexOf(childNode);
    roots.splice(rootIndex, 1);
    sceneGraph.nodes[childNode].parentNode = 0;
  }
}

/**
 * Walk down from the parent and through all its descendents.
 *
 * @param {SceneGraph} sceneGraph The scene graph containing the nodes to be visited.
 * @param {SceneNode} parentNode The parent node to start walking from.
 * @param {Number} level The current call depth level. This is used to limit the call stack.
 * @param {WalkCallback} nodeCallback The function called on each visited node.
 * @param {WalkChildrenCallback} [filterCallback] The function called before
 * walking through the children. This is usually used to determine the visiting order.
 */
function walkImpl(
  sceneGraph,
  parentNode,
  level,
  nodeCallback,
  filterCallback = undefined
) {
  if (level >= MAX_DEPTH_LEVEL) return;

  let result = nodeCallback(parentNode, sceneGraph);
  if (result === false) return;

  let parentInfo = sceneGraph.nodes[parentNode];
  let nextNodes = filterCallback
    ? filterCallback(parentInfo.children, parentNode, sceneGraph)
    : parentInfo.children;

  for (let childNode of nextNodes) {
    walkImpl(sceneGraph, childNode, level + 1, nodeCallback, filterCallback);
  }

  if (typeof result === 'function') {
    result(parentNode, sceneGraph);
  }
}

function walkDeleteCallback(sceneNode, sceneGraph) {
  delete sceneGraph.nodes[sceneNode];
}

/**
 * @template T
 */
class ComponentClass {
    /**
     * @param {string} name 
     * @param {() => T} newCallback
     * @param {(component: T) => void} [deleteCallback] 
     */
    constructor(name, newCallback = () => null, deleteCallback = () => {}) {
        this.name = name;
        this.new = newCallback;
        this.delete = deleteCallback;
    }
}

/** @typedef {import('./EntityManager').EntityManager} EntityManager */
/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template T
 * @typedef {import('./Query').Query<T>} Query<T>
 */

class QueryManager {

    constructor() {
        /**
         * @protected
         * @type {Record<string, Array<EntityId>>}
         */
        this.cachedResults = {};
        /**
         * @private
         * @type {Record<string, Query<?>>}
         */
        this.keyQueryMapping = {};

        this.onEntityComponentChanged = this.onEntityComponentChanged.bind(this);
    }

    /**
     * @param {EntityManager} entityManager
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} added
     * @param {ComponentClass<?>} removed
     * @param {boolean} dead
     */
    onEntityComponentChanged(entityManager, entityId, added, removed, dead) {
        for(let query of Object.values(this.keyQueryMapping)) {
            let entities = this.cachedResults[query.key];
            if (dead) {
                let i = entities.indexOf(entityId);
                if (i >= 0) {
                    entities.splice(i, 1);
                }
            } else if (added) {
                if (query.hasSelector(Not(added))) {
                    let i = entities.indexOf(entityId);
                    if (i >= 0) {
                        entities.splice(i, 1);
                    }
                } else if (query.hasSelector(added) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i < 0) {
                        entities.push(entityId);
                    }
                }
            } else if (removed) {
                if (query.hasSelector(Not(removed)) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i < 0) {
                        entities.push(entityId);
                    }
                } else if (query.hasSelector(removed) && query.test(entityManager, entityId)) {
                    let i = entities.indexOf(entityId);
                    if (i >= 0) {
                        entities.splice(i, 1);
                    }
                }
            }
        }
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query 
     * @returns {EntityId}
     */
    findAny(entityManager, query) {
        let result = this.findAll(entityManager, query);
        if (result.length <= 0) {
            return null;
        } else {
            return result[Math.floor(Math.random() * result.length)];
        }
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query
     * @returns {Array<EntityId>}
     */
    findAll(entityManager, query) {
        const queryKey = query.key;
        let result;
        if (!(queryKey in this.keyQueryMapping)) {
            result = [];
            this.keyQueryMapping[queryKey] = query;
            this.cachedResults[queryKey] = result;
            query.hydrate(entityManager, result);
        } else {
            result = this.cachedResults[queryKey];
        }
        return result;
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Query<?>} query 
     */
    count(entityManager, query) {
        let result = this.findAll(entityManager, query);
        return result.length;
    }

    /**
     * @param {Query<?>} query
     */
    clear(query) {
        const queryKey = query.key;
        if (!(queryKey in this.keyQueryMapping)) {
            return;
        }
        delete this.keyQueryMapping[queryKey];
        delete this.cachedResults[queryKey];
    }
    
    reset() {
        this.keyQueryMapping = {};
        this.cachedResults = {};
    }
}

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
function Not(componentClass) {
    return {
        // @ts-ignore
        type: 'not',
        name: componentClass.name,
        value: componentClass,
    };
}

function isSelectorNot(selector) {
    return 'type' in selector && selector.type === 'not';
}

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

class EntityManager {

    constructor() {
        /**
         * @protected
         * @type {ComponentClassMap}
         */
        this.components = {};
        /** @private */
        this.nameClassMapping = {};
        /**
         * @private
         * @type {EntityId}
         */
        this.nextAvailableEntityId = 1;
        /**
         * @protected
         * @type {Array<[string, ...any]>}
         */
        this.queue = [];
        /** @private */
        this.listeners = [];
        this.queries = new QueryManager();
    }

    /**
     * @protected
     * @param {EntityId} entityId
     * @param {ComponentClass<?>} attached
     * @param {ComponentClass<?>} detached
     * @param {boolean} dead
     */
    entityComponentChangedCallback(entityId, attached, detached, dead) {
        this.queries.onEntityComponentChanged(this, entityId, attached, detached, dead);
        for(let callback of this.listeners) {
            callback(this, entityId, attached, detached, dead);
        }
    }

    /**
     * @param {'change'} event 
     * @param {EntityComponentChangedCallback} callback 
     */
    addEventListener(event, callback) {
        if (event === 'change') {
            this.listeners.push(callback);
        }
    }

    /**
     * @param {'change'} event 
     * @param {EntityComponentChangedCallback} callback 
     */
    removeEventListener(event, callback) {
        if (event === 'change') {
            let i = this.listeners.indexOf(callback);
            if (i >= 0) {
                this.listeners.splice(i, 1);
            }
        }
    }

    flush() {
        while (this.queue.length > 0) {
            let [type, ...args] = this.queue.shift();
            switch (type) {
                case 'attach': {
                    let [entityId, componentClass, instance] = args;
                    this.attachImmediately(entityId, componentClass, instance);
                } break;
                case 'detach': {
                    let [entityId, componentClass] = args;
                    this.detachImmediately(entityId, componentClass);
                } break;
                case 'clear': {
                    let [componentClass] = args;
                    this.clearImmediately(componentClass);
                } break;
            }
        }
    }

    /**
     * @returns {EntityId}
     */
    create() {
        let entityId = this.nextAvailableEntityId++;
        this.entityComponentChangedCallback(entityId, null, null, false);
        return entityId;
    }

    /**
     * @param {EntityId} entityId 
     */
    destroy(entityId) {
        const components = this.components;
        for (const componentName of Object.keys(components)) {
            const instanceMap = components[componentName];
            if (entityId in instanceMap) {
                delete instanceMap[entityId];
                this.entityComponentChangedCallback(entityId, null, this.nameClassMapping[componentName], false);
            }
        }
        this.entityComponentChangedCallback(entityId, null, null, true);
    }

    /**
     * Whether the entity exists with all provided component classes.
     * 
     * @param {EntityId} entityId 
     * @param {...ComponentClass<?>} componentClasses
     */
    exists(entityId, ...componentClasses) {
        if (componentClasses.length > 0) {
            for(const componentClass of componentClasses) {
                let instanceMap = this.mapOf(componentClass);
                if (!(entityId in instanceMap)) {
                    return false;
                }
            }
            return true;
        } else {
            for (let instanceMap of Object.values(this.components)) {
                if (entityId in instanceMap) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass
     * @param {T} [instance]
     * @returns {T}
     */
    attach(entityId, componentClass, instance = undefined) {
        if (typeof instance === 'undefined') {
            instance = componentClass.new();
        }
        this.queue.push(['attach', entityId, componentClass, instance]);
        return instance;
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @param {T} [instance]
     * @returns {T}
     */
    attachImmediately(entityId, componentClass, instance = undefined) {
        if (typeof instance === 'undefined') {
            instance = componentClass.new();
        }
        let instanceMap = this.mapOf(componentClass);
        instanceMap[entityId] = instance;
        this.entityComponentChangedCallback(entityId, componentClass, null, false);
        return instance;
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
        let instanceMap = this.mapOf(componentClass);
        let instance = instanceMap[entityId];
        delete instanceMap[entityId];
        componentClass.delete(instance);
        this.entityComponentChangedCallback(entityId, null, componentClass, false);
    }

    /**
     * @param {ComponentClass<?>} componentClass 
     */
    clear(componentClass) {
        this.queue.push(['clear', componentClass]);
    }

    /**
     * @param {ComponentClass<any>} componentClass 
     */
    clearImmediately(componentClass) {
        const componentName = componentClass.name;
        const components = this.components;
        const instanceMap = components[componentName];
        let entities = Object.keys(instanceMap).map(Number);
        let instances = Object.values(instanceMap);
        components[componentName] = {};
        this.nameClassMapping[componentName] = componentClass;
        for(let instance of instances) {
            componentClass.delete(instance);
        }
        for(let entityId of entities) {
            this.entityComponentChangedCallback(entityId, null, componentClass, false);
        }
    }

    /**
     * @template T
     * @param {EntityId} entityId 
     * @param {ComponentClass<T>} componentClass 
     * @returns {T}
     */
    get(entityId, componentClass) {
        return this.mapOf(componentClass)[entityId] || null;
    }

    /**
     * @param {ComponentClass<?>} componentClass 
     * @returns {number}
     */
    count(componentClass) {
        return Object.keys(this.mapOf(componentClass)).length;
    }

    /**
     * @param {ComponentClass<?>} componentClass
     */
    keysOf(componentClass) {
        return Object.keys(this.mapOf(componentClass)).map(Number);
    }

    /**
     * @template T
     * @param {ComponentClass<T>} componentClass 
     * @returns {Array<T>}
     */
    valuesOf(componentClass) {
        return Object.values(this.mapOf(componentClass));
    }

    /**
     * @protected
     * @template T
     * @param {ComponentClass<T>} componentClass
     * @returns {ComponentInstanceMap<T>} A map of entity ids to component instance data.
     */
    mapOf(componentClass) {
        const componentName = componentClass.name;
        const components = this.components;
        if (!(componentName in components)) {
            /** @type {ComponentInstanceMap<T>} */
            let map = {};
            components[componentName] = map;
            this.nameClassMapping[componentName] = componentClass;
            return map;
        } else {
            return components[componentName];
        }
    }

    /** @returns {Set<EntityId>} */
    entityIds() {
        let result = new Set();
        for (let instanceMap of Object.values(this.components)) {
            for(let entityId of Object.keys(instanceMap)) {
                result.add(entityId);
            }
        }
        return result;
    }

    /** @returns {Array<ComponentClass<?>>} */
    componentClasses() {
        return Object.values(this.nameClassMapping);
    }

    reset() {
        const components = this.components;
        /** @type {Set<EntityId>} */
        let entities = new Set();
        for(const componentName of Object.keys(components)) {
            const componentClass = this.nameClassMapping[componentName];
            const instanceMap = components[componentName];
            for(let entityId of Object.keys(instanceMap)) {
                entities.add(Number(entityId));
            }
            this.clearImmediately(componentClass);
        }
        for(let entityId of entities) {
            this.entityComponentChangedCallback(entityId, null, null, true);
        }
        entities.clear();
        this.queries.reset();
        this.components = {};
        this.nextAvailableEntityId = 1;
        this.queue.length = 0;
        this.listeners.length = 0;
    }
}

/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template {ComponentClass<any>[]} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} ComponentInstancesOf<T>
 */

/**
 * @template {ComponentClass<any>[]} T
 */
class EntityTemplate {
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
        let entityId = entityManager.create();
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
class Query {

    /**
     * @param {T} selectors 
     */
    constructor(...selectors) {
        if (selectors.length <= 0) {
            throw new Error('Must have at least 1 selector for query.');
        }
        this.selectors = selectors;
        this.key = selectors.map(s => isSelectorNot(s) ? `!${s.name}` : s.name).sort().join('&');
    }

    /**
     * @param {Selector<?>} selector
     */
    hasSelector(selector) {
        if (isSelectorNot(selector)) {
            return this.selectors.findIndex(v => isSelectorNot(v) && v.name === selector.name) >= 0;
        } else {
            return this.selectors.findIndex(v => v.name === selector.name) >= 0;
        }
    }

    /**
     * @param {EntityManager} entityManager 
     * @param {EntityId} entityId
     */
    test(entityManager, entityId) {
        for(let selector of this.selectors) {
            if (isSelectorNot(selector)) {
                const componentClass = /** @type {SelectorNot<?>} */ (/** @type {unknown} */ (selector)).value;
                if (entityManager.exists(entityId, componentClass)) {
                    return false;
                }
            } else {
                const componentClass = /** @type {ComponentClass<?>} */ (/** @type {unknown} */ (selector));
                if (!entityManager.exists(entityId, componentClass)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @param {EntityManager} entityManager
     * @param {Array<EntityId>} result 
     */
    hydrate(entityManager, result) {
        if (this.selectors.length <= 0) {
            result.length = 0;
            return result;
        }
        let entities = entityManager.entityIds();
        for(let entityId of entities) {
            if (this.test(entityManager, entityId)) {
                result.push(entityId);
            }
        }
        return result;
    }
    
    /**
     * @param {EntityManager} entityManager 
     * @returns {number}
     */
    count(entityManager) {
        return entityManager.queries.count(entityManager, this);
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {[EntityId, ...ComponentInstancesOf<T>]}
     */
    findAny(entityManager) {
        const queryManager = entityManager.queries;
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (new Array(this.selectors.length + 1));
        let entityId = queryManager.findAny(entityManager, this);
        if (entityId === null) {
            return result.fill(undefined);
        }
        computeResult(result, entityManager, entityId, this.selectors);
        return result;
    }

    /**
     * @param {EntityManager} entityManager 
     * @returns {Generator<[EntityId, ...ComponentInstancesOf<T>]>}
     */
    *findAll(entityManager) {
        const queryManager = entityManager.queries;
        let result = /** @type {[EntityId, ...ComponentInstancesOf<T>]} */ (new Array(this.selectors.length + 1));
        let entities = queryManager.findAll(entityManager, this);
        for(let entityId of entities) {
            computeResult(result, entityManager, entityId, this.selectors);
            yield result;
        }
    }
}

/**
 * @template {ComponentClass<any>[]} T
 * @param {[EntityId, ...ComponentInstancesOf<T>]} out
 * @param {EntityManager} entityManager  
 * @param {EntityId} entityId
 * @param {T} selectors
 * @returns {[EntityId, ...ComponentInstancesOf<T>]}
 */
function computeResult(out, entityManager, entityId, selectors) {
    out[0] = entityId;
    let i = 1;
    for(let selector of selectors) {
        if (isSelectorNot(selector)) {
            out[i] = null;
        } else {
            out[i] = entityManager.get(entityId, selector);
        }
        ++i;
    }
    return out;
}

/** @typedef {import('./TopicManager').TopicManager} TopicManager */

/**
 * @template T
 * @typedef {import('./TopicManager').TopicCallback<T>} TopicCallback<T>
 */

/**
 * @template T
 */
class Topic {

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatch(topicManager, attachment) {
        topicManager.dispatch(this, attachment);
    }

    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatchImmediately(topicManager, attachment) {
        topicManager.dispatchImmediately(this, attachment);
    }

    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    on(topicManager, priority, callback) {
        topicManager.addEventListener(this, callback, { priority });
        return this;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {TopicCallback<T>} callback
     */
    off(topicManager, callback) {
        topicManager.removeEventListener(this, callback);
        return this;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    once(topicManager, priority, callback) {
        let wrapper = (attachment) => {
            this.off(topicManager, wrapper);
            return callback(attachment);
        };
        return this.on(topicManager, priority, wrapper);
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    *poll(topicManager, amount) {
        amount = Math.min(amount, topicManager.count(this));
        for(let i = 0; i < amount; ++i) {
            yield topicManager.poll(this);
        }
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    retain(topicManager, amount) {
        topicManager.retain(this, amount);
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    *pollAndRetain(topicManager, amount) {
        this.retain(topicManager, amount);
        for(let result of this.poll(topicManager, amount)) {
            yield result;
        }
    }
}

/**
 * @template T
 * @typedef {import('./Topic').Topic<T>} Topic<T>
 */

/**
 * @template T
 * @typedef {(attachment: T) => void|boolean} TopicCallback<T>
 */

/**
 * @template T
 * @typedef TopicCallbackEntry
 * @property {TopicCallback<T>} callback
 * @property {number} priority
 */

/**
 * @template T
 * @param {TopicCallbackEntry<T>} a
 * @param {TopicCallbackEntry<T>} b
 */
function comparator(a, b) {
    return a.priority - b.priority;
}

/**
 * A manager for topic states. You should call `flush()` regularly to
 * process dispatched events or use `dispatchImmediately()`.
 */
class TopicManager {

    constructor() {
        /**
         * @protected
         * @type {Record<string, Array<object>>}
         */
        this.cachedIn = {};
        /**
         * @protected
         * @type {Record<string, Array<object>>}
         */
        this.cachedOut = {};
        /**
         * @protected
         * @type {Record<string, Array<TopicCallbackEntry<?>>>}
         */
        this.callbacks = {};
        /**
         * @protected
         * @type {Record<string, number>}
         */
        this.maxRetains = {};
        /**
         * @private
         * @type {Record<string, Topic<?>>}
         */
        this.nameTopicMapping = {};
    }

    /**
     * @template T
     * @param {Topic<T>} topic 
     * @param {TopicCallback<T>} callback 
     * @param {object} [opts]
     * @param {number} [opts.priority]
     */
    addEventListener(topic, callback, opts = undefined) {
        const { priority = 0 } = opts;
        let callbacks = this.callbacksOf(topic);
        callbacks.push({
            callback,
            priority,
        });
        callbacks.sort(comparator);
    }

    /**
     * @template T
     * @param {Topic<T>} topic 
     * @param {TopicCallback<T>} callback 
     */
    removeEventListener(topic, callback) {
        let callbacks = this.callbacksOf(topic);
        let i = callbacks.findIndex(v => v.callback === callback);
        if (i >= 0) {
            callbacks.splice(i, 1);
        }
    }

    /**
     * @param {Topic<?>} topic
     */
    countEventListeners(topic) {
        return this.callbacksOf(topic).length;
    }

    /**
     * @template T
     * @param {Topic<T>} topic 
     * @param {T} attachment 
     */
    dispatch(topic, attachment) {
        let incoming = this.incomingOf(topic);
        incoming.push(attachment);
    }

    /**
     * @template T
     * @param {Topic<T>} topic 
     * @param {T} attachment 
     */
    dispatchImmediately(topic, attachment) {
        let callbacks = this.callbacksOf(topic);
        for(let { callback } of callbacks) {
            let result = callback(attachment);
            if (result === true) {
                return;
            }
        }
        let outgoing = this.outgoingOf(topic);
        outgoing.push(attachment);
    }

    /**
     * @param {Topic<?>} topic
     */
    count(topic) {
        let outgoing = this.outgoingOf(topic);
        return outgoing.length;
    }

    /**
     * @template T
     * @param {Topic<T>} topic 
     */
    poll(topic) {
        let outgoing = this.outgoingOf(topic);
        if (outgoing.length <= 0) {
            return null;
        }
        let result = outgoing.shift();
        return result;
    }

    /**
     * @param {Topic<?>} topic
     * @param {number} amount
     */
    retain(topic, amount) {
        const topicName = topic.name;
        let max = Math.max(amount, this.maxRetains[topicName] || 0);
        this.maxRetains[topicName] = max;
    }

    /**
     * @param {number} [maxPerTopic]
     */
    flush(maxPerTopic = 100) {
        for(const topicName of Object.keys(this.cachedIn)) {
            const topic = this.nameTopicMapping[topicName];
            const incoming = this.cachedIn[topicName];
            const outgoing = this.cachedOut[topicName];
            const retain = this.maxRetains[topicName] || 0;
            if (retain < outgoing.length) {
                outgoing.splice(0, outgoing.length - retain);
            }
            let max = Math.min(maxPerTopic, incoming.length);
            for(let i = 0; i < max; ++i) {
                let attachment = incoming.shift();
                this.dispatchImmediately(topic, attachment);
            }
        }
    }

    /**
     * @param {Topic<?>} topic 
     */
    getPendingRetainCount(topic) {
        return this.maxRetains[topic.name] || 0;
    }

    /**
     * @param {Topic<?>} topic
     */
    getPendingFlushCount(topic) {
        let incoming = this.incomingOf(topic);
        return incoming.length;
    }

    reset() {
        this.cachedIn = {};
        this.cachedOut = {};
        this.callbacks = {};
        this.maxRetains = {};
        this.nameTopicMapping = {};
    }

    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic 
     * @returns {Array<T>}
     */
    incomingOf(topic) {
        const topicName = topic.name;
        if (topicName in this.cachedIn) {
            return this.cachedIn[topicName];
        } else {
            let result = [];
            this.cachedIn[topicName] = result;
            this.cachedOut[topicName] = [];
            this.nameTopicMapping[topicName] = topic;
            return result;
        }
    }

    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic 
     * @returns {Array<T>}
     */
    outgoingOf(topic) {
        const topicName = topic.name;
        if (topicName in this.cachedOut) {
            return this.cachedOut[topicName];
        } else {
            let result = [];
            this.cachedIn[topicName] = [];
            this.cachedOut[topicName] = result;
            this.nameTopicMapping[topicName] = topic;
            return result;
        }
    }

    /**
     * @protected
     * @template T
     * @param {Topic<T>} topic 
     * @returns {Array<TopicCallbackEntry<T>>}
     */
    callbacksOf(topic) {
        const topicName = topic.name;
        if (topicName in this.callbacks) {
            return this.callbacks[topicName];
        } else {
            let result = [];
            this.callbacks[topicName] = result;
            return result;
        }
    }
}

/** @typedef {(frameDetail: AnimationFrameLoop) => void} AnimationFrameLoopCallback */

class AnimationFrameLoop {
    
    /**
     * @param {AnimationFrameLoopCallback} callback 
     * @param {object} [opts]
     * @param {Window} [opts.animationFrameHandler]
     */
    constructor(callback, opts = undefined) {
        const { animationFrameHandler = window } = opts || {};

        /** @type {ReturnType<requestAnimationFrame>} */
        this.handle = 0;
        this.detail = {
            prevTime: -1,
            currentTime: -1,
            deltaTime: 0,
        };

        /** @protected */
        this.animationFrameHandler = animationFrameHandler;

        /** @protected */
        this.callback = callback;

        this.next = this.next.bind(this);
        this.start = this.start.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    
    next(now = performance.now()) {
        this.handle = this.animationFrameHandler.requestAnimationFrame(this.next);
        let d = this.detail;
        d.prevTime = d.currentTime;
        d.currentTime = now;
        d.deltaTime = d.currentTime - d.prevTime;
        this.callback(this);
    }

    start() {
        this.handle = this.animationFrameHandler.requestAnimationFrame(this.next);
        return this;
    }

    cancel() {
        this.animationFrameHandler.cancelAnimationFrame(this.handle);
        return this;
    }
}

/**
 * @template M, T
 * @typedef {(m: M, [opts]: object) => T} Provider
 */

/**
 * @template M, T
 * @typedef ProviderContext
 * @property {Provider<M, T>} handle
 * @property {T} value
 */

/**
 * @template M, T
 * @param {M} m 
 * @param {Provider<M, T>} provider 
 * @returns {T}
 */
function useProvider(m, provider) {
    let state = resolveState$1(m);
    let handle = provider.name;
    if (handle in state.contexts) {
        /** @type {ProviderContext<M, T>} */
        let { value } = state.contexts[handle];
        if (value) {
            return value;
        } else {
            let current = getCurrentProvider(m);
            if (current.name === provider.name) {
                throw new Error(`Cannot useProvider() on self during initialization!`);
            } else {
                throw new Error('This is not a provider.');
            }
        }
    }
    throw new Error(`Missing assigned dependent provider '${handle}' in context.`);
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<Provider<?, ?>>} providers
 * @returns {M}
 */
function injectProviders(m, providers) {
    let state = resolveState$1(m);
    for(let provider of providers) {
        /** @type {ProviderContext<?, ?>} */
        let context = {
            handle: provider,
            value: null,
        };
        state.contexts[provider.name] = context;
        state.current = provider;
        context.value = provider(m);
    }
    return m;
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<Provider<?, ?>>} providers
 * @returns {M}
 */
function ejectProviders(m, providers) {
    let state = getStateIfExists$1(m);
    if (!state) {
        return m;
    }
    for(let provider of providers.slice().reverse()) {
        let context = state.contexts[provider.name];
        context.value = null;
        delete state.contexts[provider.name];
    }
    return m;
}

/**
 * @template M
 * @param {M} m
 */
function getCurrentProvider(m) {
    let state = getStateIfExists$1(m);
    if (!state) {
        throw new Error('This is not a provider.');
    }
    return state.current;
}

const KEY$1 = Symbol('providers');

function createState$1() {
    return {
        /** @type {Record<string, ProviderContext<?, ?>>} */
        contexts: {},
        /** @type {Provider<?, ?>} */
        current: null,
    };
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>}
 */
function resolveState$1(target) {
    if (KEY$1 in target) {
        return target[KEY$1];
    }
    return target[KEY$1] = createState$1();
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>|null}
 */
function getStateIfExists$1(target) {
    if (KEY$1 in target) {
        return target[KEY$1];
    }
    return null;
}

/**
 * @callback EffectHandler
 * @returns {AfterEffectHandler|Promise<AfterEffectHandler>|Promise<void>|void}
 */

/**
 * @callback AfterEffectHandler
 * @returns {Promise<void>|void}
 */

/**
 * @typedef EffectorContext
 * @property {Array<EffectHandler>} befores
 * @property {Array<AfterEffectHandler|void>} afters
 */

/**
 * @template M
 * @param {M} m 
 * @param {EffectHandler} handler
 */
function useEffect(m, handler) {
    const provider = getCurrentProvider(m);
    if (!provider) {
        throw new Error('Not a provider.');
    }
    let state = resolveState(m);
    let context = resolveContext(provider, state.contexts);
    context.befores.push(handler);
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<import('./ProviderHook').Provider<M, ?>>} providers 
 */
async function applyEffects(m, providers) {
    let state = resolveState(m);
    for(let provider of providers) {
        let context = resolveContext(provider, state.contexts);
        let befores = context.befores.slice();
        context.befores.length = 0;
        let result = await Promise.all(befores.map(handler => handler && handler()));
        context.afters.push(...result);
    }
    return m;
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<import('./ProviderHook').Provider<M, ?>>} providers 
 */
async function revertEffects(m, providers) {
    let state = getStateIfExists(m);
    if (!state) {
        return m;
    }
    for(let provider of providers.slice().reverse()) {
        let context = getContextIfExists(provider, state.contexts);
        if (!context) {
            throw new Error('Cannot revert context for non-existent provider.');
        }
        let afters = context.afters.slice();
        context.afters.length = 0;
        await Promise.all(afters.map(handler => handler && handler()));
    }
    return m;
}

const KEY = Symbol('effectors');

function createState() {
    return {
        /** @type {Record<string, EffectorContext>} */
        contexts: {},
    };
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>}
 */
function resolveState(target) {
    if (KEY in target) {
        return target[KEY];
    }
    return target[KEY] = createState();
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>|null}
 */
function getStateIfExists(target) {
    if (KEY in target) {
        return target[KEY];
    }
    return null;
}

/**
 * @returns {EffectorContext}
 */
function createContext() {
    return {
        befores: [],
        afters: [],
    };
}

/**
 * @param {import('./ProviderHook').Provider<?, ?>} provider
 * @param {ReturnType<createState>['contexts']} target
 * @returns {ReturnType<createContext>}
 */
function resolveContext(provider, target) {
    const key = provider.name;
    if (key in target) {
        return target[key];
    }
    return target[key] = createContext();
}

/**
 * @param {import('./ProviderHook').Provider<?, ?>} provider
 * @param {ReturnType<createState>['contexts']} target
 * @returns {ReturnType<createContext>|null}
 */
function getContextIfExists(provider, target) {
    const key = provider.name;
    if (key in target) {
        return target[key];
    }
    return null;
}

/**
 * @type {Topic<import('../loop/AnimationFrameLoop').AnimationFrameLoop>}
 */
const SystemUpdateTopic = new Topic('main.update');

/**
 * @template M
 * @param {M} m 
 * @param {import('../topic/TopicManager').TopicManager} topics 
 * @param {import('../topic/TopicManager').TopicCallback<import('../loop/AnimationFrameLoop').AnimationFrameLoop>} callback 
 */
function useSystemUpdate(m, topics, callback) {
    useEffect(m, () => {
        SystemUpdateTopic.on(topics, 0, callback);
        return () => {
            SystemUpdateTopic.off(topics, callback);
        };
    });
}

/**
 * @template M, T
 * @param {M} m 
 * @param {import('../topic/Topic').Topic<T>} topic 
 * @param {number} priority 
 * @param {import('../topic/Topic').TopicCallback<T>} callback 
 */
function useTopic(m, topic, priority, callback) {
    const topics = useProvider(m, TopicsProvider);
    useEffect(m, () => {
        topic.on(topics, priority, callback);
        return () => {
            topic.off(topics, callback);
        };
    });
}

/**
 * @template M
 * @param {M} m
 */
function TopicsProvider(m) {
    const topics = new TopicManager();
    useSystemUpdate(m, topics, () => {
        topics.flush();
    });
    return topics;
}

/**
 * @template M
 * @typedef ToastHandler
 * @property {(m: M) => Promise<void>} [load]
 * @property {(m: M) => Promise<void>} [unload]
 * @property {(m: M) => void} init
 * @property {(m: M) => void} [dead]
 * @property {(m: M) => void} update
 * @property {(m: M) => void} [draw]
 */

/**
 * @template M
 * @param {M} m
 * @param {ToastHandler<M>} handler
 */
function toast(m, handler, providers = []) {
    function GameSystem(m) {
        const topics = useProvider(m, TopicsProvider);
        useEffect(m, async () => {
            if (handler.load) await handler.load(m);
            if (handler.init) handler.init(m);
            return async () => {
                if (handler.dead) handler.dead(m);
                if (handler.unload) await handler.unload(m);
            };
        });
        useSystemUpdate(m, topics, () => {
            if (handler.update) handler.update(m);
            if (handler.draw) handler.draw(m);
        });
    }
    const result = [
        TopicsProvider,
        AnimationFrameLoopProvider,
        ...providers,
        GameSystem,
    ];
    return {
        async start() {
            injectProviders(m, result);
            await applyEffects(m, result);
            return this;
        },
        async stop() {
            await revertEffects(m, result);
            ejectProviders(m, result);
            return this;
        },
    }
}

/**
 * @template M
 * @param {M} m
 */
function AnimationFrameLoopProvider(m) {
    const topics = useProvider(m, TopicsProvider);
    const loop = new AnimationFrameLoop((e) => {
        SystemUpdateTopic.dispatchImmediately(topics, e);
    });
    useEffect(m, () => {
        loop.start();
    });
    return loop;
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AnimationFrameLoopProvider: AnimationFrameLoopProvider,
  TopicsProvider: TopicsProvider,
  toast: toast,
  useEffect: useEffect,
  useProvider: useProvider,
  useSystemUpdate: useSystemUpdate,
  useTopic: useTopic
});

export { AnimationFrameLoop, Camera, ComponentClass, EntityManager, EntityTemplate, FirstPersonCameraController, Not, OrthographicCamera, PerspectiveCamera, Query, QueryManager, SceneGraph, index as Toaster, Topic, TopicManager, isSelectorNot, lookAt, panTo, screenToWorldRay };
//# sourceMappingURL=milque-scene.esm.js.map
