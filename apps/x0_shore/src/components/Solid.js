export const Solid = {
    create(props)
    {
        const { masks } = props;
        if (!masks) throw new Error(`Component instantiation is missing required prop 'masks'.`);
        return {
            masks,
        };
    }
};
