import { vec3, mat4, quat } from 'gl-matrix';

export class ModelBuilder
{
    constructor()
    {
        this.textures = {};
        this.groups = {};
        this.parts = {};
    }

    bake()
    {
        const mesh = {
            positions: [],
            texcoords: [],
            normals: [],
        };
        for(let partName of Object.keys(this.parts))
        {
            let part = this.parts[partName];
            switch(part.mesh)
            {
                case 'box':
                    break;
                default:
                    throw new Error('Unsupported mesh type.');
            }
        }
        return mesh;
    }

    texture(textureName, width, height)
    {
        this.textures[textureName] = {
            w: width,
            h: height,
        };
        return this;
    }

    group(partName)
    {
        this.groups[partName] = {
            parts: [],
        };
        return this;
    }

    box(partName,
        fromX = 0, fromY = 0, fromZ = 0,
        toX = 1, toY = 1, toZ = 1,
        angleX = 0, angleY = 0, angleZ = 0)
    {
        let x = Math.min(fromX, toX);
        let y = Math.min(fromY, toY);
        let z = Math.min(fromZ, toZ);
        let dx = Math.abs(toX - fromX);
        let dy = Math.abs(toY - fromY);
        let dz = Math.abs(toZ - fromZ);
        let translation = vec3.fromValues(x - dx / 2, y - dy / 2, z - dz / 2);
        let scale = vec3.fromValues(dx, dy, dz);
        let rotation = quat.create();
        quat.fromEuler(rotation, angleX, angleY, angleZ);
        let matrix = mat4.create();
        mat4.fromRotationTranslationScale(matrix, rotation, translation, scale);
        this.parts[partName] = {
            mesh: 'box',
            transform: matrix,
            faces: [
                // Front (+X,+Z)
                { texture: null, u: 0, v: 0, w: dx, h: dz },
                // Right (+Y,+Z)
                { texture: null, u: 0, v: 0, w: dy, h: dz },
                // Back (-X,+Z)
                { texture: null, u: dx, v: 0, w: -dx, h: dz },
                // Left (-Y,+Z)
                { texture: null, u: dy, v: 0, w: -dy, h: dz },
                // Top (+X,+Y)
                { texture: null, u: 0, v: 0, w: dx, h: dy },
                // Bottom (-X,+Y)
                { texture: null, u: dx, v: 0, w: -dx, h: dy },
            ]
        };
        return this;
    }

    quad(partName,
        fromX = 0, fromY = 0,
        toX = 1, toY = 1,
        angleX = 0, angleY = 0, angleZ = 0)
    {
        const quad = {
            fromX, fromY,
            toX, toY,
            angleX, angleY, angleZ,
        };
        this.quads.push(quad);
        return this;
    }

    setFace(partName, faceIndex, textureName,
        textureU, textureV,
        mirrorX = false, mirrorY = false,
        rotateZ = 0)
    {
        if (!(partName in this.parts))
        {
            throw new Error(`Cannot find part with name '${partName}'.`);
        }

        let part = this.parts[partName];
        if (faceIndex < 0 || faceIndex >= part.faces.length)
        {
            throw new Error(`Face index ${faceIndex} for part is out of bounds [0, ${part.faces.length}).`);
        }

        let face = part.faces[faceIndex];
        if (textureName in this.textures)
        {
            throw new Error(`Cannot find texture with name '${textureName}'.`);
        }
        face.texture = textureName;
        face.u = textureU;
        face.v = textureV;

        if (mirrorX)
        {
            face.u = face.w - textureU;
            face.w = -1 * face.w;
        }

        if (mirrorY)
        {
            face.v = face.h - textureV;
            face.h = -1 * face.h;
        }

        return this;
    }
}
