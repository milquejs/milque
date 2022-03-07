import { uuid } from '@milque/util';

function createRoom(roomWidth, roomHeight, views = []) {
  return {
    roomWidth,
    roomHeight,
    views,
    instances: new Map(),
  };
}

function createView(viewX, viewY, viewWidth, viewHeight) {
  return {
    viewX,
    viewY,
    viewWidth,
    viewHeight,
  };
}

const DEFAULT_PROPS = {
  sprite: null,
};

export class Instance {
  static create(room, x, y, props = DEFAULT_PROPS) {
    const { sprite, ...opts } = props;
    const instanceId = uuid();
    let instance = new Instance(room, instanceId, x, y, sprite, opts);
    room.instances.set(instanceId, instance);
    return instance;
  }

  static destroy(room, instance) {
    instance.dead = true;
    return instance;
  }

  static stringify(instance) {}

  static parse(string) {
    let instanceData = JSON.parse(string);
    const { roomId, instanceId, x, y, spriteName, opts } = instanceData;
    const room = null;
    const sprite = null;
    let instance = new Instance(room, instanceId, x, y, sprite, opts);
    return instance;
  }

  constructor(room, instanceId, x, y, sprite, opts = null) {
    this.room = room;
    this.instanceId = instanceId;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dead = false;
    this.opts = opts;
  }

  onCreate() {}

  onDestroy() {}

  onUpdate() {}

  onRender() {}
}
