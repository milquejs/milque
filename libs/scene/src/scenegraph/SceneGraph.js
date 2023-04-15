const MAX_DEPTH_LEVEL = 100;

/**
 * @typedef {number} SceneNode
 *
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {SceneNode} sceneNode The current scene node.
 * @param {SceneGraph} sceneGraph The current scene graph.
 * @returns {WalkBackCallback|boolean|void} If false, the walk will skip
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
 * @typedef {ReturnType<create>} SceneGraph
 */

export function create() {
    return {
        /** @type {Array<SceneNode>} */
        roots: [],
        /** @type {Record<string, SceneNode>} */
        parents: {},
        /** @type {Record<string, Array<SceneNode>>} */
        children: {},
    };
}

/**
 * @param {SceneGraph} a 
 */
export function clone(a) {
    return {
        roots: a.roots.slice(),
        parents: {
            ...a.parents,
        },
        children: Object.fromEntries(Object.entries(a.children)
            .map(([k, v]) => [k, v.slice()])),
    };
}

/**
 * @param {SceneGraph} out 
 * @param {SceneNode} node 
 * @param {SceneNode} parentNode 
 */
export function add(out, node, parentNode = 0) {
    attach(out, node, parentNode);
}

/**
 * @param {SceneGraph} graph 
 * @param {SceneNode} node 
 */
export function has(graph, node) {
    return node in graph.parents;
}

/**
 * @param {SceneGraph} out 
 * @param {SceneNode} childNode 
 * @param {SceneNode} parentNode 
 */
export function parent(out, childNode, parentNode) {
    detach(out, childNode, getParent(out, childNode));
    attach(out, childNode, parentNode);
}

/**
 * @param {SceneGraph} out 
 * @param {SceneNode} targetNode 
 */
export function prune(out, targetNode) {
    if (!(targetNode in out.parents)) {
        throw new Error('Cannot delete non-existant scene node for scene graph.');
    }
    let parentNode = getParent(out, targetNode);
    detach(out, targetNode, parentNode);
    walkImpl(out, targetNode, 0, walkDeleteCallback);
}

/**
 * @param {SceneGraph} out 
 * @param {SceneNode} targetNode 
 * @param {SceneNode} replacementNode 
 */
export function replace(out, targetNode, replacementNode) {
    let parentNode = getParent(out, targetNode);
    let grandChildren = getChildren(out, targetNode).slice();

    // Remove the target node from graph
    detach(out, targetNode, parentNode);

    // Begin grafting the grandchildren by removing them...
    clearChildren(out, targetNode);

    if (replacementNode) {
      // Reattach all grandchildren to new replacement node.
      let replacementParentId = getParent(out, replacementNode);
      let replacementChildren = getChildren(out, replacementNode);

      // Remove replacement node from previous parent
      detach(this, replacementNode, replacementParentId);

      // ...and graft them back.
      replacementChildren.push(...grandChildren);

      // And reattach target parent to new child.
      attach(this, replacementNode, parentNode);
    } else {
      // Reattach all grandchildren to target parent...
      if (parentNode) {
        //...as regular children.
        let parentChildren = getChildren(out, parentNode);
        parentChildren.push(...grandChildren);
      } else {
        //...as root children.
        getRoots(out).push(...grandChildren);
      }
    }

    // ...and repair their parent relations.
    for (let childNode of grandChildren) {
        setParent(out, childNode, parentNode);
    }
}

/**
 * Walks through every child node in the graph.
 *
 * @param {WalkCallback} callback The function called for each node
 * in the graph, in ordered traversal from parent to child.
 * @param {object} [opts] Any additional options.
 * @param {SceneNode|Array<SceneNode>} [opts.from] The parent node to
 * start walking from, inclusive. By default, it will start from the root
 * nodes.
 * @param {WalkChildrenCallback} [opts.childFilter] The function called before
 * walking through the children. This is usually used to determine the
 * visiting order.
 */
export function walk(graph, callback, opts = undefined) {
    const { from = undefined, childFilter = undefined } = opts || {};

    let fromNodes;
    if (!from) fromNodes = getRoots(graph);
    else if (!Array.isArray(from)) fromNodes = [from];
    else fromNodes = from;

    if (childFilter) fromNodes = childFilter(fromNodes, 0, this);
    for (let fromNode of fromNodes) {
        walkImpl(graph, fromNode, 0, callback, childFilter);
    }
}

/**
 * @param {SceneGraph} graph
 */
export function getRoots(graph) {
    return graph.roots;
}

/**
 * @param {SceneGraph} graph 
 * @param {SceneNode} node
 */
export function getParent(graph, node) {
    return graph.parents[node];
}

/**
 * @param {SceneGraph} graph 
 * @param {SceneNode} node 
 * @param {SceneNode} parentNode 
 */
function setParent(graph, node, parentNode) {
    graph.parents[node] = parentNode;
}

/**
 * @param {SceneGraph} graph
 * @param {SceneNode} node
 */
export function getChildren(graph, node) {
    if (node in graph.children) {
        return graph.children[node];
    } else {
        let result = [];
        graph.children[node] = result;
        return result;
    }
}

/**
 * @param {SceneGraph} out 
 * @param {SceneNode} node
 */
function clearChildren(out, node) {
    if (node in out) {
        out.children[node].length = 0;
        delete out.children[node];
    }
}

/**
 * Attaches a child node to a parent in the scene graph.
 * If no parentNode, then it will attach as a root node.
 *
 * @param {SceneGraph} out The scene graph to attach in.
 * @param {number} childNode The child node to attach from.
 * @param {number} parentNode The parent node to attach to. Can be 0 for null.
 */
function attach(out, childNode, parentNode) {
    if (parentNode) {
        // Has new parent; attach to parent. It is now in the graph.
        getChildren(out, parentNode).push(childNode);
        setParent(out, childNode, parentNode);
    } else {
        // No parent; move to root. It is now in the graph.
        getRoots(out).push(childNode);
        setParent(out, childNode, 0);
    }
}

/**
 * Detaches a child node from its parent in the scene graph.
 * If has no parentNode, then it will detach as a root node.
 *
 * @param {SceneGraph} out The scene graph attached to.
 * @param {number} childNode The child node to detach.
 * @param {number} parentNode The parent node attached to. Could be 0 for none.
 */
function detach(out, childNode, parentNode) {
    if (parentNode) {
        // Has parent; detach from parent. It is now a free node.
        let children = getChildren(out, parentNode);
        let childIndex = children.indexOf(childNode);
        children.splice(childIndex, 1);
    } else {
        // No parent; remove from root. It is now a free node.
        let roots = getRoots(out);
        let rootIndex = roots.indexOf(childNode);
        roots.splice(rootIndex, 1);
    }
    setParent(out, childNode, 0);
}

/**
 * Walk down from the parent and through all its descendents.
 *
 * @param {SceneGraph} graph The scene graph containing the nodes to be visited.
 * @param {SceneNode} parentNode The parent node to start walking from.
 * @param {number} level The current call depth level. This is used to limit the call stack.
 * @param {WalkCallback} nodeCallback The function called on each visited node.
 * @param {WalkChildrenCallback} [filterCallback] The function called before
 * walking through the children. This is usually used to determine the visiting order.
 */
function walkImpl(
    graph,
    parentNode,
    level,
    nodeCallback,
    filterCallback = undefined) {
    if (level >= MAX_DEPTH_LEVEL) return;

    let result = nodeCallback(parentNode, graph);
    if (result === false) return;

    let children = getChildren(graph, parentNode);
    let nextNodes = filterCallback
        ? filterCallback(children, parentNode, graph)
        : children;

    for (let childNode of nextNodes) {
        walkImpl(graph, childNode, level + 1, nodeCallback, filterCallback);
    }

    if (typeof result === 'function') {
        result(parentNode, graph);
    }
}

function walkDeleteCallback(sceneNode, out) {
    delete out.parents[sceneNode];
    delete out.children[sceneNode];
}
