export class MotionSystem {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  update(dt) {
    const { entityManager } = this;

    for (let entityId of entityManager.getComponentEntityIds('Motion')) {
      let motion = entityManager.get('Motion', entityId);
      let invFriction = 1 - motion.friction;
      motion.motionX *= invFriction;
      motion.motionY *= invFriction;

      if (entityManager.has('Transform', entityId)) {
        let transform = entityManager.get('Transform', entityId);
        transform.x += motion.motionX;
        transform.y += motion.motionY;
      }
    }
  }
}
