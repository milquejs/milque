import { ComponentClass, Query } from '@milque/scene';
import { RunModule, RunStepTopic, Runner, install, using, when } from '../runner2';
import { AppModule, CanvasProvider, EntityProvider, InputProvider, RenderingProvider, SceneGraphProvider } from './Providers';
import { AxisBinding, ButtonBinding, KeyCodes } from '@milque/input';
import { SceneGraph } from '../room2/scenegraph';

export async function main() {
    const m = {};
    await install(m, RunModule);
    await install(m, AppModule);
    await install(m, MaskSystem);
    await install(m, GameSystem);

    const runner = using(m, Runner);
    await runner.start();
}

function GameSystem(m) {
    const canvas = using(m, CanvasProvider);
    const { ctx, tia } = using(m, RenderingProvider);
    const masks = using(m, MaskSystem);
    const ents = using(m, EntityProvider);
    const axb = using(m, InputProvider);

    PointerX.bindKeys(axb);
    PointerY.bindKeys(axb);
    Execute.bindKeys(axb);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const size = 50;
    const size2 = size / 2;
    const size3 = size + size2 / 2;
    const cxm2 = cx - size2;
    const cym2 = cy - size2;
    const cxM2 = cx + size2;
    const cyM2 = cy + size2;
    const cxm3 = cx - size3;
    const cym3 = cy - size3;
    const cxM3 = cx + size3;
    const cyM3 = cy + size3;

    masks.newMask(cxm3, cym3, cxm2, cym2);
    masks.newMask(cxm2, cym3, cxM2, cym2);
    masks.newMask(cxM2, cym3, cxM3, cym2);
    masks.newMask(cxm3, cym2, cxm2, cyM2);
    masks.newMask(cxm2, cym2, cxM2, cyM2);
    masks.newMask(cxM2, cym2, cxM3, cyM2);
    masks.newMask(cxm3, cyM2, cxm2, cyM3);
    masks.newMask(cxm2, cyM2, cxM2, cyM3);
    masks.newMask(cxM2, cyM2, cxM3, cyM3);

    when(m, RunStepTopic, 0, () => {
        tia.cls(ctx);
        tia.line(ctx, cxm2, cym3, cxm2, cyM3, 0xFFFFFF);
        tia.line(ctx, cxM2, cym3, cxM2, cyM3, 0xFFFFFF);
        tia.line(ctx, cxm3, cym2, cxM3, cym2, 0xFFFFFF);
        tia.line(ctx, cxm3, cyM2, cxM3, cyM2, 0xFFFFFF);

        let x = PointerX.get(axb).value * canvas.width;
        let y = PointerY.get(axb).value * canvas.height;
        let target = masks.testMasks(x, y);
        if (target && Execute.get(axb).released) {
            switch(target.state) {
                case ' ':
                    target.state = 'X';
                    break;
                case 'X':
                    target.state = 'O';
                    break;
                case 'O':
                    target.state = ' ';
                    break;
            }
        }

        for (let mask of MaskQuery.findComponents(ents, MaskComponent)) {
            let left = mask.x;
            let right = mask.x + mask.w;
            let top = mask.y;
            let bottom = mask.y + mask.h;
            let color = (target && target.id === mask.id) ? 0xFF0000 : 0x00FF00;
            let faded = (target && target.id === mask.id) ? 0x330000 : 0x003300;
            tia.rectFill(ctx, left, top, right, bottom, faded);
            tia.rect(ctx, left, top, right, bottom, color);
            let centerX = left + (right - left) / 2;
            let centerY = top + (bottom - top) / 2;
            tia.circFill(ctx, centerX, centerY, 1, color);
            tia.print(ctx, String(mask.id), left + 1, top + 1, 0xFFFFFF);

            if (mask.state) {
                tia.print(ctx, mask.state, centerX - 5, centerY - 5, 0xFFFFFF);
            }
        }

        tia.circ(ctx, x - 2, y - 2, 4, target ? 0xFF0000 : 0xFFFFFF);
        if (target) {
            tia.print(ctx, String(target.id), 0, 0, 0xFFFFFF);
        }
    });
}

const MaskComponent = new ComponentClass('mask', () => ({ id: 0, x: 0, y: 0, w: 0, h: 0, state: ' ' }));
const MaskQuery = new Query(MaskComponent);

const PointerX = new AxisBinding('pointer.x', KeyCodes.MOUSE_POS_X);
const PointerY = new AxisBinding('pointer.y', KeyCodes.MOUSE_POS_Y);
const Execute = new ButtonBinding('pointer.down', [ KeyCodes.MOUSE_BUTTON_0, KeyCodes.MOUSE_BUTTON_2 ]);

function MaskSystem(m) {
    const ents = using(m, EntityProvider);
    return {
        newMask(left, top, right, bottom) {
            let entityId = ents.create();
            let mask = ents.attach(entityId, MaskComponent);
            mask.id = entityId;
            mask.x = left;
            mask.y = top;
            mask.w = right - left;
            mask.h = bottom - top;
            return mask;
        },
        /**
         * @param {number} x 
         * @param {number} y
         */
        testMasks(x, y) {
            for(let mask of MaskQuery.findComponents(ents, MaskComponent)) {
                if (x >= mask.x && x < mask.x + mask.w) {
                    if (y >= mask.y && y < mask.y + mask.h) {
                        return mask;
                    }
                }
            }
            return null;
        }
    };
}

const TransformComponent = new ComponentClass('transform.2d', () => ({ parentId: 0, x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }));

class GameObject {
    constructor() {
    }

    onCreate(m) {}
    onDestroy(m) {}

    onUpdate(m) {}
    onDraw(m) {}
}
