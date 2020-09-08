import { vec3 as vec3$1, quat, mat4 } from 'gl-matrix';

async function loadImage(filepath, opts)
{
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', ev => {
            reject(ev);
        });
        img.src = filepath;
    });
}

var ImageLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadImage: loadImage
});

async function loadText(filepath, opts)
{
    let result = await fetch(filepath);
    return result.text();
}

var TextLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadText: loadText
});

async function loadBytes(filepath, opts)
{
    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    return buffer;
}

var ByteLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadBytes: loadBytes
});

async function loadJSON(filepath, opts)
{
    let result = await fetch(filepath);
    let json = await result.json();
    return json;
}

var JSONLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadJSON: loadJSON
});

async function loadOBJ(filepath, opts)
{
    let result = await fetch(filepath);
    let string = await result.text();
    {
        // console.log('ORIGINAL');
        const attempts = 10;
        for(let i = 0; i < attempts; ++i)
        {
            let then = performance.now();
            parse(string);
            let now = performance.now();
        }
        // console.log(sum / attempts);
    }
    {
        // console.log('UPDATE');
        const attempts = 10;
        for(let i = 0; i < attempts; ++i)
        {
            let then = performance.now();
            parse2(string);
            let now = performance.now();
        }
        // console.log(sum / attempts);
    }
    return parse2(string);
}

function parse2(string)
{
    const vertexList = [];
    const texcoordList = [];
    const normalList = [];

    const vertexIndices = [];
    const texcoordIndices = [];
    const normalIndices = [];

    // # comments
    const commentPattern = /^#.*/g;
    // v float float float
    const vertexPattern = /v\s+(\S+)\s+(\S+)\s+(\S+)/g;
    // vn float float float
    const normalPattern = /vn\s+(\S+)\s+(\S+)\s+(\S+)/g;
    // vt float float float
    const texcoordPattern = /vt\s+(\S+)\s+(\S+)/g;
    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    const facePattern = /f\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))(\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*)))?/g;
    // f float float float
    const faceVertexPattern = /f\s+([^\/\s]+)\s+([^\/\s]+)\s+([^\/\s]+)/g;

    let quad = false;
    let result = null;
    let x, y, z, w;

    // Remove all comments
    string = string.replace(commentPattern, '');

    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = vertexPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        z = Number.parseFloat(result[3]);
        vertexList.push(x);
        vertexList.push(y);
        vertexList.push(z);
    }

    // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = normalPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        z = Number.parseFloat(result[3]);
        normalList.push(x);
        normalList.push(y);
        normalList.push(z);
    }

    // ["vt 1.0 2.0", "1.0", "2.0"]
    while ((result = texcoordPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        texcoordList.push(x);
        texcoordList.push(y);
    }

    // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
    while ((result = facePattern.exec(string)) != null) {
        // Vertex indices
        x = Number.parseInt(result[2]);
        if (Number.isNaN(x)) x = 1;
        y = Number.parseInt(result[6]);
        if (Number.isNaN(y)) y = 1;
        z = Number.parseInt(result[10]);
        if (Number.isNaN(z)) z = 1;
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // Normal indices
        x = Number.parseInt(result[4]);
        if (Number.isNaN(x))
        {
            // No UVs.
            x = Number.parseInt(result[3]);
            y = Number.parseInt(result[7]);
            z = Number.parseInt(result[11]);
            normalIndices.push(x);
            normalIndices.push(y);
            normalIndices.push(z);

            texcoordIndices.push(1);
            texcoordIndices.push(1);
            texcoordIndices.push(1);
        }
        else
        {
            // Maybe UVs.
            y = Number.parseInt(result[8]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[12]);
            if (Number.isNaN(z)) z = 1;
            normalIndices.push(x);
            normalIndices.push(y);
            normalIndices.push(z);

            // UV indices
            x = Number.parseInt(result[3]);
            if (Number.isNaN(x)) x = 1;
            y = Number.parseInt(result[7]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[11]);
            if (Number.isNaN(z)) z = 1;
            texcoordIndices.push(x);
            texcoordIndices.push(y);
            texcoordIndices.push(z);
        }

        // Quad face
        if (typeof result[13] !== 'undefined') {
            
            // Vertex indices
            w = Number.parseInt(result[15]);
            if (Number.isNaN(w)) w = 1;
            vertexIndices.push(w);

            // Normal indices
            w = Number.parseInt(result[17]);
            if (Number.isNaN(w))
            {
                // No UVs.
                w = Number.parseInt(result[16]);
                normalIndices.push(w);
                texcoordIndices.push(1);
            }
            else
            {
                // Maybe UVs.
                normalIndices.push(w);

                w = Number.parseInt(result[16]);
                texcoordIndices.push(w);
            }

            quad = true;
        }
    }

    // ["f 1 2 3 4", "1", "2", "3", "4"]
    while ((result = faceVertexPattern.exec(string)) != null) {
        // Vertex indices
        x = Number.parseInt(result[2]);
        y = Number.parseInt(result[6]);
        z = Number.parseInt(result[10]);
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // UV indices
        texcoordIndices.push(1);
        texcoordIndices.push(1);
        texcoordIndices.push(1);

        // Normal indices
        normalIndices.push(1);
        normalIndices.push(1);
        normalIndices.push(1);

        // Quad face
        if (typeof result[13] !== 'undefined') {

            // Vertex indices
            w = Number.parseInt(result[14]);
            vertexIndices.push(w);

            // UV indices
            texcoordIndices.push(1);
            // Normal indices
            normalIndices.push(1);

            quad = true;
        }
    }

    let index, size;

    size = vertexIndices.length;
    const positions = new Float32Array(size * 3);
    for (let i = 0; i < size; ++i) {
        index = vertexIndices[i] - 1;
        positions[i * 3 + 0] = vertexList[index * 3 + 0];
        positions[i * 3 + 1] = vertexList[index * 3 + 1];
        positions[i * 3 + 2] = vertexList[index * 3 + 2];
    }

    size = texcoordIndices.length;
    const texcoords = new Float32Array(size * 2);
    for (let i = 0; i < size; ++i) {
        index = texcoordIndices[i] - 1;
        texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
        texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
    }

    size = normalIndices.length;
    const normals = new Float32Array(size * 3);
    for (let i = 0; i < size; ++i) {
        index = normalIndices[i] - 1;
        normals[i * 3 + 0] = normalList[index * 3 + 0];
        normals[i * 3 + 1] = normalList[index * 3 + 1];
        normals[i * 3 + 2] = normalList[index * 3 + 2];
    }

    // Must be either unsigned short or unsigned byte.
    size = vertexIndices.length;
    const indices = new Uint16Array(size);
    for (let i = 0; i < size; ++i) {
        indices[i] = i;
    }

    if (quad) {
        console.warn('WebGL does not support quad faces, only triangles.');
    }

    return {
        positions,
        texcoords,
        normals,
        indices,
    };
}

function parse(string)
{
    const vertexList = [];
    const texcoordList = [];
    const normalList = [];

    const vertexIndices = [];
    const texcoordIndices = [];
    const normalIndices = [];

    // # comments
    const commentPattern = /^#.*/g;
    // v float float float
    const vertexPattern = /v( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
    // vn float float float
    const normalPattern = /vn( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
    // vt float float float
    const texcoordPattern = /vt( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    const facePattern = /f( +([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))?/g;
    // f float float float
    const faceVertexPattern = /f( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;

    let quad = false;
    let result = null;
    let x, y, z, w;

    // Remove all comments
    string = string.replace(commentPattern, '');

    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = vertexPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        z = Number.parseFloat(result[3]);
        vertexList.push(x);
        vertexList.push(y);
        vertexList.push(z);
    }

    // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = normalPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        z = Number.parseFloat(result[3]);
        normalList.push(x);
        normalList.push(y);
        normalList.push(z);
    }

    // ["vt 1.0 2.0", "1.0", "2.0"]
    while ((result = texcoordPattern.exec(string)) != null) {
        x = Number.parseFloat(result[1]);
        y = Number.parseFloat(result[2]);
        texcoordList.push(x);
        texcoordList.push(y);
    }

    // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
    while ((result = facePattern.exec(string)) != null) {
        // Vertex indices
        x = Number.parseInt(result[2]);
        if (Number.isNaN(x)) x = 1;
        y = Number.parseInt(result[6]);
        if (Number.isNaN(y)) y = 1;
        z = Number.parseInt(result[10]);
        if (Number.isNaN(z)) z = 1;
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // UV indices
        x = Number.parseInt(result[3]);
        if (Number.isNaN(x)) x = 1;
        y = Number.parseInt(result[7]);
        if (Number.isNaN(y)) y = 1;
        z = Number.parseInt(result[11]);
        if (Number.isNaN(z)) z = 1;
        texcoordIndices.push(x);
        texcoordIndices.push(y);
        texcoordIndices.push(z);

        // Normal indices
        x = Number.parseInt(result[4]);
        if (Number.isNaN(x)) x = 1;
        y = Number.parseInt(result[8]);
        if (Number.isNaN(y)) y = 1;
        z = Number.parseInt(result[12]);
        if (Number.isNaN(z)) z = 1;
        normalIndices.push(x);
        normalIndices.push(y);
        normalIndices.push(z);

        // Quad face
        if (typeof result[13] !== 'undefined') {
            
            // Vertex indices
            w = Number.parseInt(result[14]);
            if (Number.isNaN(w)) w = 1;
            vertexIndices.push(w);

            // UV indices
            w = Number.parseInt(result[15]);
            if (Number.isNaN(w)) w = 1;
            texcoordIndices.push(w);

            // Normal indices
            w = Number.parseInt(result[16]);
            if (Number.isNaN(w)) w = 1;
            normalIndices.push(w);

            quad = true;
        }
    }

    // ["f 1 2 3 4", "1", "2", "3", "4"]
    while ((result = faceVertexPattern.exec(string)) != null) {
        // Vertex indices
        x = Number.parseInt(result[2]);
        y = Number.parseInt(result[6]);
        z = Number.parseInt(result[10]);
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // UV indices
        texcoordIndices.push(1);
        texcoordIndices.push(1);
        texcoordIndices.push(1);

        // Normal indices
        normalIndices.push(1);
        normalIndices.push(1);
        normalIndices.push(1);

        // Quad face
        if (typeof result[13] !== 'undefined') {

            // Vertex indices
            w = Number.parseInt(result[14]);
            vertexIndices.push(w);

            // UV indices
            texcoordIndices.push(1);
            // Normal indices
            normalIndices.push(1);

            quad = true;
        }
    }

    let index, size;

    size = vertexIndices.length;
    const positions = new Float32Array(size * 3);
    for (let i = 0; i < size; ++i) {
        index = vertexIndices[i] - 1;
        positions[i * 3 + 0] = vertexList[index * 3 + 0];
        positions[i * 3 + 1] = vertexList[index * 3 + 1];
        positions[i * 3 + 2] = vertexList[index * 3 + 2];
    }

    size = texcoordIndices.length;
    const texcoords = new Float32Array(size * 2);
    for (let i = 0; i < size; ++i) {
        index = texcoordIndices[i] - 1;
        texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
        texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
    }

    size = normalIndices.length;
    const normals = new Float32Array(size * 3);
    for (let i = 0; i < size; ++i) {
        index = normalIndices[i] - 1;
        normals[i * 3 + 0] = normalList[index * 3 + 0];
        normals[i * 3 + 1] = normalList[index * 3 + 1];
        normals[i * 3 + 2] = normalList[index * 3 + 2];
    }

    // Must be either unsigned short or unsigned byte.
    size = vertexIndices.length;
    const indices = new Uint16Array(size);
    for (let i = 0; i < size; ++i) {
        indices[i] = i;
    }

    if (quad) {
        console.warn('WebGL does not support quad faces, only triangles.');
    }

    return {
        positions,
        texcoords,
        normals,
        indices,
    };
}

var OBJLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadOBJ: loadOBJ
});

let ASSET_LOADERS = {};

defineAssetLoader('image', loadImage);
defineAssetLoader('text', loadText);
defineAssetLoader('json', loadJSON);
defineAssetLoader('bytes', loadBytes);
defineAssetLoader('obj', loadOBJ);

function defineAssetLoader(assetType, assetLoader)
{
    ASSET_LOADERS[assetType] = assetLoader;
}

function getAssetLoader(assetType)
{
    if (assetType in ASSET_LOADERS)
    {
        return ASSET_LOADERS[assetType];
    }
    else
    {
        throw new Error(`Unknown asset type '${assetType}'.`);
    }
}

async function loadAssetMap(assetMap, assetParentPath = '.')
{
    let result = {};
    for(let assetName of Object.keys(assetMap))
    {
        let entry = assetMap[assetName];
        if (typeof entry === 'string')
        {
            result[assetName] = await loadAsset(entry, undefined, assetParentPath);
        }
        else if (typeof entry === 'object')
        {
            if (!('src' in entry))
            {
                throw new Error(`Missing required field 'src' for entry in asset map.`);
            }

            if ('name' in entry && entry.name !== assetName)
            {
                throw new Error(`Cannot redefine name for asset '${assetName}' for entry in asset map.`);
            }

            result[assetName] = await loadAsset(entry.src, entry, assetParentPath);
        }
        else
        {
            throw new Error('Unknown entry type in asset map.');
        }
    }
    return result;
}

async function loadAssetList(assetList, assetParentPath = '.')
{
    let result = {};
    for(let entry of assetList)
    {
        if (typeof entry === 'string')
        {
            result[entry] = await loadAsset(entry, undefined, assetParentPath);
        }
        else if (typeof entry === 'object')
        {
            if (!('src' in entry))
            {
                throw new Error(`Missing required field 'src' for entry in asset list.`);
            }

            result['name' in entry ? entry.name : entry.src] = await loadAsset(entry.src, entry, assetParentPath);
        }
        else
        {
            throw new Error('Unknown entry type in asset list.');
        }
    }
    return result;
}

async function loadAsset(assetSrc, assetOpts = {}, assetParentPath = '.')
{
    if (assetSrc.indexOf(':') < 0)
    {
        throw new Error('Missing type for asset source.');
    }

    let [assetType, assetPath] = assetSrc.split(':');
    let assetLoader = getAssetLoader(assetType);
    return await assetLoader(assetParentPath + '/' + assetPath, assetOpts);
}

var AssetLoader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    defineAssetLoader: defineAssetLoader,
    getAssetLoader: getAssetLoader,
    loadAssetMap: loadAssetMap,
    loadAssetList: loadAssetList,
    loadAsset: loadAsset
});

// SOURCE: https://noonat.github.io/intersect/#aabb-vs-aabb

/* Surface contacts are considered intersections, including sweeps. */

const EPSILON = 1e-8;

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function createAABB(x, y, rx, ry)
{
    return {
        x, y,
        rx, ry,
    };
}

function createRect(left, top, right, bottom)
{
    let rx = Math.abs(right - left) / 2;
    let ry = Math.abs(bottom - top) / 2;
    return createAABB(Math.min(left, right) + rx, Math.min(top, bottom) + ry, rx, ry);
}

function testAABB(a, b)
{
    if (Math.abs(a.x - b.x) > (a.rx + b.rx)) return false;
    if (Math.abs(a.y - b.y) > (a.ry + b.ry)) return false;
    return true;
}

function intersectAABB(out, a, b)
{
    let dx = b.x - a.x;
    let px = (b.rx + a.rx) - Math.abs(dx);
    if (px < 0) return null;

    let dy = b.y - a.y;
    let py = (b.ry + a.ry) - Math.abs(dy);
    if (py < 0) return null;

    if (px < py)
    {
        let sx = Math.sign(dx);
        out.dx = px * sx;
        out.dy = 0;
        out.nx = sx;
        out.ny = 0;
        out.x = a.x + (a.rx * sx);
        out.y = b.y;
    }
    else
    {
        let sy = Math.sign(dy);
        out.dx = 0;
        out.dy = py * sy;
        out.nx = 0;
        out.ny = sy;
        out.x = b.x;
        out.y = a.y + (a.ry * sy);
    }

    return out;
}

function intersectPoint(out, a, x, y)
{
    let dx = x - a.x;
    let px = a.rx - Math.abs(dx);
    if (px < 0) return null;

    let dy = y - a.y;
    let py = a.ry - Math.abs(dy);
    if (py < 0) return null;

    if (px < py)
    {
        let sx = Math.sign(dx);
        out.dx = px * sx;
        out.dy = 0;
        out.nx = sx;
        out.ny = 0;
        out.x = a.x + (a.rx * sx);
        out.y = y;
    }
    else
    {
        let sy = Math.sign(dy);
        out.dx = 0;
        out.dy = py * sy;
        out.nx = 0;
        out.ny = sy;
        out.x = x;
        out.y = a.y + (a.ry * sy);
    }

    return out;
}

function intersectSegment(out, a, x, y, dx, dy, px = 0, py = 0)
{
    if (Math.abs(dx) < EPSILON
        && Math.abs(dy) < EPSILON
        && px === 0
        && py === 0)
    {
        return intersectPoint(out, a, x, y);
    }
    
    let arx = a.rx;
    let ary = a.ry;
    let bpx = px;
    let bpy = py;
    let scaleX = 1.0 / (dx || EPSILON);
    let scaleY = 1.0 / (dy || EPSILON);
    let signX = Math.sign(scaleX);
    let signY = Math.sign(scaleY);
    let nearTimeX = (a.x - signX * (arx + bpx) - x) * scaleX;
    let nearTimeY = (a.y - signY * (ary + bpy) - y) * scaleY;
    let farTimeX = (a.x + signX * (arx + bpx) - x) * scaleX;
    let farTimeY = (a.y + signY * (ary + bpy) - y) * scaleY;
    if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;

    let nearTime = Math.max(nearTimeX, nearTimeY);
    let farTime = Math.min(farTimeX, farTimeY);
    if (nearTime > 1 || farTime < 0) return null;

    let time = clamp(nearTime, 0, 1);
    let hitdx = (1.0 - time) * -dx;
    let hitdy = (1.0 - time) * -dy;
    let hitx = x + dx * time;
    let hity = y + dy * time;

    if (nearTimeX > nearTimeY)
    {
        out.time = time;
        out.nx = -signX;
        out.ny = 0;
        out.dx = hitdx;
        out.dy = hitdy;
        out.x = hitx;
        out.y = hity;
    }
    else
    {
        out.time = time;
        out.nx = 0;
        out.ny = -signY;
        out.dx = hitdx;
        out.dy = hitdy;
        out.x = hitx;
        out.y = hity;
    }

    return out;
}

function intersectSweepAABB(out, a, b, dx, dy)
{
    return intersectSegment(out, a, b.x, b.y, dx, dy, b.rx, b.ry);
}

function sweepIntoAABB(out, a, b, dx, dy)
{
    if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON)
    {
        let hit = intersectAABB({}, b, a);
        if (hit) hit.time = 0;

        out.x = a.x;
        out.y = a.y;
        out.time = hit ? 0 : 1;
        out.hit = hit;
        return out;
    }

    let hit = intersectSweepAABB({}, b, a, dx, dy);
    if (hit)
    {
        let time = clamp(hit.time, 0, 1);
        let length = Math.sqrt(dx * dx + dy * dy);

        let normaldx;
        let normaldy;
        if (length)
        {
            normaldx = dx / length;
            normaldy = dy / length;
        }
        else
        {
            normaldx = 0;
            normaldy = 0;
        }
        hit.x = clamp(hit.x + normaldx * a.rx, b.x - b.rx, b.x + b.rx);
        hit.y = clamp(hit.y + normaldy * a.ry, b.y - b.ry, b.y + b.ry);

        out.time = time;
        out.x = a.x + dx * time;
        out.y = a.y + dy * time;
        out.hit = hit;
    }
    else
    {
        out.time = 1;
        out.x = a.x + dx;
        out.y = a.y + dy;
        out.hit = hit;
    }

    return out;
}

function sweepInto(out, a, staticColliders, dx, dy)
{
    let tmp = {};

    out.time = 1;
    out.x = a.x + dx;
    out.y = a.y + dy;
    out.hit = null;

    for(let i = 0, l = staticColliders.length; i < l; ++i)
    {
        let result = sweepIntoAABB(tmp, a, staticColliders[i], dx, dy);
        if (result.time <= out.time)
        {
            out.time = result.time;
            out.x = result.x;
            out.y = result.y;
            out.hit = result.hit;
        }
    }
    return out;
}

var IntersectionHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    clamp: clamp,
    createAABB: createAABB,
    createRect: createRect,
    testAABB: testAABB,
    intersectAABB: intersectAABB,
    intersectPoint: intersectPoint,
    intersectSegment: intersectSegment,
    sweepInto: sweepInto
});

const MAX_SWEEP_RESOLUTION_ITERATIONS = 100;

function computeIntersections(masks, statics = [])
{
    // Compute physics.
    for(let mask of masks)
    {
        switch(mask.type)
        {
            case 'point':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectPoint({}, other, mask.x, mask.y);
                    if (mask.hit) break;
                }
                break;
            case 'segment':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectSegment({}, other, mask.x, mask.y, mask.dx, mask.dy, mask.px, mask.py);
                    if (mask.hit) break;
                }
                break;
            case 'aabb':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectAABB({}, other, mask);
                    if (mask.hit) break;
                }
                break;
        }
    }
}

function resolveIntersections(dynamics, statics = [], dt = 1)
{
    // Do physics.
    for(let dynamic of dynamics)
    {
        let dx = dynamic.dx * dt;
        let dy = dynamic.dy * dt;
        
        let time = 0;
        let tmp = {};
        let sweep;

        let hit = null;
        let iterations = MAX_SWEEP_RESOLUTION_ITERATIONS;
        do
        {
            // Do detection.
            sweep = sweepInto(tmp, dynamic, statics, dx, dy);
    
            // Do resolution.
            dynamic.x = sweep.x - (Math.sign(dx) * EPSILON);
            dynamic.y = sweep.y - (Math.sign(dy) * EPSILON);
            time += sweep.time;
            if (sweep.hit)
            {
                dx += sweep.hit.nx * Math.abs(dx);
                dy += sweep.hit.ny * Math.abs(dy);
                hit = sweep.hit;

                // Make sure that spent motion is consumed.
                let remainingTime = Math.max(1 - time, 0);
                dx *= remainingTime;
                dy *= remainingTime;
    
                if (Math.abs(dx) < EPSILON) dx = 0;
                if (Math.abs(dy) < EPSILON) dy = 0;
            }
        }
        while(time < 1 && --iterations >= 0);
        
        dynamic.dx = dx;
        dynamic.dy = dy;
        dynamic.hit = hit;
    }
}

var IntersectionResolver = /*#__PURE__*/Object.freeze({
    __proto__: null,
    computeIntersections: computeIntersections,
    resolveIntersections: resolveIntersections
});

function createIntersectionWorld()
{
    return {
        dynamics: [],
        masks: [],
        statics: [],
        update(dt)
        {
            resolveIntersections(this.dynamics, this.statics, dt);
            computeIntersections(this.masks, this.statics);
        },
        render(ctx)
        {
            ctx.save();
            {
                // Draw static colliders.
                ctx.strokeStyle = 'green';
                for(let collider of this.statics)
                {
                    ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                }

                // Draw dynamic colliders.
                ctx.strokeStyle = 'lime';
                for(let collider of this.dynamics)
                {
                    ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                }

                // Draw mask colliders.
                ctx.strokeStyle = 'blue';
                for(let collider of this.masks)
                {
                    switch(collider.type)
                    {
                        case 'point':
                            ctx.save();
                            {
                                ctx.fillStyle = 'red';
                                ctx.fillRect(collider.x - 1, collider.y - 1, 2, 2);
                            }
                            ctx.restore();
                            break;
                        case 'segment':
                            ctx.beginPath();
                            ctx.moveTo(collider.x, collider.y);
                            ctx.lineTo(collider.x + collider.dx, collider.y + collider.dy);
                            ctx.stroke();
                            break;
                        case 'aabb':
                            ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                            break;
                    }
                }
            }
            ctx.restore();
        }
    };
}

var IntersectionWorld = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createIntersectionWorld: createIntersectionWorld
});

const AUDIO_CONTEXT = new AudioContext();
autoUnlock(AUDIO_CONTEXT);

const AUDIO_ASSET_TAG = 'audio';
async function loadAudio(filepath, opts = {})
{
    const ctx = AUDIO_CONTEXT;

    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    let data = await ctx.decodeAudioData(buffer);
    return new Sound(ctx, data, Boolean(opts.loop));
}

const DEFAULT_SOURCE_PARAMS = {
    gain: 0,
    pitch: 0,
    pan: 0,
    loop: false,
};
class Sound
{
    constructor(ctx, audioBuffer, loop = false)
    {
        this.context = ctx;
        this.buffer = audioBuffer;

        this._source = null;

        this.playing = false;
        this.loop = loop;

        this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
    }

    onAudioSourceEnded()
    {
        this._playing = false;
    }

    play(opts = DEFAULT_SOURCE_PARAMS)
    {
        if (!this.buffer) return;
        if (this._source) this.destroy();

        const ctx = this.context;
        let source = ctx.createBufferSource();
        source.addEventListener('ended', this.onAudioSourceEnded);
        source.buffer = this.buffer;
        source.loop = opts.loop;

        let prevNode = source;

        // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
        // Add pitch
        if (opts.pitch)
        {
            source.detune.value = opts.pitch * 100;
        }

        // Add gain
        if (opts.gain)
        {
            const gainNode = ctx.createGain();
            gainNode.gain.value = opts.gain;
            prevNode = prevNode.connect(gainNode);
        }

        // Add stereo pan
        if (opts.pan)
        {
            const pannerNode = ctx.createStereoPanner();
            pannerNode.pan.value = opts.pan;
            prevNode = prevNode.connect(pannerNode);
        }

        prevNode.connect(ctx.destination);
        source.start();

        this._source = source;
        this._playing = true;
    }

    pause()
    {
        this._source.stop();
        this._playing = false;
    }

    destroy()
    {
        if (this._source) this._source.disconnect();
        this._source = null;
    }
}

async function autoUnlock(ctx)
{
    const callback = () => {
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    };
    document.addEventListener('click', callback);
}

var Audio = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AUDIO_CONTEXT: AUDIO_CONTEXT,
    AUDIO_ASSET_TAG: AUDIO_ASSET_TAG,
    loadAudio: loadAudio
});

const MAX_FIXED_UPDATES = 250;

/**
 * @typedef Application
 * @property {Function} [start]
 * @property {Function} [stop]
 * @property {Function} [preUpdate]
 * @property {Function} [update]
 * @property {Function} [fixedUpdate]
 * @property {Function} [postUpdate]
 * @property {Function} [pause]
 * @property {Function} [resume]
 */

class ApplicationLoop
{
    static currentTime() { return performance.now(); }

    static start(app)
    {
        let result = new ApplicationLoop(app, false);
        result.start();
        return result;
    }

    /**
     * @param {Application} app The application object that holds all the executable logic.
     * @param {Boolean} [controlled = false] Whether the loop should NOT execute and manage itself.
     */
    constructor(app, controlled = false)
    {
        this.app = app;

        this._controlled = controlled;
        this._animationFrameHandle = null;

        this.prevFrameTime = 0;
        this.started = false;
        this.paused = false;
        this.fixedTimeStep = 1 / 60;
        this.prevAccumulatedTime = 0;

        this._onstart = null;
        this._onstop = null;
        this._onpreupdate = null;
        this._onupdate = null;
        this._onfixedupdate = null;
        this._onpostupdate = null;
        this._onpause = null;
        this._onresume = null;

        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowFocus = this.onWindowFocus.bind(this);
        this.onWindowBlur = this.onWindowBlur.bind(this);
    }

    setFixedUpdatesPerSecond(count)
    {
        this.fixedTimeStep = 1 / count;
        return this;
    }

    onWindowFocus()
    {
        if (!this.started) return;
        this.resume();
    }

    onWindowBlur()
    {
        if (!this.started) return;
        this.pause();
    }

    /**
     * Runs the game loop. If this is a controlled game loop, it will call itself
     * continuously until stop() or pause().
     */
    onAnimationFrame(now)
    {
        if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
        if (!this.started) throw new Error('Must be called after start().');

        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.step(now);
    }

    /** Runs one update step for the game loop. This is usually called 60 times a second. */
    step(now = ApplicationLoop.currentTime())
    {
        if (!this.started) return false;

        const deltaTime = now - this.prevFrameTime;
        this.prevFrameTime = now;
        
        if (this.paused) return false;

        if (this.app.preUpdate) this.app.preUpdate(deltaTime);
        if (this.app.update) this.app.update(deltaTime);

        this.prevAccumulatedTime += deltaTime / 1000;
        if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep)
        {
            let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
            let count = Math.floor((this.prevAccumulatedTime - max) / this.fixedTimeStep);
            this.prevAccumulatedTime = max;
            console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
        }

        while(this.prevAccumulatedTime >= this.fixedTimeStep)
        {
            this.prevAccumulatedTime -= this.fixedTimeStep;
            if (this.app.fixedUpdate) this.app.fixedUpdate();
        }

        if (this.app.postUpdate) this.app.postUpdate(deltaTime);
    }

    /** Starts the game loop. Calls run(), unless recursive is set to false. */
    start()
    {
        if (this.started) throw new Error('Loop already started.');

        // If the window is out of focus, just ignore the time.
        window.addEventListener('focus', this.onWindowFocus);
        window.addEventListener('blur', this.onWindowBlur);

        this.started = true;
        this.prevFrameTime = ApplicationLoop.currentTime();

        if (this.app.start) this.app.start();
        
        if (!this.controlled)
        {
            this.onAnimationFrame(this.prevFrameTime);
        }

        return this;
    }

    /** Stops the game loop. */
    stop()
    {
        if (!this.started) throw new Error('Loop not yet started.');
        
        // If the window is out of focus, just ignore the time.
        window.removeEventListener('focus', this.onWindowFocus);
        window.removeEventListener('blur', this.onWindowBlur);

        this.started = false;

        if (this.app.stop) this.app.stop();

        if (!this._controlled)
        {
            if (this.animationFrameHandle)
            {
                cancelAnimationFrame(this.animationFrameHandle);
                this.animationFrameHandle = null;
            }
        }

        return this;
    }

    /** Pauses the game loop. */
    pause()
    {
        if (this.paused) return this;

        this.paused = true;
        
        if (this.app.pause) this.app.pause();
        return this;
    }

    /** Resumes the game loop. */
    resume()
    {
        if (!this.pause) return this;

        // This is an intentional frame skip (due to pause).
        this.prevFrameTime = ApplicationLoop.currentTime();

        this.paused = false;

        if (this.app.resume) this.app.resume();
        return this;
    }
}

class Game
{
    constructor(context)
    {
        this.context = context;

        this.display = null;
        this.renderContext = null;
    }

    setDisplay(display)
    {
        this.display = display;
        this.renderContext = display.canvas.getContext('2d');
        return this;
    }

    /** @override */
    start()
    {
        this.context.start();
    }

    /** @override */
    update(dt)
    {
        this.context.update(dt);
        this.context.render(this.renderContext);
    }
}

const GAME_PROPERTY = Symbol('game');
const LOOP_PROPERTY = Symbol('loop');

function start(context)
{
    let gameContext = { ...context };

    let game = new Game(gameContext);
    let loop = new ApplicationLoop(game);

    gameContext[GAME_PROPERTY] = game;
    gameContext[LOOP_PROPERTY] = loop;
    gameContext.display = null;

    window.addEventListener('DOMContentLoaded', () => {
        let display = document.querySelector('display-port');
        if (!display) throw new Error('Cannot find display-port in document.');
        game.setDisplay(display);
        gameContext.display = display;
        gameContext.load().then(() => loop.start());
    });

    return gameContext;
}

function stop(gameContext)
{
    gameContext[LOOP_PROPERTY].stop();

    delete gameContext[GAME_PROPERTY];
    delete gameContext[LOOP_PROPERTY];
}

var Game$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    start: start,
    stop: stop
});

const DEFAULT_INFO = {
    x: 0, y: 0,
    width: 1,
    height: 1,
    color: 'dodgerblue',
    solid: true,
};
const INFO_KEY = Symbol('BoxRendererInfo');

class BoxRenderer
{
    static get Info() { return INFO_KEY; }

    static draw(ctx, targets, defaultInfo = undefined)
    {
        const defaults = defaultInfo ? { ...DEFAULT_INFO, ...defaultInfo } : DEFAULT_INFO;
        for(let target of targets)
        {
            const info = target[INFO_KEY];
            
            const x = resolveInfo('x', info, target, defaults);
            const y = resolveInfo('y', info, target, defaults);
            const width = resolveInfo('width', info, target, defaults);
            const height = resolveInfo('height', info, target, defaults);
            const color = resolveInfo('color', info, target, defaults);
            const solid = resolveInfo('solid', info, target, defaults);

            ctx.translate(x, y);
            {
                const halfWidth = width / 2;
                const halfHeight = height / 2;

                if (solid)
                {
                    ctx.fillStyle = color;
                    ctx.fillRect(-halfWidth, -halfHeight, width, height);
                }
                else
                {
                    ctx.strokeStyle = color;
                    ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                }
            }
            ctx.translate(-x, -y);
        }
    }
}

function resolveInfo(param, info, target, defaults)
{
    if (info)
    {
        if (param in info)
        {
            return info[param];
        }
        else if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else if (target)
    {
        if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else
    {
        return defaults[param];
    }
}

const DEFAULT_INFO$1 = {
    x: 0, y: 0,
    width: 1,
    height: 1,
    spriteImage: null,
};
const INFO_KEY$1 = Symbol('SpriteRendererInfo');

class SpriteRenderer
{
    static get Info() { return INFO_KEY$1; }

    static draw(ctx, targets, defaultInfo = undefined)
    {
        const defaults = defaultInfo ? { ...DEFAULT_INFO$1, ...defaultInfo } : DEFAULT_INFO$1;
        for(let target of targets)
        {
            const info = target[INFO_KEY$1];
            const x = resolveInfo$1('x', info, target, defaults);
            const y = resolveInfo$1('y', info, target, defaults);

            const spriteImage = resolveInfo$1('spriteImage', info, target, defaults);
            if (spriteImage)
            {
                const width = spriteImage.width;
                const height = spriteImage.height;

                ctx.translate(x, y);
                {
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;
    
                    ctx.drawImage(spriteImage, -halfWidth, -halfHeight);
                }
                ctx.translate(-x, -y);
            }
            else
            {
                const width = 10;
                const height = 10;

                ctx.translate(x, y);
                {
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;

                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.strokeText('?', 0, 0, width);
                }
                ctx.translate(-x, -y);
            }
        }
    }
}

function resolveInfo$1(param, info, target, defaults)
{
    if (info)
    {
        if (param in info)
        {
            return info[param];
        }
        else if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else if (target)
    {
        if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else
    {
        return defaults[param];
    }
}

// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

/**
 * @typedef Bounds
 * @property {Number} x The center x position.
 * @property {Number} y The center y position.
 * @property {Number} rx The half width of the bounds.
 * @property {Number} ry The half height of the bounds.
 */

const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;

/**
 * A quadtree to help your sort boxes by proximity (in quadrants). Usually, this is used
 * like this:
 * 1. Clear the tree to be empty.
 * 2. Add all the boxes. They should be in the shape of {@link Bounds}.
 * 3. For each target box you want to check for, call {@link retrieve()}.
 * 4. The previous function should return a list of potentially colliding boxes. This is
 * where you should use a more precise intersection test to accurately determine if the
 * result is correct.
 * 
 * ```js
 * // Here is an example
 * quadTree.clear();
 * quadTree.insertAll(boxes);
 * let out = [];
 * for(let box of boxes)
 * {
 *   quadTree.retrieve(box, out);
 *   for(let other of out)
 *   {
 *     // Found a potential collision between box and other.
 *     // Run your collision detection algorithm for them here.
 *   }
 *   out.length = 0;
 * }
 * ```
 */
class QuadTree
{
    /**
     * Creates bounds for the given dimensions.
     * 
     * @param {Number} x The center x position.
     * @param {Number} y The center y position.
     * @param {Number} rx The half width of the bounds.
     * @param {Number} ry The half height of the bounds.
     * @returns {Bounds} The newly created bounds.
     */
    static createBounds(x, y, rx, ry)
    {
        return { x, y, rx, ry };
    }

    /**
     * Constructs an empty quadtree.
     * 
     * @param {Number} [level] The root level for this tree.
     * @param {Bounds} [bounds] The bounds of this tree.
     */
    constructor(
        level = 0,
        bounds = QuadTree.createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
    {
        this.level = level;
        this.bounds = bounds;

        this.boxes = [];
        this.nodes = new Array(4);
    }

    /**
     * Inserts all the boxes into the tree.
     * 
     * @param {Array<Buonds>} boxes A list of boxes.
     */
    insertAll(boxes)
    {
        for(let box of boxes)
        {
            this.insert(box);
        }
    }

    /**
     * Inserts the box into the tree.
     * 
     * @param {Bounds} box A box.
     */
    insert(box)
    {
        let hasNode = this.nodes[0];

        if (hasNode)
        {
            let quadIndex = this.findQuadIndex(box);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].insert(box);
                return;
            }
        }

        this.boxes.push(box);

        if (this.boxes.length > MAX_OBJECTS && this.level < MAX_LEVELS)
        {
            if (!hasNode) this.split();

            for(let i = this.boxes.length - 1; i >= 0; --i)
            {
                let otherBox = this.boxes[i];
                let quadIndex = this.findQuadIndex(otherBox);
                if (quadIndex >= 0)
                {
                    this.boxes.splice(i, 1);
                    this.nodes[quadIndex].insert(otherBox);
                }
            }
        }
    }

    /**
     * Retrieves all the near boxes for the target.
     * 
     * @param {Bounds} box The target box to get all near boxes for.
     * @param {Array<Bounds>} [out=[]] The list to append results to.
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.includeSelf=false] Whether to include the
     * target in the result list.
     * @returns {Array<Bounds>} The appended list of results.
     */
    retrieve(box, out = [], opts = {})
    {
        const { includeSelf = false } = opts;

        if (this.nodes[0])
        {
            let quadIndex = this.findQuadIndex(box);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].retrieve(box, out);
            }
        }

        let boxes = this.boxes;
        if (!includeSelf)
        {
            // Append all elements before the index (or none, if not found)...
            let targetIndex = boxes.indexOf(box);
            for(let i = 0; i < targetIndex; ++i)
            {
                out.push(boxes[i]);
            }
            // Append all elements after the index (or from 0, if not found)...
            let length = boxes.length;
            for(let i = targetIndex + 1; i < length; ++i)
            {
                out.push(boxes[i]);
            }
        }
        else
        {
            out.push(...boxes);
        }
        return out;
    }

    /**
     * Removes all boxes form the tree.
     */
    clear()
    {
        this.boxes.length = 0;

        for(let i = 0; i < this.nodes.length; ++i)
        {
            let node = this.nodes[i];
            if (node)
            {
                node.clear();
                this.nodes[i] = null;
            }
        }
    }

    /** @private */
    split()
    {
        let { x, y, rx, ry } = this.bounds;
        let nextLevel = this.level + 1;

        let ChildConstructor = this.constructor;

        this.nodes[0] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y, rx, ry));
        this.nodes[1] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y, rx, ry));
        this.nodes[2] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y + ry, rx, ry));
        this.nodes[3] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y + ry, rx, ry));
    }

    /** @private */
    findQuadIndex(box)
    {
        const { x: bx, y: by, rx: brx, ry: bry } = this.bounds;
        const midpointX = bx + brx;
        const midpointY = by + bry;

        const { x, y, rx, ry } = box;
        const isTop = y < midpointY && y + ry * 2 < midpointY;
        const isBottom = y > midpointY;
        const isLeft = x < midpointX && x + rx * 2 < midpointX;
        const isRight= x > midpointX;

        let index = -1;
        if (isLeft)
        {
            if (isTop)
            {
                index = 1;
            }
            else if (isBottom)
            {
                index = 2;
            }
        }
        else if (isRight)
        {
            if (isTop)
            {
                index = 0;
            }
            else if (isBottom)
            {
                index = 3;
            }
        }

        return index;
    }
}

/**
 * @typedef {Function} TestFunction
 * @param {AxisAlignedBoundingBox} a
 * @param {AxisAlignedBoundingBox} b
 * @returns {Boolean} Whether or not the passed-in boxes
 * should be considered as possibly colliding.
 */

/**
 * @typedef CollisionResult
 * @property {AxisAlignedBoundingBox} box
 * @property {AxisAlignedBoundingBox} other
 */

/**
 * The property key for masks to keep count of how many are
 * still available.
 */
const MASK_COUNT = Symbol('maskCount');

/** An axis-aligned graph for effeciently solving box collisions. */
class AxisAlignedBoundingBoxGraph
{
    /**
     * Constructs an empty graph.
     * 
     * @param {Object} [opts={}] Any additional options.
     * @param {typeof AxisAlignedBoundingBox} [opts.boxConstructor=AxisAlignedBoundingBox]
     * The axis-aligned bounding box constructor that make up the graph.
     */
    constructor(opts = {})
    {
        this.boxConstructor = opts.boxConstructor || AxisAlignedBoundingBox;

        this.masks = new Map();
        this.boxes = new Set();

        // Used for constant lookup when updating dynamic masks.
        this.dynamics = new Set();
        // Used for efficiently pruning objects when solving.
        this.quadtree = new QuadTree();
    }

    add(owner, maskName, maskValues = {})
    {
        let mask = {
            owner,
            box: null,
            get: null,
        };

        if (!this.masks.has(owner))
        {
            this.masks.set(owner, {
                [MASK_COUNT]: 1,
                [maskName]: mask,
            });
        }
        else if (!(maskName in this.masks.get(owner)))
        {
            let ownedMasks = this.masks.get(owner);
            ownedMasks[maskName] = mask;
            ownedMasks[MASK_COUNT]++;
        }
        else
        {
            throw new Error(`Mask ${maskName} already exists for owner.`);
        }

        if (Array.isArray(maskValues))
        {
            const x = maskValues[0] || 0;
            const y = maskValues[1] || 0;
            const rx = (maskValues[2] / 2) || 0;
            const ry = (maskValues[3] / 2) || 0;

            let box = new (this.boxConstructor)(this, owner, x, y, rx, ry);
            this.boxes.add(box);

            mask.box = box;
        }
        else if (typeof maskValues === 'object')
        {
            let x = maskValues.x || 0;
            let y = maskValues.y || 0;
            let rx = maskValues.rx || (maskValues.width / 2) || 0;
            let ry = maskValues.ry || (maskValues.height / 2) || 0;

            if (typeof owner === 'object')
            {
                if (!x) x = owner.x || 0;
                if (!y) y = owner.y || 0;
                if (!rx) rx = (owner.width / 2) || 0;
                if (!ry) ry = (owner.height / 2) || 0;
            }
            
            let box = new (this.boxConstructor)(this, owner, x, y, rx, ry);
            this.boxes.add(box);

            mask.box = box;
            if ('get' in maskValues)
            {
                mask.get = maskValues.get;
                mask.get(box, owner);
                this.dynamics.add(mask);
            }
        }
        else if (typeof maskValues === 'function')
        {
            let box = new (this.boxConstructor)(this, owner, 0, 0, 0, 0);
            this.boxes.add(box);
            
            mask.box = box;
            mask.get = maskValues;
            maskValues.call(mask, box, owner);
            this.dynamics.add(mask);
        }
        else
        {
            throw new Error('Invalid mask option type.');
        }
    }

    remove(owner, maskName)
    {
        if (this.masks.has(owner))
        {
            let ownedMasks = this.masks.get(owner);
            let mask = ownedMasks[maskName];
            if (mask)
            {
                if (mask.get) this.dynamics.delete(mask);
                this.boxes.delete(mask.box);
                ownedMasks[maskName] = null;

                let count = --ownedMasks[MASK_COUNT];
                if (count <= 0)
                {
                    this.masks.delete(owner);
                }
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    get(owner, maskName)
    {
        if (this.masks.has(owner))
        {
            return this.masks.get(owner)[maskName];
        }
        else
        {
            return null;
        }
    }

    count(owner)
    {
        if (this.masks.has(owner))
        {
            return this.masks.get(owner)[MASK_COUNT];
        }
        else
        {
            return 0;
        }
    }

    clear()
    {
        this.boxes.clear();
        this.masks.clear();
        this.dynamics.clear();
        this.quadtree.clear();
    }

    /**
     * Forcibly updates the current graph to match the system for
     * the given initial options.
     * 
     * This is usually called automatically by {@link solve()} to
     * update the graph to get the current results, but could also
     * be called manually for more control.
     */
    update()
    {
        // Update boxes
        for(let mask of this.dynamics.values())
        {
            mask.get(mask.box, mask.owner);
        }
    }
    
    /**
     * Solves the current graph for collisions. Usually, you want
     * to call {@link update()} before this function to ensure the
     * boxes accurately reflect the current state.
     * 
     * @param {Boolean} [forceUpdate=true] Whether to update the
     * graph before solving it. If false, you must call {@link update()}
     * yourself to update the graph to the current state.
     * @param {Object} [opts={}] Any additional options.
     * @param {TestFunction} [opts.test] The custom tester function
     * to initially check if 2 objects can be colliding.
     * @returns {Array<CollisionResult>} The collisions found in the current graph.
     */
    solve(forceUpdate = true, out = [], opts = {})
    {
        const { test = testAxisAlignedBoundingBox } = opts;

        if (forceUpdate)
        {
            this.update();
        }

        let result = out;
        let boxes = this.boxes;
        let quadtree = this.quadtree;
        quadtree.clear();
        quadtree.insertAll(boxes);

        let others = [];
        for(let box of boxes)
        {
            quadtree.retrieve(box, others);
            for(let other of others)
            {
                if (test(box, other))
                {
                    const collision = createCollisionResult(box, other);
                    result.push(collision);
                }
            }
            others.length = 0;
        }
        return result;
    }
}

/**
 * Creates a collision result for the given boxes.
 * 
 * @param {AxisAlignedBoundingBox} a
 * @param {AxisAlignedBoundingBox} b
 * @returns {CollisionResult} The new collision result.
 */
function createCollisionResult(a, b)
{
    return {
        box: a,
        other: b,
    };
}

/**
 * A representative bounding box to keep positional and
 * dimensional metadata for any object in the
 * {@link AxisAlignedBoundingBoxGraph}.
 */
class AxisAlignedBoundingBox
{
    constructor(aabbGraph, owner, x, y, rx, ry)
    {
        this.aabbGraph = aabbGraph;
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    setSize(width, height)
    {
        this.rx = width / 2;
        this.ry = height / 2;
        return this;
    }

    setHalfSize(rx, ry)
    {
        this.rx = rx;
        this.ry = ry;
        return this;
    }
}

/**
 * Tests whether either {@link AxisAlignedBoundingBox} intersect one another.
 * 
 * @param {AxisAlignedBoundingBox} a A box.
 * @param {AxisAlignedBoundingBox} b Another box in the same graph.
 * @returns {Boolean} If either box intersects the other.
 */
function testAxisAlignedBoundingBox(a, b)
{
    return !(Math.abs(a.x - b.x) > (a.rx + b.rx))
        && !(Math.abs(a.y - b.y) > (a.ry + b.ry));
}

/**
 * @typedef {String} EntityId
 */

/**
 * Handles all entity and component mappings.
 */
class EntityManager
{
    /**
     * Constructs an empty entity manager with the given factories.
     * 
     * @param {Object} [opts={}] Any additional options.
     * @param {Object} [opts.componentFactoryMap={}] An object map of each component to its factory.
     * @param {Boolean} [opts.strictMode=false] Whether to enable error checking (and throwing).
     */
    constructor(opts = {})
    {
        const { componentFactoryMap = {}, strictMode = false } = opts;
        let factoryMap = {};
        let instances = {};
        for(let componentName in componentFactoryMap)
        {
            let factoryOption = componentFactoryMap[componentName];
            let create, destroy;
            if (typeof factoryOption === 'function')
            {
                create = factoryOption;
                destroy = null;
            }
            else if (typeof factoryOption === 'object')
            {
                create = factoryOption.create || null;
                destroy = factoryOption.destroy || null;
            }
            else
            {
                throw new Error('Unsupported component factory options.');
            }
            factoryMap[componentName] = { owner: factoryOption, create, destroy };
            instances[componentName] = {};
        }
        this.factoryMap = factoryMap;
        this.instances = instances;
        this.entities = new Set();
        this.nextAvailableEntityId = 1;
        this.strictMode = strictMode;
    }

    create(entityTemplate = undefined)
    {
        let entityId = String(this.nextAvailableEntityId++);
        this.entities.add(entityId);
        if (entityTemplate)
        {
            if (Array.isArray(entityTemplate))
            {
                for(let componentName of entityTemplate)
                {
                    this.add(componentName, entityId);
                }
            }
            else if (typeof entityTemplate === 'object')
            {
                for(let componentName in entityTemplate)
                {
                    this.add(componentName, entityId, entityTemplate[componentName]);
                }
            }
            else
            {
                throw new Error('Invalid component options.');
            }
        }
        return entityId;
    }

    destroy(entityId)
    {
        for(let componentName in this.instances)
        {
            this.remove(componentName, entityId);
        }
        this.entities.delete(entityId);
    }

    add(componentName, entityId, props = undefined)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                this.factoryMap[componentName] = {
                    owner: {},
                    create: null,
                    destroy: null,
                };
                this.instances[componentName] = {};
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }

        if (!this.entities.has(entityId))
        {
            throw new Error(`Entity '${entityId}' does not exist.`);
        }

        if (this.instances[componentName][entityId])
        {
            throw new Error(`Entity already has component '${componentName}'.`);
        }

        const { create } = this.factoryMap[componentName];
        let result = create
            ? create(props, entityId, this)
            : (props
                ? {...props}
                : {});
        if (result)
        {
            this.instances[componentName][entityId] = result;
        }
    }

    remove(componentName, entityId)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                return;
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        let entityComponents = this.instances[componentName];
        let componentValues = entityComponents[entityId];
        if (componentValues)
        {
            entityComponents[entityId] = null;
    
            const { destroy } = this.factoryMap[componentName];
            if (destroy) destroy(componentValues, entityId, this);
        }
    }

    /**
     * Finds the component for the given entity.
     * 
     * @param {String} componentName The name of the target component.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Object} The component found. If it does not exist, null
     * is returned instead.
     */
    get(componentName, entityId)
    {
        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }
        
        const entityComponents = this.instances[componentName];
        return entityComponents[entityId] || null;
    }
    
    /**
     * Checks whether the entity has the component.
     * 
     * @param {String} componentName The name of the target component.
     * @param {EntityId} entityId The id of the entity to look in.
     * @returns {Boolean} Whether the component exists for the entity.
     */
    has(componentName, entityId)
    {
        return componentName in this.instances && Boolean(this.instances[componentName][entityId]);
    }

    clear(componentName)
    {
        if (!(componentName in this.factoryMap))
        {
            if (this.strictMode)
            {
                throw new Error(`Missing component factory for '${componentName}'.`);
            }
            else
            {
                return;
            }
        }

        if (!(componentName in this.instances))
        {
            throw new Error(`Missing component instance mapping for '${componentName}'.`);
        }

        let entityComponents = this.instances[componentName];
        const { destroy } = this.factoryMap[componentName];
        if (destroy)
        {
            for(let entityId in entityComponents)
            {
                let componentValues = entityComponents[entityId];
                entityComponents[entityId] = null;

                destroy(componentValues, componentName, entityId, this);
            }
        }
        this.instances[componentName] = {};
    }

    /**
     * Gets all the entity ids.
     * 
     * @returns {Set<EntityId>} The set of entity ids.
     */
    getEntityIds()
    {
        return this.entities;
    }

    getComponentFactory(componentName)
    {
        if (componentName in this.factoryMap)
        {
            return this.factoryMap[componentName].owner;
        }
        else
        {
            return null;
        }
    }

    getComponentNames()
    {
        return Object.keys(this.factoryMap);
    }

    getComponentEntityIds(componentName)
    {
        if (componentName in this.instances)
        {
            return Object.keys(this.instances[componentName]);
        }
        else
        {
            return [];
        }
    }
    
    getComponentInstances(componentName)
    {
        if (componentName in this.instances)
        {
            return Object.values(this.instances[componentName]);
        }
        else
        {
            return [];
        }
    }
}

const MAX_DEPTH_LEVEL = 100;

/**
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
 * the current node's children. If a function, it will be called after
 * traversing down all of its children.
 * 
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 */

/**
 * A tree-like graph of nodes with n-children.
 */
class SceneGraph
{
    /**
     * Constructs an empty scene graph with nodes to be created from the given constructor.
     * 
     * @param {Object} [opts] Any additional options.
     * @param {typeof SceneNode} [opts.nodeConstructor] The scene node constructor that make up the graph.
     */
    constructor(opts = {})
    {
        this.nodeConstructor = opts.nodeConstructor || SceneNode;
        this.nodes = new Map();

        this.rootNodes = [];
    }

    /**
     * Adds an object to the scene graph.
     * 
     * @param {Object} child The child object to add.
     * @param {Object} [parent=null] The parent object to add the child under. If null,
     * the child will be inserted under the root node.
     * @returns {SceneNode} The scene node that represents the added child object.
     */
    add(child, parent = null)
    {
        if (child === null) throw new Error(`Cannot add null as child to scene graph.`);
        if (parent === null || this.nodes.has(parent))
        {
            let parentNode = parent === null ? null : this.nodes.get(parent);
            if (this.nodes.has(child))
            {
                let childNode = this.nodes.get(child);
                detach(childNode.parentNode, childNode, this);
                attach(parentNode, childNode, this);
                return childNode;
            }
            else
            {
                let childNode = new (this.nodeConstructor)(this, child, null, []);
                this.nodes.set(child, childNode);
                attach(parentNode, childNode, this);
                return childNode;
            }
        }
        else
        {
            throw new Error(`No node in scene graph exists for parent.`);
        }
    }

    /**
     * Removes an object from the scene graph, along with all
     * of its descendents.
     * 
     * @param {Object} child The child object to remove. If null, will clear
     * the entire graph.
     * @returns {Boolean} Whether any objects were removed from the scene.
     */
    remove(child)
    {
        if (child === null)
        {
            this.clear();
            return true;
        }
        else if (this.nodes.has(child))
        {
            let childNode = this.nodes.get(child);
            let parentNode = childNode.parentNode;
            detach(parentNode, childNode, this);
            this.nodeConstructor.walk(childNode, 0, descendent => {
                this.nodes.delete(descendent);
            });
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Replaces the target object with the new child object in the graph,
     * inheriting its parent and children.
     * 
     * @param {Object} target The target object to replace. Cannot be null.
     * @param {Object} child The object to replace with. If null,
     * it will remove the target and the target's parent will adopt
     * its grandchildren.
     */
    replace(target, child)
    {
        if (target === null) throw new Error('Cannot replace null for child in scene graph.');
        if (this.nodes.has(target))
        {
            let targetNode = this.nodes.get(target);
            let targetParent = targetNode.parentNode;
            let targetChildren = [...targetNode.childNodes];

            // Remove target node from the graph
            detach(targetParent, targetNode, this);

            // Begin grafting the grandchildren by first removing...
            targetNode.childNodes.length = 0;

            if (child === null)
            {
                // Reattach all grandchildren to target parent.
                if (targetParent === null)
                {
                    // As root children.
                    this.rootNodes.push(...targetChildren);
                }
                else
                {
                    // As regular children.
                    targetParent.childNodes.push(...targetChildren);
                }
            }
            else
            {
                // Reattach all grandchildren to new child.
                let childNode;
                if (this.nodes.has(child))
                {
                    childNode = this.nodes.get(child);

                    // Remove child node from prev parent
                    detach(childNode.parentNode, childNode, this);

                    // ...and graft them back.
                    childNode.childNodes.push(...targetChildren);
                }
                else
                {
                    childNode = new (this.nodeConstructor)(this, child, null, targetChildren);
                    this.nodes.set(child, childNode);
                }

                // And reattach target parent to new child.
                attach(targetParent, childNode, this);
            }
            
            // ...and graft them back.
            for(let targetChild of targetChildren)
            {
                targetChild.parentNode = targetParent;
            }

            return child;
        }
        else if (target === null)
        {
            return this.replace(this.root.owner, child);
        }
        else
        {
            throw new Error('Cannot find target object to replace in scene graph.');
        }
    }

    /** Removes all nodes from the graph. */
    clear()
    {
        this.nodes.clear();
        this.rootNodes.length = 0;
    }

    /**
     * Gets the scene node for the given object.
     * 
     * @param {Object} child The object to retrieve the node for.
     * @returns {SceneNode} The scene node that represents the object.
     */
    get(child)
    {
        return this.nodes.get(child);
    }

    /**
     * Walks through every child node in the graph for the given
     * object's associated node.
     * 
     * @param {WalkCallback} callback The function called for each node
     * in the graph, in ordered traversal from parent to child.
     * @param {Object} [opts={}] Any additional options.
     * @param {Boolean} [opts.childrenOnly=true] Whether to skip traversing
     * the first node, usually the root, and start from its children instead.
     */
    walk(from, callback, opts = {})
    {
        const { childrenOnly = true } = opts;
        if (from === null)
        {
            for(let childNode of this.rootNodes)
            {
                this.nodeConstructor.walk(childNode, 0, callback);
            }
        }
        else
        {
            const fromNode = this.get(from);
            if (!fromNode)
            {
                if (childrenOnly)
                {
                    for(let childNode of fromNode.childNodes)
                    {
                        this.nodeConstructor.walk(childNode, 0, callback);
                    }
                }
                else
                {
                    this.nodeConstructor.walk(fromNode, 0, callback);
                }
            }
            else
            {
                throw new Error(`No node in scene graph exists for walk start.`);
            }
        }
    }
}

function attach(parentNode, childNode, sceneGraph)
{
    if (parentNode === null)
    {
        sceneGraph.rootNodes.push(childNode);
        childNode.parentNode = null;
    }
    else
    {
        parentNode.childNodes.push(childNode);
        childNode.parentNode = parentNode;
    }
}

function detach(parentNode, childNode, sceneGraph)
{
    if (parentNode === null)
    {
        let index = sceneGraph.rootNodes.indexOf(childNode);
        sceneGraph.rootNodes.splice(index, 1);
        childNode.parentNode = undefined;
    }
    else
    {
        let index = parentNode.childNodes.indexOf(childNode);
        parentNode.childNodes.splice(index, 1);
        childNode.parentNode = undefined;
    }
}

/**
 * A representative node to keep relational metadata for any object in
 * the {@link SceneGraph}.
 */
class SceneNode
{
    /**
     * Walk down from the parent and through all its descendents.
     * 
     * @param {SceneNode} parentNode The parent node to start walking from.
     * @param {Number} level The current call depth level. This is used to limit the call stack.
     * @param {WalkCallback} callback The function called on each visited node.
     */
    static walk(parentNode, level, callback)
    {
        if (level >= MAX_DEPTH_LEVEL) return;

        let result = callback(parentNode.owner, parentNode);
        if (result === false) return;

        for(let childNode of parentNode.childNodes)
        {
            this.walk(childNode, level + 1, callback);
        }

        if (typeof result === 'function')
        {
            result(parentNode.owner, parentNode);
        }
    }

    /**
     * Constructs a scene node with the given parent and children. This assumes
     * the given parent and children satisfy the correctness constraints of the
     * graph. In other words, This does not validate nor modify other nodes,
     * such as its parent or children, to maintain correctness. That must be
     * handled externally.
     * 
     * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
     * @param {Object} owner The owner object.
     * @param {SceneNode} parentNode The parent node.
     * @param {Array<SceneNode>} childNodes The list of child nodes.
     */
    constructor(sceneGraph, owner, parentNode, childNodes)
    {
        this.sceneGraph = sceneGraph;
        this.owner = owner;

        this.parentNode = parentNode;
        this.childNodes = childNodes;
    }
}

class Camera2D
{
    constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
    {
        this.position = vec3$1.create();
        this.rotation = quat.create();
        this.scale = vec3$1.fromValues(1, 1, 1);

        this.clippingPlane = {
            left, right, top, bottom, near, far,
        };
    }

    get x() { return this.position[0]; }
    set x(value) { this.position[0] = value; }
    get y() { return this.position[1]; }
    set y(value) { this.position[1] = value; }
    get z() { return this.position[2]; }
    set z(value) { this.position[2] = value; }
    
    moveTo(x, y, z = 0, dt = 1)
    {
        let nextPosition = vec3$1.fromValues(x, y, z);
        vec3$1.lerp(this.position, this.position, nextPosition, Math.max(Math.min(dt, 1), 0));
        return this;
    }

    /** @override */
    getViewMatrix(out)
    {
        let viewX = -Math.round(this.x);
        let viewY = -Math.round(this.y);
        let viewZ = this.z === 0 ? 1 : 1 / this.z;
        let invPosition = vec3$1.fromValues(viewX, viewY, 0);
        let invScale = vec3$1.fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
        mat4.fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
        return out;
    }

    /** @override */
    getProjectionMatrix(out)
    {
        let { left, right, top, bottom, near, far } = this.clippingPlane;
        mat4.ortho(out, left, right, top, bottom, near, far);
        return out;
    }
}

class CanvasView2D
{
    constructor(display, camera = new Camera2D())
    {
        this.display = display;
        this.camera = camera;

        this.viewTransformDOMMatrix = new DOMMatrix();
    }
    
    transformScreenToWorld(screenX, screenY)
    {
        let matrix = mat4.create();
        this.getViewProjectionMatrix(matrix);
        mat4.invert(matrix, matrix);
        let result = vec3.fromValues(screenX, screenY, 0);
        vec3.transformMat4(result, result, matrix);
        return result;
    }
    
    transformCanvas(ctx)
    {
        let domMatrix = this.viewTransformDOMMatrix;
        let matrix = mat4.create();
        this.getViewProjectionMatrix(matrix);
        setDOMMatrix(domMatrix, matrix);

        const { a, b, c, d, e, f } = domMatrix;
        ctx.transform(a, b, c, d, e, f);
    }

    getViewProjectionMatrix(out)
    {
        const displayWidth = this.display.width;
        const displayHeight = this.display.height;

        let matrix = mat4.create();
        const projectionMatrix = this.camera.getProjectionMatrix(matrix);
        const viewMatrix = this.camera.getViewMatrix(out);
        mat4.multiply(matrix, viewMatrix, projectionMatrix);
        // HACK: This is the correct canvas matrix, but since we simply restore the
        // the aspect ratio by effectively undoing the scaling, we can skip this step
        // all together to achieve the same effect (albeit incorrect).
        /*
        const canvasMatrix = mat4.fromRotationTranslationScale(
            out,
            [0, 0, 0, 1],
            [displayWidth / 2, displayHeight / 2, 0],
            [displayWidth, displayHeight, 0]);
        */
        // HACK: This shouldn't be here. This should really be in the view matrix.
        const canvasMatrix = mat4.fromTranslation(
            out,
            [displayWidth / 2, displayHeight / 2, 0]);
        mat4.multiply(out, canvasMatrix, matrix);
        return out;
    }
}

function setDOMMatrix(domMatrix, glMatrix)
{
    domMatrix.a = glMatrix[0];
    domMatrix.b = glMatrix[1];
    domMatrix.c = glMatrix[4];
    domMatrix.d = glMatrix[5];
    domMatrix.e = glMatrix[12];
    domMatrix.f = glMatrix[13];
    return domMatrix;
}

export { ApplicationLoop as A, BoxRenderer as B, Camera2D as C, EntityManager as E, Game$1 as G, ImageLoader as I, JSONLoader as J, OBJLoader as O, QuadTree as Q, SceneNode as S, TextLoader as T, AssetLoader as a, Audio as b, AxisAlignedBoundingBox as c, AxisAlignedBoundingBoxGraph as d, ByteLoader as e, CanvasView2D as f, IntersectionHelper as g, IntersectionResolver as h, IntersectionWorld as i, SpriteRenderer as j, SceneGraph as k, setDOMMatrix as s, testAxisAlignedBoundingBox as t };
