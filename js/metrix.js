/*
 * This is the main metrix code. It provides the metrix instance as a default export.
 */
import metrixUpdate from "./metrix-update.js"

class Metrix
{
    update(element = undefined)
    {
        return metrixUpdate(element)
    }
}

export default new Metrix
