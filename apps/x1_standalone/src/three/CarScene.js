import { BoxGeometry, DirectionalLight, Mesh, MeshLambertMaterial, Scene } from 'three';

/** @scene geometry */
export const gBox = new BoxGeometry();

/** @scene material */
export const mLambert = new MeshLambertMaterial();

/** @scene object */
export const light = new DirectionalLight();

/** @scene root */
export const scene = new Scene();
scene.add(light);
scene.add(new Mesh(gBox, mLambert));
