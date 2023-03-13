import { ButtonBinding, KeyCodes } from '@milque/input';
import { Toaster as T } from '@milque/scene';
import { DisplayProvider, InputProvider } from './main';

export const INPUTS = {
    MoveLeft: new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]),
    MoveRight: new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]),
    MoveUp: new ButtonBinding('move.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]),
    MoveDown: new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]),
};

export const PROVIDERS = [
    GameProvider
];

function GameProvider(m) {
    const { axb } = T.useProvider(m, InputProvider);
    axb.bindBindings(Object.values(INPUTS));
    
    const { canvas } = T.useProvider(m, DisplayProvider);
    const ctx = canvas.getContext('2d');

    return {
        ctx
    };
}

export function init(m) {

}

export function update(m) {
    
}

export function draw(m) {
    const { ctx } = T.useProvider(m, GameProvider);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 10, 10);
}