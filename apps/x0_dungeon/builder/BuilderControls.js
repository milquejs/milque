import { InputContext } from './lib.js';

export const BUILDER_MAPPING = {
    buildx: { key: 'mouse:pos.x', scale: 1 },
    buildy: { key: 'mouse:pos.y', scale: 1 },
    build: { key: 'mouse:2', scale: 1 },
    build_dragstart: { key: 'mouse:0', event: 'down' },
    build_dragstop: { key: 'mouse:0', event: 'up' },
    build_prevtile: { key: 'keyboard:KeyA', event: 'down' },
    build_nexttile: { key: 'keyboard:KeyD', event: 'down' },
};

export const BUILDER_INPUT_CONTEXT = new InputContext(BUILDER_MAPPING);
document.body.appendChild(BUILDER_INPUT_CONTEXT);

export const BuildX = BUILDER_INPUT_CONTEXT.getInput('buildx');
export const BuildY = BUILDER_INPUT_CONTEXT.getInput('buildy');
export const BuildAction = BUILDER_INPUT_CONTEXT.getInput('build');
export const BuildDragStart = BUILDER_INPUT_CONTEXT.getInput('build_dragstart');
export const BuildDragStop = BUILDER_INPUT_CONTEXT.getInput('build_dragstop');
export const BuildNextTile = BUILDER_INPUT_CONTEXT.getInput('build_nexttile');
export const BuildPrevTile = BUILDER_INPUT_CONTEXT.getInput('build_prevtile');
