/*
 * This module defines the low-level loading procedures for the metrix instrument parts
 */

const loadHtml = async (id) => {
    try {
        return (await import(/* webpackMode: "eager" */ "../instruments/" + id + "/template.html")).default
    } catch (e) {
        return null
    }
}

const loadCode = async (id) => {
    try {
        return await import(/* webpackMode: "eager" */ "../instruments/" + id + "/instrument.js")
    } catch (e) {
        return null
    }
}

const loadCss = async (id) => {
    try {
        return (await import(/* webpackMode: "eager" */ "../instruments/" + id + "/style.css")).default
    } catch (e) {
        return null
    }
}

export {loadHtml, loadCode, loadCss}
