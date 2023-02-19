function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function setupTextureFilteringAndMips(gl, width, height) {
  if (isPowerOf2(width) && isPowerOf2(height)) {
    // the dimensions are power of 2 so generate mips and turn on
    // tri-linear filtering.
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
  } else {
    // at least one of the dimensions is not a power of 2 so set the filtering
    // so WebGL will render it.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}
