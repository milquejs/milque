export const INPUT_MAPPING = {
    cursorX: 'Mouse:PosX',
    cursorY: 'Mouse:PosY',
    place: 'Mouse:Button0',
    rotate: { key: 'Mouse:Button2', event: 'down' },
    up: [
        'Keyboard:KeyW',
        'Keyboard:ArrowUp'
    ],
    left: [
        'Keyboard:KeyA',
        'Keyboard:ArrowLeft'
    ],
    down: [
        'Keyboard:KeyS',
        'Keyboard:ArrowDown'
    ],
    right: [
        'Keyboard:KeyD',
        'Keyboard:ArrowRight'
    ],
    reset: { key: 'Keyboard:KeyR', event: 'down' },
    save: { key: 'Keyboard:KeyS', event: 'down' },
    load: { key: 'Keyboard:KeyL', event: 'down' },
    debug: 'Keyboard:Space'
};
