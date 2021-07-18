/** @typedef {import('@milque/input').InputContext} InputContext */

export const INPUTS = {};

/**
 * @param {InputContext} inputs 
 */
export function attach(inputs)
{
    inputs.bindAxis('CursorX', 'Mouse', 'PosX');
    inputs.bindAxis('CursorY', 'Mouse', 'PosY');
    inputs.bindButton('Activate', 'Mouse', 'Button0');
    inputs.bindButton('Mark', 'Mouse', 'Button2');
    inputs.bindButton('Restart', 'Keyboard', 'KeyR');

    INPUTS.CursorX = inputs.getInput('CursorX');
    INPUTS.CursorY = inputs.getInput('CursorY');
    INPUTS.Activate = inputs.getInput('Activate');
    INPUTS.Mark = inputs.getInput('Mark');
    INPUTS.Restart = inputs.getInput('Restart');
}
