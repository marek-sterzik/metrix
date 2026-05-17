const w = 20

function initialize(instrument)
{
    instrument.setWidth(w + "em").setHeight((w/1.13) + "em")
    console.log("analog-meter initialize")
}

function setValue(instrument, value)
{
    console.log("analog-meter setValue", value)
}

function destroy(instrument)
{
    console.log("analog-meter setValue")
}

export {initialize, setValue, destroy}
