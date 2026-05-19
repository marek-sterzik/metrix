/*
 * This module defines the InstrumentClass class reprezenting one instrument class.
 */

import installCss from "./css-installer.js"
import {setupElement, destroyElement} from "./setup-element.js"
import Instrument from "./instrument.js"
import validator from "./validator.js"
import defaultSchema from "./default-schema.js"

const defaultSchemaValidator = validator(defaultSchema)

const getModuleExport = (module, name, id) => {
    if (module === null) {
        throw `instrument @${id} does not exist, does not contain instrument.js file or instrument.js file is invalid`
    }
    return module[name]
}

const getBoolean = (module, name, mandatory, id) => {
    const val = getModuleExport(module, name, id)
    if (val === true || val === false) {
        return val
    }
    if (val === undefined || val === null) {
        if (mandatory) {
            throw `missing boolean ${name} in exports for instrument @${id}`
        }
        return null
    }

    throw `instrument @${id} does contain invalid boolean export ${name}`
}

const getObject = (module, name, mandatory, id) => {
    const val = getModuleExport(module, name, id)
    if (typeof val === "object") {
        return val
    }

    if (val === undefined || val === null) {
        if (mandatory) {
            throw `missing object ${name} in exports for instrument @${id}`
        }
        return null
    }

    throw `instrument @${id} does contain invalid object export ${name}`
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
            updateConfig: getFunction(code, "updateConfig", false, id),
            validateConfig: getFunction(code, "validateConfig", false, id),
        }

        this.applyDefaultConfigSchema = getBoolean(code, "applyDefaultConfigSchema", false, id)
        if (this.applyDefaultConfigSchema === null) {
            this.applyDefaultConfigSchema = true
        }

        const configSchema = getObject(code, "configSchema", false, id)
        if (configSchema !== null) {
            this.configSchemaValidator = validator(configSchema)
        } else {
            this.configSchemaValidator = null
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
        try {
            this.callFunction("destroy", instrument)
        } catch (e) {
        }
        destroyElement(instrument.element, this.id)
    }

    checkConfig(config)
    {
        if (this.applyDefaultConfigSchema) {
            defaultSchemaValidator.validate(config)
        }
        if (this.configSchemaValidator !== null) {
            this.configSchemaValidator.validate(config)
        }
        this.callFunction("validateConfig", config)
    }

    supportsReconfiguration()
    {
        return this.functions["updateConfig"] !== null
    }

    updateConfig(instrument, oldConfig)
    {
        return this.callFunction("updateConfig", instrument, oldConfig)
    }

    setValue(instrument, value)
    {
        return this.callFunction("setValue", instrument, value)
    }
}

export default InstrumentClass
