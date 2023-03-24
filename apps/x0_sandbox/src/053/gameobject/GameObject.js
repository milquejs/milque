export class GameObject {
    constructor(name, components, systems) {
        this.name = name;
        this.components = components;
        this.systems = systems;
    }

    instantiate(ents, count = 1) {
        for(let i = 0; i < count; ++i) {
            let e = ents.create();
            for(let system of this.systems) {
                ents.attach(e, system);
            }
        }
    }

    destroy(ents, target) {
    }

    findAll(ents) {
    }

    findAny(ents) {
    }
}
