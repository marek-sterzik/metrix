/*
 * This module defines the class representing one single instrument instance.
 */

import createSetterGetter from "./sg.js"
import dataSourceDispatcher from "./data-source-dispatcher.js"
import Message from "@metrix/message.js"

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

    listen(msgCategory, listener)
    {
        dataSourceDispatcher.registerInstrumentConsumer(this, msgCategory, listener)
    }

    send(msgType, topic, payload = null)
    {
        dataSourceDispatcher.dispatchFromInstrument(this, new Message(msgType, topic, payload))
    }

    pushValue(value)
    {
        const topic = this.config("topic")
        if (topic !== null) {
            this.send("broadcast", topic, value)
        }
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
        return this.config("source") !== null
    }

    registerDataSource()
    {
        if (this.isDataSourceConfigured()) {
            dataSourceDispatcher.registerInstrument(this, this.config("source"), this.config("topic"))
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

    config = createSetterGetter(null, key => (key in this.configuration) ? this.configuration[key] : null)
    data = createSetterGetter((key, value) => (this.data[key] = value), key => (key in this.data) ? this.data[key] : null)
}

export default Instrument
