import { ImageLoader, JSONLoader, OBJLoader, TextLoader } from 'milque';

export const ASSET_CONTEXT = {
    async load()
    {
        return {
            mainVertexShaderSource: await TextLoader.loadText('main.vert'),
            mainFragmentShaderSource: await TextLoader.loadText('main.frag'),
            cubeObj: await OBJLoader.loadOBJ('cube.obj'),
            quadObj: await OBJLoader.loadOBJ('quad.obj'),
            gradientClay: await ImageLoader.loadImage('gradient_clay.png'),
            color: await ImageLoader.loadImage('color.png'),
        };
    }
};
