export async function loadOBJ(filepath, opts)
{
    let result = await fetch(filepath);
    let string = await result.text();
    {
        // console.log('ORIGINAL');
        const attempts = 10;
        let sum = 0;
        for(let i = 0; i < attempts; ++i)
        {
            let then = performance.now();
            parse(string);
            let now = performance.now();
            sum += (now - then) / 1000;
        }
        // console.log(sum / attempts);
    }
    {
        // console.log('UPDATE');
        const attempts = 10;
        let sum = 0;
        for(let i = 0; i < attempts; ++i)
        {
            let then = performance.now();
            parse2(string);
            let now = performance.now();
            sum += (now - then) / 1000;
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
