import metrix from "./metrix.js"
import $ from "jquery"

$(() => {
    metrix.update().then(() => console.log("metrix loaded"))
})

