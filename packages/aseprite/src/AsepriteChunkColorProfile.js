import { ByteReader } from './ByteReader';

/** @typedef {AsepriteColorProfiles[keyof AsepriteColorProfiles]} AsepriteColorProfile */

export const AsepriteColorProfiles = /** @type {const} */ ({
  NONE: 0,
  SRGB: 1,
  ICC: 2,
});

/**
 * @param {ByteReader} data
 */
export function readAsepriteChunkColorProfile(data) {
  const profileType = /** @type {AsepriteColorProfile} */ (data.nextWord());
  const flags = data.nextWord();
  const fixedGamma = data.nextFixed();
  data.skipBytes(8); // Zeroes (reserved)
  let iccProfile = null;
  if (profileType === AsepriteColorProfiles.ICC) {
    const iccProfileLength = data.nextDoubleWord();
    iccProfile = data.nextBytes(iccProfileLength); // http://www.color.org/ICC1V42.pdf
  }
  return {
    profileType,
    flags,
    fixedGamma,
    iccProfile,
  };
}
