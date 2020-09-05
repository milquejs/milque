const MAX_DEPTH_LEVEL = 100;

/**
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {Object} object The current object.
 * @param {SceneNode} node The representative node for the current object.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
 * the current node's children. If a function, it will be called after
 * traversing down all of its children.
 * 
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {Object} object The current object.
 * @param {SceneNode} node The representative node for the current object.
 */

/**
 * A tree-like graph of nodes with n-children.
 */
export class SceneGraph
{
    /**
     * Constructs an empty scene graph with nodes to be created from the given constructor.
     * 
     * @param {Object} [opts] Any additional options.
     * @param {typeof SceneNode} [opts.nodeConstructor] The scene node constructor that make up the graph.
     * @param {Object} [opts.root] The root owner, otherwise it is an empty object.
     */
    constructor(opts = {})
    {
        this.nodeConstructor = opts.nodeConstructor || SceneNode;
        this.nodes = new Map();
        
        const rootOwner = opts.root || {};
        this.root = new (this.nodeConstructor)(this, rootOwner, null, []);
        this.nodes.set(rootOwner, this.root);
    }

    /**
     * Adds an object to the scene graph.
     * 
     * @param {Object} child The child object to add.
     * @param {Object} [parent=null] The parent object to add the child under. If null,
     * the child will be inserted under the root node.
     * @returns {SceneNode} The scene node that represents the added child object.
     */
    add(child, parent = null)
    {
        if (this.nodes.has(parent))
        {
            let parentNode = this.nodes.get(parent);
            if (this.nodes.has(child))
            {
                let childNode = this.nodes.get(child);
                detach(childNode.parent, childNode);
                attach(parentNode, childNode);
                return childNode;
            }
            else
            {
                let childNode = new (this.nodeConstructor)(this, child, null, []);
                this.nodes.set(child, childNode);
                attach(parentNode, childNode);
                return childNode;
            }
        }
        else if (parent === null)
        {
            return this.add(child, this.root.owner);
        }
        else
        {
            throw new Error(`No node in scene graph exists for parent.`);
        }
    }

    /**
     * Removes an object from the scene graph, along with all
     * of its descendents.
     * 
     * @param {Object} child The child object to remove. If null, will clear
     * the entire graph.
     * @returns {Boolean} Whether any objects were removed from the scene.
     */
    remove(child)
    {
        if (this.nodes.has(child))
        {
            let childNode = this.nodes.get(child);
            let parentNode = childNode.parent;
            detach(parentNode, childNode);
            this.nodeConstructor.walk(childNode, 0, descendent => {
                this.nodes.delete(descendent);
            });
            return true;
        }
        else if (child === null)
        {
            this.clear();
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Replaces the target object with the new child object in the graph,
     * inheriting its parent and children.
     * 
     * @param {Object} target The target object to replace. If null,
     * it will replace the root node.
     * @param {Object} child The object to replace with. If null,
     * it will remove the target and the target's parent will adopt
     * its grandchildren.
     */
    replace(target, child)
    {
        if (this.nodes.has(target))
        {
            let targetNode = this.nodes.get(target);
            let targetParent = targetNode.parent;
            let targetChildren = [...targetNode.children];

            // Remove target node from the graph
            detach(targetParent, targetNode);

            // Begin grafting the grandchildren by first removing...
            targetNode.children.length = 0;

            if (child === null)
            {
                // Reattach all grandchildren to target parent.
                targetParent.children.push(...targetChildren);
            }
            else
            {
                // Reattach all grandchildren to new child.
                let childNode;
                if (this.nodes.has(child))
                {
                    childNode = this.nodes.get(child);

                    // Remove child node from prev parent
                    detach(childNode.parent, childNode);

                    // ...and graft them back.
                    childNode.children.push(...targetChildren);
                }
                else
                {
                    childNode = new (this.nodeConstructor)(this, child, null, targetChildren);
                    this.nodes.set(child, childNode);
                }

                // And reattach target parent to new child.
                attach(targetParent, childNode);
            }
            
            // ...and graft them back.
            for(let targetChild of targetChildren)
            {
                targetChild.parent = targetParent;
            }

            return child;
        }
        else if (target === null)
        {
            return this.replace(this.root.owner, child);
        }
        else
        {
            throw new Error('Cannot find target object to replace in scene graph.');
        }
    }

    /** Removes all nodes from the graph. */
    clear()
    {
        this.nodes.clear();

        // Reset the graph.
        const rootOwner = {};
        this.root = new (this.nodeConstructor)(this, rootOwner, null, []);
        this.nodes.set(rootOwner, this.root);
    }

    /**
     * Gets the scene node for the given object.
     * 
     * @param {Object} owner The object to retreive the node for.
     * @returns {SceneNode} The scene node that represents the object.
     */
    get(child)
    {
        if (child === null)
        {
            return this.root;
        }
        else
        {
            return this.nodes.get(child);
        }
    }

    /**
     * Walks through every node in the graph starting from the root and
     * down to its children.
     * 
     * @param {WalkCallback} callback The function called for each node
     * in the graph, in ordered traversal from parent to child.
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.skipRoot] Whether to skip traversing the root
     * and start from its children instead.
     */
    forEach(callback, opts = {})
    {
        if (opts.skipRoot)
        {
            for(let childNode of this.root.children)
            {
                this.nodeConstructor.walk(childNode, 1, callback);
            }
        }
        else
        {
            this.nodeConstructor.walk(this.root, 0, callback);
        }
    }
}

function attach(parentNode, childNode)
{
    parentNode.children.push(childNode);
    childNode.parent = parentNode;
}

function detach(parentNode, childNode)
{
    let index = parentNode.children.indexOf(childNode);
    parentNode.children.splice(index, 1);
    childNode.parent = null;
}

/**
 * A representative node to keep relational metadata for any object in
 * the {@link SceneGraph}.
 */
export class SceneNode
{
    /**
     * Walk down from the parent and through all its descendents.
     * 
     * @param {SceneNode} parentNode The parent node to start walking from.
     * @param {Number} level The current call depth level. This is used to limit the call stack.
     * @param {WalkCallback} callback The function called on each visited node.
     */
    static walk(parentNode, level, callback)
    {
        if (level >= MAX_DEPTH_LEVEL) return;

        let result = callback(parentNode.owner, parentNode);
        if (result === false) return;

        for(let childNode of parentNode.children)
        {
            this.walk(childNode, level + 1, callback);
        }

        if (typeof result === 'function')
        {
            result(parentNode.owner, parentNode);
        }
    }

    /**
     * Constructs a scene node with the given parent and children. This assumes
     * the given parent and children satisfy the correctness constraints of the
     * graph. In other words, This does not validate nor modify other nodes,
     * such as its parent or children, to maintain correctness. That must be
     * handled externally.
     * 
     * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
     * @param {Object} owner The owner object.
     * @param {SceneNode} parent The parent node.
     * @param {Array<SceneNode>} children The list of child nodes.
     */
    constructor(sceneGraph, owner, parent, children)
    {
        this.sceneGraph = sceneGraph;
        this.owner = owner;

        this.parent = parent;
        this.children = children;
    }
}
