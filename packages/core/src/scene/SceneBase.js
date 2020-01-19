/**
 * This is not required to create a scene. Any object or class
 * with any of the defined functions can be considered a valid
 * scene. This is for ease of use and readability.
 */
export class SceneBase
{
    /** @abstract */
    async load(world, opts) {}
    /** @abstract */
    async unload(world) {}

    /** @abstract */
    onStart(world) {}
    /** @abstract */
    onStop(world) {}

    /** @abstract */
    onPreUpdate(dt) {}
    /** @abstract */
    onUpdate(dt) {}
    /** @abstract */
    onPostUpdate(dt) {}
}
