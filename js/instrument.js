/*
 * This module defines the class representing one single instrument instance.
 */

import createSetterGetter from "./sg.js"

class Instrument
{
    constructor(instrumentClass, element, configuration)
    {
        this.instrumentClass = instrumentClass
        this.element = element
        this.configuration = configuration
        this.data = {}
        Object.freeze(this)
        this.checkConfig(this.configuration)
    }

    initialize()
    {
        this.instrumentClass.initialize(this)
        return this
    }

    destroy()
    {
        this.instrumentClass.destroy(this)
        this.setWidth(null).setHeight(null)
    }

    supportsReconfiguration()
    {
        return this.instrumentClass.supportsReconfiguration()
    }

    updateConfig(newConfig)
    {
        if (!this.supportsReconfiguration()) {
            throw "Cannot reconfigure instrument"
        }
        this.checkConfig(newConfig)
        const oldConfig = Object.assign({}, this.configuration)
        Object.keys(this.configuration).forEach(key => delete this.configuration[key]);
        Object.assign(this.configuration, newConfig)
        
        this.instrumentClass.updateConfig(instrument, oldConfig)

    }

    checkConfig(config)
    {
        this.instrumentClass.checkConfig(config)
    }

    setValue(value)
    {
        this.instrumentClass.setValue(this, value)
        return this
    }

    setWidth(width)
    {
        this.element.css("width", (width !== null && width !== undefined) ? width : '')
        return this
    }

    setHeight(height)
    {
        this.element.css("height", (height !== null && height !== undefined) ? height : '')
        return this
    }

    config = createSetterGetter(null, key => this.configuration[key])
    data = createSetterGetter((key, value) => (this.data[key] = value), key => this.data[key])
}

export default Instrument
