import { Jsonic } from 'jsonic'

const configFrom = (element, attr, required) => {
    const configString = element.attr(attr)
    if (configString === undefined || configString === null) {
        if (required) {
            const id = element.attr("data-metrix-instrument")
            throw `missing configuration for metrix instrument @${id}`
        }
        return {}
    }
    const config = Jsonic(configString)
    if (typeof config !== 'object') {
        if (required) {
            const id = element.attr("data-metrix-instrument")
            throw `invalid configuration for metrix instrument @${id}`
        }
        return {}
    }
    return config
}

const collectInstrumentConfig = (element) => {
    var data = {}
    data = Object.assign(configFrom(element, "data-metrix-config", true), data)
    while (element && element.length > 0) {
        data = Object.assign(configFrom(element, "data-metrix-preset", false), data)
        element = element.parent()
    }
    return data
}

export default collectInstrumentConfig
