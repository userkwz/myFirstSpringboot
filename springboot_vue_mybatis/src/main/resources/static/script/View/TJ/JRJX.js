//@ sourceURL=JRJX.js
$(function () {
    getHZTJ();
});

function getHZTJ() {
    $.ajax({
        type: "post",
        async: true,
        url: "/Handler/AJXX/AJXXHandler.ashx?action=GetJRJXTJ",
        success: function (data) {
            var result;
            if (data == null || data.length == 0 || data == "[]" || data == "{}") {
                //result = { agsls: 0, jsjzcs: 0, kttss: 0, smtzs: 0, wssl: 0, wbjajs: 0, bhydlsls: 0, ldgbbas: 0 ,xxsl:0};
                result = { agsls: 0, jsjzcs: 0, wbjajsl: 0, ybjlcwjssl: 0, wssl: 0, wbjajs: 0, bhydlsls: 0, ldgbbas: 0, xxsl: 0 };
            } else {
                result = eval('(' + data + ')')[0];
            }

            $("#pan_agsls").html("" + (result.agsls != 0 ? ("<a style=\"text-decoration: none;\">" + result.agsls + "</a>") : result.agsls));
            //            document.getElementById('pan_agsls').title = result.agsls + "件";
            $("#pan_jsjzcs").html("" + (result.jsjzcs != 0 ? ("<a style=\"text-decoration: none;\">" + result.jsjzcs + "</a>") : result.jsjzcs));
            //            document.getElementById('pan_jsjzcs').title = result.jsjzcs + "件";
            //$("#pan_kttss").html("" + (result.kttss != 0 ? ("<a style=\"text-decoration: none;\">" + result.kttss + "</a>") : result.kttss));
            //            document.getElementById('pan_kttss').title = result.kttss + "件";
            //$("#pan_smtzs").html("" + (result.smtzs != 0 ? ("<a style=\"text-decoration: none;\">" + result.smtzs + "</a>") : result.smtzs));

            $("#pan_wbjaj").html("" + (result.wbjajsl != 0 ? ("<a style=\"text-decoration: none;\">" + result.wbjajsl + "</a>") : result.wbjajsl));
            $("#pan_ybjlcwjs").html("" + (result.ybjlcwjssl != 0 ? ("<a style=\"text-decoration: none;\">" + result.ybjlcwjssl + "</a>") : result.ybjlcwjssl));

            $("#pan_cqajs").html("" + (result.cqajs != 0 ? ("<a style=\"text-decoration: none;\">" + result.cqajs + "</a>") : result.cqajs));
            //            document.getElementById('pan_wbjajs').title = result.wbjajs + "件";
            $("#pan_bhydlsls").html("" + (result.bhydlsls != 0 ? ("<a style=\"text-decoration: none;\">" + result.bhydlsls + "</a>") : result.bhydlsls));
            //            document.getElementById('pan_bhydlsls').title = result.bhydlsls + "件";
            $("#pan_ldgbbas").html("" + (result.ldgbbas != 0 ? ("<a style=\"text-decoration: none;\">" + result.ldgbbas + "</a>") : result.ldgbbas));
            //            document.getElementById('pan_ldgbbas').title = result.ldgbbas + "件";
            $("#pan_ajgks").html("" + (result.xxsl != 0 ? ("<a style=\"text-decoration: none;\">" + result.xxsl + "</a>") : result.xxsl));

            $("#pan_wsgks").html("" + (result.wssl != 0 ? ("<a style=\"text-decoration: none;\">" + result.wssl + "</a>") : result.wssl));
        },
        error: function (data) {

        }
    });
}

function onClickAJXX(index, showColumn, exportExcel, sendEmail, title) {
    var time = new Date();
    if (frameObject != null || frameObject != undefined) {
        var dwbm = frameObject.GetUserInfo().UnitCode;

        var queryData = {
            t: time.getMilliseconds(),
            bmsah: '',
            ajmc: '',
            dwbm: dwbm,
            bmbm: '',
            type: index,
            cbr: '',
            sjtype: "2",
            dateStart: getEndDate(),
            dateEnd: '' ,
            bjrqStart: '',
            bjrqEnd: '',
            wcrqStart: '',
            wcrqEnd: '',
            sendEmail: sendEmail, //是否显示发送邮件按钮
            showColumn: showColumn,
            exportExcel: exportExcel,
            selectedUrl: selectedUrl
        };
        var jsonStr = JSON.stringify(queryData);
        var url = caseListUrl;
        //if (index == 5 || index == 1) {
        //    url = caseListUrl1;
        //}
        frameObject.OpenDialogWeb(0, baseUrl + url, '/Handler/AJXX/AJXXHandler.ashx?action=GetJRJX_Ajxx', jsonStr, ' | ' + title, '');
    }
}