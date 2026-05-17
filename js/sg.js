const createSetterGetter = (setter, getter) => {
    return function (key, ...args) {
        if (args.length === 0) {
            if (getter === null) {
                throw new Error("getter not available")
            }
            return getter(key)
        } else if (args.length === 1) {
            if (setter === null) {
                throw new Error("setter not available")
            }
            return setter(key, args[0])
        } else {
            throw new Error("Invalid number of arguments in setter/getter")
        }
    }
}

export default createSetterGetter
