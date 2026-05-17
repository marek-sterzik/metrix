/*
 * It provides the metrixUpdate function performing a global update
 * on the whole document or only on a given subelement
 */
import $ from "jquery"
import loadInstrumentClass from "./instrument-loader.js"

const metrixInstrumentSelector = "div[data-metrix-instrument]"

const collectInstrumentConfig = (element) => {
    return {}
}

var error = null
var errorLoaded = false

const loadErrorClass = async () => {
    if (!errorLoaded) {
        error = await loadInstrumentClass("error")
        errorLoaded = true
    }
    return error
}

const loadInstrumentClasses = async (classes) => {
    const elements = await Promise.all(classes.map((cls) => loadInstrumentClass(cls)))
    const ret = {}
    for (var i in classes) {
        ret[classes[i]] = elements[i]
    }
    return ret
}

const installInstrument = async (instrumentClass, element, classId) => {
    try {
        var instrumentConfig
        if (instrumentClass !== null) {
            instrumentConfig = collectInstrumentConfig(element)
        } else {
            instrumentClass = await loadErrorClass()
            instrumentConfig = {"message": `instrument class "${classId}" cannot be loaded`}
        }
        if (instrumentClass !== null) {
            const instrument = instrumentClass.createInstrument(element, instrumentConfig)
            element.data("@metrix-instrument", instrument)
            instrument.initialize()
        }
    } catch (e) {
        console.error(e)
    }
}

const metrixUpdate = async (element = undefined) => {
    var elements
    if (element === null || element === undefined) {
        elements = $(metrixInstrumentSelector)
    } else {
        elements = element.find(metrixInstrumentSelector)
    }
    const elementsToUpdate = {}
    elements.each(function () {
        const element = $(this)
        if (!element.data("@metrix-instrument")) {
            const instrumentClass = element.attr("data-metrix-instrument")
            if (!(instrumentClass in elementsToUpdate)) {
                elementsToUpdate[instrumentClass] = []
            }
            elementsToUpdate[instrumentClass].push(element)
        }
    })

    
    const classes = await loadInstrumentClasses(Object.keys(elementsToUpdate))

    for (var cls in elementsToUpdate) {
        const instrumentClass = classes[cls]
        for (var element of elementsToUpdate[cls]) {
            await installInstrument(instrumentClass, element, cls)
        }
    }
}

export default metrixUpdate
