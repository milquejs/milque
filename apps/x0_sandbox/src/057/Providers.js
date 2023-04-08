import { FlexCanvas } from '@milque/display';
import { EntityManager } from '@milque/scene';
import { InputContext } from '@milque/input';
import { AssetManager } from '@milque/asset';

import { Tia } from '../tia/Tia';
import { SceneGraph } from '../room2/scenegraph';
import { AnimationFrameTopic, install, using, when } from '../runner2';

export async function AppModule(m) {
    await install(m, CanvasProvider, RenderingProvider, AssetProvider);
    await install(m, InputProvider, EntityProvider, SceneGraphProvider);
}

export function SceneGraphProvider() {
    return SceneGraph.create();
}

export function CanvasProvider() {
    return FlexCanvas.create({ scaling: 'scale', sizing: 'viewport' });
}

export function RenderingProvider(m) {
    const canvas = using(m, CanvasProvider);
    return {
        ctx: /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d')),
        tia: new Tia(),
    };
}

export function AssetProvider() {
    return new AssetManager();
}

export function InputProvider(m) {
    let canvas = using(m, CanvasProvider);
    let axb = new InputContext(canvas);
    when(m, AnimationFrameTopic, 1, ({ currentTime }) => axb.poll(currentTime));
    return axb;
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    when(m, AnimationFrameTopic, -1, () => ents.flush());
    return ents;
}
