export class KeyCode {
  /**
   * @param {string} string
   * @returns {KeyCode}
   */
  static parse(string) {
    string = string.trim();
    let i = string.indexOf('.');
    if (i < 0) {
      throw new Error('Missing device separator for key code.');
    }
    let device = string.substring(0, i);
    if (device.length < 0) {
      throw new Error('Missing device for key code.');
    }
    let key = string.substring(i + 1);
    if (key.length < 0) {
      throw new Error('Missing code for key code.');
    }
    return new KeyCode(device, key);
  }

  /**
   * @param {string} device
   * @param {string} code
   */
  constructor(device, code) {
    this.device = device;
    this.code = code;
  }

  /** @override */
  toString() {
    return `${this.device}.${this.code}`;
  }
}
