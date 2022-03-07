export class SceneNode {
  constructor(source = null, parent = null) {
    this._source = source;
    this._parent = parent;
    this._children = [];

    this.localTransform = new DOMMatrix([1, 0, 0, 1, 0, 0]);
    this.worldTransform = this.localTransform;
  }

  get transform() {
    return this.worldTransform;
  }

  get parent() {
    return this._parent;
  }
  get children() {
    return this._children;
  }
  get source() {
    return this._source;
  }

  updateWorldTransform() {
    if (!this._parent) this._parent.updateWorldTransform();
    this.updateWorldTransformSelfOnly();
  }

  updateWorldTransformSelfOnly() {
    if (!this._parent) {
      this.worldTransform = this.localTransform.multiply(
        this._parent.worldTransform
      );
    } else {
      this.worldTransform = this.localTransform;
    }
  }

  setLocalTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0) {
    let rsin = Math.sin(rotation);
    this.localTransform.a = scaleX;
    this.localTransform.b = rsin * scaleY;
    this.localTransform.c = -rsin * scaleX;
    this.localTransform.d = scaleY;
    this.localTransform.e = x;
    this.localTransform.f = y;
    return this;
  }

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
  }

  childAt(index) {
    return this._children[index];
  }

  childCount() {
    return this._children.length;
  }
}
