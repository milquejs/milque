import { Transform2D } from './Transform2D.js';

export function createSceneGraph() {
  return {
    nodeMapping: new Map(),
    root: createSceneNode(),
    attachNode(handle) {
      let sceneNode = createSceneNode(handle, this.root);
      this.nodeMapping.set(handle, sceneNode);
      return sceneNode;
    },
    updateNode(
      handle,
      x = handle.x || 0,
      y = handle.y || 0,
      rotation = handle.rotation || 0,
      scaleX = handle.scaleX || 1,
      scaleY = handle.scaleY || 1
    ) {
      if (this.nodeMapping.has(handle)) {
        let node = this.nodeMapping.get(handle);
        node.setLocalTransform(x, y, rotation, scaleX, scaleY);
      }
    },
    compute() {
      computeSceneSubGraph(this.root);
    },
    getTransform(handle) {
      return this.nodeMapping.get(handle).transform;
    },
  };
}

function computeSceneSubGraph(node) {
  node.updateWorldTransform();
  for (let child of node.children) {
    computeSceneSubGraph(child);
  }
}

function createSceneNode(source = null, parent = null) {
  return {
    _source: source,
    _parent: parent,
    _children: [],
    localTransform: new Transform2D(),
    worldTransform: new Transform2D(),
    get transform() {
      return this._worldTransform;
    },
    get parent() {
      return this._parent;
    },
    get children() {
      return this._children;
    },
    get source() {
      return this._source;
    },
    updateWorldTransform() {
      multiply3x3(
        this.worldTransform,
        this.localTransform,
        this._parent.transform
      );
    },
    setLocalTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0) {
      this.localTransform.x = x;
      this.localTransform.y = y;
      this.localTransform.rotation = rotation;
      this.localTransform.scaleX = scaleX;
      this.localTransform.scaleY = scaleY;
      return this;
    },
    // NOTE: Why not addChild()?
    // https://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html
    setParent(sceneNode) {
      if (this._parent) {
        this._parent._children.splice(this._parent._children.indexOf(this), 1);
        this._parent = null;
      }

      if (sceneNode) {
        this._parent = sceneNode;
        this._parent._children.push(this);
      }

      return this;
    },
    childAt(index) {
      return this._children[index];
    },
    childCount() {
      return this._children.length;
    },
  };
}

// TODO: This is from gl-matrix.
function multiply3x3(out, a, b) {
  let a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  let a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  let a20 = a[6],
    a21 = a[7],
    a22 = a[8];
  let b00 = b[0],
    b01 = b[1],
    b02 = b[2];
  let b10 = b[3],
    b11 = b[4],
    b12 = b[5];
  let b20 = b[6],
    b21 = b[7],
    b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
