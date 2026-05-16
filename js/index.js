import metrixUpdate from "./metrix.js"
import $ from "jquery"

$(() => {
    metrixUpdate().then(() => console.log("metrix loaded"))
})

