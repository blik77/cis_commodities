function findError(text,idError){
    if(idError==="errorJDBCConnection"){
        if(text.indexOf("Could not get JDBC Connection")){
            showError(idError);
            return true;
        }
    }
    return false;
}
function showError(idError){
    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang][idError]);
}