import { ProgramBuilder } from '@milque/mogli';
export class WebGLRenderer {
    constructor(display) {
        this.display = display;

        /** @type {WebGL2RenderingContext} */
        const gl = display.canvas.getContext('webgl2');
        if (!gl) throw new Error('Your browser does not support WebGL.');

        this.gl = gl;
        gl.enable(gl.DEPTH_TEST);

        this.program = new ProgramBuilder(gl)
            .shader(gl.VERTEX_SHADER, '')
            .shader(gl.FRAGMENT_SHADER, '')
            .link();
        
    }
    
    /**
     * @param {Array<?>} sceneObjects
     * @param {import('@milque/scene').Camera} camera
     */
    render(sceneObjects, camera) {
        for(let sceneObject of sceneObjects) {
            this.renderNode(sceneObject, camera);
        }
    }

    renderNode(sceneNode, camera) {
        let gl = this.gl;
        gl.useProgram(this.program);
        
    }
}
