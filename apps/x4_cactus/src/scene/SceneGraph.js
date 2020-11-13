const MAX_DEPTH_LEVEL = 100;

/**
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
 * the current node's children. If a function, it will be called after
 * traversing down all of its children.
 * 
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 * 
 * @callback WalkChildrenCallback Called for each level of children, before
 * traversing its children. This is usually used to determine visit order.
 * @param {Array<SceneNode>} childNodes A mutable list of child nodes to be
 * visited.
 * @param {SceneNode} childNode The representative node for the current object.
 * This is also the parent of these children.
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
     */
    constructor(opts = {})
    {
        this.nodeConstructor = opts.nodeConstructor || SceneNode;
        this.nodes = new Map();

        this.rootNodes = [];
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
        if (child === null) throw new Error(`Cannot add null as child to scene graph.`);
        if (parent === null || this.nodes.has(parent))
        {
            let parentNode = parent === null ? null : this.nodes.get(parent);
            if (this.nodes.has(child))
            {
                let childNode = this.nodes.get(child);
                detach(childNode.parentNode, childNode, this);
                attach(parentNode, childNode, this);
                return childNode;
            }
            else
            {
                let childNode = new (this.nodeConstructor)(this, child, null, []);
                this.nodes.set(child, childNode);
                attach(parentNode, childNode, this);
                return childNode;
            }
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
        if (child === null)
        {
            this.clear();
            return true;
        }
        else if (this.nodes.has(child))
        {
            let childNode = this.nodes.get(child);
            let parentNode = childNode.parentNode;
            detach(parentNode, childNode, this);
            walkImpl(this, childNode, 0, descendent => {
                this.nodes.delete(descendent);
            });
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
     * @param {Object} target The target object to replace. Cannot be null.
     * @param {Object} child The object to replace with. If null,
     * it will remove the target and the target's parent will adopt
     * its grandchildren.
     */
    replace(target, child)
    {
        if (target === null) throw new Error('Cannot replace null for child in scene graph.');
        if (this.nodes.has(target))
        {
            let targetNode = this.nodes.get(target);
            let targetParent = targetNode.parentNode;
            let targetChildren = [...targetNode.childNodes];

            // Remove target node from the graph
            detach(targetParent, targetNode, this);

            // Begin grafting the grandchildren by first removing...
            targetNode.childNodes.length = 0;

            if (child === null)
            {
                // Reattach all grandchildren to target parent.
                if (targetParent === null)
                {
                    // As root children.
                    this.rootNodes.push(...targetChildren);
                }
                else
                {
                    // As regular children.
                    targetParent.childNodes.push(...targetChildren);
                }
            }
            else
            {
                // Reattach all grandchildren to new child.
                let childNode;
                if (this.nodes.has(child))
                {
                    childNode = this.nodes.get(child);

                    // Remove child node from prev parent
                    detach(childNode.parentNode, childNode, this);

                    // ...and graft them back.
                    childNode.childNodes.push(...targetChildren);
                }
                else
                {
                    childNode = new (this.nodeConstructor)(this, child, null, targetChildren);
                    this.nodes.set(child, childNode);
                }

                // And reattach target parent to new child.
                attach(targetParent, childNode, this);
            }
            
            // ...and graft them back.
            for(let targetChild of targetChildren)
            {
                targetChild.parentNode = targetParent;
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
        this.rootNodes.length = 0;
    }

    /**
     * Gets the scene node for the given object.
     * 
     * @param {Object} child The object to retrieve the node for.
     * @returns {SceneNode} The scene node that represents the object.
     */
    get(child)
    {
        return this.nodes.get(child);
    }

    /**
     * Walks through every child node in the graph for the given
     * object's associated node.
     * 
     * @param {WalkCallback} callback The function called for each node
     * in the graph, in ordered traversal from parent to child.
     * @param {Object} [opts={}] Any additional options.
     * @param {Boolean} [opts.childrenOnly=true] Whether to skip traversing
     * the first node, usually the root, and start from its children instead.
     * @param {Function} [opts.childrenCallback] The function called before
     * walking through the children. This is usually used to determine the
     * visiting order.
     */
    walk(from, callback, opts = {})
    {
        const { childrenOnly = true, childrenCallback } = opts;
        if (from === null)
        {
            sortChildrenForWalk(this.nodes, this.rootNodes, null, childrenCallback);
            for(let childNode of this.rootNodes)
            {
                walkImpl(this, childNode, 0, callback, childrenCallback);
            }
        }
        else
        {
            const fromNode = this.get(from);
            if (!fromNode)
            {
                if (childrenOnly)
                {
                    sortChildrenForWalk(this.nodes, fromNode.childNodes, fromNode, childrenCallback);
                    for(let childNode of fromNode.childNodes)
                    {
                        walkImpl(this, childNode, 0, callback, childrenCallback);
                    }
                }
                else
                {
                    walkImpl(this, fromNode, 0, callback, childrenCallback);
                }
            }
            else
            {
                throw new Error(`No node in scene graph exists for walk start.`);
            }
        }
    }
}

function attach(parentNode, childNode, sceneGraph)
{
    if (parentNode === null)
    {
        sceneGraph.rootNodes.push(childNode);
        childNode.parentNode = null;
    }
    else
    {
        parentNode.childNodes.push(childNode);
        childNode.parentNode = parentNode;
    }
}

function detach(parentNode, childNode, sceneGraph)
{
    if (parentNode === null)
    {
        let index = sceneGraph.rootNodes.indexOf(childNode);
        sceneGraph.rootNodes.splice(index, 1);
        childNode.parentNode = undefined;
    }
    else
    {
        let index = parentNode.childNodes.indexOf(childNode);
        parentNode.childNodes.splice(index, 1);
        childNode.parentNode = undefined;
    }
}

/**
 * Walk down from the parent and through all its descendents.
 * 
 * @param {SceneNode} parentNode The parent node to start walking from.
 * @param {Number} level The current call depth level. This is used to limit the call stack.
 * @param {WalkCallback} nodeCallback The function called on each visited node.
 * @param {WalkChildrenCallback} [childrenCallback] The function called before
 * walking through the children. This is usually used to determine the visiting order.
 */
function walkImpl(sceneGraph, parentNode, level, nodeCallback, childrenCallback = undefined)
{
    if (level >= MAX_DEPTH_LEVEL) return;

    let result = nodeCallback(parentNode.owner, parentNode);
    if (result === false) return;

    let nextNodes = parentNode.childNodes;
    sortChildrenForWalk(sceneGraph.nodes, nextNodes, parentNode, childrenCallback);

    for(let childNode of nextNodes)
    {
        walkImpl(childNode, level + 1, nodeCallback);
    }

    if (typeof result === 'function')
    {
        result(parentNode.owner, parentNode);
    }
}

function sortChildrenForWalk(nodeMapping, childNodes, parentNode, childrenCallback = null)
{
    if (!childrenCallback) return;
    let nextChildren = childNodes.map(node => node.owner);
    childrenCallback(nextChildren, parentNode);
    for(let i = 0; i < nextChildren.length; ++i)
    {
        childNodes[i] = nodeMapping.get(nextChildren[i]);
    }
    childNodes.length = nextChildren.length;
}

/**
 * A representative node to keep relational metadata for any object in
 * the {@link SceneGraph}.
 */
export class SceneNode
{
    /**
     * Constructs a scene node with the given parent and children. This assumes
     * the given parent and children satisfy the correctness constraints of the
     * graph. In other words, This does not validate nor modify other nodes,
     * such as its parent or children, to maintain correctness. That must be
     * handled externally.
     * 
     * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
     * @param {Object} owner The owner object.
     * @param {SceneNode} parentNode The parent node.
     * @param {Array<SceneNode>} childNodes The list of child nodes.
     */
    constructor(sceneGraph, owner, parentNode, childNodes)
    {
        this.sceneGraph = sceneGraph;
        this.owner = owner;

        this.parentNode = parentNode;
        this.childNodes = childNodes;
    }
}
