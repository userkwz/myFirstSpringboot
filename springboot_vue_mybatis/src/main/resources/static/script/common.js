var frameObejct = {name :"kwz"}
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    console.log(strFullPath+"------"+strPath)
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    console.log(strFullPath+"------"+strPath+"-----"+postPath)
    return (prePath + postPath);
};
function AddScript(type, src) {
    var add = true;
    var oHead = document.getElementsByTagName('head').item(0);
    for (var i = 0; i < oHead.childNodes.length; i++) {
        if (oHead.childNodes[i].src && oHead.childNodes[i].src.indexOf(src.replace(/\.\.\//g, '')) != -1) {
            var oScirpt = document.createElement("script");
            oScirpt.type = type;
            oScirpt.src = src;

            oHead.replaceChild(oScirpt, oHead.childNodes[i]);
            add = false;
            break;
        }
    }
    if (add) {
        var scirpt = document.createElement("script");
        scirpt.type = type;
        scirpt.src = src;
        oHead.appendChild(scirpt);
    }
}