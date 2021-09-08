import { vec3, mat4 } from 'gl-matrix';

const YAXIS = vec3.fromValues(0, 1, 0);

export class ArcballCameraController
{
    constructor(distance = 10)
    {
        this.position = vec3.create();

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
        this.cameraPosition = vec3.fromValues(0, 0, distance);

        /** @private */
        this.vec = vec3.create();
        /** @private */
        this.mat = mat4.create();
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
        let up = vec3.copy(vec, YAXIS);
        // Use up vector for movement
        vec3.scale(up, up, upAmount);
        vec3.add(pivot, pivot, up);
        vec3.add(eye, eye, up);

        // Get right vector
        let right = vec3.set(vec, viewMatrix[0], viewMatrix[4], viewMatrix[8]);        
        // Use right vector for movement
        vec3.scale(right, right, rightAmount);
        vec3.add(pivot, pivot, right);
        vec3.add(eye, eye, right);

        // Get forward vector (camera forward is -z)
        let forward = vec3.set(vec, -viewMatrix[2], -viewMatrix[6], -viewMatrix[10]);
        // Use forward vector for zoom
        vec3.scale(forward, forward, zoomAmount);
        // Restrict eye from crossing the pivot
        let prev = eye[0] - pivot[0];
        let sprev = Math.sign(prev);
        if (Math.sign(prev + forward[0]) !== sprev) forward[0] = 0;
        prev = eye[1] - pivot[1];
        if (Math.sign(prev + forward[1]) !== sprev) forward[1] = 0;
        prev = eye[2] - pivot[2];
        if (Math.sign(prev + forward[2]) !== sprev) forward[2] = 0;
        vec3.add(eye, eye, forward);

        // Use projected forward vector for movement
        let projectedForward = vec3.set(vec, -viewMatrix[2], 0, -viewMatrix[10]);
        vec3.scale(projectedForward, projectedForward, forwardAmount);
        vec3.add(pivot, pivot, projectedForward);
        vec3.add(eye, eye, projectedForward);

        // Reset up vector
        up = YAXIS;

        // Reset forward vector (camera forward is -z)
        forward = vec3.set(vec, -viewMatrix[2], -viewMatrix[6], -viewMatrix[10]);

        // Restrict from crossing the up vector
        let cosAngle = vec3.dot(forward, up);
        if (cosAngle * Math.sign(dpitch) > 0.99) dpitch = 0;

        // Update camera position from yaw
        mat4.rotate(mat, mat, dyaw, up);
        vec3.transformMat4(vec, vec3.sub(vec, eye, pivot), mat);
        vec3.add(eye, vec, pivot);

        // Reset right vector
        right = vec3.set(vec, viewMatrix[0], viewMatrix[4], viewMatrix[8]);

        // Update camera position from pitch
        mat4.identity(mat);
        mat4.rotate(mat, mat, dpitch, right);
        vec3.transformMat4(vec, vec3.sub(vec, eye, pivot), mat);
        vec3.add(eye, vec, pivot);

        // Update view matrix
        mat4.lookAt(viewMatrix, eye, pivot, up);
        return viewMatrix;
    }
}
