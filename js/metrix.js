/*
 * This is the main metrix code. It provides the metrix instance as a default export.
 */

import metrixUpdate from "./metrix-update.js"
import $ from "jquery"

var waitLoad = new Promise((success, fail) => $(() => {
    success();
    waitLoad = null
}))

var loaded = false

class Metrix
{
    constructor()
    {
        Object.freeze(this)
    }

    async update(element = undefined)
    {
        if (waitLoad !== null) {
            await waitLoad
        }
        const ret = await metrixUpdate(element)
        if (!loaded) {
            loaded = true
            console.log("metrix loaded")
        }
        return ret
    }

    jQuery = $
}

export default new Metrix
