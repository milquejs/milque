import { vec3 as vec3$1, quat, mat4, mat3 } from 'gl-matrix';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function create() {
  return {
    translation: vec3$1.create(),
    rotation: quat.create(),
    scale: vec3$1.fromValues(1, 1, 1)
  };
}
function getTransformationMatrix(transform) {
  var dst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mat4.create();
  return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

var Transform = /*#__PURE__*/Object.freeze({
  create: create,
  getTransformationMatrix: getTransformationMatrix
});

var SceneGraph =
/*#__PURE__*/
function () {
  function SceneGraph() {
    _classCallCheck(this, SceneGraph);

    this.root = this.createSceneNode(create(), null);
  }

  _createClass(SceneGraph, [{
    key: "update",
    value: function update() {
      this.root.updateWorldMatrix();
    }
  }, {
    key: "createSceneNode",
    value: function createSceneNode() {
      var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : create();
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;
      var result = {
        sceneGraph: this,
        transform: transform,
        localMatrix: mat4.create(),
        worldMatrix: mat4.create(),
        parent: null,
        children: [],
        setParent: function setParent(sceneNode) {
          if (this.parent) {
            var index = this.parent.children.indexOf(this);
            this.parent.children.splice(index, 1);
          }

          if (sceneNode) {
            sceneNode.children.push(this);
          }

          this.parent = parent;
          return this;
        },
        updateWorldMatrix: function updateWorldMatrix(parentWorldMatrix) {
          // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
          // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
          // recompute the matrix prevents this.
          getTransformationMatrix(this.transform, this.localMatrix);

          if (parentWorldMatrix) {
            mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
          } else {
            mat4.copy(this.worldMatrix, this.localMatrix);
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;
              child.updateWorldMatrix(this.worldMatrix);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      };

      if (parent) {
        result.setParent(parent);
      }

      return result;
    }
  }]);

  return SceneGraph;
}();

function create$1(position, texcoord, normal, indices) {
  var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  if (!color) {
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
    color = [];

    for (var i = 0; i < position.length; i += 3) {
      color.push(r, g, b);
    }
  }

  return {
    position: position,
    texcoord: texcoord,
    normal: normal,
    indices: indices,
    color: color,
    elementSize: 3,
    elementCount: indices.length
  };
}
function applyColor(r, g, b, geometry) {
  for (var i = 0; i < geometry.color.length; i += 3) {
    geometry.color[i + 0] = r;
    geometry.color[i + 1] = g;
    geometry.color[i + 2] = b;
  }

  return geometry;
}
function applyTransformation(transformationMatrix, geometry) {
  var position = geometry.position;
  var normal = geometry.normal;
  var inverseTransposeMatrix = mat3.create();
  mat3.normalFromMat4(inverseTransposeMatrix, transformationMatrix);
  var result = vec3$1.create();

  for (var i = 0; i < position.length; i += 3) {
    result[0] = position[i + 0];
    result[1] = position[i + 1];
    result[2] = position[i + 2];
    vec3$1.transformMat4(result, result, transformationMatrix);
    position[i + 0] = result[0];
    position[i + 1] = result[1];
    position[i + 2] = result[2];
    result[0] = normal[i + 0];
    result[1] = normal[i + 1];
    result[2] = normal[i + 2];
    vec3$1.transformMat3(result, result, inverseTransposeMatrix);
    normal[i + 0] = result[0];
    normal[i + 1] = result[1];
    normal[i + 2] = result[2];
  }

  return geometry;
}
function joinGeometry() {
  var position = [];
  var texcoord = [];
  var normal = [];
  var indices = [];
  var color = [];
  var indexCount = 0;

  for (var _len = arguments.length, geometries = new Array(_len), _key = 0; _key < _len; _key++) {
    geometries[_key] = arguments[_key];
  }

  for (var _i = 0, _geometries = geometries; _i < _geometries.length; _i++) {
    var geometry = _geometries[_i];
    position.push.apply(position, _toConsumableArray(geometry.position));
    texcoord.push.apply(texcoord, _toConsumableArray(geometry.texcoord));
    normal.push.apply(normal, _toConsumableArray(geometry.normal));
    color.push.apply(color, _toConsumableArray(geometry.color));

    for (var i = 0; i < geometry.indices.length; ++i) {
      var index = geometry.indices[i];
      indices.push(index + indexCount);
    }

    indexCount += geometry.position.length / 3;
  }

  return create$1(position, texcoord, normal, indices, color);
}

function create$2() {
  var centered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var x = 0;
  var y = 0;
  var z = 0;
  var width = 1;
  var height = 1;
  var position;

  if (centered) {
    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;
    position = [x - halfWidth, y - halfHeight, z, x + halfWidth, y - halfHeight, z, x - halfWidth, y + halfHeight, z, x + halfWidth, y + halfHeight, z];
  } else {
    position = [x, y, z, x + width, y, z, x, y + height, z, x + width, y + height, z];
  }

  var texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
  var normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  var indices = [0, 1, 2, 2, 1, 3];
  return create$1(position, texcoord, normal, indices);
}

var QuadGeometry = /*#__PURE__*/Object.freeze({
  create: create$2
});

function create$3() {
  var doubleSided = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var frontPlane = create$2(true);

  if (doubleSided) {
    var backPlane = create$2(true);
    var transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
    applyTransformation(transformationMatrix, backPlane);
    applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
    return joinGeometry(frontPlane, backPlane);
  } else {
    return frontPlane;
  }
}

var PlaneGeometry = /*#__PURE__*/Object.freeze({
  create: create$3
});

function create$4() {
  var front = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var back = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var bottom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var left = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var right = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var HALF_PI = Math.PI / 2;
  var halfWidth = 0.5;
  var halfHeight = 0.5;
  var halfDepth = 0.5;
  var transformationMatrix = mat4.create();
  var faces = []; // Front

  if (front) {
    var frontPlane = create$3(false);
    mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
    applyTransformation(transformationMatrix, frontPlane);
    faces.push(frontPlane);
  } // Top


  if (top) {
    var topPlane = create$3(false);
    mat4.fromXRotation(transformationMatrix, -HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
    applyTransformation(transformationMatrix, topPlane);
    faces.push(topPlane);
  } // Back


  if (back) {
    var backPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, Math.PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
    applyTransformation(transformationMatrix, backPlane);
    faces.push(backPlane);
  } // Bottom


  if (bottom) {
    var bottomPlane = create$3(false);
    mat4.fromXRotation(transformationMatrix, HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
    applyTransformation(transformationMatrix, bottomPlane);
    faces.push(bottomPlane);
  } // Left


  if (left) {
    var leftPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, -HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
    applyTransformation(transformationMatrix, leftPlane);
    faces.push(leftPlane);
  } // Right


  if (right) {
    var rightPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
    applyTransformation(transformationMatrix, rightPlane);
    faces.push(rightPlane);
  }

  return joinGeometry.apply(void 0, faces);
}

var CubeGeometry = /*#__PURE__*/Object.freeze({
  create: create$4
});

function create$5() {
  var size = 1;
  var fifthSize = size * 0.2;
  var transformationMatrix = mat4.create();
  var topRung = create$4(true, true, true, true, false, true);
  mat4.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
  mat4.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
  applyTransformation(transformationMatrix, topRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
  var bottomRung = create$4(true, true, true, true, false, true);
  mat4.fromScaling(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
  applyTransformation(transformationMatrix, bottomRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
  var leftBase = create$4(true, true, true, true, true, true);
  mat4.fromTranslation(transformationMatrix, [-fifthSize, 0, 0]);
  mat4.scale(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
  applyTransformation(transformationMatrix, leftBase);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
  return joinGeometry(leftBase, topRung, bottomRung);
}

var GlyphFGeometry = /*#__PURE__*/Object.freeze({
  create: create$5
});



var Geometry3D = /*#__PURE__*/Object.freeze({
  Quad: QuadGeometry,
  Plane: PlaneGeometry,
  Cube: CubeGeometry,
  GlyphF: GlyphFGeometry,
  create: create$1,
  applyColor: applyColor,
  applyTransformation: applyTransformation,
  joinGeometry: joinGeometry
});

function create$6(position, texcoord, indices) {
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  if (!color) {
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
    color = [];

    for (var i = 0; i < position.length; i += 3) {
      color.push(r, g, b);
    }
  }

  return {
    position: position,
    texcoord: texcoord,
    indices: indices,
    color: color,
    elementSize: 2,
    elementCount: indices.length
  };
}
function applyTransformation2D(transformationMatrix, geometry) {
  var position = geometry.position;
  var result = vec2.create();

  for (var i = 0; i < position.length; i += 2) {
    result[0] = position[i + 0];
    result[1] = position[i + 1];
    vec3.transformMat3(result, result, transformationMatrix);
    position[i + 0] = result[0];
    position[i + 1] = result[1];
  }

  return geometry;
}
function joinGeometry2D() {
  var position = [];
  var texcoord = [];
  var indices = [];
  var color = [];
  var indexCount = 0;

  for (var _len = arguments.length, geometries = new Array(_len), _key = 0; _key < _len; _key++) {
    geometries[_key] = arguments[_key];
  }

  for (var _i = 0, _geometries = geometries; _i < _geometries.length; _i++) {
    var geometry = _geometries[_i];
    position.push.apply(position, _toConsumableArray(geometry.position));
    texcoord.push.apply(texcoord, _toConsumableArray(geometry.texcoord));
    color.push.apply(color, _toConsumableArray(geometry.color));

    for (var i = 0; i < geometry.indices.length; ++i) {
      var index = geometry.indices[i];
      indices.push(index + indexCount);
    }

    indexCount += geometry.position.length / 2;
  }

  return create$6(position, texcoord, indices, color);
}

function create$7() {
  var centered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var x = 0;
  var y = 0;
  var width = 1;
  var height = 1;
  var position;

  if (centered) {
    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;
    position = [x - halfWidth, y - halfHeight, x + halfWidth, y - halfHeight, x - halfWidth, y + halfHeight, x + halfWidth, y + halfHeight];
  } else {
    position = [x, y, x + width, y, x, y + height, x + width, y + height];
  }

  var texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
  var indices = [0, 1, 2, 2, 1, 3];
  return create$6(position, texcoord, indices);
}

var Quad2DGeometry = /*#__PURE__*/Object.freeze({
  create: create$7
});

function create$8() {
  var size = 1;
  var fifthSize = size * 0.2;
  var transformationMatrix = mat3.create();
  var topRung = create$7();
  mat3.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
  mat3.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
  applyTransformation2D(transformationMatrix, topRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
  var bottomRung = create$7();
  mat3.fromScaling(transformationMatrix, [fifthSize, fifthSize]);
  applyTransformation2D(transformationMatrix, bottomRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
  var leftBase = create$7();
  mat3.fromTranslation(transformationMatrix, [-fifthSize, 0]);
  mat3.scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
  applyTransformation2D(transformationMatrix, leftBase);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
  return joinGeometry2D(leftBase, topRung, bottomRung);
}

var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
  create: create$8
});



var Geometry2D = /*#__PURE__*/Object.freeze({
  Quad2D: Quad2DGeometry,
  GlyphF2D: GlyphF2DGeometry,
  create: create$6,
  applyTransformation2D: applyTransformation2D,
  joinGeometry2D: joinGeometry2D,
  applyColor2D: applyColor
});

function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource) {
  var sharedAttributeLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout); // Don't forget to clean up the shaders! It's no longer needed...

  gl.detachShader(programHandle, vertexShaderHandle);
  gl.detachShader(programHandle, fragmentShaderHandle);
  gl.deleteShader(vertexShaderHandle);
  gl.deleteShader(fragmentShaderHandle); // But do keep around the program :P

  return {
    handle: programHandle,
    _gl: gl,
    uniforms: createShaderProgramUniformSetters(gl, programHandle),
    attributes: createShaderProgramAttributeSetters(gl, programHandle),
    uniform: function uniform(name, value) {
      // If the uniform exists, since it may have been optimized away by the compiler :(
      if (name in this.uniforms) {
        this.uniforms[name](this._gl, value);
      }

      return this;
    },
    attribute: function attribute(name, bufferInfo) {
      // If the attribute exists, since it may have been optimized away by the compiler :(
      if (name in this.attributes) {
        this.attributes[name](this._gl, bufferInfo);
      }

      return this;
    },
    elementAttribute: function elementAttribute(bufferInfo) {
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);

      return this;
    }
  };
}
function createShader(gl, type, source) {
  var shaderHandle = gl.createShader(type);
  gl.shaderSource(shaderHandle, source);
  gl.compileShader(shaderHandle);

  if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS)) {
    var result = gl.getShaderInfoLog(shaderHandle);
    gl.deleteShader(shaderHandle);
    throw new Error(result);
  }

  return shaderHandle;
}
function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle) {
  var sharedAttributeLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var programHandle = gl.createProgram();
  gl.attachShader(programHandle, vertexShaderHandle);
  gl.attachShader(programHandle, fragmentShaderHandle); // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
  // NOTE: Unfortunately, this must happen before program linking to take effect.

  for (var i = 0; i < sharedAttributeLayout.length; ++i) {
    gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
  }

  gl.linkProgram(programHandle);

  if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS)) {
    var result = gl.getProgramInfoLog(programHandle);
    gl.deleteProgram(programHandle);
    throw new Error(result);
  }

  return programHandle;
}
function createShaderProgramAttributeSetters(gl, programHandle) {
  var dst = {};
  var attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);

  for (var i = 0; i < attributeCount; ++i) {
    var activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
    if (!activeAttributeInfo) break;
    var attributeName = activeAttributeInfo.name;
    var attributeIndex = gl.getAttribLocation(programHandle, attributeName);
    dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
  }

  return dst;
}
function createShaderProgramAttributeSetter(attributeIndex) {
  var result = function (attributeIndex, gl, bufferInfo) {
    gl.enableVertexAttribArray(attributeIndex);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
    gl.vertexAttribPointer(attributeIndex, bufferInfo.size, bufferInfo.type, bufferInfo.normalize, bufferInfo.stride, bufferInfo.offset);
  }.bind(null, attributeIndex);

  result.location = attributeIndex;
  return result;
}
function createShaderProgramUniformSetters(gl, programHandle) {
  var dst = {};
  var ctx = {
    textureUnit: 0
  };
  var uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);

  for (var i = 0; i < uniformCount; ++i) {
    var activeUniformInfo = gl.getActiveUniform(programHandle, i);
    if (!activeUniformInfo) break;
    var uniformName = activeUniformInfo.name;

    if (uniformName.substring(uniformName.length - 3) === '[0]') {
      uniformName = uniformName.substring(0, uniformName.length - 3);
    }

    var uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
    dst[uniformName] = uniformSetter;
  }

  return dst;
}
function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx) {
  var name = uniformInfo.name;
  var location = gl.getUniformLocation(programHandle, name);
  var type = uniformInfo.type;
  var array = uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]';
  var uniformTypeInfo = getUniformTypeInfo(gl, type);

  if (!uniformTypeInfo) {
    throw new Error("Unknown uniform type 0x".concat(type.toString(16), "."));
  }

  switch (type) {
    case gl.FLOAT:
    case gl.INT:
    case gl.BOOL:
      return uniformTypeInfo.setter(location, array);

    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      var textureUnit;

      if (array) {
        textureUnit = [];

        for (var i = 0; i < uniformInfo.size; ++i) {
          textureUnit.push(ctx.textureUnit++);
        }
      } else {
        textureUnit = ctx.textureUnit++;
      }

      return uniformTypeInfo.setter(location, array, textureUnit);

    default:
      return uniformTypeInfo.setter(location);
  }
}
var UNIFORM_TYPE_MAP = null;
function getUniformTypeInfo(gl, type) {
  var _UNIFORM_TYPE_MAP;

  if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type]; // NOTE: Instead of setting the active texture index for the sampler, we instead designate
  // active texture indices based on the program and number of sampler uniforms it has.
  // This way, we simply pass the texture handle to the uniform setter and it will find
  // the associated texture index by name. This is okay since we usually expect each
  // program to have it's own unqiue active texture list, therefore we can take advantage
  // of the reassignment of sampler uniforms to perform a lookup first instead.
  // This does mean that when creating a texture, you don't need to specify which active
  // texture index it should be in. This is handled by the shader program initialization,
  // and is assigned when the program is used.

  function samplerSetter(textureTarget, location) {
    var array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var textureUnit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
    var result = (array ? function (location, textureUnits, textureTarget, gl, textures) {
      gl.uniform1fv(location, textureUnits);
      textures.forEach(function (texture, index) {
        gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
        gl.bindTexture(textureTarget, texture);
      });
    } : function (location, textureUnit, textureTarget, gl, texture) {
      gl.uniform1i(location, textureUnit);
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(textureTarget, texture);
    }).bind(null, location, textureUnit, textureTarget);
    result.location = location;
    return result;
  }

  UNIFORM_TYPE_MAP = (_UNIFORM_TYPE_MAP = {}, _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT, {
    TypedArray: Float32Array,
    size: 4,
    setter: function setter(location) {
      var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var result = (array ? function (location, gl, value) {
        gl.uniform1fv(location, value);
      } : function (location, gl, value) {
        gl.uniform1f(location, value);
      }).bind(null, location);
      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC2, {
    TypedArray: Float32Array,
    size: 8,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform2fv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC3, {
    TypedArray: Float32Array,
    size: 12,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform3fv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_VEC4, {
    TypedArray: Float32Array,
    size: 16,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform4fv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT, {
    TypedArray: Int32Array,
    size: 4,
    setter: function setter(location) {
      var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var result = (array ? function (location, gl, value) {
        gl.uniform1iv(location, value);
      } : function (location, gl, value) {
        gl.uniform1i(location, value);
      }).bind(null, location);
      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC2, {
    TypedArray: Int32Array,
    size: 8,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform2iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC3, {
    TypedArray: Int32Array,
    size: 12,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform3iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.INT_VEC4, {
    TypedArray: Int32Array,
    size: 16,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform4iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL, {
    TypedArray: Uint32Array,
    size: 4,
    setter: function setter(location) {
      var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var result = (array ? function (location, gl, value) {
        gl.uniform1iv(location, value);
      } : function (location, gl, value) {
        gl.uniform1i(location, value);
      }).bind(null, location);
      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC2, {
    TypedArray: Uint32Array,
    size: 8,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform2iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC3, {
    TypedArray: Uint32Array,
    size: 12,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform3iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.BOOL_VEC4, {
    TypedArray: Uint32Array,
    size: 16,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniform4iv(location, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT2, {
    TypedArray: Float32Array,
    size: 16,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniformMatrix2fv(location, false, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT3, {
    TypedArray: Float32Array,
    size: 36,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniformMatrix3fv(location, false, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.FLOAT_MAT4, {
    TypedArray: Float32Array,
    size: 64,
    setter: function setter(location) {
      var result = function (location, gl, value) {
        gl.uniformMatrix4fv(location, false, value);
      }.bind(null, location);

      result.location = location;
      return result;
    }
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.SAMPLER_2D, {
    TypedArray: null,
    size: 0,
    setter: samplerSetter.bind(null, gl.TEXTURE_2D)
  }), _defineProperty(_UNIFORM_TYPE_MAP, gl.SAMPLER_CUBE, {
    TypedArray: null,
    size: 0,
    setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
  }), _UNIFORM_TYPE_MAP);
  return UNIFORM_TYPE_MAP[type];
}

function createBufferInfo(gl, type, data, size) {
  var normalize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var stride = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var bufferTarget = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : gl.ARRAY_BUFFER;
  var usage = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : gl.STATIC_DRAW;
  var bufferHandle = gl.createBuffer();
  var bufferTypeInfo = getBufferTypeInfo(gl, type);
  if (!bufferTypeInfo) throw new Error("Unknown uniform type 0x".concat(type.toString(16), "."));

  if (data instanceof bufferTypeInfo.TypedArray) {
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else if (Array.isArray(data)) {
    data = new bufferTypeInfo.TypedArray(data);
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else if (typeof data === 'number') {
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else {
    throw new Error("Unknown buffer data type - can only be a TypedArray, an Array, or a number.");
  }

  return {
    handle: bufferHandle,
    size: size,
    type: type,
    normalize: normalize,
    stride: stride,
    offset: offset,

    /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
    updateData: function updateData(gl, data) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var usage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
      // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
      var bufferTypeInfo = getBufferTypeInfo(gl, type);

      if (!(data instanceof bufferTypeInfo.TypedArray)) {
        data = new bufferTypeInfo.TypedArray(data);
      }

      if (offset > 0) {
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      }
    }
  };
}
function createElementBufferInfo(gl, type, data) {
  var stride = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var usage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : gl.STATIC_DRAW;
  // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
  return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
}
var BUFFER_TYPE_MAP = null;
function getBufferTypeInfo(gl, type) {
  var _BUFFER_TYPE_MAP;

  if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];
  BUFFER_TYPE_MAP = (_BUFFER_TYPE_MAP = {}, _defineProperty(_BUFFER_TYPE_MAP, gl.BYTE, {
    TypedArray: Int8Array,
    size: 1
  }), _defineProperty(_BUFFER_TYPE_MAP, gl.SHORT, {
    TypedArray: Int16Array,
    size: 2
  }), _defineProperty(_BUFFER_TYPE_MAP, gl.UNSIGNED_BYTE, {
    TypedArray: Uint8Array,
    size: 1
  }), _defineProperty(_BUFFER_TYPE_MAP, gl.UNSIGNED_SHORT, {
    TypedArray: Uint16Array,
    size: 2
  }), _defineProperty(_BUFFER_TYPE_MAP, gl.FLOAT, {
    TypedArray: Float32Array,
    size: 4
  }), _BUFFER_TYPE_MAP);
  return BUFFER_TYPE_MAP[type];
}

function createVertexArrayInfo(gl) {
  var sharedAttributeLayout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var vertexArrayHandle = gl.createVertexArray();
  var attributes = {};

  for (var i = 0; i < sharedAttributeLayout.length; ++i) {
    attributes[sharedAttributeLayout[i]] = {
      location: i,
      setter: createShaderProgramAttributeSetter(i)
    };
  }

  return {
    handle: vertexArrayHandle,
    attributes: attributes,
    _gl: gl,
    elementBuffer: null,
    elementType: null,
    elementCount: 0,
    attributeBuffers: {},
    setElementCount: function setElementCount(count) {
      this.elementCount = count;
      return this;
    },
    elementAttribute: function elementAttribute(bufferInfo) {
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

      var bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type); // NOTE: Number of bytes in buffer divided by the number of bytes of element type

      this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
      this.elementBuffer = bufferInfo;
      this.elementType = bufferInfo.type;
      return this;
    },
    sharedAttribute: function sharedAttribute(name, bufferInfo) {
      if (name in this.attributes) {
        this.attributes[name].setter(this._gl, bufferInfo);
      }

      this.attributeBuffers[name] = bufferInfo;
      return this;
    },
    programAttribute: function programAttribute(name, bufferInfo) {
      for (var _len = arguments.length, programInfos = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        programInfos[_key - 2] = arguments[_key];
      }

      for (var _i = 0, _programInfos = programInfos; _i < _programInfos.length; _i++) {
        var program = _programInfos[_i];
        program.attribute(name, bufferInfo);
      }

      this.attributeBuffers[name] = bufferInfo;
      return this;
    }
  };
}

function createTextureInfo(gl) {
  var textureHandle = gl.createTexture();
  return {
    handle: textureHandle
  };
}

function createDrawInfo(programInfo, vertexArrayInfo, uniforms) {
  var drawArrayOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var drawMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  return {
    programInfo: programInfo,
    vertexArrayInfo: vertexArrayInfo,
    uniforms: uniforms,
    drawArrayOffset: drawArrayOffset,
    drawMode: drawMode
  };
}
function draw(gl, drawInfos) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = drawInfos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var drawInfo = _step.value;
      var programInfo = drawInfo.programInfo;
      var vertexArrayInfo = drawInfo.vertexArrayInfo;
      var uniforms = drawInfo.uniforms;
      var drawArrayOffset = drawInfo.drawArrayOffset;
      var drawMode = drawInfo.drawMode || gl.TRIANGLES; // Prepare program

      gl.useProgram(programInfo.handle); // Prepare vertex array

      gl.bindVertexArray(vertexArrayInfo.handle); // Prepare uniforms

      for (var _i = 0, _Object$entries = Object.entries(uniforms); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            name = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        programInfo.uniform(name, value);
      } // Depends on buffers in attributes...


      if (vertexArrayInfo.elementBuffer) {
        // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
        gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
      } else {
        gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

export { Geometry3D as Geometry, Geometry2D, SceneGraph, Transform, createBufferInfo, createDrawInfo, createElementBufferInfo, createShader, createShaderProgram, createShaderProgramAttributeSetter, createShaderProgramAttributeSetters, createShaderProgramInfo, createShaderProgramUniformSetter, createShaderProgramUniformSetters, createTextureInfo, createVertexArrayInfo, draw, getBufferTypeInfo, getUniformTypeInfo };
