// Function that disables all other checkboxes, when a checkbox is selected
function ckChange(ckType){
    var ckName = document.getElementsByName(ckType.name);
    var checked = document.getElementById(ckType.id);

    if (checked.checked) {
        for(var i=0; i < ckName.length; i++){

            if (!ckName[i].checked){
                ckName[i].disabled = true;
            }else{
                ckName[i].disabled = false;
            }
        }
    }
    else {
        for(var a=0; a < ckName.length; a++){
            ckName[a].disabled = false;
        }
    }
}