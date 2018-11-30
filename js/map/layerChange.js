function changeLayer(thisObject, thisId){

    if(document.getElementById(thisId).checked)
        dataLayerName = thisId;
    else
        dataLayerName = '';

    ckChange(thisObject);
    changeMapStyle(mapname, dataLayerName);

}