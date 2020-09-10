export class MotionSystem
{
    constructor(entityManager, input)
    {
        this.entityManager = entityManager;
        this.input = input;
    }

    update(dt)
    {
        const { entityManager, input } = this;
        
        for(let entityId of entityManager.getComponentEntityIds('Motion'))
        {
            let motion = entityManager.get('Motion', entityId);

            if (entityManager.has('PlayerControlled', entityId))
            {
                let dx = input.getInputValue('moveRight') - input.getInputValue('moveLeft');
                let dy = input.getInputValue('moveDown') - input.getInputValue('moveUp');
                if (dx || dy)
                {
                    let dr = Math.atan2(dy, dx);
                    let cdr = Math.cos(dr);
                    let sdr = Math.sin(dr);
                    motion.motionX += cdr * motion.speed;
                    motion.motionY += sdr * motion.speed;
                    motion.moving = true;
                    motion.facing = Math.sign(cdr);
                }
                else
                {
                    motion.moving = false;
                }
            }

            let invFriction = 1 - motion.friction;
            motion.motionX *= invFriction;
            motion.motionY *= invFriction;

            if (entityManager.has('Transform', entityId))
            {
                let transform = entityManager.get('Transform', entityId);
                transform.x += motion.motionX;
                transform.y += motion.motionY;
            }
        }
    }
}
