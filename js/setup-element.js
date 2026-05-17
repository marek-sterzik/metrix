/*
 * This module defines basic (pre-javascript) setup of an element installing an metrix instrument into it.
 */

const getCssClasses = (instrumentClass) => ["metrix-instrument", "metrix-instrument-" + instrumentClass]

const setupElement = (element, instrumentClass, html) => {
        const cssClasses = getCssClasses(instrumentClass)
        for (var cls of cssClasses) {
            if (!element.hasClass(cls)) {
                element.addClass(cls)
            }
        }
        element.html(html)
}

const destroyElement = (element, instrumentClass) => {
        const cssClasses = getCssClasses(instruemntClass)
        for (var cls of cssClasses) {
            if (element.hasClass(cls)) {
                element.removeClass(cls)
            }
        }
        element.html("")
}

export {setupElement, destroyElement}
