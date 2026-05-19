function initialize(instrument)
{
    instrument.element.find("span.message").text(instrument.config("message"))
}

function setValue(instrument, value)
{
}

const applyDefaultConfigSchema = false

const configSchema = {
    type: "object",
    properties: {
        "message": {type: "string"},
    },
    required: ["message"]
}

export {initialize, setValue, applyDefaultConfigSchema, configSchema}
