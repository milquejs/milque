const MAX_DEPTH_LEVEL = 100;

/**
 * @typedef {Number} SceneNode
 * 
 * @typedef SceneNodeInfo
 * @property {SceneNode} parent The parent node. If the node does not have a parent,
 * it will be 0.
 * @property {Array<SceneNode>} children The list of child nodes.
 * 
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
 * the current node's children and all of its descendents. If a function,
 * it will be called after traversing down all of its children.
 * 
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * 
 * @callback WalkChildrenCallback Called for each level of children, before
 * traversing them. This is usually used to determine visit order.
 * @param {Array<SceneNode>} childNodes A list of child nodes to be visited.
 * @param {SceneNode} parentNode The current parent node of these children.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {Array<SceneNode>} The list of children to traverse for this parent.
 */

/**
 * A tree-like graph of nodes with n-children.
 */
export class SceneGraph
{
    /**
     * Constructs an empty scene graph.
     */
    constructor()
    {
        this.nodes = {};
        this.roots = [];

        this._nextAvailableSceneNodeId = 1;
    }

    /**
     * Creates a scene node in the scene graph.
     * 
     * @param {SceneNode} [parentNode] The parent node for the created scene
     * node.
     * @returns {SceneNode} The created scene node.
     */
    createSceneNode(parentNode = undefined)
    {
        let sceneNode = this._nextAvailableSceneNodeId++;
        let info = createSceneNodeInfo();
        this.nodes[sceneNode] = info;
        attach(parentNode, sceneNode, this);
        return sceneNode;
    }

    /**
     * Creates multiple scene nodes in the scene graph.
     * 
     * @param {Number} count The number of scene nodes to create.
     * @param {SceneNode} [parentNode] The parent node for the created scene
     * nodes.
     * @returns {Array<SceneNode>} A list of created scene nodes.
     */
    createSceneNodes(count, parentNode = undefined)
    {
        let result = [];
        for(let i = 0; i < count; ++i)
        {
            result.push(this.createSceneNode(parentNode));
        }
        return result;
    }

    /**
     * Deletes a scene node from the scene graph, along with all
     * of its descendents.
     * 
     * @param {SceneNode} sceneNode The scene node to remove.
     */
    deleteSceneNode(sceneNode)
    {
        if (sceneNode in this.nodes)
        {
            let info = this.nodes[sceneNode];
            detach(info.parent, sceneNode, this);
            walkImpl(this, sceneNode, 0, walkDeleteCallback);
        }
        else
        {
            throw new Error('Cannot delete non-existant scene node for scene graph.');
        }
    }

    /**
     * Deletes all given scene nodes from the scene graph, along with all
     * of their descendents.
     * 
     * @param {Array<SceneNode>} sceneNodes A list of scene nodes to remove.
     */
    deleteSceneNodes(sceneNodes)
    {
        for(let sceneNode of sceneNodes)
        {
            this.deleteSceneNode(sceneNode);
        }
    }

    /**
     * Get the scene node's info.
     * 
     * @param {SceneNode} sceneNode The scene node to get info for.
     * @returns {SceneNodeInfo} The info for the given scene node.
     */
    getSceneNodeInfo(sceneNode)
    {
        return this.nodes[sceneNode];
    }

    /**
     * Changes the parent of the scene node with the new parent node in
     * the graph.
     * 
     * @param {SceneNode} sceneNode The target scene node to change.
     * @param {SceneNode} parentNode The scene node to set as the parent.
     */
    parentSceneNode(sceneNode, parentNode)
    {
        let info = this.nodes[sceneNode];
        detach(info.parent, sceneNode, this);
        attach(parentNode, sceneNode, this);
    }

    /**
     * Replaces the scene node with the new replacement node in the graph,
     * inheriting its parent and children.
     * 
     * @param {SceneNode} sceneNode The target scene node to replace.
     * @param {SceneNode} replacementNode The scene node to replace with. If falsey,
     * it will remove the target scene node and the target's parent will adopt
     * its grandchildren. If the target did not have parents, the grandchildren will
     * become root nodes in the graph.
     */
    replaceSceneNode(sceneNode, replacementNode)
    {
        let info = this.nodes[sceneNode];
        let parentNode = info.parent;
        let grandChildren = info.children.slice();

        // Remove the target node from graph
        detach(parentNode, sceneNode, this);

        // Begin grafting the grandchildren by removing them...
        info.children.length = 0;

        if (replacementNode)
        {
            // Reattach all grandchildren to new replacement node.
            let replacementInfo = this.nodes[replacementNode];
            let replacementParent = replacementInfo.parent;

            // Remove replacement node from previous parent
            detach(replacementParent, replacementNode, this);

            // ...and graft them back.
            replacementInfo.children.push(...grandChildren);

            // And reattach target parent to new child.
            attach(parentNode, replacementNode, this);
        }
        else
        {
            // Reattach all grandchildren to target parent...
            if (parentNode)
            {
                //...as regular children.
                let parentInfo = this.nodes[parentNode];
                parentInfo.children.push(...grandChildren);
            }
            else
            {
                //...as root children.
                this.roots.push(...grandChildren);
            }
        }

        // ...and repair their parent relations.
        for(let childNode of grandChildren)
        {
            this.nodes[childNode].parent = parentNode;
        }
    }

    /**
     * Walks through every child node in the graph.
     * 
     * @param {WalkCallback} callback The function called for each node
     * in the graph, in ordered traversal from parent to child.
     * @param {Object} [opts={}] Any additional options.
     * @param {SceneNode|Array<SceneNode>} [opts.from] The parent node to
     * start walking from, inclusive. By default, it will start from the root
     * nodes.
     * @param {WalkChildrenCallback} [opts.childfilter] The function called before
     * walking through the children. This is usually used to determine the
     * visiting order.
     */
    walk(callback, opts = {})
    {
        const { from = undefined, childFilter = undefined } = opts;

        let fromNodes;
        if (!from) fromNodes = this.roots;
        else if (!Array.isArray(from)) fromNodes = [from];
        else fromNodes = from;

        if (childFilter) fromNodes = childFilter(fromNodes, 0, this);
        for(let fromNode of fromNodes)
        {
            walkImpl(this, fromNode, 0, callback, childFilter);
        }
    }
}

/**
 * @param {SceneNode} key The scene node handle.
 * @returns {SceneNodeInfo} The scene node metadata.
 */
function createSceneNodeInfo()
{
    return {
        parent: 0,
        children: [],
    };
}

/**
 * Attaches a child node to a parent in the scene graph. If parentNode is
 * null, then it will attach as a root node.
 * 
 * @param {SceneNode} parentNode The parent node to attach to. Can be null.
 * @param {SceneNode} childNode The child node to attach from.
 * @param {SceneGraph} sceneGraph The scene graph to attach in.
 */
function attach(parentNode, childNode, sceneGraph)
{
    if (parentNode)
    {
        // Has new parent; attach to parent. It is now in the graph.
        sceneGraph.nodes[parentNode].children.push(childNode);
        sceneGraph.nodes[childNode].parent = parentNode;
    }
    else
    {
        // No parent; move to root. It is now in the graph.
        sceneGraph.roots.push(childNode);
        sceneGraph.nodes[childNode].parent = 0;
    }
}

/**
 * Detaches a child node from its parent in the scene graph. If parentNode is
 * null, then it will detach as a root node.
 * 
 * @param {SceneNode} parentNode The parent node to attach to. Can be null.
 * @param {SceneNode} childNode The child node to attach from.
 * @param {SceneGraph} sceneGraph The scene graph to attach in.
 */
function detach(parentNode, childNode, sceneGraph)
{
    if (parentNode)
    {
        // Has parent; detach from parent. It is now a free node.
        let children = sceneGraph.nodes[parentNode].children;
        let childIndex = children.indexOf(childNode);
        children.splice(childIndex, 1);
        sceneGraph.nodes[childNode].parentNode = 0;
    }
    else
    {
        // No parent; remove from root. It is now a free node.
        let roots = sceneGraph.roots;
        let rootIndex = roots.indexOf(childNode);
        roots.splice(rootIndex, 1);
        sceneGraph.nodes[childNode].parentNode = 0;
    }
}

/**
 * Walk down from the parent and through all its descendents.
 * 
 * @param {SceneGraph} sceneGraph The scene graph containing the nodes to be visited.
 * @param {SceneNode} parentNode The parent node to start walking from.
 * @param {Number} level The current call depth level. This is used to limit the call stack.
 * @param {WalkCallback} nodeCallback The function called on each visited node.
 * @param {WalkChildrenCallback} [filterCallback] The function called before
 * walking through the children. This is usually used to determine the visiting order.
 */
function walkImpl(sceneGraph, parentNode, level, nodeCallback, filterCallback = undefined)
{
    if (level >= MAX_DEPTH_LEVEL) return;

    let result = nodeCallback(parentNode, sceneGraph);
    if (result === false) return;

    let parentInfo = sceneGraph.nodes[parentNode];
    let nextNodes = filterCallback
        ? filterCallback(parentInfo.children, parentNode, sceneGraph)
        : parentInfo.children;
    
    for(let childNode of nextNodes)
    {
        walkImpl(sceneGraph, childNode, level + 1, nodeCallback, filterCallback);
    }

    if (typeof result === 'function')
    {
        result(parentNode, sceneGraph);
    }
}

function walkDeleteCallback(sceneNode, sceneGraph)
{
    delete sceneGraph.nodes[sceneNode];
}

