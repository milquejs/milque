export class CameraSystem {
  constructor(entityManager, view, cameraSpeed = 1) {
    this.entityManager = entityManager;
    this.view = view;
    this.cameraSpeed = cameraSpeed;
  }

  update(dt) {
    const { entityManager, view } = this;
    let controlledEntity =
      entityManager.getComponentEntityIds('PlayerControlled')[0];
    let controlledTransform = entityManager.get('Transform', controlledEntity);
    view.camera.moveTo(
      controlledTransform.x,
      controlledTransform.y,
      0,
      dt * this.cameraSpeed
    );
  }
}
