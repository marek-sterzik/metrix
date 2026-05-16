/*
 * This module allows to load css classes into a single <style> element in the head of the document.
 */

import $ from "jquery"

var element = null
var content = ""

$(() => {
    element = $("<style>")
    $("head").append(element)
    element.text(content)
    content = ""
})



const installCss = (css) => {
    css = css + "\n\n"
    if (element === null) {
        content += css
    } else {
        element.text(element.text() + css)
    }
}

export default installCss
