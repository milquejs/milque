import { mat4 } from '../../../../deps.js';
import * as Transform from '../object/Transform.js';

class SceneGraph
{
    constructor()
    {
        this.root = this.createSceneNode(Transform.create(), null);
    }
    
    update()
    {
        this.root.updateWorldMatrix();
    }

    createSceneNode(transform = Transform.create(), parent = this.root)
    {
        const result = {
            sceneGraph: this,
            transform,
            localMatrix: mat4.create(),
            worldMatrix: mat4.create(),
            parent: null,
            children: [],
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
                return this;
            },
            updateWorldMatrix(parentWorldMatrix)
            {
                // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
                // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
                // recompute the matrix prevents this.
                Transform.getTransformationMatrix(this.transform, this.localMatrix);

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
        };

        if (parent)
        {
            result.setParent(parent);
        }
        return result;
    }
}

export default SceneGraph;
