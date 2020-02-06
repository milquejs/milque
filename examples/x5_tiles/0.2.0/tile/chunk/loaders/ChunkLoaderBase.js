export class ChunkLoaderBase
{
    /** @abstract */
    async load(chunkX, chunkY) { return null; }
    /** @abstract */
    async unload(chunkX, chunkY, chunk) {}
}
