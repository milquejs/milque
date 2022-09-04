export class SceneNode {
    constructor() {
        this.parent = null;
        this.children = [];
    }
    
    setParent(sceneNode) {
        let prev = this.parent;
        if (prev) {
            let i = prev.children.indexOf(this);
            if (i >= 0) {
                prev.children.splice(i, 1);
            }
        }
        this.parent = sceneNode;
        sceneNode.children.push(this);
        return this;
    }

    clear() {
        for(let child of this.children) {
            child.parent = null;
        }
        this.children.length = 0;
    }
}
