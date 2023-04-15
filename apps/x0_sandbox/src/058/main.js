import * as Defs from './defs';
import * as Inputs from './Inputs';

import { Game, startGame } from './Game';
import { CanvasProvider, EntityProvider, InputProvider, RenderingProvider } from './Providers';
import { useFrameEffect, using } from '../runner2';
import { GameObject, GameObjectSystem } from './GameObject';
import { lerp } from '@milque/util';

export async function main() {
    await startGame(new BunnyGame());
}

class BunnyGame extends Game {

    /** @override */
    static get assetRefs() {
        return Object.values(Defs);
    }

    /** @override */
    static get inputBindings() {
        return Object.values(Inputs);
    }

    /** @override */
    static get providers() {
        return [
            GameObjectSystem
        ];
    }

    /** @override */
    onInit(m) {
        let ents = using(m, EntityProvider);

        new ObjBunny(ents, ents.create()).withTransform(64, 64);
    }

    /**
     * @override
     * @param {object} m 
     */
    onDraw(m) {
        const { ctx, tia } = using(m, RenderingProvider);
        tia.rectFill(ctx, 0, 0, 10, 10, 0xFF0000);
    }
}

class ObjDust extends GameObject {

    constructor(ents, entityId, maxAge = 100) {
        super(ents, entityId);

        this.maxAge = maxAge;
        this.age = maxAge;

        this.withSprite(Defs.spDust.uri, Math.floor(Math.random() * Defs.spDust.current.frameCount), 0);
    }
}

class ObjBunnyTrail extends GameObject {

    constructor(ents, entityId, maxAge = 100) {
        super(ents, entityId);

        this.maxAge = maxAge;
        this.age = maxAge;

        this.withSprite(Defs.spBunny.uri, 0, 0);
        this.withSprite(Defs.spBunnyEyes.uri, 0, 0);
    }

    /** @override */
    onUpdate(m, frameDetail) {
        super.onUpdate(m, frameDetail);

        const ents = using(m, EntityProvider);

        if (this.age > 0) {
            --this.age;
        } else {
            ents.destroy(this.entityId);
        }
    }

    /** @override */
    onDraw(m, frameDetail) {
        let { ctx } = using(m, RenderingProvider);
        let agePercent = this.age / this.maxAge;
        ctx.globalAlpha = 0.3 * agePercent * agePercent;
        super.onDraw(m, frameDetail);
        ctx.globalAlpha = 1;
    }
}

class ObjBunny extends GameObject {
    constructor(ents, entityId) {
        super(ents, entityId);
        
        this.targetX = 0;
        this.targetY = 0;

        this.prevX = 0;
        this.prevY = 0;

        this.deltaX = 0;
        this.deltaY = 0;

        this.moveSpeed = 0.2;

        this.maxTimer = 8;
        this.timer = this.maxTimer;

        this.trailing = false;

        this.withSprite(Defs.spBunny.uri, 0, 10);
        this.withSprite(Defs.spBunnyEyes.uri, 0, 10);
        this.withZDepth(1);
    }

    /** @override */
    onUpdate(m, frameDetail) {
        super.onUpdate(m, frameDetail);

        let dt = frameDetail.deltaTime / 60;
        let canvas = using(m, CanvasProvider);
        let axb = using(m, InputProvider);
        let ents = using(m, EntityProvider);
        if (Inputs.PointerAction.get(axb).down) {
            this.targetX = Inputs.PointerX.get(axb).value * canvas.width;
            this.targetY = Inputs.PointerY.get(axb).value * canvas.height;
        }

        let speed = this.moveSpeed;
        this.transform.x = lerp(this.transform.x, this.targetX, speed * dt);
        this.transform.y = lerp(this.transform.y, this.targetY, speed * dt);

        this.deltaX = this.transform.x - this.prevX;
        this.deltaY = this.transform.y - this.prevY;
        
        this.prevX = this.transform.x;
        this.prevY = this.transform.y;

        this.transform.scaleX = -Math.sign(this.deltaX);

        if (--this.timer <= 0) {
            let deltaSpeed = (this.deltaX * this.deltaX + this.deltaY * this.deltaY);
            if (this.trailing) {
                if (deltaSpeed <= 0.1) {
                    this.trailing = false;
                }
            } else if (deltaSpeed > 8) {
                this.trailing = true;
            }
            if (this.trailing) {
                this.moveSpeed = 0.3;
                this.spawnTrail(ents);
            } else {
                this.moveSpeed = 0.2;
            }
            this.timer = this.maxTimer;
        }
    }

    /** @override */
    onDraw(m, frameDetail) {
        super.onDraw(m, frameDetail);
        if (this.trailing) {
            let deltaSpeed = (this.deltaX * this.deltaX + this.deltaY * this.deltaY);
            this.transform.scaleY = 0.8 + 0.2 * (1 - Math.min(1, deltaSpeed / 8));
        } else {
            this.transform.scaleY = 1;
        }
    }

    spawnTrail(ents) {
        let trail = new ObjBunnyTrail(ents, ents.create())
            .withTransform(this.transform.x, this.transform.y, this.transform.scaleX, this.transform.scaleY);
        trail.sprites[0].frameIndex = this.sprites[0].frameIndex;
        trail.sprites[1].frameIndex = this.sprites[1].frameIndex;
        return trail;
    }
}
