/*
 * This module defines basic (pre-javascript) setup of an element installing an metrix instrument into it.
 */

const setupElement = (element, instrumentClass, html) => {
        const cssClasses = ["metrix-instrument", "metrix-instrument-" + instrumentClass]
        for (var cls of cssClasses) {
            if (!element.hasClass(cls)) {
                element.addClass(cls)
            }
        }
        element.html(html)
}

export default setupElement
