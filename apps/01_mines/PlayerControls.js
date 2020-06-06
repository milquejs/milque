import { InputMapping, InputContext } from './Input.js';

export const MAPPING = InputMapping.create({
    actions: {
        jump: [ 'key:Space' ],
    },
    ranges: {
        moveForward: { 'key:KeyW': 1, 'key:ArrowUp': 1 },
        moveBackward: { 'key:KeyS': 1, 'key:ArrowDown': 1 },
    },
});
export const CONTEXT = new InputContext(MAPPING);

export const MoveForward = CONTEXT.getRange('moveForward');
export const MoveBackward = CONTEXT.getRange('moveBackward');
export const Jump = CONTEXT.getPressed('jump');
export const Inventory = CONTEXT.getReleased('inventory');
export const Running = CONTEXT.getState('running');
