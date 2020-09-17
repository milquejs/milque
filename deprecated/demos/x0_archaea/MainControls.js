import { InputContext } from './lib.js';

export const INPUT_MAPPING = {
    activate: { key: 'mouse:0', event: 'up' },
    mark: { key: 'mouse:2', event: 'up' },
    restart: { key: 'keyboard:KeyR', event: 'up' },
    cursorX: { key: 'mouse:pos.x', scale: 1 },
    cursorY: { key: 'mouse:pos.y', scale: 1 },
};
export const INPUT_CONTEXT = new InputContext(INPUT_MAPPING);

export const CursorX = INPUT_CONTEXT.getInput('cursorX');
export const CursorY = INPUT_CONTEXT.getInput('cursorY');
export const Activate = INPUT_CONTEXT.getInput('activate');
export const Mark = INPUT_CONTEXT.getInput('mark');
export const Restart = INPUT_CONTEXT.getInput('restart');

export function show()
{
    document.body.appendChild(INPUT_CONTEXT);
    return INPUT_CONTEXT;
}

export function poll()
{
    INPUT_CONTEXT.poll();
    return INPUT_CONTEXT;
}
