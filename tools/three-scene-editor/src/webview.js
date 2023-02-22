import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// @ts-ignore
const vscode = acquireVsCodeApi();

function updateFromWebview(jsonString) {
    vscode.postMessage({
        type: 'updateFromWebview',
        value: jsonString,
    });
}

function alert(message) {
    vscode.postMessage({ type: 'alert', value: typeof message === 'string' ? message : JSON.stringify(message) });
}
function info(message) {
    vscode.postMessage({ type: 'info', value: typeof message === 'string' ? message : JSON.stringify(message) });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        main();
    } catch (e) {
        alert(JSON.stringify(e));
    }
});

class ThreeApplication {

    constructor() {
        this.canvas = document.querySelector('canvas');
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.controller = new OrbitControls(this.camera, this.canvas);
        this.controller.update();

        this.world = new ThreeJSONWorld(this.scene);

        //this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        //this.scene.add(this.mesh);

        // let loader = new THREE.ObjectLoader();
        // loader.parseAsync(jsonData).then(value => this.scene.add(value));

        this.resizeTimeout = null;

        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onInterval = this.onInterval.bind(this);

        this.prevTime = 0;
        this.currentTime = 0;
        this.deltaTime = 0;

        window.requestAnimationFrame(this.onAnimationFrame);
        window.addEventListener('resize', this.onResize);
        window.setInterval(this.onInterval, 3_000);
        this.onResize();
    }

    onInterval() {
        let string = this.world.stringify();
        updateFromWebview(string);
    }

    onAnimationFrame(now) {
        this.prevTime = this.currentTime;
        this.currentTime = now;
        this.deltaTime = this.currentTime - this.prevTime;
        window.requestAnimationFrame(this.onAnimationFrame);

        this.controller.update();

        let dt = this.deltaTime / 60;
        // this.mesh.rotation.x += 0.1 * dt;
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.resizeTimeout = null;
            let rect = document.body.getBoundingClientRect();
            let w = rect.width;
            let h = rect.height;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }, 100);
    }

    async updateFromDocument(text) {
        info('DOC');
        let json;
        try {
            json = JSON.parse(text);
        } catch {
            alert('Failed to parse json.');
            return;
        }
        this.scene.clear();
        let loader = new THREE.ObjectLoader();
        let result = await loader.parseAsync(json);
        this.scene.add(result);
    }
}

async function main() {
    const app = new ThreeApplication();

    window.addEventListener('message', (e) => {
        const message = e.data;
        switch (message.type) {
            case 'updateFromDocument':
                const text = message.value;
                app.updateFromDocument(text);
                vscode.setState({ text });
                return;
        }
    });

    const state = vscode.getState();
    if (state) {
        app.updateFromDocument(state.text);
    }
}

class ThreeJSONWorld {

    constructor() {
        this.scene = new THREE.Scene();

        this.geometryUUIDToId = {};
    }

    syncFrom(text) {
        let json;
        try {
            json = JSON.parse(text);
        } catch {
            throw new Error('Invalid json.');
        }
        if (!json || typeof json !== 'object') {
            throw new Error('Must be a non-empty object json.');
        }
        for(let object of json.object) {
            let uuid = object.uuid;
        }
        // TODO: Sync this properly
        for(let geometry of json.geometries) {
            let id = this.geometryUUIDToId[geometry.uuid];
            if (!id) {

            }
            this.scene.getObjectById(geometry.uuid);
        }
    }

    jsonify() {
        return this.scene.toJSON();
    }

    stringify() {
        let json = this.jsonify();
        return JSON.stringify(json, null, 2);
    }
}
