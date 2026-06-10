/*
 * This module defines the class representing one single instrument instance.
 */

import createSetterGetter from "./sg.js"
import dataSourceDispatcher from "./data-source-dispatcher.js"
import Message from "@metrix/message.js"

const transformSize = (size, aspectRatio, directionToHeight) => {
    const match = size.match(/^(-?[0-9]*\.?[0-9]+)\s*(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax)$/)
    if (!match) {
        return null
    }
    const value = parseFloat(match[1])
    const unit = match[2]
    const convertedValue = directionToHeight ? value/aspectRatio : value*aspectRatio
    return `${convertedValue}${unit}`
}

class Instrument
{
    constructor(instrumentClass, element, configuration)
    {
        this.instrumentClass = instrumentClass
        this.element = element
        this.configuration = configuration
        this.priv = {"aspectRatio": null, "calculatedSize": null}
        this.data = {}
        Object.freeze(this)
        this.checkConfig(this.configuration)
        this.registerDataSource()
        this.updateAspectRatio()
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

    recalcSize()
    {
        if (this.priv.calculatedSize === "width") {
            const width = this.element.height() * this.priv.aspectRatio
            this.element.width(width)
        } else if (this.priv.calculatedSize == "height") {
            const height = this.element.width() / this.priv.aspectRatio
            this.element.height(height)
        }
    }

    updateAspectRatio()
    {
        const width = this.config("width")
        const height = this.config("height")
        this.element.css("overflow", "hidden")
        if (this.priv.aspectRatio === null) {
            this.element.css("width", (width !== null) ? width : "")
            this.element.css("height", (height !== null) ? height : "")
            this.priv.calculatedSize = null
        } else {
            if (width !== null) {
                const changedHeight = transformSize(width, this.priv.aspectRatio, true)
                this.element.css("width", width)
                this.element.css("height", (changedHeight !== null) ? changedHeight : "")
                this.priv.calculatedSize = (changedHeight !== null) ? null : "height"
            } else if (height !== null) {
                const changedWidth = transformSize(height, this.priv.aspectRatio, false)
                this.element.css("width", (changedWidth !== null) ? changedWidth : "")
                this.element.css("height", height)
                this.priv.calculatedSize = (changedWidth !== null) ? null : "width"
            } else {
                this.element.css("width", "")
                this.element.css("height", "")
                this.priv.calculatedSize = "height"
            }
        }
        this.recalcSize()
    }

    setAspectRatio(aspectRatio)
    {
        this.priv.aspectRatio = aspectRatio
        this.updateAspectRatio()
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

    config = createSetterGetter(null, key => (key in this.configuration) ? this.configuration[key] : null)
    data = createSetterGetter((key, value) => (this.data[key] = value), key => (key in this.data) ? this.data[key] : null)
}

export default Instrument
