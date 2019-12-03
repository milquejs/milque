const { vec3, mat4, quat, mat3 } = glMatrix;

function createMesh(gl, geometry, sharedAttributeLayout)
{
    const vertexArray = Mogli.createVertexArrayInfo(gl, sharedAttributeLayout);

    const positionBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.position, 3);
    const texcoordBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.texcoord, 2);
    const normalBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.normal, 3);
    const colorBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.color, 3);
    const indicesBuffer = Mogli.createElementBufferInfo(gl, gl.UNSIGNED_SHORT, geometry.indices);

    gl.bindVertexArray(vertexArray.handle);
    vertexArray.sharedAttribute('a_position', positionBuffer);
    vertexArray.sharedAttribute('a_texcoord', texcoordBuffer);
    vertexArray.sharedAttribute('a_normal', normalBuffer);
    vertexArray.sharedAttribute('a_color', colorBuffer);
    vertexArray.elementAttribute(indicesBuffer);
    gl.bindVertexArray(null);

    return {
        vertexArray
    };
}

/** CAMERA *******************************************/

function createPerspectiveCamera(fovy = 1, near = 0.01, far = 1000)
{
    return {
        transform: Mogli.Transform.create(),
        transformMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        update(gl, displayWidth, displayHeight)
        {
            mat4.perspective(this.projectionMatrix, fovy, displayWidth / displayHeight, near, far);
            Mogli.Transform.getTransformationMatrix(this.transform, this.transformMatrix);
            mat4.invert(this.viewMatrix, this.transformMatrix);
        },
        lookAt(target)
        {
            Mogli.Transform.lookAt(this.transform, target);
        }
    };
}

function createOrthographicCamera(offsetX = 0, offsetY = 0, near = 1, far = -1)
{
    return {
        transform: Mogli.Transform.create(),
        transformMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        update(gl, displayWidth, displayHeight)
        {
            const halfWidth = displayWidth / 2;
            const halfHeight = displayHeight / 2;
            // This maintains the OpenGL coordinate system. Therefore, -Y is DOWN and +Y is UP.
            mat4.ortho(this.projectionMatrix, offsetX - halfWidth, offsetX + halfWidth, offsetY - halfHeight, offsetY + halfHeight, near, far);
            Mogli.Transform.getTransformationMatrix(this.transform, this.transformMatrix);
            mat4.invert(this.viewMatrix, this.transformMatrix);
        },
        lookAt(target)
        {
            Mogli.Transform.lookAt(this.transform, target);
        }
    };
}

function moveGlobalCamera(camera, mover, moveSpeed = 1)
{
    if (mover.forward) camera.transform.translation[2] -= moveSpeed;
    if (mover.backward) camera.transform.translation[2] += moveSpeed;
    if (mover.down) camera.transform.translation[1] -= moveSpeed;
    if (mover.up) camera.transform.translation[1] += moveSpeed;
    if (mover.left) camera.transform.translation[0] -= moveSpeed;
    if (mover.right) camera.transform.translation[0] += moveSpeed;
}

function moveLocalCamera(camera, mover, moveSpeed = 1)
{
    const vector = vec3.create();

    const position = camera.transform.translation;
    const forward = Mogli.Transform.getForwardVector(camera.transform, vector);
    if (mover.forward) vec3.scaleAndAdd(position, position, forward, -moveSpeed);
    if (mover.backward) vec3.scaleAndAdd(position, position, forward, moveSpeed);
    const up = Mogli.Transform.getUpVector(camera.transform, vector);
    if (mover.down) vec3.scaleAndAdd(position, position, up, -moveSpeed);
    if (mover.up) vec3.scaleAndAdd(position, position, up, moveSpeed);
    const right = Mogli.Transform.getRightVector(camera.transform, vector);
    if (mover.left) vec3.scaleAndAdd(position, position, right, -moveSpeed);
    if (mover.right) vec3.scaleAndAdd(position, position, right, moveSpeed);
}

function moveFirstPersonCamera(camera, mover, moveSpeed = 1)
{
    const vector = vec3.create();

    const position = camera.transform.translation;
    const forward = Mogli.Transform.getForwardVector(camera.transform, vector);
    // Disable y-axis translations for forward/backward...
    forward[1] = 0;
    vec3.normalize(forward, forward);
    if (mover.forward) vec3.scaleAndAdd(position, position, forward, -moveSpeed);
    if (mover.backward) vec3.scaleAndAdd(position, position, forward, moveSpeed);
    if (mover.down) vec3.scaleAndAdd(position, position, Mogli.Transform.YAXIS, -moveSpeed);
    if (mover.up) vec3.scaleAndAdd(position, position, Mogli.Transform.YAXIS, moveSpeed);
    const right = Mogli.Transform.getRightVector(camera.transform, vector);
    if (mover.left) vec3.scaleAndAdd(position, position, right, -moveSpeed);
    if (mover.right) vec3.scaleAndAdd(position, position, right, moveSpeed);
}

function lookFirstPersonCamera(camera, looker, lookSpeed = 1, lookPitchMargin = 10)
{
    if (!('pitch' in camera)) camera.pitch = 0;
    if (!('yaw' in camera)) camera.yaw = 0;

    camera.pitch += -looker.dy * lookSpeed;
    camera.yaw += -looker.dx * lookSpeed;
    camera.pitch = Math.min(90 - lookPitchMargin, Math.max(-90 + lookPitchMargin, camera.pitch));

    quat.fromEuler(camera.transform.rotation, camera.pitch, camera.yaw, 0);
}

function resize(gl)
{
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    if (width !== gl.canvas.width || height !== gl.canvas.height)
    {
        gl.canvas.width = width;
        gl.canvas.height = height;
        return true;
    }
    return false;
}

/** COLLISION *******************************************/

const BODY_TYPE_AABB = 'aabb';
const BODY_TYPE_SPHERE = 'sphere';
const BODY_TYPE_POINT = 'point';
const BODY_TYPE_RAY = 'ray';

const COLLISION_REGISTRY = new Map();
COLLISION_REGISTRY.set('aabb-aabb', aabbAABB);
COLLISION_REGISTRY.set('point-aabb', pointAABB);
COLLISION_REGISTRY.set('sphere-aabb', sphereAABB);
COLLISION_REGISTRY.set('ray-aabb', rayAABB);
COLLISION_REGISTRY.set('aabb-point', (a, b) => pointAABB(b, a));
COLLISION_REGISTRY.set('aabb-sphere', (a, b) => sphereAABB(b, a));
COLLISION_REGISTRY.set('aabb-ray', (a, b) => rayAABB(b, a));

COLLISION_REGISTRY.set('sphere-sphere', sphereSphere);
COLLISION_REGISTRY.set('point-sphere', pointSphere);
COLLISION_REGISTRY.set('ray-sphere', raySphere);
COLLISION_REGISTRY.set('sphere-point', (a, b) => pointSphere(b, a));
COLLISION_REGISTRY.set('sphere-ray', (a, b) => raySphere(b, a));

COLLISION_REGISTRY.set('ray-point', rayPoint);
COLLISION_REGISTRY.set('point-ray', (a, b) => rayPoint(b, a));

class CollisionManager
{
    constructor()
    {
        this._bodies = [];
    }

    addBody(body)
    {
        this._bodies.push(body);
    }

    removeBody(body)
    {
        this._bodies.splice(this._bodies.indexOf(body), 1);
    }

    potentials(body)
    {
        return this._bodies;
    }

    collides(body)
    {
        const bodies = this.potentials(body);
        for(const other of bodies)
        {
            const collisionID = body.type + '-' + other.type;
            const collisionResolver = COLLISION_REGISTRY.get(collisionID);
            const result = collisionResolver(body, other);
            if (result)
            {
                return true;
            }
        }
        return false;
    }
}

function createAABB(x = 0, y = 0, z = 0, width = 1, height = width, depth = height)
{
    return {
        type: BODY_TYPE_AABB,
        x, y, z,
        width, height, depth,
        get minX()
        {
            return x - width / 2;
        },
        get minY()
        {
            return y - height / 2;
        },
        get minZ()
        {
            return z - depth / 2;
        },
        get maxX()
        {
            return x + width / 2;
        },
        get maxY()
        {
            return y + height / 2;
        },
        get maxZ()
        {
            return z + depth / 2;
        }
    };
}

function createPoint(x = 0, y = 0, z = 0)
{
    return {
        type: BODY_TYPE_POINT,
        x, y, z
    };
}

function createSphere(x = 0, y = 0, z = 0, radius = 1)
{
    return {
        type: BODY_TYPE_SPHERE,
        x, y, z,
        radius
    };
}

function createRay(x = 0, y = 0, z = 0, dx = 0, dy = 0, dz = 1)
{
    return {
        type: BODY_TYPE_RAY,
        x, y, z,
        dx, dy, dz
    };
}

function aabbAABB(a, b)
{
    return a.minX <= b.maxX
        && a.maxX >= b.minX
        && a.minY <= b.maxY
        && a.maxY >= b.minY
        && a.minZ <= b.maxZ
        && a.maxZ >= b.minZ;
}

function pointAABB(a, b)
{
    return a.x >= b.minX
        && a.x <= b.maxX
        && a.y >= b.minY
        && a.y <= b.maxY
        && a.z >= b.minZ
        && a.z <= b.maxZ;
}

function sphereAABB(a, b)
{
    const x = Math.max(b.minX, Math.min(a.x, b.maxX));
    const y = Math.max(b.minY, Math.min(a.y, b.maxY));
    const z = Math.max(b.minZ, Math.min(a.z, b.maxZ));
    const dx = x - a.x;
    const dy = y - a.y;
    const dz = z - a.z;
    const distSqu = dx * dx + dy * dy + dz * dz;
    return distSqu < a.radius * a.radius;
}

function rayAABB(a, b)
{
    const invdx = 1 / a.dx;
    const invdy = 1 / a.dy;
    const invdz = 1 / a.dz;

    const t1 = (b.minX - a.x) * invdx;
    const t2 = (b.maxX - a.x) * invdx;
    const t3 = (b.minY - a.y) * invdy;
    const t4 = (b.maxY - a.y) * invdy;
    const t5 = (b.minZ - a.z) * invdz;
    const t6 = (b.maxZ - a.z) * invdz;

    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0)
    {
        return false;
    }

    if (tmin > tmax)
    {
        return false;
    }

    // ray-length = tmin
    return true;
}

function sphereSphere(a, b)
{
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    const distSqu = dx * dx + dy * dy + dz * dz;
    const radii = a.radius + b.radius;
    return distSqu < radii * radii;
}

function pointSphere(a, b)
{
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    const distSqu = dx * dx + dy * dy + dz * dz;
    return distSqu < b.radius * b.radius;
}

function raySphere(a, b)
{
    let t0, t1;

    const vector = vec3.fromValues(
        b.x - a.x,
        b.y - a.y,
        b.z - a.z,
    );
    const tca = vec3.dot(vector, [a.dx, a.dy, a.dz]);
    const d2 = vec3.dot(vector, vector) - tca * tca;
    const r2 = b.radius * b.radius;
    if (d2 > r2) return false;

    const thc = Math.sqrt(r2 - d2);
    t0 = tca - thc;
    t1 = tca + thc;

    if (t0 > t1)
    {
        const temp = t1;
        t1 = t0;
        t0 = temp;
    }

    if (t0 < 0)
    {
        t0 = t1;
        if (t0 < 0) return false;
    }

    // ray-length = t0
    return true;
}

function rayPoint(a, b)
{
    const TOLERANCE = 0.001;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    if (Math.abs(Math.atan2(dy, dx) - Math.atan2(a.dy, a.dx)) < TOLERANCE)
    {
        if (Math.abs(Math.atan2(dz, dy) - Math.atan2(a.dz, a.dy)) < TOLERANCE)
        {
            return true;
        }
    }

    return false;
}
