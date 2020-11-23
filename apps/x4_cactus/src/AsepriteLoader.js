// https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md

export function loadAseprite(filepath, opts = {})
{
    const response = await fetch(filepath);
    const r = new ByteReader(response.body).setEndian(LITTLE_ENDIAN);

    const fileSize = r.readDoubleWord();
    const magicNumber = r.readWord();
    if (magicNumber !== 0xA5E0)
    {
        throw new Error('Invalid Aseprite byte format.');
    }
    const frames = r.readWord();
    const width = r.readWord();
    const height = r.readWord();
    const colorDepth = r.readWord();
    const flags = r.readDoubleWord();
    const speed = r.readWord();
    const zero1 = r.readDoubleWord();
    const zero2 = r.readDoubleWord();
    const transparentColor = r.readByte();
    r.seekBytes(3);
    const numColors = r.readWord();
    const pixelWidth = r.readByte();
    const pixelHeight = r.readByte();
    r.seekBytes(92);
    const opacityValid = flags & 1 === 1;

    r.close();
}

function readHeader(reader)
{
    const fileSize = r.readDoubleWord();
    const magicNumber = r.readWord();
    if (magicNumber !== 0xA5E0)
    {
        throw new Error('Invalid Aseprite header byte format.');
    }
    const frames = r.readWord();
    const width = r.readWord();
    const height = r.readWord();
    const colorDepth = r.readWord();
    const flags = r.readDoubleWord();
    const speed = r.readWord();
    const zero1 = r.readDoubleWord();
    const zero2 = r.readDoubleWord();
    const transparentColor = r.readByte();
    r.seekBytes(3);
    const numColors = r.readWord();
    const pixelWidth = r.readByte();
    const pixelHeight = r.readByte();
    r.seekBytes(92);
    const flagHasValidLayerOpacity = flags & 1 === 1;
}

function readFrame(reader)
{
    const frameBytes = r.readDoubleWord();
    const magicNumber = r.readWord();
    if (magicNumber !== 0xF1FA)
    {
        throw new Error('Invalid Aseprite frame header byte format.');
    }
    const frameDuration = r.readWord();
    const byte1 = r.readByte();
    const byte2 = r.readByte();
    const numChunks = r.readDoubleWord();

    let chunks = [];
    for(let i = 0; i < numChunks; ++i)
    {
        const size = r.readDoubleWord();
        const type = r.readWord();
        const data = r.readBytes(size);
        chunks.push({
            size,
            type,
            data,
        });
    }

    return {
        frameBytes,
        frameDuration,
        chunks: []
    }
}

function readFrameHeader()
{

}

export const BIG_ENDIAN = 0;
export const LITTLE_ENDIAN = 1;

class ByteReader
{
    constructor(readableStream)
    {
        this.readable = readableStream;
        this.reader = readableStream.getReader();

        this.byteChunk = null;
        this.byteIndex = -1;

        this.endianMode = BIG_ENDIAN;
    }

    setEndian(mode)
    {
        this.endianMode = mode;
        return this;
    }

    close()
    {
        this.reader.close();
    }

    async prepareChunk()
    {
        if (this.byteIndex < 0 || this.byteIndex > this.byteChunk.length)
        {
            // Load next chunk
            this.byteChunk = await this.reader.read();
            if (this.byteChunk)
            {
                this.byteIndex = 0;
            }
            else
            {
                this.close();
                throw new Error('Cannot read data at end of stream.');
            }
        }
    }

    async readDoubleWord()
    {
        let a = this.readWord();
        let b = this.readWord();
        if (this.endianMode === BIG_ENDIAN)
        {
            return (a << 16) + b;
        }
        else
        {
            return (b << 16) + a;
        }
    }

    async readWord()
    {
        let a = this.readByte();
        let b = this.readByte();
        if (this.endianMode === BIG_ENDIAN)
        {
            return (a << 8) + b;
        }
        else
        {
            return (b << 8) + a;
        }
    }

    async readByte()
    {
        await this.prepareChunk();
        return this.byteChunk[this.byteIndex++];
    }

    async readBytes(count)
    {
        await this.prepareChunk();
        let bytesRemainingInChunk = this.byteChunk.length - this.byteIndex;
        if (bytesRemainingInChunk <= count)
        {
            let result = this.byteChunk.slice(this.byteIndex, this.byteIndex + count);
            this.byteIndex += count;
            return result;
        }
        else
        {
            let result = new Uint8Array(count);
            let chunksToRead = (count - bytesRemainingInChunk) % this.byteChunk.length;
        }
    }

    async seekBytes(byteCount = 1)
    {
        for(let i = 0; i < byteCount; ++i)
        {
            await this.readByte();
        }
    }
}

