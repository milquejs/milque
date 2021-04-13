/**
 * @param {string} url The asset path.
 * @param {object} opts Additional options.
 * @param {AudioContext} opts.ctx The audio context.
 * @returns {Promise<AudioBuffer>}
 */
export async function load(url, opts)
{
    const { ctx } = opts;

    if (!ctx)
    {
        throw new Error('Missing audio context for audio loader.');
    }

    let result = await fetch(url);
    let buffer = await result.arrayBuffer();
    let data = await ctx.decodeAudioData(buffer);
    return data;
}
