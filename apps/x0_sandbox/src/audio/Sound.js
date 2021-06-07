const AUDIO_CONTEXT_SYMBOL = Symbol('audioContext');

export class Sound
{
    /** @returns {AudioContext} */
    static getAudioContext()
    {
        if (AUDIO_CONTEXT_SYMBOL in this)
        {
            return this[AUDIO_CONTEXT_SYMBOL];
        }
        else
        {
            let result = new AudioContext();
            autoUnlock(result);
            this[AUDIO_CONTEXT_SYMBOL] = result;
            return result;
        }
    }

    /**
     * @param {AudioContext} audioContext 
     * @param {AudioBuffer} audioBuffer
     */
    constructor(audioContext, audioBuffer)
    {
        this.audioContext = audioContext;
        this.audioBuffer = audioBuffer;

        /** @private */
        this._playing = false;
        /** @private */
        this._started = false;
        /**
         * @private
         * @type {AudioBufferSourceNode}
         */
        this._source = null;

        /** @private */
        this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
    }

    destroy()
    {
        if (this._source)
        {
            this._source.disconnect();
        }
        this._source = null;
        this._started = false;
        this._playing = false;
    }

    /** @private */
    onAudioSourceEnded()
    {
        this._playing = false;
    }

    /**
     * @param {object} [opts]
     * @param {number} [opts.pitch]
     * @param {number} [opts.gain]
     * @param {number} [opts.pan]
     * @param {boolean} [opts.loop]
     */
    play(opts = {})
    {
        let audioBuffer = this.audioBuffer;
        if (!audioBuffer) return;
        // HACK: This just restarts when played again.
        if (this._source) this.destroy();

        const {
            pitch = undefined,
            gain = undefined,
            pan = undefined,
            loop = false
        } = opts;

        /** @type {AudioContext} */
        let audioContext = this.audioContext;
        let source = audioContext.createBufferSource();
        source.addEventListener('ended', this.onAudioSourceEnded);
        source.buffer = audioBuffer;
        source.loop = loop;

        let prevNode = source;
        // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
        // Add pitch
        if (pitch)
        {
            source.detune.value = pitch * 100;
        }
        // Add gain
        if (gain)
        {
            const gainNode = audioContext.createGain();
            gainNode.gain.value = gain;
            prevNode = prevNode.connect(gainNode);
        }
        // Add stereo pan
        if (pan)
        {
            const pannerNode = audioContext.createStereoPanner();
            pannerNode.pan.value = pan;
            prevNode = prevNode.connect(pannerNode);
        }
        prevNode.connect(audioContext.destination);
        source.start();

        this._source = source;
        this._started = true;
        this._playing = true;
    }

    pause()
    {
        this._source.stop();
        this._playing = false;
    }

    isStarted()
    {
        return this._started;
    }

    isPlaying()
    {
        return this._playing;
    }

    isPaused()
    {
        return this._started && !this._playing;
    }
}

function autoUnlock(ctx)
{
    const callback = () => {
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    };
    document.addEventListener('click', callback);
}
