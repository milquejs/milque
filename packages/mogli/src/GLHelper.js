/**
 * Checks whether the context supports WebGL2 features.
 * 
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
 * @returns {Boolean} True if WebGL2 is supported. Otherwise, false.
 */
export function isWebGL2Supported(gl)
{
    return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
}
