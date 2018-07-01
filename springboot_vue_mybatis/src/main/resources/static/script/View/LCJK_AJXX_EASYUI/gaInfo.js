var Tyyw_Bmsah;
var url = new UrlSearch();
$(document).ready(function () {
    //Tyyw_Bmsah = getQueryString(window.location.href, "bmsah");
    //Tyyw_Bmsah = "山东省院起诉受[2016]37000000031号";
    AddOperationLog('个案信息');
    Tyyw_Bmsah = $('#div_win_bmsah').val();
    if (Tyyw_Bmsah == null) {
        Tyyw_Bmsah = url.bmsah;
    }
    //Alert(Tyyw_Bmsah);
    if (Tyyw_Bmsah == null) {
        Alert("部门受案号为空");
        return;
    }
    document.getElementById('iframe1').src = "/View/BL/LCJK_AJXX_EASYUI/GAXX/JZWJ.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah;
    Init();

    frameObject.ClearPicture();
    
    ////添加
    //$('#gaxx_lcjk').click(function(){
    //parent.showLCJK(Tyyw_Bmsah);
	//});
});

function Init() {


    $.post('/Handler/BL/GAXXHandler.ashx?action=' + escape("GetGcCardItem") + '&bmsah=' + Tyyw_Bmsah,
                function (result) {
                    $('#gaxx_gcList').children("li").remove();
                    $('#gaxx_gcList div').remove();
                    var data = eval(result);
                    if (data != null) {
                        for (var i = 0; i < data.length; i++) {
                            var li = $("<li></li>");
                            var a = $("<a></a>");
                            a.attr("onclick", "ShowGCXX(\"" + data[i].CardName + "\")");
                            a.append(data[i].Title);
                            li.append(a);
                            var div = $("<div></div>");
                            div.attr("class", "divider");
                            $('#gaxx_gcList').append(li);
                            $('#gaxx_gcList').append(div);

                        }
                    }
                });
                $.post('/Handler/BL/GAXXHandler.ashx?action=' + escape("GetCardItem") + '&bmsah=' + Tyyw_Bmsah,
                function (result) {
                    $('#gaxx_akList').children("li").remove();
                    $('#gaxx_akList div').remove();
                    var data = eval(result);
                    if (data != null) {
                        for (var i = 0; i < data.length; i++) {
                            var li = $("<li></li>");
                            var a = $("<a></a>");
                            a.attr("onclick", "ShowAJXX(\"" + data[i].CardName + "\")");
                            a.append(data[i].Title);
                            li.append(a);
                            var div = $("<div></div>");
                            div.attr("class", "divider");
                            $('#gaxx_akList').append(li);
                            $('#gaxx_akList').append(div);

                        }
                        $('#gaxx_card_tt').tabs('select', 0);
                        ShowAJXX(data[0].CardName);
                    }
                });
}
//显示案件信息
function ShowAJXX(akbm) {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    $('#gaxx_akxh').val(akbm);
    document.getElementById('iframe2').src = "/View/BL/LCJK_AJXX_EASYUI/GAXX/AJXX.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah + "&akname=" + akbm;
//    $('#gaxx_panel').panel({
//        href: '/View/BL/BL_AJPC/GAXX/AJXX.htm'
//    });
}
//显示过程信息
function ShowGCXX(akbm) {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    $('#gaxx_gcakxh').val(akbm);
    document.getElementById('iframe2').src = "/View/BL/LCJK_AJXX_EASYUI/GAXX/GCXX.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah + "&akname=" + akbm;
//    $('#gaxx_panel').panel({
//        href: '/View/BL/BL_AJPC/GAXX/GCXX.htm'
//    });
}
// 获取页面传递参数
function getQueryString(paramStr, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //var r = window.location.search.substr(1).match(reg);
    var r = paramStr.match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

function showLCJK() {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    var url = new UrlSearch();
    //document.getElementById('iframe2').src = "/View/AJXX/LCJKTCWT.htm?key=" + url.key + "&dwbm=" + url.dwbm + "&bmsah=" + Tyyw_Bmsah;


    frameObject.OpenDialogWeb(2, baseUrl + "/View/AJXX/LCJKTCWT.htm?key=" + url.key + "&dwbm=" + url.dwbm + "&bmsah=" + Tyyw_Bmsah, '', '', '发起流程监控', '');

}

function CloseThisProgress() {
    CloseProgress();
}