export class Room {
  constructor() {
    this._instances = [];
  }

  createInstance(gameObject) {
    let instance = new gameObject();
    this._instances.push(instance);
    return this;
  }

  getInstances() {
    return this._instances;
  }

  onCreate(world) {}
  onDestroy(world) {}
}
