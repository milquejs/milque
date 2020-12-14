export const Renderable = {
    create(props)
    {
        const { renderType = 'null' } = props;
        return {
            renderType,
        };
    }
};
