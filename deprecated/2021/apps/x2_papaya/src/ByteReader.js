export const BIG_ENDIAN = 0;
export const LITTLE_ENDIAN = 1;

export class ByteReader
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
        this.reader.cancel();
    }

    async prepareChunk()
    {
        if (this.byteIndex < 0 || this.byteIndex > this.byteChunk.length)
        {
            // Load next chunk
            let { value } = await this.reader.read();
            if (value)
            {
                this.byteChunk = value;
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
        let a = await this.readWord();
        let b = await this.readWord();
        if (this.endianMode === BIG_ENDIAN)
        {
            return (a << 16) + b;
        }
        else
        {
            return (b << 16) + a;
        }
    }

    async readSignedWord()
    {
        let word = await this.readWord();
        if (word & 0x8000) word = -(word & 0x7FFF);
        return word;
    }

    async readWord()
    {
        let a = await this.readByte();
        let b = await this.readByte();
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
            let index = 0;
            let chunksToRead = (count - bytesRemainingInChunk) % this.byteChunk.length;
            for(let i = 0; i < bytesRemainingInChunk; ++i)
            {
                result[i] = this.byteChunk[this.byteIndex + i];
            }
            index = bytesRemainingInChunk;
            this.byteIndex = -1;
            for(let i = 0; i < chunksToRead; ++i)
            {
                await this.prepareChunk();
                for(let i = 0; i < this.byteChunk.length; ++i)
                {
                    result[index++] = this.byteChunk[i];
                }
            }
            return result;
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
