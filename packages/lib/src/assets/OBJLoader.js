export async function loadOBJ(filepath, opts)
{
    let result = await fetch(filepath);
    let string = await result.text();
    return parse(string);
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
    const facePattern = /f( +([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))?/g;
    // f float float float
    const faceVertexPattern = /f( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;

    let result = null;
    let x, y, z, w;

    // Remove all comments
    string = string.replace(commentPattern, '');

    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = vertexPattern.exec(string)) != null) {
        x = parseFloat(result[1]);
        y = parseFloat(result[2]);
        z = parseFloat(result[3]);
        vertexList.push(x);
        vertexList.push(y);
        vertexList.push(z);
    }

    // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
    while ((result = normalPattern.exec(string)) != null) {
        x = parseFloat(result[1]);
        y = parseFloat(result[2]);
        z = parseFloat(result[3]);
        normalList.push(x);
        normalList.push(y);
        normalList.push(z);
    }

    // ["vt 1.0 2.0", "1.0", "2.0"]
    while ((result = texcoordPattern.exec(string)) != null) {
        x = parseFloat(result[1]);
        y = parseFloat(result[2]);
        texcoordList.push(x);
        texcoordList.push(y);
    }

    // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
    while ((result = facePattern.exec(string)) != null) {
        // Vertex indices
        x = parseInt(result[2]);
        y = parseInt(result[6]);
        z = parseInt(result[10]);
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // UV indices
        x = parseInt(result[3]);
        y = parseInt(result[7]);
        z = parseInt(result[11]);
        texcoordIndices.push(x);
        texcoordIndices.push(y);
        texcoordIndices.push(z);

        // Normal indices
        x = parseInt(result[4]);
        y = parseInt(result[8]);
        z = parseInt(result[12]);
        normalIndices.push(x);
        normalIndices.push(y);
        normalIndices.push(z);

        // Quad face
        if (typeof result[13] !== 'undefined') {
            // Vertex indices
            w = parseInt(result[14]);
            vertexIndices.push(w);

            // UV indices
            w = parseInt(result[15]);
            texcoordIndices.push(w);

            // Normal indices
            w = parseInt(result[16]);
            normalIndices.push(w);
        }
    }

    // ["f 1 2 3 4", "1", "2", "3", "4"]
    while ((result = faceVertexPattern.exec(string)) != null) {
        // Vertex indices
        x = parseInt(result[2]);
        y = parseInt(result[6]);
        z = parseInt(result[10]);
        vertexIndices.push(x);
        vertexIndices.push(y);
        vertexIndices.push(z);

        // UV indices
        texcoordIndices.push(0);
        texcoordIndices.push(0);
        texcoordIndices.push(0);

        // Normal indices
        normalIndices.push(0);
        normalIndices.push(0);
        normalIndices.push(0);

        // Quad face
        if (typeof result[13] !== 'undefined') {
            // Vertex indices
            w = parseInt(result[14]);
            vertexIndices.push(w);

            // UV indices
            texcoordIndices.push(0);
            // Normal indices
            normalIndices.push(0);
        }
    }

    let index, size;

    size = vertexIndices.length;
    const vertices = new Float32Array(size * 3);
    for (let i = 0; i < size; ++i) {
        index = vertexIndices[i] - 1;
        vertices[i * 3 + 0] = vertexList[index * 3 + 0];
        vertices[i * 3 + 1] = vertexList[index * 3 + 1];
        vertices[i * 3 + 2] = vertexList[index * 3 + 2];
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

    size = vertexIndices.length;
    const indices = new Uint16Array(size);
    for (let i = 0; i < size; ++i) {
        indices[i] = i;
    }

    return {
        vertices,
        texcoords,
        normals,
        indices,
    };
}
