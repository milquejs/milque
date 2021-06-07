import { mat4 } from 'gl-matrix';
import { Camera } from './Camera.js';

export class OrthographicCamera extends Camera
{
    /**
     * @param {number} [left]
     * @param {number} [top] 
     * @param {number} [right] 
     * @param {number} [bottom] 
     * @param {number} [near] 
     * @param {number} [far] 
     */
    constructor(left = undefined, top = undefined, right = undefined, bottom = undefined, near = -1000, far = 1000)
    {
        super(mat4.create(), mat4.create());

        this.orthoBounds = {
            left: typeof left === 'undefined' ? undefined : Number(left),
            top: typeof top === 'undefined' ? undefined : Number(top),
            right: typeof right === 'undefined' ? undefined : Number(right),
            bottom: typeof bottom === 'undefined' ? undefined : Number(bottom),
        };
        this.clippingPlane = {
            near: Number(near),
            far: Number(far),
        };
    }

    /**
     * If both the bounds and viewport dimensions are defined, the orthographic
     * projection will be set the defined bounds adjusted with respect to
     * the aspect ratio. This is usually the desired behavior.
     * 
     * If the bounds are `undefined`, the orthographic projection will
     * be set to the viewport dimensions. This is useful for pixel-perfect
     * projections.
     * 
     * If viewport dimensions are `undefined`, the orthographic projection
     * will only use the defined bounds. This is useful if you are already
     * performing your own calculations for the bounds or desire a static
     * projection.
     * 
     * @override
     * @param {number} [viewportWidth]
     * @param {number} [viewportHeight]
     */
    resize(viewportWidth = undefined, viewportHeight = undefined)
    {
        const { near, far } = this.clippingPlane;
        const { left, top, right, bottom } = this.orthoBounds;

        let projectionMatrix = this.projectionMatrix;
        let hasViewport = typeof viewportWidth !== 'undefined';
        let hasBounds = typeof left !== 'undefined';

        if (hasViewport)
        {
            if (hasBounds)
            {
                // Use the defined bounds with respect to the viewport aspect ratio
                const aspectRatio = viewportWidth / viewportHeight;
                mat4.ortho(projectionMatrix,
                    left * aspectRatio, right * aspectRatio,
                    bottom, top,
                    near, far);
            }
            else
            {
                // Use the viewport dimensions as bounds
                mat4.ortho(projectionMatrix,
                    0, viewportWidth,
                    viewportHeight, 0,
                    near, far);
            }
        }
        else
        {
            if (hasBounds)
            {
                // Use the defined bounds as-is
                mat4.ortho(projectionMatrix,
                    left, right,
                    bottom, top,
                    near, far);
            }
            else
            {
                // Use default bounds (since nothing else exists)
                mat4.ortho(projectionMatrix,
                    -1, 1,
                    1, -1,
                    -1, 1);
            }
        }
        return this;
    }
}
