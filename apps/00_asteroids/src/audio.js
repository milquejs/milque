/** @returns {Sound} */
export async function createSound(arrayBuffer) {
  let ctx = Sound.AUDIO_CONTEXT;
  let audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  return new Sound(ctx, audioBuffer);
}

class Sound {
  /** @returns {AudioContext} */
  static get AUDIO_CONTEXT() {
    let result = new AudioContext();
    autoUnlock(result);
    Object.defineProperty(this, 'AUDIO_CONTEXT', {
      value: result,
    });
    return result;
  }

  /**
   * @param {AudioContext} audioContext
   * @param {AudioBuffer} audioBuffer
   */
  constructor(audioContext, audioBuffer) {
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

  onAudioSourceEnded() {
    this._playing = false;
  }

  play(opts = {}) {
    let audioBuffer = this.audioBuffer;
    if (!audioBuffer) return;
    // HACK: This just restarts when played again.
    if (this._source) this.destroy();

    const { pitch = 0, gain = 0, pan = 0, loop = false } = opts;

    /** @type {AudioContext} */
    let audioContext = this.audioContext;
    let source = audioContext.createBufferSource();
    source.addEventListener('ended', this.onAudioSourceEnded);
    source.buffer = audioBuffer;
    source.loop = loop;

    let prevNode = source;
    // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
    // Add pitch
    if (pitch) {
      source.detune.value = pitch * 100;
    }
    // Add gain
    if (gain) {
      const gainNode = audioContext.createGain();
      gainNode.gain.value = gain;
      prevNode = prevNode.connect(gainNode);
    }
    // Add stereo pan
    if (pan) {
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

  pause() {
    this._source.stop();
    this._playing = false;
  }

  destroy() {
    if (this._source) {
      this._source.disconnect();
    }
    this._source = null;
    this._started = false;
    this._playing = false;
  }

  isStarted() {
    return this._started;
  }

  isPlaying() {
    return this._playing;
  }

  isPaused() {
    return this._started && !this._playing;
  }
}

function autoUnlock(ctx) {
  const callback = () => {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  };
  document.addEventListener('click', callback);
}
