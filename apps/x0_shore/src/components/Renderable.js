export const Renderable = {
    create(props)
    {
        const { renderType, ...otherProps } = props;
        if (!renderType) throw new Error(`Component instantiation is missing required prop 'renderType'.`);
        return {
            renderType,
            ...otherProps,
        };
    }
};
