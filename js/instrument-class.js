/*
 * This module defines the InstrumentClass class reprezenting one instrument class
 */

import installCss from "./css-installer.js"
import {setupElement, destroyElement} from "./setup-element.js"
import Instrument from "./instrument.js"

const getModuleExport = (module, name, id) => {
    if (module === null) {
        throw `instrument @${id} does not exist, does not contain instrument.js file or instrument.js file is invalid`
    }
    return module[name]
}

const getFunction = (module, name, mandatory, id) => {
    const fn = getModuleExport(module, name, id)
    if (typeof fn === 'function') {
        return fn
    }
    if (fn === undefined) {
        if (mandatory) {
            throw `${name} not defined in instrument @${id}`
        }
        return null
    }
    throw `named export ${name} of instrument @${id} expected to be a function, but is not`
}

const cssData = new WeakMap()

class InstrumentClass
{
    constructor(id, html, css, code)
    {
        this.id = id
        this.html = html
        cssData.set(this, css)

        this.functions = {
            initialize: getFunction(code, "initialize", true, id),
            setValue: getFunction(code, "setValue", true, id),
            destroy: getFunction(code, "destroy", false, id),
        }

        Object.freeze(this)
    }

    createInstrument(element, configuration = {})
    {
        return new Instrument(this, element, configuration)
    }

    installCss()
    {
        const css = cssData.get(this)
        if (css) {
            installCss(css)
            cssData.delete(this)
        }
    }

    callFunction(fn, ...args)
    {
        if (this.functions[fn]) {
            return this.functions[fn].apply(undefined, args)
        }
        return undefined
    }

    initialize(instrument)
    {
        this.installCss()
        setupElement(instrument.element, this.id, (this.html !== null) ? this.html : "")
        return this.callFunction("initialize", instrument)
    }

    destroy(instrument)
    {
        this.callFunction("destroy", instrument)
        destroyElement(instrument.element, this.id)
    }

    setValue(instrument, value)
    {
        return this.callFunction("setValue", instrument, value)
    }
}

export default InstrumentClass
