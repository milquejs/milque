'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var glMatrix = require('gl-matrix');

const UP = glMatrix.vec3.fromValues(0, 1, 0);

function panTo(viewMatrix, x, y, z = 0, dt = 1)
{
    let position = glMatrix.vec3.create();
    glMatrix.mat4.getTranslation(position, viewMatrix);
    let translation = glMatrix.vec3.fromValues(
        (x - position[0]) * dt,
        (y - position[1]) * dt,
        (z - position[2]) * dt);
    glMatrix.mat4.translate(viewMatrix, viewMatrix, translation);
}

function lookAt(viewMatrix, x, y, z = 0, dt = 1)
{
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    glMatrix.mat4.getTranslation(position, viewMatrix);
    glMatrix.mat4.getRotation(rotation, viewMatrix);
    let target = glMatrix.vec3.fromValues(x, y, z);
    
    glMatrix.mat4.lookAt(viewMatrix, position, target, UP);

    let targetRotation = glMatrix.quat.create();
    glMatrix.mat4.getRotation(targetRotation, viewMatrix);
    glMatrix.quat.slerp(rotation, rotation, targetRotation, dt);

    glMatrix.mat4.fromRotationTranslation(viewMatrix, rotation, position);
}

/**
 * Gets a directional ray in the world space from the given normalized
 * screen coordinates and camera matrices.
 * 
 * NOTE: In addition to some scaling, the y component from a pointer's
 * position usually has to be flipped to match the normalized screen
 * coordinate space, which assumes a range of [-1, 1] for both x and y,
 * where (0, 0) is the center and (-1, -1) is the bottom-left of the
 * screen.
 * 
 * ### Typical Device Screen Coordinate Space:
 * ```
 * (0,0)------------(w,0)
 *    |               |
 *    |   (w/2,h/2)   |
 *    |               |
 * (0,w)------------(w,h)
 * ```
 * 
 * ### Normalized Screen Coordinate Space:
 * ```
 * (-1,+1)---------(+1,+1)
 *    |               |
 *    |     (0,0)     |
 *    |               |
 * (-1,-1)---------(+1,-1)
 * ```
 * 
 * ### Example Conversion from Device to Normalized:
 * ```
 * let normalizedScreenX = (canvasClientX / canvasWidth) * 2 - 1;
 * let normalizedScreenY = 1 - (canvasClientY / canvasHeight) * 2;
 * ```
 * 
 * @param {vec3} out The output vector.
 * @param {number} normalizedScreenCoordX The X screen coordinate normalized to [-1, 1], where -1 is the left side of the screen.
 * @param {number} normalizedScreenCoordY The Y screen coordinate normalized to [-1, 1], where -1 is the bottom side of the screen.
 * @param {mat4} projectionMatrix The projection matrix of the world camera.
 * @param {mat4} viewMatrix The view matrix of the world camera.
 * @param {boolean} [normalized=false] Whether to normalize the result. Usually true for non-orthogonal projections.
 * @returns {vec3} The ray direction in the world space. By default, this is not normalized.
 */
function screenToWorldRay(out, normalizedScreenCoordX, normalizedScreenCoordY, projectionMatrix, viewMatrix, normalized = false)
{
    // https://antongerdelan.net/opengl/raycasting.html
    // To homogeneous clip coords
    let v = glMatrix.vec4.fromValues(normalizedScreenCoordX, normalizedScreenCoordY, -1, 1);
    // To camera coords
    let m = glMatrix.mat4.create();
    glMatrix.mat4.invert(m, projectionMatrix);
    glMatrix.vec4.transformMat4(v, v, m);
    v[2] = -1;
    v[3] = 0;
    // To world coords
    glMatrix.mat4.invert(m, viewMatrix);
    glMatrix.vec4.transformMat4(v, v, m);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    // Normalized as directional ray
    if (normalized)
    {
        glMatrix.vec3.normalize(out, out);
    }
    return out;
}

class Camera
{
    constructor(projectionMatrix, viewMatrix)
    {
        this.projectionMatrix = projectionMatrix;
        this.viewMatrix = viewMatrix;
    }

    /**
     * @abstract
     * @param {number} [viewportWidth]
     * @param {number} [viewportHeight]
     * @returns {Camera}
     */
    // eslint-disable-next-line no-unused-vars
    resize(viewportWidth = undefined, viewportHeight = undefined)
    {
        return this;
    }
}

const DEFAULT_FOVY = Math.PI / 3;

class PerspectiveCamera extends Camera
{
    constructor(fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000)
    {
        super(glMatrix.mat4.create(), glMatrix.mat4.create());

        this.fieldOfView = Number(fieldOfView);
        this.clippingPlane = {
            near: Number(near),
            far: Number(far),
        };
    }

    /** @override */
    resize(viewportWidth = undefined, viewportHeight = undefined)
    {
        const aspectRatio = typeof viewportWidth === 'undefined' ? 1 : viewportWidth / viewportHeight;
        const { near, far } = this.clippingPlane;
        glMatrix.mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
        return this;
    }
}

class OrthographicCamera extends Camera
{
    /**
     * @param {number} [left]
     * @param {number} [top] 
     * @param {number} [right] 
     * @param {number} [bottom] 
     * @param {number} [near] 
     * @param {number} [far] 
     */
    constructor(left = undefined, top = undefined, right = undefined, bottom = undefined, near = -1000, far = 1000)
    {
        super(glMatrix.mat4.create(), glMatrix.mat4.create());

        this.orthoBounds = {
            left: typeof left === 'undefined' ? undefined : Number(left),
            top: typeof top === 'undefined' ? undefined : Number(top),
            right: typeof right === 'undefined' ? undefined : Number(right),
            bottom: typeof bottom === 'undefined' ? undefined : Number(bottom),
        };
        this.clippingPlane = {
            near: Number(near),
            far: Number(far),
        };
    }

    /**
     * If both the bounds and viewport dimensions are defined, the orthographic
     * projection will be set the defined bounds adjusted with respect to
     * the aspect ratio. This is usually the desired behavior.
     * 
     * If the bounds are `undefined`, the orthographic projection will
     * be set to the viewport dimensions. This is useful for pixel-perfect
     * projections.
     * 
     * If viewport dimensions are `undefined`, the orthographic projection
     * will only use the defined bounds. This is useful if you are already
     * performing your own calculations for the bounds or desire a static
     * projection.
     * 
     * @override
     * @param {number} [viewportWidth]
     * @param {number} [viewportHeight]
     */
    resize(viewportWidth = undefined, viewportHeight = undefined)
    {
        const { near, far } = this.clippingPlane;
        const { left, top, right, bottom } = this.orthoBounds;

        let projectionMatrix = this.projectionMatrix;
        let hasViewport = typeof viewportWidth !== 'undefined';
        let hasBounds = typeof left !== 'undefined';

        if (hasViewport)
        {
            if (hasBounds)
            {
                // Use the defined bounds with respect to the viewport aspect ratio
                const aspectRatio = viewportWidth / viewportHeight;
                glMatrix.mat4.ortho(projectionMatrix,
                    left * aspectRatio, right * aspectRatio,
                    bottom, top,
                    near, far);
            }
            else
            {
                // Use the viewport dimensions as bounds
                glMatrix.mat4.ortho(projectionMatrix,
                    0, viewportWidth,
                    viewportHeight, 0,
                    near, far);
            }
        }
        else
        {
            if (hasBounds)
            {
                // Use the defined bounds as-is
                glMatrix.mat4.ortho(projectionMatrix,
                    left, right,
                    bottom, top,
                    near, far);
            }
            else
            {
                // Use default bounds (since nothing else exists)
                glMatrix.mat4.ortho(projectionMatrix,
                    -1, 1,
                    1, -1,
                    -1, 1);
            }
        }
        return this;
    }
}

const TO_RAD_FACTOR = Math.PI / 180;

/**
 * A camera controller that behaves like a traditional first person camera.
 * Pitch is restricted to prevent gimbal lock and roll is ignored.
 * 
 * NOTE: Don't forget to lock your pointer, i.e. `canvas.requestPointerLock()`.
 */
class FirstPersonCameraController
{
    constructor(opts = { locky: false })
    {
        this.locky = opts.locky;

        this.position = glMatrix.vec3.create();
        this.forward = glMatrix.vec3.fromValues(0, 0, -1);
        this.right = glMatrix.vec3.fromValues(1, 0, 0);
        this.up = glMatrix.vec3.fromValues(0, 1, 0);

        /** @private */
        this.forwardAmount = 0;
        /** @private */
        this.rightAmount = 0;
        /** @private */
        this.upAmount = 0;

        /** @private */
        this.pitch = 0;
        /** @private */
        this.yaw = -90;
    }

    look(dx, dy, dt = 1)
    {
        this.pitch = Math.min(89.9, Math.max(-89.9, this.pitch + dy * dt));
        this.yaw = (this.yaw + dx * dt) % 360;
        return this;
    }

    move(forward, right = 0, up = 0, dt = 1)
    {
        this.forwardAmount += forward * dt;
        this.rightAmount += right * dt;
        this.upAmount += up * dt;
        return this;
    }

    apply(viewMatrix)
    {
        let {
            position,
            forward, right, up,
            forwardAmount, rightAmount, upAmount,
            pitch, yaw
        } = this;

        // Calculate forward and right vectors
        let rady = yaw * TO_RAD_FACTOR;
        let radp = pitch * TO_RAD_FACTOR;
        let cosy = Math.cos(rady);
        let cosp = Math.cos(radp);
        let siny = Math.sin(rady);
        let sinp = Math.sin(radp);
        let dx = cosy * cosp;
        let dy = sinp;
        let dz = siny * cosp;

        // Set forward for move vector
        glMatrix.vec3.normalize(forward, glMatrix.vec3.set(forward, dx, this.locky ? 0 : dy, dz));
        glMatrix.vec3.normalize(right, glMatrix.vec3.cross(right, forward, up));

        let move = glMatrix.vec3.create();
        // Move forward
        glMatrix.vec3.scale(move, forward, forwardAmount);
        glMatrix.vec3.add(position, position, move);
        // Move right
        glMatrix.vec3.scale(move, right, rightAmount);
        glMatrix.vec3.add(position, position, move);
        // Move up
        glMatrix.vec3.scale(move, up, upAmount);
        glMatrix.vec3.add(position, position, move);
        // Reset movement
        this.forwardAmount = 0;
        this.rightAmount = 0;
        this.upAmount = 0;

        // Reset forward for look vector
        if (this.locky) glMatrix.vec3.set(forward, dx, dy, dz);
        
        let target = glMatrix.vec3.add(move, position, forward);
        glMatrix.mat4.lookAt(viewMatrix, position, target, up);
        return viewMatrix;
    }
}

const YAXIS = glMatrix.vec3.fromValues(0, 1, 0);

class ArcballCameraController
{
    constructor(distance = 10)
    {
        this.position = glMatrix.vec3.create();

        /** @private */
        this.forwardAmount = 0;
        /** @private */
        this.rightAmount = 0;
        /** @private */
        this.upAmount = 0;
        /** @private */
        this.yawAmount = 0;
        /** @private */
        this.pitchAmount = 0;
        /** @private */
        this.zoomAmount = 0;

        /** @private */
        this.cameraPosition = glMatrix.vec3.fromValues(0, 0, distance);

        /** @private */
        this.vec = glMatrix.vec3.create();
        /** @private */
        this.mat = glMatrix.mat4.create();
    }

    look(dx, dy, dt = 1)
    {
        this.pitchAmount += dy * dt * -1;
        this.yawAmount += dx * dt * -1;
        return this;
    }

    move(forward, right, up = 0, dt = 1)
    {
        this.forwardAmount += forward * dt;
        this.rightAmount += right * dt;
        this.upAmount += up * dt;
        return this;
    }

    zoom(amount, dt = 1)
    {
        this.zoomAmount += amount * dt;
        return this;
    }

    apply(viewMatrix)
    {
        let {
            position: pivot,
            cameraPosition: eye,
            forwardAmount,
            rightAmount,
            upAmount,
            pitchAmount: dpitch,
            yawAmount: dyaw,
            zoomAmount,
        } = this;

        // Reset movement
        this.forwardAmount = 0;
        this.rightAmount = 0;
        this.upAmount = 0;
        this.pitchAmount = 0;
        this.yawAmount = 0;
        this.zoomAmount = 0;

        // Temp variables
        let vec = this.vec;
        let mat = this.mat;

        // Get up vector
        let up = glMatrix.vec3.copy(vec, YAXIS);
        // Use up vector for movement
        glMatrix.vec3.scale(up, up, upAmount);
        glMatrix.vec3.add(pivot, pivot, up);
        glMatrix.vec3.add(eye, eye, up);

        // Get right vector
        let right = glMatrix.vec3.set(vec, viewMatrix[0], viewMatrix[4], viewMatrix[8]);        
        // Use right vector for movement
        glMatrix.vec3.scale(right, right, rightAmount);
        glMatrix.vec3.add(pivot, pivot, right);
        glMatrix.vec3.add(eye, eye, right);

        // Get forward vector (camera forward is -z)
        let forward = glMatrix.vec3.set(vec, -viewMatrix[2], -viewMatrix[6], -viewMatrix[10]);
        // Use forward vector for zoom
        glMatrix.vec3.scale(forward, forward, zoomAmount);
        // Restrict eye from crossing the pivot
        let prev = eye[0] - pivot[0];
        let sprev = Math.sign(prev);
        if (Math.sign(prev + forward[0]) !== sprev) forward[0] = 0;
        prev = eye[1] - pivot[1];
        if (Math.sign(prev + forward[1]) !== sprev) forward[1] = 0;
        prev = eye[2] - pivot[2];
        if (Math.sign(prev + forward[2]) !== sprev) forward[2] = 0;
        glMatrix.vec3.add(eye, eye, forward);

        // Use projected forward vector for movement
        let projectedForward = glMatrix.vec3.set(vec, -viewMatrix[2], 0, -viewMatrix[10]);
        glMatrix.vec3.scale(projectedForward, projectedForward, forwardAmount);
        glMatrix.vec3.add(pivot, pivot, projectedForward);
        glMatrix.vec3.add(eye, eye, projectedForward);

        // Reset up vector
        up = YAXIS;

        // Reset forward vector (camera forward is -z)
        forward = glMatrix.vec3.set(vec, -viewMatrix[2], -viewMatrix[6], -viewMatrix[10]);

        // Restrict from crossing the up vector
        let cosAngle = glMatrix.vec3.dot(forward, up);
        if (cosAngle * Math.sign(dpitch) > 0.99) dpitch = 0;

        // Update camera position from yaw
        glMatrix.mat4.rotate(mat, mat, dyaw, up);
        glMatrix.vec3.transformMat4(vec, glMatrix.vec3.sub(vec, eye, pivot), mat);
        glMatrix.vec3.add(eye, vec, pivot);

        // Reset right vector
        right = glMatrix.vec3.set(vec, viewMatrix[0], viewMatrix[4], viewMatrix[8]);

        // Update camera position from pitch
        glMatrix.mat4.identity(mat);
        glMatrix.mat4.rotate(mat, mat, dpitch, right);
        glMatrix.vec3.transformMat4(vec, glMatrix.vec3.sub(vec, eye, pivot), mat);
        glMatrix.vec3.add(eye, vec, pivot);

        // Update view matrix
        glMatrix.mat4.lookAt(viewMatrix, eye, pivot, up);
        return viewMatrix;
    }
}

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
class SceneGraph
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

exports.ArcballCameraController = ArcballCameraController;
exports.Camera = Camera;
exports.FirstPersonCameraController = FirstPersonCameraController;
exports.OrthographicCamera = OrthographicCamera;
exports.PerspectiveCamera = PerspectiveCamera;
exports.SceneGraph = SceneGraph;
exports.lookAt = lookAt;
exports.panTo = panTo;
exports.screenToWorldRay = screenToWorldRay;
