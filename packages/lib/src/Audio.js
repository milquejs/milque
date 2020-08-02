const AUDIO_CONTEXT = new AudioContext();

export async function loadAudio(filepath, opts = {})
{
    const audioContext = AUDIO_CONTEXT;

    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    let data = await audioContext.decodeAudioData(buffer);
    return new Sound(audioContext, data, Boolean(opts.loop));
}

export class Sound
{
    constructor(audioContext, audioBuffer, loop = false)
    {
        this.context = audioContext;
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
        if (!this.buffer) return;
        if (this._source) this.destroy();

        let source = AUDIO_CONTEXT.createBufferSource();
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
