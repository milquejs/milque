import { SceneNode } from './SceneNode.js';

export class SceneGraph
{
    constructor()
    {
        this.nodeMapping = new Map();
        this.root = new SceneNode();
    }

    attachNode(handle)
    {
        let sceneNode = createSceneNode(handle, this.root);
        this.nodeMapping.set(handle, sceneNode);
        return sceneNode;
    }

    updateNode(handle,
        x = handle.x || 0,
        y = handle.y || 0,
        rotation = handle.rotation || 0,
        scaleX = handle.scaleX || 1,
        scaleY = handle.scaleY || 1)
    {
        if (this.nodeMapping.has(handle))
        {
            let node = this.nodeMapping.get(handle);
            node.setLocalTransform(x, y, rotation, scaleX, scaleY);
        }
    }

    compute()
    {
        computeSceneSubGraph(this.root);
    }

    getTransform(handle)
    {
        return this.nodeMapping.get(handle).transform;
    }
}
