/*
 * It provides the metrixUpdate function performing a global update
 * on the whole document or only on a given subelement
 */
import $ from "jquery"
import loadInstrumentClass from "./instrument-loader.js"
import collectInstrumentConfig from "./config-collector.js"
const metrixInstrumentSelector = "div[data-metrix-instrument]"
import equals from "./equals.js"

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

const replaceInstrument = (element, instrumentClass, instrumentConfig) => {
    const existingInstrument = element.data("@metrix-instrument")
    if (existingInstrument) {
        if (!equals(existingInstrument.configuration, instrumentConfig)) {
            if (existingInstrument.instrumentClass === instrumentClass && existingInstrument.supportsReconfiguration()) {
                existingInstrument.updateConfig(instrumentConfig)
                instrumentClass = null
            } else {
                existingInstrument.destroy()
            }
        } else {
            instrumentClass = null
        }
    }
    if (instrumentClass !== null) {
        const instrument = instrumentClass.createInstrument(element, instrumentConfig)
        element.data("@metrix-instrument", instrument)
        instrument.initialize()
    }
}

const updateInstrument = async (instrumentClass, element, classId) => {
    var retry = true
    var instrumentConfig
    try {
        if (instrumentClass !== null) {
            instrumentConfig = collectInstrumentConfig(element)
        } else {
            retry = false
            instrumentClass = await loadErrorClass()
            instrumentConfig = {"message": `instrument @${classId} cannot be loaded`}
        }
        replaceInstrument(element, instrumentClass, instrumentConfig)
    } catch (e) {
        console.error(`cannot load instrument ${classId}:`, e)
        if (retry) {
            instrumentClass = await loadErrorClass()
            instrumentConfig = {"message": `${e}`}
            try {
                replaceInstrument(element, instrumentClass, instrumentConfig)
            } catch (e) {
            }
        }
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
        const instrumentClass = element.attr("data-metrix-instrument")
        if (!(instrumentClass in elementsToUpdate)) {
            elementsToUpdate[instrumentClass] = []
        }
        elementsToUpdate[instrumentClass].push(element)
    })

    
    const classes = await loadInstrumentClasses(Object.keys(elementsToUpdate))

    for (var cls in elementsToUpdate) {
        const instrumentClass = classes[cls]
        for (var element of elementsToUpdate[cls]) {
            await updateInstrument(instrumentClass, element, cls)
        }
    }
}

export default metrixUpdate
