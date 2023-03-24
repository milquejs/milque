import { DisplayProvider } from '../main';
import { useContext } from '../runner';
import { Tia } from '../Tia';

export const TITLE = 'Hustle!';

export const PROVIDERS = [
    GameProvider,
];

function GameProvider(m) {
    const { display, canvas } = useContext(m, DisplayProvider);
    const ctx = canvas.getContext('2d');
    const tia = new Tia();

    display.width = 400;
    display.height = 300;
    return {
        ctx,
        tia,
    };
}

export function init(m) {
}

export function update(m) {
}

export function draw(m) {
    const { ctx, tia } = useContext(m, GameProvider);

    tia.camera(0, 0);
    tia.cls(ctx);

    drawButton(m, 10, 10, 'Hustle!');
}

function drawButton(m, x, y, title) {
    const { ctx, tia } = useContext(m, GameProvider);
    let x2 = x + 80;
    let y2 = y + 32;
    tia.rect(ctx, x, y, x2, y2, 0xFFFFFF);
    tia.rectFill(ctx, x, y, x2, y2, 0x333333);
    tia.print(ctx, 'Hustle!', x + 8, y + 8, 0xFFFFFF);
}
