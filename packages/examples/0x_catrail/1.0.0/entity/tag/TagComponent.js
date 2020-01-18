/**
 * A class to represent a component with no data, also known as a tag.
 * This class is not required to create a tag component; any class is
 * considered a tag, if:
 * 
 * - It does not implement reset() or reset() always returns false.
 * - And its instances do not own any properties.
 * 
 * This class is mostly for ease of use and readability.
 */
export class TagComponent {};
