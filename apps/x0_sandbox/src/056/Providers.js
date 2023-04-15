import { FlexCanvas } from '@milque/display';
import { EntityManager, SceneGraph } from '@milque/scene';
import { InputContext } from '@milque/input';
import { AssetManager } from '@milque/asset';

import { useContext, useWhenSystemUpdate } from '../runner';
import { Tia } from '../tia/Tia';

export const DEPS = [
    CanvasProvider,
    RenderingProvider,
    AssetProvider,
    InputProvider,
    EntityProvider,
    SceneGraphProvider,
];

export function SceneGraphProvider() {
    return SceneGraph.create();
}

export function CanvasProvider() {
    return FlexCanvas.create({ scaling: 'scale', sizing: 'viewport' });
}

export function RenderingProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    let ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    let tia = new Tia();
    return {
        tia, ctx,
    };
}

export function AssetProvider() {
    return new AssetManager();
}

export function InputProvider(m) {
    let canvas = useContext(m, CanvasProvider);
    let axb = new InputContext(canvas);
    useWhenSystemUpdate(m, 1, ({ detail: { currentTime }}) => axb.poll(currentTime));
    return axb;
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, () => ents.flush());
    return ents;
}
