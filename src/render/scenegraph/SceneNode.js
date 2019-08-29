import { mat4 } from 'gl-matrix';
import { createTransform, getTransformMatrix } from './Transform.js';

class SceneNode
{
    constructor(transform = createTransform())
    {
        this.transform = transform;
        this.localMatrix = mat4.create();
        this.worldMatrix = mat4.create();
        this.parent = null;
        this.children = [];
    }

    setParent(sceneNode)
    {
        if (this.parent)
        {
            const index = this.parent.children.indexOf(this);
            this.parent.children.splice(index, 1);
        }

        if (sceneNode)
        {
            sceneNode.children.push(this);
        }

        this.parent = parent;
    }

    updateWorldMatrix(parentWorldMatrix)
    {
        // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
        // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
        // recompute the matrix prevents this.
        getTransformMatrix(this.transform, this.localMatrix);

        if (parentWorldMatrix)
        {
            mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
        }
        else
        {
            mat4.copy(this.worldMatrix, this.localMatrix);
        }

        for(const child of this.children)
        {
            child.updateWorldMatrix(this.worldMatrix);
        }
    }
}

export default SceneNode;
