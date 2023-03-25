export class GameObject {
    constructor(name, components, systems) {
        this.name = name;
        this.components = components;
        this.systems = systems;
    }

    instantiate(ents, count = 1) {
        for(let i = 0; i < count; ++i) {
            let e = ents.create();
            for(let component of this.components) {
                ents.attach(e, component);
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
