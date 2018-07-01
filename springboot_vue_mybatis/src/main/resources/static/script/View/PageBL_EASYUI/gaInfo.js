//@ sourceURL= gainfo.js
var Tyyw_Bmsah;
var url = new UrlSearch();

$(document).ready(function () {
    //Tyyw_Bmsah = getQueryString(window.location.href, "bmsah");
    //Tyyw_Bmsah = "山东省院起诉受[2016]37000000031号";
    Tyyw_Bmsah = $('#div_win_bmsah').val();
    if (Tyyw_Bmsah == null) {
        var base = new Base64();

        Tyyw_Bmsah = base.decode(url.bmsah);
    }
    //Alert(Tyyw_Bmsah);
    if (Tyyw_Bmsah == null) {
        Alert("部门受案号为空");
        return;
    }
    //document.getElementById('iframe1').src = "/View/BL/BL_AJPC_EASYUI/GAXX/JZWJ.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah;
    Init();
    frameObject.ClearPicture();
});

function Init() {
    ShowProgress();

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
    //document.getElementById('iframe2').src = "/View/BL/BL_AJPC_EASYUI/GAXX/AJXX.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah + "&akname=" + akbm;
        $('#gaxx_panel').panel({
            href: '/View/BL/BL_AJPC_EASYUI/GAXX/AJXX.htm'
        });
}
//显示过程信息
function ShowGCXX(akbm) {
    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    $('#gaxx_gcakxh').val(akbm);
    //document.getElementById('iframe2').src = "/View/BL/BL_AJPC_EASYUI/GAXX/GCXX.htm?key=" + url.key + "&bmsah=" + Tyyw_Bmsah + "&akname=" + akbm;
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

function CloseThisProgress() {
    CloseProgress();
}


// 打开电子卷宗文件
function open_dossier_file(node, bmsah, jzbh) {

    var child = $(this.parent.document.iframe2.document.getElementById('gaxx_aj_tt'));
    child.children().children().children().children("#gaxx_panel").css("display", "none");
    var info = node.id.split("}@{");

    if (info != null && info.length > 2) {
        ShowProgress();

        // 获取电子卷宗文件
        $.ajax({
            type: 'POST',
            url: '/Handler/BL/GAXXHandler.ashx',
            data: { action: 'GetDossierFile', bmsah: bmsah, bm: jzbh },
            dataType: "json",
            success: function (result) {
                CloseProgress();

                try {
                    if (result.ErrMsg != null && result.ErrMsg != undefined && result.ErrMsg != '') {
                        Alert(result.ErrMsg);
                        return;
                    }

                    var success = new PDFObject({ url: result.Data,
                        pdfOpenParams: { scrollbars: '0', toolbar: '0', statusbar: '0' }
                    }).embed("gaxx_panel");
                } catch (e) {

                }
            }
        });
    }
    else {
        if (node.state == "closed") {
            $("#tree_caseinfo_doc_files").tree('expand', node.target);
        } else {
            $("#tree_caseinfo_doc_files").tree('collapse', node.target);
        }
    }
}