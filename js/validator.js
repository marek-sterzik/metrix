
import Ajv from "ajv/dist/2020.js"

const ajv = new Ajv()

class Validator
{
    constructor(schema)
    {
        this.compiled = ajv.compile(schema)
    }

    validate(data)
    {
        if (!this.compiled(data)) {
            throw this.compiled.errors[0].message
        }
        return true
    }
}

const validator = (schema) => new Validator(schema)

export default validator
