import SceneNode from './SceneNode.js';

class SceneGraph
{
    constructor()
    {
        this.root = new SceneNode();
    }

    update()
    {
        this.root.updateWorldMatrix();
    }
}

export default SceneGraph;
