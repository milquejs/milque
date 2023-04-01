import { ComponentClass } from '@milque/scene';
import { SceneGraph } from '../room';
import { useContext, useWhenSystemDraw } from '../runner';

const SceneNodeComponent = new ComponentClass('sceneNode', () => ({
    nodeId: 0,
    children: [],
}));

export const SceneGraphProviders = {
    SceneGraphForSceneGraphSystem() {
        return SceneGraph.create();
    },
};

export function attachSceneNode(ents, ) {

}

export function SceneGraphSystem(m) {
    const sceneGraph = useContext(m, SceneGraphProviders.SceneGraphForSceneGraphSystem);

    useWhenSystemDraw(m, 0, () => {

    });
}
