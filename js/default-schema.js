/*
 * This module defines the default JSON schmea for validating configuration of all modules. This may be disabled by exporting
 * const applyDefaultConfigSchema = false in the instrument.js file
 */

const sizePattern = "^-?[0-9]*\\.?[0-9]+\s*(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)$"

const defaultSchema = {
    type: "object",
    properties: {
        "topic": {
            "type": ["string", "null"]
        },
        "source": {
            "type": ["string", "null"]
        },
        "width": {
            "type": "string",
            "pattern": sizePattern,
        },
        "height": {
            "type": "string",
            "pattern": sizePattern,
        }
    },
}

export default defaultSchema
