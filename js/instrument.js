/*
 * This module defines the class representing one single instrument instance.
 */

import createSetterGetter from "./sg.js"
import dataSourceDispatcher from "./data-source-dispatcher.js"

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
        this.registerDataSource()
    }

    initialize()
    {
        this.instrumentClass.initialize(this)
        return this
    }

    destroy()
    {
        this.unregisterDataSource()
        this.instrumentClass.destroy(this)
        this.setWidth(null).setHeight(null)
    }

    isDataSourceConfigured()
    {
        try {
            ["source", "topic"].forEach(key => {
                if (!(key in this.configuration)) {
                    throw "missing key" 
                }
                if (typeof this.configuration[key] !== "string") {
                    throw "not a string"
                }
            })
            return true
        } catch (e) {
            return false
        }
    }

    registerDataSource()
    {
        if (this.isDataSourceConfigured()) {
            dataSourceDispatcher.registerInstrument(this, this.configuration['source'], this.configuration['topic'])
        }
    }

    unregisterDataSource()
    {
        if (this.isDataSourceConfigured()) {
            dataSourceDispatcher.unregisterInstrument(this)
            
        }
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
        this.unregisterDataSource()
        const oldConfig = Object.assign({}, this.configuration)
        Object.keys(this.configuration).forEach(key => delete this.configuration[key]);
        Object.assign(this.configuration, newConfig)
        this.instrumentClass.updateConfig(instrument, oldConfig)
        this.registerDataSource()
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
