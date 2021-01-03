'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var glMatrix = require('gl-matrix');

const UP = glMatrix.vec3.fromValues(0, 1, 0);
function panTo(viewMatrix, x, y, z = 0, dt = 1) {
  let position = glMatrix.vec3.create();
  glMatrix.mat4.getTranslation(position, viewMatrix);
  let translation = glMatrix.vec3.fromValues((x - position[0]) * dt, (y - position[1]) * dt, (z - position[2]) * dt);
  glMatrix.mat4.translate(viewMatrix, viewMatrix, translation);
}
function lookAt(viewMatrix, x, y, z = 0, dt = 1) {
  let position = glMatrix.vec3.create();
  let rotation = glMatrix.quat.create();
  glMatrix.mat4.getTranslation(position, viewMatrix);
  glMatrix.mat4.getRotation(rotation, viewMatrix);
  let target = glMatrix.vec3.fromValues(x, y, z);
  glMatrix.mat4.lookAt(viewMatrix, position, target, UP);
  let targetRotation = glMatrix.quat.create();
  glMatrix.mat4.getRotation(viewMatrix, targetRotation);
  glMatrix.quat.slerp(rotation, rotation, targetRotation, dt);
  glMatrix.mat4.fromRotationTranslation(viewMatrix, rotation, position);
}
/**
 * Gets a directional ray in the world space from the given normalized
 * screen coordinates and camera matrices.
 * 
 * NOTE: In addition to some scaling, the y component from a pointer's
 * position usually has to be flipped to match the normalized screen
 * coordinate space, which assumes a range of [-1, 1] for both x and y,
 * where (0, 0) is the CENTER and (-1, -1) is the BOTTOM-LEFT of the
 * screen.
 * 
 * Typical Device Screen Coordinate Space:
 * 
 * (0,0)------------(w,0)
 *    |               |
 *    |   (w/2,h/2)   |
 *    |               |
 * (0,w)------------(w,h)
 * 
 * Normalized Screen Coordinate Space:
 * 
 * (-1,+1)---------(+1,+1)
 *    |               |
 *    |     (0,0)     |
 *    |               |
 * (-1,-1)---------(+1,-1)
 * 
 * @param {Number} normalizedScreenCoordX The X screen coordinate normalized to [-1, 1], where 0 is the left side of the screen.
 * @param {Number} normalizedScreenCoordY The Y screen coordinate normalized to [-1, 1], where 0 is the bottom side of the screen.
 * @param {mat4} projectionMatrix The projection matrix of the world camera.
 * @param {mat4} viewMatrix The view matrix of the world camera.
 * @returns {vec3} The normalized ray direction in the world space.
 */

function screenToWorldRay(normalizedScreenCoordX, normalizedScreenCoordY, projectionMatrix, viewMatrix) {
  // https://antongerdelan.net/opengl/raycasting.html
  // To homogeneous clip coords
  let v = glMatrix.vec4.fromValues(normalizedScreenCoordX, normalizedScreenCoordY, -1, 1); // To camera coords

  let m = glMatrix.mat4.create();
  glMatrix.mat4.invert(m, projectionMatrix);
  glMatrix.vec4.transformMat4(v, v, m);
  v[2] = -1;
  v[3] = 0; // To world coords

  glMatrix.mat4.invert(m, viewMatrix);
  glMatrix.vec4.transformMat4(v, v, m); // Normalized as directional ray

  let result = glMatrix.vec3.fromValues(v[0], v[1], v[2]);
  glMatrix.vec3.normalize(result, result);
  return result;
}

class Camera {
  constructor(canvas, projectionMatrix, viewMatrix) {
    this.canvas = canvas;
    this.projectionMatrix = projectionMatrix;
    this.viewMatrix = viewMatrix;
    this.resize = this.resize.bind(this);
    canvas.addEventListener('resize', this.resize);
    setTimeout(this.resize, 0);
  }

  destroy() {
    this.canvas.removeEventListener('resize', this.resize);
  }
  /** @abstract */


  resize() {}

}

const DEFAULT_FOVY = Math.PI / 3;
class PerspectiveCamera extends Camera {
  constructor(canvas, fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000) {
    super(canvas, glMatrix.mat4.create(), glMatrix.mat4.create());
    this.fieldOfView = fieldOfView;
    this.clippingPlane = {
      near,
      far
    };
  }
  /** @override */


  resize() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const {
      near,
      far
    } = this.clippingPlane;
    glMatrix.mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
  }

}

class OrthographicCamera extends Camera {
  constructor(canvas, left, top, right, bottom, near, far) {
    super(canvas, glMatrix.mat4.create(), glMatrix.mat4.create());
    this.bounds = {
      left,
      top,
      right,
      bottom
    };
    this.clippingPlane = {
      near,
      far
    };
  }
  /** @override */


  resize() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const {
      near,
      far
    } = this.clippingPlane;
    const {
      left,
      top,
      right,
      bottom
    } = this.bounds;
    glMatrix.mat4.ortho(this.projectionMatrix, left * aspectRatio, right * aspectRatio, bottom, top, near, far);
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
  constructor(opts = {
    locky: false
  }) {
    this.locky = opts.locky;
    this.position = glMatrix.vec3.create();
    this.forward = glMatrix.vec3.fromValues(0, 0, -1);
    this.right = glMatrix.vec3.fromValues(1, 0, 0);
    this.up = glMatrix.vec3.fromValues(0, 1, 0);
    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0;
    this.pitch = 0;
    this.yaw = -90;
  }

  look(dx, dy, dt = 1) {
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
      yaw
    } = this; // Calculate forward and right vectors

    let rady = yaw * TO_RAD_FACTOR;
    let radp = pitch * TO_RAD_FACTOR;
    let cosy = Math.cos(rady);
    let cosp = Math.cos(radp);
    let siny = Math.sin(rady);
    let sinp = Math.sin(radp);
    let dx = cosy * cosp;
    let dy = sinp;
    let dz = siny * cosp; // Set forward for move vector

    glMatrix.vec3.normalize(forward, glMatrix.vec3.set(forward, dx, this.locky ? 0 : dy, dz));
    glMatrix.vec3.normalize(right, glMatrix.vec3.cross(right, forward, up));
    let move = glMatrix.vec3.create(); // Move forward

    glMatrix.vec3.scale(move, forward, forwardAmount);
    glMatrix.vec3.add(position, position, move); // Move right

    glMatrix.vec3.scale(move, right, rightAmount);
    glMatrix.vec3.add(position, position, move); // Move up

    glMatrix.vec3.scale(move, up, upAmount);
    glMatrix.vec3.add(position, position, move); // Reset movement

    this.forwardAmount = 0;
    this.rightAmount = 0;
    this.upAmount = 0; // Reset forward for look vector

    if (this.locky) glMatrix.vec3.set(forward, dx, dy, dz);
    let target = glMatrix.vec3.add(move, position, forward);
    glMatrix.mat4.lookAt(viewMatrix, position, target, up);
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
    let grandChildren = info.children.slice(); // Remove the target node from graph

    detach(parentNode, sceneNode, this); // Begin grafting the grandchildren by removing them...

    info.children.length = 0;

    if (replacementNode) {
      // Reattach all grandchildren to new replacement node.
      let replacementInfo = this.nodes[replacementNode];
      let replacementParent = replacementInfo.parent; // Remove replacement node from previous parent

      detach(replacementParent, replacementNode, this); // ...and graft them back.

      replacementInfo.children.push(...grandChildren); // And reattach target parent to new child.

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
    } // ...and repair their parent relations.


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
    const {
      from = undefined,
      childFilter = undefined
    } = opts;
    let fromNodes;
    if (!from) fromNodes = this.roots;else if (!Array.isArray(from)) fromNodes = [from];else fromNodes = from;
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
    children: []
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


function walkImpl(sceneGraph, parentNode, level, nodeCallback, filterCallback = undefined) {
  if (level >= MAX_DEPTH_LEVEL) return;
  let result = nodeCallback(parentNode, sceneGraph);
  if (result === false) return;
  let parentInfo = sceneGraph.nodes[parentNode];
  let nextNodes = filterCallback ? filterCallback(parentInfo.children, parentNode, sceneGraph) : parentInfo.children;

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

exports.Camera = Camera;
exports.FirstPersonCameraController = FirstPersonCameraController;
exports.OrthographicCamera = OrthographicCamera;
exports.PerspectiveCamera = PerspectiveCamera;
exports.SceneGraph = SceneGraph;
exports.lookAt = lookAt;
exports.panTo = panTo;
exports.screenToWorldRay = screenToWorldRay;
