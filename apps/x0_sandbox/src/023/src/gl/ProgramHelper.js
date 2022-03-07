export function Program(gl) {
  return new ProgramBuilder(gl);
}

class ProgramBuilder {
  constructor(gl) {
    this.handle = gl.createProgram();
    this.shaders = [];
    this.gl = gl;
  }

  shader(type, shaderSource) {
    const gl = this.gl;
    let shader = createShader(gl, type, shaderSource);
    this.shaders.push(shader);
    return this;
  }

  link() {
    const gl = this.gl;
    createShaderProgram(gl, this.handle, this.shaders);
    this.shaders.length = 0;
    return this.handle;
  }
}

export function createShader(gl, type, shaderSource) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (status) {
    return shader;
  }

  console.error(
    gl.getShaderInfoLog(shader) + '\nFailed to compile shader:\n' + shaderSource
  );
  gl.deleteShader(shader);
}

export function createShaderProgram(gl, program, shaders) {
  // Attach to the program.
  for (let shader of shaders) {
    gl.attachShader(program, shader);
  }

  // Link'em!
  gl.linkProgram(program);

  // Don't forget to clean up the shaders! It's no longer needed.
  for (let shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }

  let status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (status) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
