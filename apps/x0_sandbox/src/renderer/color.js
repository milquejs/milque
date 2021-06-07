export const hex = {
    red(hexValue)
    {
        return (hexValue >> 16) & 0xFF;
    },
    redf(hexValue)
    {
        return ((hexValue >> 16) & 0xFF) / 255.0;
    },
    green(hexValue)
    {
        return (hexValue >> 8) & 0xFF;
    },
    greenf(hexValue)
    {
        return ((hexValue >> 8) & 0xFF) / 255.0;
    },
    blue(hexValue)
    {
        return hexValue & 0xFF;
    },
    bluef(hexValue)
    {
        return (hexValue & 0xFF) / 255.0;
    },
    alpha(hexValue)
    {
        return (hexValue >> 24) & 0xFF;
    },
    alphaf(hexValue)
    {
        return ((hexValue >> 24) & 0xFF) / 255.0;
    }
};
