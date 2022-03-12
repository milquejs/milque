const AUDIO_CONTEXT_SYMBOL = Symbol('audioContext');

export class Sound {
  /** @returns {AudioContext} */
  static getAudioContext() {
    if (AUDIO_CONTEXT_SYMBOL in this) {
      return this[AUDIO_CONTEXT_SYMBOL];
    } else {
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
  constructor(audioContext, audioBuffer) {
    this.audioContext = audioContext;
    this.audioBuffer = audioBuffer;

    /** @private */
    this._playing = false;
    /** @private */
    this._started = false;

    /** @private */
    this._pitch = 0;
    /** @private */
    this._loop = false;

    /** @private */
    this._gainNode = audioContext.createGain();

    /** @private */
    this._panNode = audioContext.createStereoPanner();

    /** @private */
    this._source = null;

    /** @private */
    this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
  }

  destroy() {
    if (this._source) {
      this._source.disconnect();
    }
    this._source = null;
    this._started = false;
    this._playing = false;
  }

  /** @private */
  onAudioSourceEnded() {
    console.log('END!');
    this._playing = false;
  }

  setPitch(value) {
    this._pitch = value;
    if (this._source) {
      // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
      this._source.detune.value = value * 100;
    }
    return this;
  }

  setGain(value) {
    this._gainNode.gain.value = value;
    return this;
  }

  setPan(value) {
    this._panNode.pan.value = value;
    return this;
  }

  setLoop(value) {
    this._loop = value;
    if (this._source) {
      this._source.loop = value;
    }
    return this;
  }

  play() {
    if (this._source) {
      this._source.disconnect();
    }

    const audioContext = this.audioContext;
    const audioBuffer = this.audioBuffer;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    if (this._pitch) {
      // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
      source.detune.value = this._pitch * 100;
    }
    if (this._loop) {
      source.loop = this._loop;
    }
    /** @type {AudioNode} */
    let prev = source;
    prev = prev.connect(this._gainNode);
    prev = prev.connect(this._panNode);
    prev.connect(audioContext.destination);

    this._source = source;
    this._started = true;
    this._playing = true;

    source.addEventListener('ended', this.onAudioSourceEnded);
    source.start();
  }

  pause() {
    this._source.stop();
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
