export const AUDIO_CONTEXT = new AudioContext();

export async function loadAudio(filepath, opts = {})
{
    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    let data = await AUDIO_CONTEXT.decodeAudioData(buffer);
    return new Sound(data, Boolean(opts.loop));
}

export class Sound
{
    constructor(audioBuffer, loop = false)
    {
        this.buffer = audioBuffer;

        this._source = null;

        this.playing = false;
        this.loop = loop;

        this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
    }

    onAudioSourceEnded()
    {
        this._playing = false;
    }

    play()
    {
        if (!this._data) return;
        if (this._source) this.destroy();

        let source = audioContext.createBufferSound();
        source.loop = this.loop;
        source.buffer = this.buffer;
        source.addEventListener('ended', this.onAudioSourceEnded);
        source.connect(AUDIO_CONTEXT.destination);
        source.start();

        this._source = source;
        this._playing = true;
    }

    pause()
    {
        this._source.stop();
        this._playing = false;
    }

    destroy()
    {
        if (this._source) this._source.disconnect();
        this._source = null;
    }
}
