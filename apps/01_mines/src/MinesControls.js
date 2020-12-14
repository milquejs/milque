import { InputContext, InputSource } from '@milque/input';

export const INPUT_MAPPING = {
    activate: { key: 'Mouse:Button0', event: 'up' },
    mark: { key: 'Mouse:Button2', event: 'up' },
    restart: { key: 'Keyboard:KeyR', event: 'up' },
    cursorX: { key: 'Mouse:PosX', scale: 1 },
    cursorY: { key: 'Mouse:PosY', scale: 1 },
};
export const INPUT_CONTEXT = new InputContext().setInputMap(INPUT_MAPPING);

export const CursorX = INPUT_CONTEXT.getInput('cursorX');
export const CursorY = INPUT_CONTEXT.getInput('cursorY');
export const Activate = INPUT_CONTEXT.getInput('activate');
export const Mark = INPUT_CONTEXT.getInput('mark');
export const Restart = INPUT_CONTEXT.getInput('restart');

export function attach()
{
    const inputSource = InputSource.for(document.querySelector('#main'));
    INPUT_CONTEXT.attach(inputSource);
    return INPUT_CONTEXT;
}

export function poll()
{
    INPUT_CONTEXT.source.poll();
    return INPUT_CONTEXT;
}
