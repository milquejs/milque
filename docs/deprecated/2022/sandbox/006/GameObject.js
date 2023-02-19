class GameObject {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.sprite = null;
    this.mask = null;

    this.visible = false;
    this.solid = false;
  }
}

class GameObjectBuilder {
  constructor(gameObjectManager) {
    this.manager = gameObjectManager;
    this.values = {};
  }

  withSprite(sprite) {
    this.values.sprite = sprite;
    return this;
  }

  withMask(mask) {
    this.values.mask = mask;
    return this;
  }

  withIsVisibile(visible) {
    this.values.visible = visible;
    return this;
  }

  withIsSolid(solid) {
    this.values.solid = solid;
    return this;
  }

  withPosition(x, y) {
    this.values.x = x;
    this.values.y = y;
    return this;
  }

  build() {
    let result = new GameObject();
    for (let key of Object.keys(this.values)) {
      result[key] = this.values[key];
    }
    this.manager.add(result);
    this.values = {};
    return result;
  }
}

export class GameObjectManager {
  constructor() {
    this.gameObjects = [];
    this.builder = new GameObjectBuilder(this);
  }

  builder() {
    return this.builder;
  }

  add(gameObject) {
    this.gameObjects.push(gameObject);
  }

  remove(gameObject) {
    let i = this.gameObjects.indexOf(gameObject);
    if (i >= 0) {
      this.gameObjects.splice(i, 1);
    }
  }

  /** @override */
  [Symbol.iterator]() {
    return this.gameObjects;
  }
}
