function initialize(element)
{
    console.log("initialize")
    return {element: element}
}

function setValue(value, instrument)
{
    console.log("setValue")
}

function destroy(instrument)
{

}

export {initialize, setValue, destroy}