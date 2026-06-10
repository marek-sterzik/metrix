/*
 * This module defines the default JSON schmea for validating configuration of all modules. This may be disabled by exporting
 * const applyDefaultConfigSchema = false in the instrument.js file
 */

const defaultSchema = {
    type: "object",
    properties: {
        "topic": {type: "string"},
        "source": {type: "string"},
    },
    required: ["topic", "source"]
}

export default defaultSchema
