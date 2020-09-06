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

function assertNotNull(a)
{
    if (!a)
    {
        throw new Error(`Assertion failed - expected not null but was '${a}'.`);
    }
}

function assertNull(a)
{
    if (a != null)
    {
        throw new Error(`Assertion failed - expected null but was '${a}'.`);
    }
}

function assertGreaterThan(value, target)
{
    if (value <= target)
    {
        throw new Error(`Assertion failed - expected value to be greater than '${target}' but was '${value}'.`);
    }
}

function assertGreaterThanOrEqualTo(value, target)
{
    if (value < target)
    {
        throw new Error(`Assertion failed - expected value to be greater than or equal to '${target}' but was '${value}'.`);
    }
}

function assertLessThan(value, target)
{
    if (value >= target)
    {
        throw new Error(`Assertion failed - expected value to be less than '${target}' but was '${value}'.`);
    }
}

function assertLessThanOrEqualTo(value, target)
{
    if (value > target)
    {
        throw new Error(`Assertion failed - expected value to be less than or equal to '${target}' but was '${value}'.`);
    }
}

function assertEquals(a, b)
{
    if (a != b)
    {
        throw new Error(`Assertion failed - expected '${b}' but was '${a}'.`);
    }
}

function assertEqualsWithError(a, b, error = Number.EPSILON)
{
    if (a < b - error || a > b + error)
    {
        throw new Error(`Assertion failed - expected '${b}' +/- ${error} but was '${a}'.`);
    }
}

function assertTrue(result)
{
    if (!result)
    {
        throw new Error(`Assertion failed - expected true but was '${result}'.`);
    }
}

function assertFalse(result)
{
    if (result)
    {
        throw new Error(`Assertion failed - expected false but was '${result}'.`);
    }
}

var IntersectionTestHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    assertNotNull: assertNotNull,
    assertNull: assertNull,
    assertGreaterThan: assertGreaterThan,
    assertGreaterThanOrEqualTo: assertGreaterThanOrEqualTo,
    assertLessThan: assertLessThan,
    assertLessThanOrEqualTo: assertLessThanOrEqualTo,
    assertEquals: assertEquals,
    assertEqualsWithError: assertEqualsWithError,
    assertTrue: assertTrue,
    assertFalse: assertFalse
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

// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

function createBounds(x, y, rx, ry)
{
    return { x, y, rx, ry };
}

const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;

class QuadTree
{
    constructor(level = 0, bounds = createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
    {
        this.level = level;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = new Array(4);
    }

    clear()
    {
        this.objects.length = 0;

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

    split()
    {
        let { x, y, rx, ry } = this.bounds;
        let nextLevel = this.level + 1;

        let ChildConstructor = this.constructor;

        this.nodes[0] = new ChildConstructor(nextLevel, createBounds(x + rx, y, rx, ry));
        this.nodes[1] = new ChildConstructor(nextLevel, createBounds(x, y, rx, ry));
        this.nodes[2] = new ChildConstructor(nextLevel, createBounds(x, y + ry, rx, ry));
        this.nodes[3] = new ChildConstructor(nextLevel, createBounds(x + rx, y + ry, rx, ry));
    }

    findQuadIndex(object)
    {
        let { x, y, rx, ry } = this.bounds;

        let index = -1;
        let midpointX = x + rx;
        let midpointY = y + ry;

        let isTop = object.y < midpointY && object.y + object.ry * 2 < midpointY;
        let isBottom = object.y > midpointY;

        let isLeft = object.x < midpointX && object.x + object.rx * 2 < midpointX;
        let isRight= object.x > midpointX;

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

    insertAll(objects)
    {
        for(let object of objects)
        {
            this.insert(object);
        }
    }

    insert(object)
    {
        let hasNode = this.nodes[0];

        if (hasNode)
        {
            let quadIndex = this.findQuadIndex(object);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].insert(object);
                return;
            }
        }

        this.objects.push(object);

        if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS)
        {
            if (!hasNode) this.split();

            for(let i = this.objects.length - 1; i >= 0; --i)
            {
                let obj = this.objects[i];
                let quadIndex = this.findQuadIndex(obj);
                if (quadIndex >= 0)
                {
                    this.objects.splice(i, 1);
                    this.nodes[quadIndex].insert(obj);
                }
            }
        }
    }

    retreive(out, object)
    {
        if (this.nodes[0])
        {
            let quadIndex = this.findQuadIndex(object);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].retreive(out, object);
            }
        }

        out.push(...this.objects);
        return out;
    }
}

var QuadTree$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createBounds: createBounds,
    QuadTree: QuadTree
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

export { ApplicationLoop as A, BoxRenderer as B, Game$1 as G, ImageLoader as I, JSONLoader as J, OBJLoader as O, QuadTree$1 as Q, SpriteRenderer as S, TextLoader as T, AssetLoader as a, Audio as b, ByteLoader as c, IntersectionHelper as d, IntersectionResolver as e, IntersectionTestHelper as f, IntersectionWorld as g };
