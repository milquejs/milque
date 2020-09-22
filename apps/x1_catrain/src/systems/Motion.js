export function Motion(props)
{
    const { motionX = 0, motionY = 0, speed = 0.6, friction = 0.25 } = props;
    return {
        motionX,
        motionY,
        speed,
        friction,
        moving: false,
        facing: 1,
    };
}
