import { Transform } from './Transform.js';

/**
 * Creates a camera for a view. This serves as the in-world representation of the
 * view. This is usually manipulated to move the world, zoom in, etc.
 */
export function createCamera(offsetX = 0, offsetY = 0)
{
    return {
        transform: new Transform(),
        projectionMatrix: [1, 0, 0, 1, offsetX, offsetY],
        get viewMatrix() {
            let dst = [ ...this.transform.matrix ];
            dst[4] = -dst[4];
            dst[5] = -dst[5];
            return dst;
        },
        get offsetX() { return this.projectionMatrix[4]; },
        set offsetX(value) { this.projectionMatrix[4] = value; },
        get offsetY() { return this.projectionMatrix[5]; },
        set offsetY(value) { this.projectionMatrix[5] = value; },
    };
}