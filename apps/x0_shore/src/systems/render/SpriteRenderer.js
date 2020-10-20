import { Sprite } from '@app/components/Sprite.js';

export function SpriteRenderer(ctx, owner, entityManager)
{
    let sprite = entityManager.get('Sprite', owner);
    let scaleX = 1;
    let speed = 0;
    if (entityManager.has('Motion', owner))
    {
        let motion = entityManager.get('Motion', owner);
        speed = motion.moving ? 0.2 : 0;
        scaleX = motion.facing <= 0 ? -1 : 1;
    }
    ctx.scale(scaleX, 1);
    {
        if (speed)
        {
            Sprite.next(sprite, speed);
            Sprite.draw(ctx, sprite);
        }
        else
        {
            Sprite.draw(ctx, sprite, 0);
        }
    }
    ctx.scale(-scaleX, 1);
}
