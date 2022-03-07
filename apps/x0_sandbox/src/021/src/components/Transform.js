import { mat4 } from 'gl-matrix';
import { World } from '../World.js';

World.require('sceneGraph');

export const Transform = {
  create(props, entityId) {
    const { parentId = undefined, x = 0, y = 0, z = 0 } = props;
    const { sceneGraph } = World.getWorld();

    sceneGraph.add(entityId, parentId);
    let result = {
      worldTransformation: mat4.create(),
      localTransformation: mat4.create(),
      x,
      y,
      z,
      pitch: 0,
      yaw: 0,
      roll: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    };
    return result;
  },
  destroy(component, entityId) {
    const { sceneGraph } = World.getWorld();
    sceneGraph.remove(entityId);
  },
};
