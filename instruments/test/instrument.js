function initialize(instrument)
{
}

function setValue(instrument, value)
{
    instrument.element.find("span.value").text(value)
}

function destroy(instrument)
{
}

export {initialize, setValue, destroy}
