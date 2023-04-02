export class ObjectInstance {
    /**
     * @param {string} name 
     * @param {import('./ObjectDef').ObjectDef} def
     */
    static fromDef(name, def) {
        let result = new ObjectInstance(name);
        result.visible = def.initial.visible;
        result.x = def.initial.offsetX;
        result.y = def.initial.offsetY;
        result.scaleX = def.initial.scaleX;
        result.scaleY = def.initial.scaleY;
        result.rotation = def.initial.rotation;
        return result;
    }

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.objectName = name;
        this.parentName = null;

        this.entityId = 0;
        this.parentId = 0;
        this.childIds = [];

        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        
        this.visible = true;
    }
}
