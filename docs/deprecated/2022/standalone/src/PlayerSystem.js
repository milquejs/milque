import { INPUTS } from './Inputs.js';

export function PlayerSystem(dt, camera, controller) {
    updatePlayerInputs(dt, controller);
    controller.apply(camera.viewMatrix);
}

function updatePlayerInputs(dt, controller) {
    let forward = INPUTS.MoveForward.value - INPUTS.MoveBackward.value;
    let right = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    let up = INPUTS.MoveDown.value - INPUTS.MoveUp.value;
    controller.move(forward, right, up, dt);
    let dx = INPUTS.CursorX.delta;
    let dy = -INPUTS.CursorY.delta;
    controller.look(dx, dy, dt);
}
