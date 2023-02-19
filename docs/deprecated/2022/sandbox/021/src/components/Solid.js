export const Solid = {
  create(props) {
    const { masks = [] } = props;
    return {
      masks,
    };
  },
};
