import { mat4 } from './lib.js';

import { SceneNode } from './SceneGraph.js';

export class Transform extends SceneNode
{
    constructor(sceneGraph, owner, parent, children)
    {
        super(sceneGraph, owner, parent, children);

        this.worldTransformation = mat4.create();
        this.localTransformation = mat4.create();
    }

    get x() { return this.worldTTransformation[12]; }
    set x(value)
    {
        this.worldTransformation[12] += value;
        this.localTransformation[12] += value;
    }

    get y() { return this.worldTransformation[13]; }
    set y(value)
    {
        this.worldTransformation[13] += value;
        this.localTransformation[13] += value;
    }

    get z() { return this.worldTransformation[14]; }
    set z(value)
    {

        this.worldTransformation[14] += value;
        this.localTransformation[14] += value;
    }
}

export function create(props)
{
    const { scene } = props;
    scene.add()
    return 
}
