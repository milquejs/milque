import { DeviceCodes } from './DeviceCodeWrapper';
import { KeyCode } from './KeyCode';
import * as KeyCodes from './KeyCodes';

KeyCode.parse = parse;

export { KeyCodes, KeyCode };

/**
 * @param {string} text
 * @param {object} [opts]
 * @param {boolean} [opts.strict]
 * @param {boolean|'range'|'state'} [opts.type]
 * @returns {KeyCode}
 */
function parse(text, opts) {
  const { strict = true } = opts || {};
  text = text.trim();
  const i = text.indexOf('.');
  if (i < 0) {
    throw new Error('Missing device separator for key code.');
  }
  const device = text.substring(0, i);
  if (device.length < 0) {
    throw new Error('Missing device for key code.');
  }
  if (strict) {
    const deviceCode = Object.values(DeviceCodes).find(deviceCode => deviceCode === device);
    if (!deviceCode) {
      throw new Error(`Unknown device code string '${text}'.`)
    }
  }
  const code = text.substring(i + 1);
  if (code.length < 0) {
    throw new Error('Missing code for key code.');
  }
  if (!strict) {
    return new KeyCode(device, code, opts?.type || false);
  }
  const keyCode = Object.values(KeyCodes).find(keyCode => keyCode.device === device && keyCode.code === code);
  if (!keyCode) {
    throw new Error(`Unknown key code string '${text}'.`);
  }
  const type = opts?.type;
  if (typeof type !== 'undefined') {
    let result = type === true ? 'range' : type === false ? 'state' : type;
    if (result !== keyCode.type) {
      throw new Error(`Mismatched requested type '${type}' for key code '${keyCode}' - expected '${keyCode.type}' or undefined.`);
    }
  }
  return keyCode;
}
