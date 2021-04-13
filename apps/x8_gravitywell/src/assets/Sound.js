import { load as loadAudioBuffer } from './AudioBufferLoader.js';

const DEFAULT_AUDIO_CONTEXT_KEY = 'default';
const AUDIO_CONTEXTS_SYMBOL = Symbol('audioContexts');

export class Sound
{
    static async loadSound(url, opts = {})
    {
        const {
            audioContextKey = DEFAULT_AUDIO_CONTEXT_KEY,
        } = opts;
        const ctx = this.getAudioContext(audioContextKey);
        let audioBuffer = await loadAudioBuffer(url, { ctx });
        return new Sound(ctx, audioBuffer);
    }

    static createAudioContext(audioContextKey, autoUnlock = true, audioContextOpts = {})
    {
        let audioContexts = AUDIO_CONTEXTS_SYMBOL in this
            ? this[AUDIO_CONTEXTS_SYMBOL]
            : (this[AUDIO_CONTEXTS_SYMBOL] = {});
        let result = new AudioContext(audioContextOpts);
        audioContexts[audioContextKey] = result;
        if (autoUnlock)
        {
            const callback = () => {
                if (result.state === 'suspended') {
                    result.resume();
                }
            };
            document.addEventListener('click', callback);
        }
        return result;
    }

    static getAudioContext(audioContextKey = DEFAULT_AUDIO_CONTEXT_KEY)
    {
        if (AUDIO_CONTEXTS_SYMBOL in this)
        {
            let audioContexts = this[AUDIO_CONTEXTS_SYMBOL];
            if (audioContextKey in audioContexts)
            {
                return audioContexts[audioContextKey];
            }
        }
        throw new Error(`Missing audio context for key '${audioContextKey} - must call createAudioContext('${audioContextKey}') first.'`);
    }

    constructor(ctx, audioBuffer)
    {
        this.context = ctx;
        this.buffer = audioBuffer;

        /** @private */
        this._playing = false;
        
        /** @private */
        this._source = null;

        /** @private */
        this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
    }

    get playing()
    {
        return this._playing;
    }

    /** @private */
    onAudioSourceEnded()
    {
        this._playing = false;
    }

    play(opts = {})
    {
        if (!this.buffer) return;
        if (this._source) this.destroy();

        const {
            gain = 0,
            pitch = 0,
            pan = 0,
            loop = false,
        } = opts;

        const ctx = this.context;
        let source = ctx.createBufferSource();
        source.addEventListener('ended', this.onAudioSourceEnded);
        source.buffer = this.buffer;
        source.loop = opts.loop;

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
            const gainNode = ctx.createGain();
            gainNode.gain.value = gain;
            prevNode = prevNode.connect(gainNode);
        }

        // Add stereo pan
        if (pan)
        {
            const pannerNode = ctx.createStereoPanner();
            pannerNode.pan.value = pan;
            prevNode = prevNode.connect(pannerNode);
        }

        prevNode.connect(ctx.destination);
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

Sound.createAudioContext(DEFAULT_AUDIO_CONTEXT_KEY);
