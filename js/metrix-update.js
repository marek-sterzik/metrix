/*
 * It provides the metrixUpdate function performing a global update
 * on the whole document or only on a given subelement
 */
import $ from "jquery"
import loadInstrumentClass from "./instrument-loader.js"
import collectInstrumentConfig from "./config-collector.js"

const metrixInstrumentSelector = "div[data-metrix-config]"

import equals from "./equals.js"

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

const updateInstrument = (element, instrumentClass, instrumentConfig, errorClass) => {
    const instrumentClassName = instrumentConfig.instrument
    try {
        if (instrumentClass === null) {
            throw `cannot load instrument class ${instrumentClassName}`
        }
        replaceInstrument(element, instrumentClass, instrumentConfig)
    } catch (e) {
        console.error(`cannot load instrument ${instrumentClassName}:`, e)
        instrumentClass = errorClass
        instrumentConfig = {"message": `${e}`}
        try {
            replaceInstrument(element, instrumentClass, instrumentConfig)
        } catch (e) {
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

    const instrumentClasses = {}
    const elementsToUpdate = []
    elements.each(function () {
        const element = $(this)
        var config
        try {
            config = collectInstrumentConfig(element)
        } catch (e) {
            config = {"instrument": "error", "message": `${e}`}
        }
        const instrumentClass = config.instrument

        if (!(instrumentClass in instrumentClasses)) {
            instrumentClasses[instrumentClass] = true
        }
        elementsToUpdate.push({"element": element, "config": config, "instrumentClass": instrumentClass})
    })

    instrumentClasses.error = true
    
    const classes = await loadInstrumentClasses(Object.keys(instrumentClasses))

    for (var elementToUpdate of elementsToUpdate) {
        const instrumentClass = classes[elementToUpdate.instrumentClass]
        updateInstrument(elementToUpdate.element, instrumentClass, elementToUpdate.config, classes.error)
    }
}

$(window).resize(() => {
    $(metrixInstrumentSelector).each(function (){
        const instrument = $(this).data("@metrix-instrument")
        if (instrument) {
            instrument.recalcSize()
        }
    })
})

export default metrixUpdate
