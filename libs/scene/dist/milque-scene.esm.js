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
    constructor(name, newCallback = () => null, deleteCallback = () => { }) {
        this.name = name;
        this.new = newCallback;
        this.delete = deleteCallback;
    }
}

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

class EntityManager {
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
class EntityQuery {
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
class Topic {

    /**
     * @abstract
     * @param {T} [attachment] 
     */
    dispatch(attachment = null) {}

    /**
     * @abstract
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {}

    /**
     * @abstract
     * @param {number} max 
     */
    flush(max = 1000) {}
}

/**
 * @template T
 */
class CommandTopic extends Topic {
    
    constructor() {
        super();

        /**
         * @private
         * @type {Array<T>}
         */
        this.messages = [];
        
        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @override
     * @param {T} message 
     */
    dispatch(message) {
        this.queued.push(message);
    }

    /**
     * @override
     * @param {T} message 
     */
    dispatchImmediately(message) {
        this.messages.push(message);
    }

    /** @override */
    flush(max = 1000) {
        let result = this.queued.splice(0, Math.min(max, this.queued.length));
        this.messages.push(...result);
    }

    /**
     * @param {number} [max]
     * @return {Iterable<T>}
     */
    *poll(max = 1000) {
        let iterations = 0;
        while(iterations < max && this.messages.length > 0) {
            let message = this.messages.shift();
            yield message;
            ++iterations;
        }
    }
}

/**
 * @template T
 * @typedef {(t: T) => void|boolean} EventTopicCallback
 */

/** @template T */
class EventTopic extends Topic {

    constructor() {
        super();

        /**
         * @private
         * @type {Array<EventTopicCallback<T>>}
         */
        this.listeners = [];

        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    on(callback) {
        this.listeners.push(callback);
        return this;
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    off(callback) {
        let i = this.listeners.indexOf(callback);
        if (i >= 0) {
            this.listeners.splice(i, 1);
        }
        return this;
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    once(callback) {
        let wrapper = (attachment) => {
            this.off(wrapper);
            return callback(attachment);
        };
        this.on(wrapper);
        return this;
    }

    /**
     * @override
     * @param {T} [attachment]
     */
    dispatch(attachment = null) {
        this.queued.push(attachment);
    }

    /**
     * @override
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {
        for(let listener of this.listeners) {
            let result = listener(attachment);
            // Consume the event if return true.
            if (result === true) {
                break;
            }
        }
    }

    /** @override */
    flush(max = 1000) {
        let i = 0;
        while(this.queued.length > 0 && i++ < max) {
            let attachment = this.queued.shift();
            this.dispatchImmediately(attachment);
        }
    }

    count() {
        return this.listeners.length;
    }
}

/**
 * @template T
 * @typedef {(t: T) => void|boolean} PriorityTopicCallback<T>
 */

/**
 * @template T
 * @typedef PriorityTopicOptions
 * @property {number} priority
 * @property {PriorityTopicCallback<T>} callback
 */

/**
 * @param {PriorityTopicOptions<?>} a 
 * @param {PriorityTopicOptions<?>} b 
 */
function comparator(a, b) {
    return a.priority - b.priority;
}

/**
 * @template T
 */
class PriorityEventTopic extends Topic {

    constructor() {
        super();

        /**
         * @private
         * @type {Array<PriorityTopicOptions<T>>}
         */
        this.listeners = [];

        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @param {number} priority 
     * @param {PriorityTopicCallback<T>} callback 
     */
    on(priority, callback) {
        this.listeners.push({ priority, callback });
        this.listeners.sort(comparator);
        return this;
    }

    /**
     * @param {PriorityTopicCallback<T>} callback 
     */
    off(callback) {
        for(let i = 0; i < this.listeners.length; ++i) {
            if (this.listeners.at(i).callback === callback) {
                this.listeners.splice(i, 1);
                break;
            }
        }
        return this;
    }

    /**
     * @param {number} priority 
     * @param {PriorityTopicCallback<T>} callback 
     */
    once(priority, callback) {
        let wrapper = (attachment) => {
            this.off(wrapper);
            return callback(attachment);
        };
        return this.on(priority, wrapper);
    }

    count() {
        return this.listeners.length;
    }

    /**
     * @override
     * @param {T} [attachment]
     */
    dispatch(attachment = null) {
        this.queued.push(attachment);
        return this;
    }

    /**
     * @override
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {
        for(let listener of this.listeners) {
            let result = listener.callback(attachment);
            // Consume the event if return true.
            if (result === true) {
                break;
            }
        }
        return this;
    }

    /** @override */
    flush(max = 1000) {
        let i = 0;
        while(this.queued.length > 0 && i++ < max) {
            let attachment = this.queued.shift();
            this.dispatchImmediately(attachment);
        }
        return this;
    }
}

export { Camera, CommandTopic, ComponentClass, EntityManager, EntityQuery, EntityTemplate, EventTopic, FirstPersonCameraController, OrthographicCamera, PerspectiveCamera, PriorityEventTopic, SceneGraph, Topic, lookAt, panTo, screenToWorldRay };
//# sourceMappingURL=milque-scene.esm.js.map
