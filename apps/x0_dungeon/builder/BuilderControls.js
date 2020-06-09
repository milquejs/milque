import { InputContext } from '../Input.js';

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

export const BuildX = BUILDER_INPUT_CONTEXT.getRange('buildx');
export const BuildY = BUILDER_INPUT_CONTEXT.getRange('buildy');
export const BuildAction = BUILDER_INPUT_CONTEXT.getRange('build');
export const BuildDragStart = BUILDER_INPUT_CONTEXT.getAction('build_dragstart');
export const BuildDragStop = BUILDER_INPUT_CONTEXT.getAction('build_dragstop');
export const BuildNextTile = BUILDER_INPUT_CONTEXT.getAction('build_nexttile');
export const BuildPrevTile = BUILDER_INPUT_CONTEXT.getAction('build_prevtile');
