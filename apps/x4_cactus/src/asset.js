import { ImageLoader, OBJLoader, TextLoader } from '@milque/asset';

export const ASSET_CONTEXT = {
    async load()
    {
        return {
            mainVertexShaderSource: await TextLoader('main.vert'),
            mainFragmentShaderSource: await TextLoader('main.frag'),
            cubeObj: await OBJLoader('cube.obj'),
            quadObj: await OBJLoader('quad.obj'),
            gradientClay: await ImageLoader('gradient_clay.png'),
            color: await ImageLoader('null.png'),
        };
    }
};
