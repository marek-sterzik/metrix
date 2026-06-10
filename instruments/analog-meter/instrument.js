//import svg from "../../js/metrix-lib/svg.js"
import svg from "@metrix/svg.js"

function initialize(instrument)
{
    instrument.setAspectRatio(1.13)
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
