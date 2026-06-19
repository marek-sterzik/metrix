function initialize(instrument) {
    instrument.setAspectRatio(1)

    console.log("led-indicator initialize")
}

function setValue(instrument, value) {
    console.log("LED VALUE:", value)

    const root = instrument.el
    const led = root?.querySelector('.led')

    if (!led) return

    led.classList.add('on')
}

function destroy(instrument) {
    console.log("led-indicator destroy")
}

export {
    initialize,
    setValue,
    destroy
}