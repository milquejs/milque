/**
 * @typedef {import('../game/Game.js').Game} Game
 */

import { Random } from '@milque/random';
import { PerspectiveCamera, ArcballCameraController } from '@milque/scene';
import { mat4, vec3 } from 'gl-matrix';
import { AxisGridRenderer } from '../3d/AxisGridRenderer.js';
import { FixedRenderer3d } from '../3d/FixedRenderer3d.js';
import { Starship } from './Starship.js';

/**
 * @param {Game} game 
 */
export async function main(game)
{
    const gl = game.display.getContext('webgl2');
    if (!gl) throw new Error('Sorry, your browser does not support WebGL2!');
    gl.enable(gl.DEPTH_TEST);

    game.inputs.bindAxisButtons('strafe', 'Keyboard', 'KeyA', 'KeyD');

    let renderer = new FixedRenderer3d(gl);
    let camera = new PerspectiveCamera();
    let eye = vec3.fromValues(0, 2, 10);
    mat4.lookAt(camera.viewMatrix, eye, vec3.create(), vec3.fromValues(0, 1, 0));
    
    let starship = new Starship();

    let buildings = [];
    for(let i = MIN_BUILDING_Z; i < MAX_BUILDING_Z; ++i)
    {
        if (Math.random() > 0.3)
        {
            buildings.push(createBuilding(i));
        }
    }

    let clouds = [];
    for(let i = MIN_CLOUD_X; i < MAX_CLOUD_X; ++i)
    {
        if (Math.random() > 0.4)
        {
            clouds.push(createCloud(i));
        }
    }

    game.on('frame', () => {
        camera.resize(gl.canvas.width, gl.canvas.height);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderer.bindCameraMatrix(camera.projectionMatrix, camera.viewMatrix);
        
        starship.update(game);
        starship.render(renderer);

        updateBuildings(buildings);
        renderBuildings(renderer, buildings);

        updateClouds(clouds);
        renderClouds(renderer, clouds);

        renderer.transform.pushTransformMatrix();
        {
            renderer.transform.translate(0, -1, 0);
            renderer.transform.rotateZ(Math.PI);
            renderer.transform.scale(100, 0.1, 100);
            renderer.drawCube();
        }
        renderer.transform.popTransformMatrix();

        // Grid
        /*
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        axisGrid.bindCameraMatrix(camera.projectionMatrix, camera.viewMatrix);
        axisGrid.bindClippingPlane(camera.clippingPlane.near, camera.clippingPlane.far);
        axisGrid.drawAxisGrid();
        gl.disable(gl.BLEND);
        */
    });
}

const MIN_CLOUD_X = -100;
const MAX_CLOUD_X = 100;

function createCloud(x = 0)
{
    return {
        x,
        y: Random.range(10, 20),
        z: Random.range(MIN_BUILDING_Z, MAX_BUILDING_Z),
        w: Random.range(4, 20),
        h: Random.range(0.5, 2),
        speed: Random.range(0.01, 0.02),
    };
}

function updateClouds(clouds)
{
    for(let cloud of clouds)
    {
        cloud.x -= cloud.speed;
        if (cloud.x < MIN_CLOUD_X)
        {
            cloud.x = MAX_CLOUD_X;
        }
    }
}

function renderClouds(renderer, clouds)
{
    for(let cloud of clouds)
    {
        renderer.transform.pushTransformMatrix();
        {
            renderer.transform.translate(cloud.x, cloud.y, cloud.z);
            renderer.transform.scale(cloud.w, cloud.h, cloud.w / 2);
            renderer.drawCube();
        }
        renderer.transform.popTransformMatrix();
    }
}

const MIN_BUILDING_X = 4;
const MAX_BUILDING_X = 10;
const MIN_BUILDING_Z = -500;
const MAX_BUILDING_Z = 10;

function createBuilding(z = 0)
{
    return {
        z: z,
        x: Random.sign() * Random.range(MIN_BUILDING_X, MAX_BUILDING_X),
        w: 2,
        h: Random.range(2, 8)
    };
}

function updateBuildings(buildings)
{
    for(let building of buildings)
    {
        building.z += 0.1;
        if (building.z > MAX_BUILDING_Z)
        {
            building.z = MIN_BUILDING_Z;
        }
    }
}

/**
 * @param {FixedRenderer3d} renderer 
 * @param {*} buildings 
 */
function renderBuildings(renderer, buildings)
{
    for(let building of buildings)
    {
        renderer.transform.pushTransformMatrix();
        {
            let mat = renderer.transform.getTransformMatrix();
            mat4.rotateX(mat, mat, building.z * 0.0005);
            renderer.transform.translate(building.x, building.h / 2, building.z);
            renderer.transform.scale(1, building.h, building.w);
            renderer.drawCube();
        }
        renderer.transform.popTransformMatrix();
    }
}

function renderStarfield()
{

}