/*
 * This module defines the class representing one single instrument instance.
 */

class Instrument
{
    constructor(instrumentClass, element, configuration)
    {
        this.instrumentClass = instrumentClass
        this.element = element
        this.configuration = configuration
        this.data = {}
    }

    initialize()
    {
        this.instrumentClass.initialize(this)
    }

    setValue(value)
    {
        this.instrumentClass.setValue(this, value)
    }
}

export default Instrument
