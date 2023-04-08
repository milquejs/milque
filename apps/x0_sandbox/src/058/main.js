import { ComponentClass, Query } from '@milque/scene';
import { RunModule, RunStepTopic, Runner, install, using, when } from '../runner2';
import { AppModule, AssetProvider, CanvasProvider, EntityProvider, InputProvider, RenderingProvider, SceneGraphProvider } from './Providers';
import { AxisBinding, ButtonBinding, KeyCodes } from '@milque/input';
import { SceneGraph } from '../room2/scenegraph';
import { AssetRef } from '@milque/asset';
import { ImageLoader } from '@milque/asset/src';

export async function main() {
    const m = {};
    await install(m, RunModule);
    await install(m, AppModule);

    const runner = using(m, Runner);
    await runner.start();
}

import { imgBunny } from '../056/def_bunny';

async function GameSystem(m) {
    let assets = using(m, AssetProvider);
    await imgBunny.load(assets);
}

class GameObject {

}
