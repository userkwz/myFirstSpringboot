var url = new UrlSearch();
var Tyyw_Bmsah;
$(document).ready(function () {
    //Tyyw_Bmsah = getQueryString(window.location.href, "bmsah");
    //Tyyw_Bmsah = "山东省院起诉受[2016]37000000031号";
    Tyyw_Bmsah = $('#div_win_bmsah').val();
    if (Tyyw_Bmsah == null) {
        Tyyw_Bmsah = url.bmsah;
    }
    //Alert(Tyyw_Bmsah);
    if (Tyyw_Bmsah == null) {
        Alert("部门受案号为空");
        return;
    }

    initWinSendEmail();

    //document.getElementById('iframe1').src = "/View/BL/BL_AJPC/GAXX/JZWJ.htm?key=" + url.key + "&bmsah=" + bmsah;
    var nr = (url.nr ? url.nr : '');
    if (nr != '') {
        document.getElementById('sendEmail').style.display = "block";
    }
    if (url.showType != null && url.showType == "1") {
        var tab = $('#gaxx_card_tt').tabs('getTab', '未通过原因');
        $('#gaxx_card_tt').tabs('update', {
            tab: tab,
            options: {
                title: '数据约束条件'
            }
        });
    }
    Init(Tyyw_Bmsah, nr);
    frameObject.ClearPicture();
});

function Init(bmsah, nr) {
    ShowProgress();

    $.post('/Handler/BL/GAXXHandler.ashx?action=' + escape("GetGcCardItem") + '&bmsah=' + bmsah + '&nr=' + nr,
        function (result) {
            $('#gaxx_gcList').children("li").remove();
            $('#gaxx_gcList div').remove();
            var data = eval(result);
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    var li = $("<li></li>");
                    var a = $("<a></a>");
                    a.attr("onclick", "ShowGCXX(\"" + bmsah + "\",\"" + data[i].CardName + "\")");
                    a.append(data[i].Title);
                    li.append(a);
                    var div = $("<div></div>");
                    div.attr("class", "divider");
                    $('#gaxx_gcList').append(li);
                    $('#gaxx_gcList').append(div);

                }
            }
        });
    $.post('/Handler/BL/GAXXHandler.ashx?action=' + escape("GetCardItem") + '&bmsah=' + bmsah + '&nr=' + nr,
        function (result) {
            $('#gaxx_akList').children("li").remove();
            $('#gaxx_akList div').remove();
            var data = eval(result);
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    var li = $("<li></li>");
                    var a = $("<a></a>");
                    a.attr("onclick", "ShowAJXX(\"" + bmsah + "\",\"" + data[i].CardName + "\")");
                    a.append(data[i].Title);
                    li.append(a);
                    var div = $("<div></div>");
                    div.attr("class", "divider");
                    $('#gaxx_akList').append(li);
                    $('#gaxx_akList').append(div);

                }
                $('#gaxx_card_tt').tabs('select', 0);
                ShowAJXX(bmsah, data[0].CardName);
            }
        });
    $('#gaxx_wfgzList').html(decodeURI(nr));
}
//显示案件信息
function ShowAJXX(bmsah, akbm) {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    $('#gaxx_akxh').val(akbm);
    //document.getElementById('iframe2').src = "/View/BL/BL_AJPC_EASYUI/GAXX/AJXX.htm?key=" + url.key + "&bmsah=" + bmsah + "&akname=" + akbm;
        $('#gaxx_panel').panel({
            href: '/View/BL/BL_AJPC_EASYUI/GAXX/AJXX.htm'
        });
}
//显示过程信息
function ShowGCXX(bmsah, akbm) {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    $('#gaxx_gcakxh').val(akbm);
    //document.getElementById('iframe2').src = "/View/BL/BL_AJPC_EASYUI/GAXX/GCXX.htm?key=" + url.key + "&bmsah=" + bmsah + "&akname=" + akbm;
        $('#gaxx_panel').panel({
            href: '/View/BL/BL_AJPC_EASYUI/GAXX/GCXX.htm'
        });
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

function SendEmail() {
    var url = new UrlSearch();
//    document.getElementById('iframe_sendEmail').src = '../../Mail/mail.htm?key=' + url.key;
    //    $('#div_sendEmail').window('open');
    var cbdwmc = '';
    var nr = (url.nr ? url.nr : '');
    frameObject.OpenDialogWeb(2, baseUrl + sendMailUrl + '?key=' + url.key + '&dwbm=' + url.dwbm + '&sendMail=2&cbdw=' + cbdwmc + '&bmsah=' + url.bmsah + '&nr=' + nr, '', '', '发送邮件', '');
}
function initWinSendEmail() {
    $('#div_sendEmail').window({
        title: '发送邮件',
        width: 870,
        height: 620,
        modal: true,
        collapsible: false,
        maximizable: false,
        minimizable: false
    });
    $('#div_sendEmail').window('close');
}

function CloseThisProgress() {
    CloseProgress();
}