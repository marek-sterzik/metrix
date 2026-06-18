function initialize(instrument) {

    instrument.setAspectRatio(1.54); 
    console.log("digital-meter initialize");
}

function setValue(instrument, value) {
    console.log("digital-meter setValue:", value);

    const svgObject = document.querySelector('.metrix-instrument-digital-meter object');

    if (svgObject && svgObject.contentDocument) {
        

        const textElement = svgObject.contentDocument.getElementById('meter-value');
        
        if (textElement) {

            const tspanElement = textElement.querySelector('tspan');
            
            if (tspanElement) {

                tspanElement.textContent = Number(value).toFixed(1); 
            } else {

                textElement.textContent = Number(value).toFixed(1); 
            }
        }
    }
}

function destroy(instrument) {
    console.log("digital-meter destroy");
}

export {initialize, setValue, destroy};