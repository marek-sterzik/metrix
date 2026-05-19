/*
 * This module defines a deep equal function suitable for comparing JSON serializable data structures.
 */

const isPrimitive = obj => (obj !== Object(obj))

const isArray = obj => (obj instanceof Array)

const equals = (a, b) => {
    if (a === b) {
        return true
    }

    if (isPrimitive(a) && isPrimitive(b)) {
        return false
    }

    const aIsArray = isArray(a)

    if (aIsArray !== isArray(b)) {
        return false
    }

    if (aIsArray) {
        if (a.length !== b.length) {
            return false
        }
        for (var i in a) {
            if (!equals(a[i], b[i])) {
                return false
            }
        }
    } else {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false
        }

        for (var key in a)
        {
            if (!(key in b)) {
                return false
            }
            if (!equals(a[key], b[key])) {
                return false
            }
        }
    }
    return true
    
}



export default equals
