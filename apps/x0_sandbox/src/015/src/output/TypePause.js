class TypePause {
  constructor(defaultMessage = '', opts = {}) {
    this.message = defaultMessage;
    this.stream = opts.stream || process.stdout;
  }

  async pause(message = this.message) {
    return await new Promise((resolve) => this._begin(message, resolve));
  }

  _begin(message, callback) {
    let ctx = {
      callback,
      oninput: null,
    };
    ctx.oninput = this._onInputData.bind(this, ctx);

    let stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', ctx.oninput);

    this.stream.write(message);
  }

  _end(ctx) {
    this.stream.clearLine();
    this.stream.cursorTo(0);

    let stdin = process.stdin;
    stdin.off('data', ctx.oninput);
    stdin.pause();
    stdin.setRawMode(false);

    if (ctx.callback) ctx.callback();
  }

  _onInputData(ctx, key) {
    if (key.includes(32)) {
      this._end(ctx);
    }
  }
}

module.exports = { TypePause };
