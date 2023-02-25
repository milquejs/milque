import { AnimationClip, BoxGeometry, BufferGeometry, Material, Mesh, MeshBasicMaterial, ObjectLoader, Scene } from 'three';

export class ThreeWorld {
    constructor() {
        this.scene = new Scene();

        this.meshes = [];

        /** @type {Record<string, BufferGeometry>} */
        this.geometries = {};
        /** @type {Record<string, Material>} */
        this.materials = {};
        /** @type {Record<string, AnimationClip>} */
        this.animations = {};
    }

    createCube() {
        let g = new BoxGeometry(1, 1, 1);
        this.geometries[g.uuid] = g;
        let m = new MeshBasicMaterial({ color: 0x00ff00 });
        this.materials[m.uuid] = m;

        let mesh = new Mesh(g, m);
        this.meshes.push(mesh);

        this.scene.add(mesh);
        return mesh;
    }

    applyChanges() {

    }

    async syncFrom(text) {
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid json - ${e}`);
        }
        let loader = new ObjectLoader();
        let object = await loader.parseAsync(json);
        /*
        if (!this.scene) {
            this.geometries = loader.parseGeometries(json.geometries);
            this.materials = loader.parseMaterials(json.materials);
            this.animations = loader.parseAnimations(json.animations);
        }
        /** @type {Scene} */
        //let object = loader.parseObject(json.object,
        //    /** @type {any} */ (this.geometries),
        //    /** @type {any} */ (this.materials),
        //    /** @type {any} */ (this.animations));
        this.scene = object;
    }
    
    stringify() {
        let json = this.scene.toJSON();
        let text = JSON.stringify(json, null, 2);
        return text;
    }
}
