export const Openable = {
    create(props)
    {
        const { open = false } = props;
        return {
            open,
        };
    }
};
