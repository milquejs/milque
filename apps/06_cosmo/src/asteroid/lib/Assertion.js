export function assertNotNull(value) {
    return assert('Must be non-null!', typeof value !== 'undefined' && value !== null, value);
}

export function assertTruthy(value) {
    return assert('Must be truthy!', Boolean(value), value);
}

export function assertFalsey(value) {
    return assert('Must be falsey!', !value, value);
}

export function assertNotEmpty(value) {
    if (typeof value === 'string' || Array.isArray(value)) {
        return assert('Must be not empty!', value && value.length > 0, value);
    } else if (typeof value === 'object') {
        return assert('Must be not empty!', value && Object.keys(value).length > 0, value);
    } else {
        return assert('Must be a collection!', false, value);
    }
}

export function assertEmpty(value) {
    if (typeof value === 'string' || Array.isArray(value)) {
        return assert('Must be empty!', value && value.length <= 0, value);
    } else if (typeof value === 'object') {
        return assert('Must be empty!', value && Object.keys(value).length <= 0, value);
    } else {
        return assert('Must be a collection!', false, value);
    }
}

export function assert(message, condition, value) {
    if (!condition) {
        throw new Error(`Assertion failed - ${message} But found ${value}.`);
    }
    return value;
}
