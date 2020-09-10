export const AnimatedSprite = {
    create(props)
    {
        const { sprite } = props;
        if (!sprite) throw new Error(`Component instantiation is missing required prop 'sprite'.`);
        return {
            sprite,
            index: 0,
            dt: 0,
        };
    },
    next(component, dt = 1)
    {
        component.dt += dt;
        const amount = Math.floor(component.dt);
        component.dt -= amount;
        component.index = (component.index + amount) % component.sprite.length;
    },
    reset(component)
    {
        component.index = 0;
        component.dt = 0;
    },
    draw(ctx, component)
    {
        component.sprite.draw(ctx, component.index);
    }
};
