function initialize(instrument) {
    instrument.setAspectRatio(0.6)
    
    const root = instrument.el

    if (!root){
        return
    }
        
    const checkbox = root.querySelector('.switch-hardware-input')

    if (checkbox) {

        checkbox.addEventListener('change', function(event) {
        
            event.stopPropagation()
            
            const isChecked = checkbox.checked
            console.log("[Metrix Input] Checkbox změnil stav na:", isChecked)

            root.dispatchEvent(new CustomEvent('change', {

                detail: { 
                    value: isChecked 
                },

                bubbles: true
            }))
        })
    }
    console.log("switch initialize")
}

function setValue(instrument, value) {
    console.log("switch setValue", value)
    
    const root = instrument.el

    if (!root){
        return
    }

    const checkbox = root.querySelector('.switch-hardware-input')

    if (!checkbox) {
         return
    }
       
    const shouldBeActive = (value === true || value === 1 || value === "true" || value === "on")

    if (checkbox.checked !== shouldBeActive) {
        checkbox.checked = shouldBeActive
    }
}

function destroy(instrument) {
    console.log("switch destroy")
}

export {
    initialize,
    setValue,
    destroy
}
