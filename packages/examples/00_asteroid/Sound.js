export const AUDIO_CONTEXT = new AudioContext();
let sounds = [];

export function init()
{
    // Nothing as of yet...
}

export function clear()
{
    sounds.length = 0;
}

export function createSound(filepath, loop = false)
{
    const result = {
        _playing: false,
        _data: null,
        _source: null,
        play()
        {
            if (!this._data) return;
            if (this._source) this.destroy();

            let source = AUDIO_CONTEXT.createBufferSource();
            source.loop = loop;
            source.buffer = this._data;
            source.addEventListener('ended', () => {
                this._playing = false;
            });
            source.connect(AUDIO_CONTEXT.destination);
            source.start(0);

            this._source = source;
            this._playing = true;
        },
        pause()
        {
            this._source.stop();
            this._playing = false;
        },
        destroy()
        {
            if (this._source) this._source.disconnect();
            this._source = null;
        },
        isPaused()
        {
            return !this._playing;
        }
    };

    fetchSoundData(filepath)
        .then(data => result._data = data);

    sounds.push(result);
    return result;
}

export async function fetchSoundData(filepath)
{
    return fetch(filepath)
        .then(response => response.arrayBuffer())
        .then(buffer => AUDIO_CONTEXT.decodeAudioData(buffer));
}
