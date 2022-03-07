export const hex = {
  red(hexValue) {
    return (hexValue >> 16) & 0xff;
  },
  redf(hexValue) {
    return ((hexValue >> 16) & 0xff) / 255.0;
  },
  green(hexValue) {
    return (hexValue >> 8) & 0xff;
  },
  greenf(hexValue) {
    return ((hexValue >> 8) & 0xff) / 255.0;
  },
  blue(hexValue) {
    return hexValue & 0xff;
  },
  bluef(hexValue) {
    return (hexValue & 0xff) / 255.0;
  },
  alpha(hexValue) {
    return (hexValue >> 24) & 0xff;
  },
  alphaf(hexValue) {
    return ((hexValue >> 24) & 0xff) / 255.0;
  },
};
