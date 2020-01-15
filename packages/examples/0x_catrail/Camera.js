/**
 * A camera for a view. This serves as the in-world representation of the
 * view. This is usually manipulated to move the world, zoom in, etc.
 */
export class Camera
{
    update(dt) {}

    /** @abstract */
    getProjectionMatrix() { return [1, 0, 0, 1, 0, 0]; }

    /** @abstract */
    getViewMatrix() { return [1, 0, 0, 1, 0, 0]; }
}
