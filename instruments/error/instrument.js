function initialize(instrument)
{
    instrument.element.find("span.message").text(instrument.config("message"))
}

function setValue(instrument, value)
{
}

export {initialize, setValue}
