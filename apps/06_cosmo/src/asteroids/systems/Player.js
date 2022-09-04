import { ComponentClass, ComponentQuery, EntityTemplate } from '../../core/EntityManager.js';
import { addListener } from '../../core/Listenable.js';
import { INPUTS } from '../../inputs.js';
import { useRenderManager } from '../../renderer/RenderManager.js';

/** @typedef {import('../../renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText */

export const PlayerComponent = new ComponentClass('PlayerComponent', () => ({
    x: 0, y: 0,
    motionX: 0,
    motionY: 0,
    friction: 0.05,
}));
export const PlayerTemplate = new EntityTemplate([PlayerComponent]);
export const PlayerQuery = new ComponentQuery(PlayerComponent);

const PLAYER_RADIUS = 8;

export function PlayerSystem(m) {
    addListener(m, 'init', () => {
        PlayerTemplate.instantiate(m);
    });
    addListener(m, 'update', () => {
        const { display } = useRenderManager(m);
        const halfDisplayWidth = display.width / 2;
        const halfDisplayHeight = display.height / 2;
        for (let player of PlayerQuery.findAll(m)) {
            let minX = -halfDisplayWidth + PLAYER_RADIUS;
            let maxX = halfDisplayWidth - PLAYER_RADIUS;
            let minY = -halfDisplayHeight + PLAYER_RADIUS;
            let maxY = halfDisplayHeight - PLAYER_RADIUS;
            if (player.x < minX) {
                player.x = minX;
                player.motionX = 0;
            }
            if (player.x > maxX) {
                player.x = maxX;
                player.motionX = 0;
            }
            if (player.y < minY) {
                player.y = minY;
                player.motionY = 0;
            }
            if (player.y > maxY) {
                player.y = maxY;
                player.motionY = 0;
            }
            player.x += player.motionX;
            player.y += player.motionY;
            player.motionX *= 1 - player.friction;
            player.motionY *= 1 - player.friction;
        }
    });

    addListener(m, 'input', () => {
        let player = PlayerQuery.find(m);
        let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
        let dy = INPUTS.MoveDown.value - INPUTS.MoveUp.value;
        let moveSpeed = 0.1;
        // player.motionX += dx * moveSpeed;
        // player.motionY += dy * moveSpeed;
    });

    addListener(m, 'render', (ctx) => {
        ctx.setColor(0xFF00FF);
        for (let player of PlayerQuery.findAll(m)) {
            ctx.drawBox(player.x, player.y, PLAYER_RADIUS, PLAYER_RADIUS);
        }
    });
}
