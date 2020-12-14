/**
 * Capitalizes the first character of the string of non-zero length.
 * 
 * @param {string} string The string to capitalize.
 * @returns {string} The string with the first character capitalized.
 */
export function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.substring(1);
}
