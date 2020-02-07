var audioContext = new AudioContext();

function createSound(filepath, loop = false)
{
    const result = {
        _playing: false,
        _data: null,
        _source: null,
        play()
        {
            if (!this._data) return;
            if (this._source) this.destroy();

            let source = audioContext.createBufferSource();
            source.loop = loop;
            source.buffer = this._data;
            source.addEventListener('ended', () => {
                this._playing = false;
            });
            source.connect(audioContext.destination);
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

    fetch(filepath)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(data => result._data = data);

    return result;
}

var Audio = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSound: createSound
});

export { Audio };
