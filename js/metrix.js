import $ from "jquery"

$(function (){
    $("div[data-metrix-instrument]").each(function () {
        const instrumentClass = $(this).attr("data-metrix-instrument")
        const cssClass = "metrix-instrument-" + instrumentClass
        $(this).addClass(cssClass)
    })
})