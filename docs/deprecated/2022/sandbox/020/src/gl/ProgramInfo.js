import {
  findActiveAttributes,
  findActiveUniforms,
  ProgramBuilder,
} from './ProgramHelper.js';
import { getVectorElementType } from './GLTypeInfo.js';
import { draw } from './GLHelper.js';

export function createProgramInfo(gl) {
  return new ProgramInfoBuilder(gl);
}

export class ProgramInfoBuilder extends ProgramBuilder {
  /** @override */
  link(gl) {
    super.link(gl);
    return new ProgramInfo(gl, this.handle);
  }
}

export class ProgramInfo {
  constructor(gl, program) {
    this.handle = program;

    this.activeUniforms = findActiveUniforms(gl, program);
    this.activeAttributes = findActiveAttributes(gl, program);

    this.drawContext = new ProgramInfoDrawContext(this);
  }

  bind(gl) {
    gl.useProgram(this.handle);

    this.drawContext.gl = gl;
    return this.drawContext;
  }
}

export class ProgramInfoDrawContext {
  constructor(programInfo) {
    this.parent = programInfo;

    // Must be set by parent.
    this.gl = null;
  }

  uniform(uniformName, value) {
    const gl = this.gl;
    const activeUniforms = this.parent.activeUniforms;
    if (uniformName in activeUniforms) {
      let uniform = activeUniforms[uniformName];
      let location = uniform.location;
      uniform.set(gl, location, value);
    }
    return this;
  }

  attribute(
    attributeName,
    buffer,
    size,
    normalize = false,
    stride = 0,
    offset = 0
  ) {
    const gl = this.gl;
    const activeAttributes = this.parent.activeAttributes;
    if (attributeName in activeAttributes) {
      let attribute = activeAttributes[attributeName];
      let location = attribute.location;
      if (buffer) {
        let type = getVectorElementType(gl, attribute.type);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(location);
      } else {
        gl.disableVertexAttribArray(location);
      }
    }
    return this;
  }

  draw(gl, mode, offset, count, elements = null) {
    draw(gl, mode, offset, count, elements);
    return this.parent;
  }
}
