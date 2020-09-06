import { vec3 as vec3$1, quat, mat4, mat3 } from 'gl-matrix';

const ORIGIN = vec3$1.fromValues(0, 0, 0);
const XAXIS = vec3$1.fromValues(1, 0, 0);
const YAXIS = vec3$1.fromValues(0, 1, 0);
const ZAXIS = vec3$1.fromValues(0, 0, 1);

function create()
{
    return {
        translation: vec3$1.create(),
        rotation: quat.create(),
        scale: vec3$1.fromValues(1, 1, 1)
    };
}

/** This is the INVERSE of gluLookAt(). */
function lookAt(transform, target = ORIGIN)
{
    const result = vec3$1.create();
    vec3$1.subtract(result, target, transform.position);
    vec3$1.normalize(result, result);
    
    const dotProduct = vec3$1.dot(ZAXIS, result);
    if (Math.abs(dotProduct - (-1)) < Number.EPSILON)
    {
        quat.set(transform.rotation, 0, 0, 1, Math.PI);
        return transform;
    }
    if (Math.abs(dot - 1) < Number.EPSILON)
    {
        quat.set(transform.rotation, 0, 0, 0, 1);
        return transform;
    }

    vec3$1.cross(result, ZAXIS, result);
    vec3$1.normalize(result, result);
    const halfAngle = Math.acos(dotProduct) / 2;
    const sineAngle = Math.sin(halfAngle);
    transform.rotation[0] = result[0] * sineAngle;
    transform.rotation[1] = result[1] * sineAngle;
    transform.rotation[2] = result[2] * sineAngle;
    transform.rotation[3] = Math.cos(halfAngle);
    return transform;
}

function getTransformationMatrix(transform, dst = mat4.create())
{
    return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

function getForwardVector(transform, dst = vec3$1.create())
{
    vec3$1.transformQuat(dst, ZAXIS, transform.rotation);
    return dst;
}

function getUpVector(transform, dst = vec3$1.create())
{
    vec3$1.transformQuat(dst, YAXIS, transform.rotation);
    return dst;
}

function getRightVector(transform, dst = vec3$1.create())
{
    vec3$1.transformQuat(dst, XAXIS, transform.rotation);
    return dst;
}

var Transform = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ORIGIN: ORIGIN,
    XAXIS: XAXIS,
    YAXIS: YAXIS,
    ZAXIS: ZAXIS,
    create: create,
    lookAt: lookAt,
    getTransformationMatrix: getTransformationMatrix,
    getForwardVector: getForwardVector,
    getUpVector: getUpVector,
    getRightVector: getRightVector
});

class SceneGraph
{
    constructor()
    {
        this.root = this.createSceneNode(create(), null);
    }
    
    update()
    {
        this.root.updateWorldMatrix();
    }

    createSceneNode(transform = create(), parent = this.root)
    {
        const result = {
            sceneGraph: this,
            transform,
            localMatrix: mat4.create(),
            worldMatrix: mat4.create(),
            parent: null,
            children: [],
            setParent(sceneNode)
            {
                if (this.parent)
                {
                    const index = this.parent.children.indexOf(this);
                    this.parent.children.splice(index, 1);
                }

                if (sceneNode)
                {
                    sceneNode.children.push(this);
                }

                this.parent = parent;
                return this;
            },
            updateWorldMatrix(parentWorldMatrix)
            {
                // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
                // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
                // recompute the matrix prevents this.
                getTransformationMatrix(this.transform, this.localMatrix);

                if (parentWorldMatrix)
                {
                    mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
                }
                else
                {
                    mat4.copy(this.worldMatrix, this.localMatrix);
                }

                for(const child of this.children)
                {
                    child.updateWorldMatrix(this.worldMatrix);
                }
            }
        };

        if (parent)
        {
            result.setParent(parent);
        }
        return result;
    }
}

function create$1(position, texcoord, normal, indices, color = undefined)
{
    if (!color)
    {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        color = [];
        for(let i = 0; i < position.length; i += 3)
        {
            color.push(r, g, b);
        }
    }

    return {
        position,
        texcoord,
        normal,
        indices,
        color,
        elementSize: 3,
        elementCount: indices.length,
    };
}

function applyColor(r, g, b, geometry)
{
    for(let i = 0; i < geometry.color.length; i += 3)
    {
        geometry.color[i + 0] = r;
        geometry.color[i + 1] = g;
        geometry.color[i + 2] = b;
    }
    return geometry;
}

function applyTransformation(transformationMatrix, geometry)
{
    const position = geometry.position;
    const normal = geometry.normal;

    const inverseTransposeMatrix = mat3.create();
    mat3.normalFromMat4(inverseTransposeMatrix, transformationMatrix);

    const result = vec3$1.create();
    for(let i = 0; i < position.length; i += 3)
    {
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

function joinGeometry(...geometries)
{
    const position = [];
    const texcoord = [];
    const normal = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        normal.push(...geometry.normal);
        color.push(...geometry.color);
        indices.push(...geometry.indices.map((value) => value + indexCount));

        indexCount += geometry.position.length / 3;
    }

    return create$1(position, texcoord, normal, indices, color);
}

function create$2(centered = false)
{
    const x = 0;
    const y = 0;
    const z = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight, z,
            x + halfWidth, y - halfHeight, z,
            x - halfWidth, y + halfHeight, z,
            x + halfWidth, y + halfHeight, z,
        ];
    }
    else
    {
        position = [
            x, y, z,
            x + width, y, z,
            x, y + height, z,
            x + width, y + height, z,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const normal = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return create$1(position, texcoord, normal, indices);
}

var QuadGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$2
});

function create$3(doubleSided = true)
{
    const frontPlane = create$2(true);
    if (doubleSided)
    {
        const backPlane = create$2(true);
        const transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
        applyTransformation(transformationMatrix, backPlane);
        applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
        return joinGeometry(frontPlane, backPlane);
    }
    else
    {
        return frontPlane;
    }
}

var PlaneGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$3
});

function create$4(front = true, back = true, top = true, bottom = true, left = true, right = true)
{
    const HALF_PI = Math.PI / 2;
    const halfWidth = 0.5;
    const halfHeight = 0.5;
    const halfDepth = 0.5;

    const transformationMatrix = mat4.create();
    const faces = [];
    
    // Front
    if (front)
    {
        const frontPlane = create$3(false);
        mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, frontPlane);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = create$3(false);
        mat4.fromXRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = create$3(false);
        mat4.fromYRotation(transformationMatrix, Math.PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = create$3(false);
        mat4.fromXRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = create$3(false);
        mat4.fromYRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = create$3(false);
        mat4.fromYRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinGeometry(...faces);
}

var CubeGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$4
});

function create$5()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = mat4.create();

    const topRung = create$4(true, true, true, true, false, true);
    mat4.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = create$4(true, true, true, true, false, true);
    mat4.fromScaling(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = create$4(true, true, true, true, true, true);
    mat4.fromTranslation(transformationMatrix, [-fifthSize, 0, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
    applyTransformation(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry(leftBase, topRung, bottomRung);
}

var GlyphFGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$5
});

var Geometry3D = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Quad: QuadGeometry,
    Plane: PlaneGeometry,
    Cube: CubeGeometry,
    GlyphF: GlyphFGeometry,
    create: create$1,
    applyColor: applyColor,
    applyTransformation: applyTransformation,
    joinGeometry: joinGeometry
});

function create$6(position, texcoord, indices, color = undefined)
{
    if (!color)
    {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        color = [];
        for(let i = 0; i < position.length; i += 3)
        {
            color.push(r, g, b);
        }
    }

    return {
        position,
        texcoord,
        indices,
        color,
        elementSize: 2,
        elementCount: indices.length,
    };
}

function applyTransformation2D(transformationMatrix, geometry)
{
    const position = geometry.position;

    const result = vec2.create();
    for(let i = 0; i < position.length; i += 2)
    {
        result[0] = position[i + 0];
        result[1] = position[i + 1];
        vec3.transformMat3(result, result, transformationMatrix);
        position[i + 0] = result[0];
        position[i + 1] = result[1];
    }

    return geometry;
}

function joinGeometry2D(...geometries)
{
    const position = [];
    const texcoord = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        color.push(...geometry.color);

        for(let i = 0; i < geometry.indices.length; ++i)
        {
            const index = geometry.indices[i];
            indices.push(index + indexCount);
        }

        indexCount += geometry.position.length / 2;
    }

    return create$6(position, texcoord, indices, color);
}

function create$7(centered = false)
{
    const x = 0;
    const y = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight,
            x + halfWidth, y - halfHeight,
            x - halfWidth, y + halfHeight,
            x + halfWidth, y + halfHeight,
        ];
    }
    else
    {
        position = [
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return create$6(position, texcoord, indices);
}

var Quad2DGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$7
});

function create$8()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = mat3.create();

    const topRung = create$7();
    mat3.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
    mat3.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
    applyTransformation2D(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = create$7();
    mat3.fromScaling(transformationMatrix, [fifthSize, fifthSize]);
    applyTransformation2D(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = create$7();
    mat3.fromTranslation(transformationMatrix, [-fifthSize, 0]);
    mat3.scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
    applyTransformation2D(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry2D(leftBase, topRung, bottomRung);
}

var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$8
});

var Geometry2D = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Quad2D: Quad2DGeometry,
    GlyphF2D: GlyphF2DGeometry,
    applyColor2D: applyColor,
    create: create$6,
    applyTransformation2D: applyTransformation2D,
    joinGeometry2D: joinGeometry2D
});

function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource, sharedAttributeLayout = [])
{
    const vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout);

    // Don't forget to clean up the shaders! It's no longer needed...
    gl.detachShader(programHandle, vertexShaderHandle);
    gl.detachShader(programHandle, fragmentShaderHandle);
    gl.deleteShader(vertexShaderHandle);
    gl.deleteShader(fragmentShaderHandle);

    // But do keep around the program :P
    return {
        handle: programHandle,
        _gl: gl,
        uniforms: createShaderProgramUniformSetters(gl, programHandle),
        attributes: createShaderProgramAttributeSetters(gl, programHandle),
        uniform(name, value)
        {
            // If the uniform exists, since it may have been optimized away by the compiler :(
            if (name in this.uniforms)
            {
                this.uniforms[name](this._gl, value);
            }
            return this;
        },
        attribute(name, bufferInfo)
        {
            // If the attribute exists, since it may have been optimized away by the compiler :(
            if (name in this.attributes)
            {
                this.attributes[name](this._gl, bufferInfo);
            }
            return this;
        },
        elementAttribute(bufferInfo)
        {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);
            return this;
        }
    };
}

function createShader(gl, type, source)
{
    const shaderHandle = gl.createShader(type);
    gl.shaderSource(shaderHandle, source);
    gl.compileShader(shaderHandle);
    if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS))
    {
        const result = gl.getShaderInfoLog(shaderHandle);
        gl.deleteShader(shaderHandle);
        throw new Error(result);
    }
    return shaderHandle;
}

function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout = [])
{
    const programHandle = gl.createProgram();
    gl.attachShader(programHandle, vertexShaderHandle);
    gl.attachShader(programHandle, fragmentShaderHandle);

    // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
    // NOTE: Unfortunately, this must happen before program linking to take effect.
    for(let i = 0; i < sharedAttributeLayout.length; ++i)
    {
        gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
    }

    gl.linkProgram(programHandle);
    if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS))
    {
        const result = gl.getProgramInfoLog(programHandle);
        gl.deleteProgram(programHandle);
        throw new Error(result);
    }
    return programHandle;
}

function createShaderProgramAttributeSetters(gl, programHandle)
{
    const dst = {};
    const attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);
    for(let i = 0; i < attributeCount; ++i)
    {
        const activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
        if (!activeAttributeInfo) break;
        const attributeName = activeAttributeInfo.name;
        const attributeIndex = gl.getAttribLocation(programHandle, attributeName);
        dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
    }
    return dst;
}

function createShaderProgramAttributeSetter(attributeIndex)
{
    const result = (function(attributeIndex, gl, bufferInfo) {
        gl.enableVertexAttribArray(attributeIndex);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
        gl.vertexAttribPointer(attributeIndex,
            bufferInfo.size,
            bufferInfo.type,
            bufferInfo.normalize,
            bufferInfo.stride,
            bufferInfo.offset);
    }).bind(null, attributeIndex);
    result.location = attributeIndex;
    return result;
}

function createShaderProgramUniformSetters(gl, programHandle)
{
    const dst = {};
    const ctx = {
        textureUnit: 0
    };
    const uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < uniformCount; ++i)
    {
        const activeUniformInfo = gl.getActiveUniform(programHandle, i);
        if (!activeUniformInfo) break;

        let uniformName = activeUniformInfo.name;
        if (uniformName.substring(uniformName.length - 3) === '[0]')
        {
            uniformName = uniformName.substring(0, uniformName.length - 3);
        }
        const uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
        dst[uniformName] = uniformSetter;
    }
    return dst;
}

function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx)
{
    const name = uniformInfo.name;
    const location = gl.getUniformLocation(programHandle, name);
    const type = uniformInfo.type;
    const array = (uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]');

    const uniformTypeInfo = getUniformTypeInfo(gl, type);
    if (!uniformTypeInfo)
    {
        throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);
    }

    switch(type)
    {
        case gl.FLOAT:
        case gl.INT:
        case gl.BOOL:
            return uniformTypeInfo.setter(location, array);
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            let textureUnit;
            if (array)
            {
                textureUnit = [];
                for(let i = 0; i < uniformInfo.size; ++i)
                {
                    textureUnit.push(ctx.textureUnit++);
                }
            }
            else
            {
                textureUnit = ctx.textureUnit++;
            }
            return uniformTypeInfo.setter(location, array, textureUnit);
        default:
            return uniformTypeInfo.setter(location);
    }
}

let UNIFORM_TYPE_MAP = null;
function getUniformTypeInfo(gl, type)
{
    if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type];

    // NOTE: Instead of setting the active texture index for the sampler, we instead designate
    // active texture indices based on the program and number of sampler uniforms it has.
    // This way, we simply pass the texture handle to the uniform setter and it will find
    // the associated texture index by name. This is okay since we usually expect each
    // program to have it's own unqiue active texture list, therefore we can take advantage
    // of the reassignment of sampler uniforms to perform a lookup first instead.
    // This does mean that when creating a texture, you don't need to specify which active
    // texture index it should be in. This is handled by the shader program initialization,
    // and is assigned when the program is used.
    function samplerSetter(textureTarget, location, array = false, textureUnit = 0)
    {
        if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
        const result = (array
            ? function(location, textureUnits, textureTarget, gl, textures) {
                gl.uniform1fv(location, textureUnits);
                textures.forEach((texture, index) => {
                    gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
                    gl.bindTexture(textureTarget, texture);
                });
            }
            : function(location, textureUnit, textureTarget, gl, texture) {
                gl.uniform1i(location, textureUnit);
                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                gl.bindTexture(textureTarget, texture);
            })
            .bind(null, location, textureUnit, textureTarget);
        result.location = location;
        return result;
    }

    UNIFORM_TYPE_MAP = {
        [gl.FLOAT]: {
            TypedArray: Float32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1fv(location, value); }
                    : function(location, gl, value) { gl.uniform1f(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC2]: {
            TypedArray: Float32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC3]: {
            TypedArray: Float32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_VEC4]: {
            TypedArray: Float32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4fv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT]: {
            TypedArray: Int32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1iv(location, value); }
                    : function(location, gl, value) { gl.uniform1i(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC2]: {
            TypedArray: Int32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC3]: {
            TypedArray: Int32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.INT_VEC4]: {
            TypedArray: Int32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL]: {
            TypedArray: Uint32Array,
            size: 4,
            setter(location, array = false)
            {
                const result = (array
                    ? function(location, gl, value) { gl.uniform1iv(location, value); }
                    : function(location, gl, value) { gl.uniform1i(location, value); })
                    .bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC2]: {
            TypedArray: Uint32Array,
            size: 8,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC3]: {
            TypedArray: Uint32Array,
            size: 12,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.BOOL_VEC4]: {
            TypedArray: Uint32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT2]: {
            TypedArray: Float32Array,
            size: 16,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix2fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT3]: {
            TypedArray: Float32Array,
            size: 36,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix3fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.FLOAT_MAT4]: {
            TypedArray: Float32Array,
            size: 64,
            setter(location)
            {
                const result = (function(location, gl, value) { gl.uniformMatrix4fv(location, false, value); }).bind(null, location);
                result.location = location;
                return result;
            }
        },
        [gl.SAMPLER_2D]: {
            TypedArray: null,
            size: 0,
            setter: samplerSetter.bind(null, gl.TEXTURE_2D)
        },
        [gl.SAMPLER_CUBE]: {
            TypedArray: null,
            size: 0,
            setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
        },
        // UNSIGNED_INT
        // UNSIGNED_INT_VEC2
        // UNSIGNED_INT_VEC3
        // UNSIGNED_INT_VEC4
        // FLOAT_MAT2x3
        // FLOAT_MAT2x4
        // FLOAT_MAT3x2
        // FLOAT_MAT3x4
        // FLOAT_MAT4x2
        // FLOAT_MAT4x3
        // SAMPLER_3D
        // SAMPLER_2D_SHADOW
        // SAMPLER_2D_ARRAY
        // SAMPLER_2D_ARRAY_SHADOW
        // INT_SAMPLER_2D
        // INT_SAMPLER_3D
        // INT_SAMPLER_CUBE
        // INT_SAMPLER_2D_ARRAY
        // UNSIGNED_INT_SAMPLER_2D
        // UNSIGNED_INT_SAMPLER_3D
        // UNSIGNED_INT_SAMPLER_CUBE
        // UNSIGNED_INT_SAMPLER_2D_ARRAY
    };
    return UNIFORM_TYPE_MAP[type];
}

function createBufferInfo(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW)
{
    const bufferHandle = gl.createBuffer();

    const bufferTypeInfo = getBufferTypeInfo(gl, type);
    if (!bufferTypeInfo) throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);    

    if (data instanceof bufferTypeInfo.TypedArray)
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (Array.isArray(data))
    {
        data = new bufferTypeInfo.TypedArray(data);
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else if (typeof data === 'number')
    {
        gl.bindBuffer(bufferTarget, bufferHandle);
        gl.bufferData(bufferTarget, data, usage);
    }
    else
    {
        throw new Error(`Unknown buffer data type - can only be a TypedArray, an Array, or a number.`);
    }

    return {
        handle: bufferHandle,
        size,
        type,
        normalize,
        stride,
        offset,
        /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
        updateData(gl, data, offset = 0, usage = gl.STATIC_DRAW)
        {
            // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
            const bufferTypeInfo = getBufferTypeInfo(gl, type);
            if (!(data instanceof bufferTypeInfo.TypedArray))
            {
                data = new bufferTypeInfo.TypedArray(data);
            }

            if (offset > 0)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            }
            else
            {
                gl.bufferData(gl.ARRAY_BUFFER, data, usage);
            }
        }
    };
}

function createElementBufferInfo(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW)
{
    // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
    return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
}

let BUFFER_TYPE_MAP = null;
function getBufferTypeInfo(gl, type)
{
    if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];

    BUFFER_TYPE_MAP = {
        [gl.BYTE]: {
            TypedArray: Int8Array,
            size: 1
        },
        [gl.SHORT]: {
            TypedArray: Int16Array,
            size: 2
        },
        [gl.UNSIGNED_BYTE]: {
            TypedArray: Uint8Array,
            size: 1
        },
        [gl.UNSIGNED_SHORT]: {
            TypedArray: Uint16Array,
            size: 2
        },
        [gl.FLOAT]: {
            TypedArray: Float32Array,
            size: 4
        },
        // HALF_FLOAT
    };

    return BUFFER_TYPE_MAP[type];
}

function createVertexArrayInfo(gl, sharedAttributeLayout = [])
{
    const vertexArrayHandle = gl.createVertexArray();

    const attributes = {};
    for(let i = 0; i < sharedAttributeLayout.length; ++i)
    {
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
        setElementCount(count)
        {
            this.elementCount = count;
            return this;
        },
        elementAttribute(bufferInfo)
        {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

            const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type);
            // NOTE: Number of bytes in buffer divided by the number of bytes of element type
            this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
            this.elementBuffer = bufferInfo;
            this.elementType = bufferInfo.type;
            return this;
        },
        sharedAttribute(name, bufferInfo)
        {
            if (name in this.attributes)
            {
                this.attributes[name].setter(this._gl, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        },
        programAttribute(name, bufferInfo, ...programInfos)
        {
            for(const program of programInfos)
            {
                program.attribute(name, bufferInfo);
            }
            this.attributeBuffers[name] = bufferInfo;
            return this;
        }
    };
}

function createTextureInfo(gl)
{
    const textureHandle = gl.createTexture();
    return {
        handle: textureHandle
    };
}

function createDrawInfo(programInfo, vertexArrayInfo, uniforms, drawArrayOffset = 0, drawMode = null)
{
    return {
        programInfo,
        vertexArrayInfo,
        uniforms,
        drawArrayOffset,
        drawMode
    };
}

function draw(gl, drawInfos, sharedUniforms = {})
{
    for(const drawInfo of drawInfos)
    {
        const programInfo = drawInfo.programInfo;
        const vertexArrayInfo = drawInfo.vertexArrayInfo;
        const uniforms = drawInfo.uniforms;
        const drawArrayOffset = drawInfo.drawArrayOffset;
        const drawMode = drawInfo.drawMode || gl.TRIANGLES;

        // Prepare program...
        gl.useProgram(programInfo.handle);

        // Prepare vertex array...
        gl.bindVertexArray(vertexArrayInfo.handle);

        // Prepare shared uniforms...
        for(const [name, value] of Object.entries(sharedUniforms))
        {
            programInfo.uniform(name, value);
        }

        // Prepare uniforms...
        for(const [name, value] of Object.entries(uniforms))
        {
            programInfo.uniform(name, value);
        }

        // Depends on buffers in attributes...
        if (vertexArrayInfo.elementBuffer)
        {
            // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
            gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
        }
        else
        {
            gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
        }
    }
}

export { Geometry3D as G, SceneGraph as S, Transform as T, Geometry2D as a, createDrawInfo as b, createBufferInfo as c, createElementBufferInfo as d, createShader as e, createShaderProgram as f, createShaderProgramAttributeSetter as g, createShaderProgramAttributeSetters as h, createShaderProgramInfo as i, createShaderProgramUniformSetter as j, createShaderProgramUniformSetters as k, createTextureInfo as l, createVertexArrayInfo as m, draw as n, getBufferTypeInfo as o, getUniformTypeInfo as p };
