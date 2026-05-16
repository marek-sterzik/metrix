/*
 * This module defines an asynchronous instrument class loading procedure.
 */

import {loadHtml, loadCode, loadCss} from "./ll-loader.js"
import Instrument from "./instrument.js"
import InstrumentClass from "./instrument-class.js"

const instrumentClasses = {}
const instrumentLoads = {}

const loadInstrumentClassRaw = async (id) => {
    const htmlPromise = loadHtml(id)
    const [html, css, code] = await Promise.all([loadHtml(id), loadCss(id), loadCode(id)])
    return new InstrumentClass(id, html, css, code)
}

const loadInstrumentClass = async (id) => {
    while (id in instrumentLoads) {
        await instrumentLoads[id]
    }
    if (id in instrumentClasses) {
        return instrumentClasses[id]
    }

    const promise = loadInstrumentClassRaw(id)
    instrumentLoads[id] = promise
    try {
        return await promise
    } finally {
        delete(instrumentLoads[id])
    }
}

const loadInstrumentClassNoError = async (id) => {
    try {
        return await loadInstrumentClass(id)
    } catch (e) {
        console.error(`cannot load instrument ${id}`, e)
        return null
    }
}

export default loadInstrumentClassNoError
