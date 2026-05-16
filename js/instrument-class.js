/*
 * This module defines the InstrumentClass class reprezenting one instrument class
 */

import installCss from "./css-installer.js"
import setupElement from "./setup-element.js"
import Instrument from "./instrument.js"

const getFunction = (module, name, mandatory, id) => {
    const fn = module[name]
    if (typeof fn === 'function') {
        return fn
    }
    if (fn === undefined) {
        if (mandatory) {
            throw `${name} not defined in instrument ${id}`
        }
        return null
    }
    throw `named export ${name} of instrument ${id} expected to be a function, but is not`
}


class InstrumentClass
{
    constructor(id, html, css, code)
    {
        this.id = id
        this.html = html
        this.css = css

        this.functions = {
            initialize: getFunction(code, "initialize", true, id),
            setValue: getFunction(code, "setValue", true, id),
            destroy: getFunction(code, "destroy", false, id),
        }
        this.code = code
    }

    createInstrument(element, configuration = {})
    {
        return new Instrument(this, element, configuration)
    }

    installCss()
    {
        if (this.css !== null) {
            installCss(this.css)
            this.css = null
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
        setupElement(instrument.element, this.id, (this.html !== null) ? this.html : "")
        this.installCss()
        return this.callFunction("initialize", instrument)
    }

    setValue(instrument, value)
    {
        return this.callFunction("setValue", instrument, value)
    }
}

export default InstrumentClass
