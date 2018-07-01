//var dNode;    /*tree的顶级节点*/
//var sExpandNode; /*tree要选中并展开的节点*/
var yjsPcNodes;
var Tyyw_Bmsah;
$(document).ready(function () {
    if (Tyyw_Bmsah == null) {
        var url = new UrlSearch();
        Tyyw_Bmsah = url.bmsah;
    }

    // 卷宗文件树
    $("#tree_caseinfo_doc_files").tree({
        url: '/Handler/BL/GAXXHandler.ashx?action=GetCaseFiles&bmsah=' + Tyyw_Bmsah,
        lines: true,
        animate: true,
        onLoadSuccess: function (node, data) {
            if (data == null)
                return;

            // 展开根目录
            ExpandWSNodeByBM();
        }
    });

    // 清理本地存放附件
    $.ajax({
        url: '/Handler/BL/GAXXHandler.ashx',
        data: { action: 'GetLocalFilePath' },
        success: function (result) {
            //删除目录及文件
            try {
                //boundObjectForJS.deleteDirectory(result);
            } catch (e) {

            }
        }
    });

    // 关闭按钮
    $('#btn_win_caseinfo_doc_files_close').linkbutton({
        iconCls: 'icon-cancel',
        onClick: function () {
            $('#win_caseinfo_doc_files').window('close');
        }
    });

    // 点击树形控件页面跳转
    $('#tree_caseinfo_doc_files').tree({
        onDblClick: function (node) {
            // 展开选中节点
            if (node.state == "closed") {
                $("#tree_caseinfo_doc_files").tree('expand', node.target);
            }

            var bm = node.id;
            var type = node.type;
            var bmsah = node.bmsah;

            // 打开文书卷宗
            if (type == "2") {
                // 调整文书控件大小
                resize_lay_ajxx_and_divDoc();

                // 打开文书
                if (node.wjlx == "1") {
                    open_doc_file(node, bmsah, bm, '1');
                }
                // 下载附件到本地并用本机默认程序打开
                else if (!isNull(node.wjlx)) {
                    open_doc_file(node, bmsah, bm, '2');
                }

                $('#lay_ajxx').panel({
                    onResize: function (width, height) {
                        resize_lay_ajxx_and_divDoc();
                    }
                });
            }
            //打开用印后文书，弹出IE窗口打开
            else if (type == "3") {
                open_doc_file_sealed(node, bmsah, bm);
            }
            //打开电子卷宗
            else {
                open_dossier_file(node, bmsah, bm);
            }
        }
    });
});

// 打开文书，type：1.文书，2.附件
// 文书：调用文书控件打开文书
// 附件：下载附件到本地，并用本地默认程序打开文件
function open_doc_file(node, bmsah, wsbh, type) {

    ShowProgress();

    // 获取文书并用文书控件加载文书
    $.ajax({
        type: 'POST',
        url: '/Handler/CaseInfo/index.ashx',
        data: { action: 'GetDocmentFile', pcslbm: Tyyw_Pcslbm, bmsah: bmsah, wsbh: wsbh, sfws: type },
        dataType: "json",
        success: function (result) {

            if (result == null || result == undefined) {
                CloseProgress();
                Alert("服务端返回数据为空。");
                return;
            }

            if (result.ErrMsg != null && result.ErrMsg != undefined && result.ErrMsg != '') {
                CloseProgress();
                Alert(result.ErrMsg);
                return;
            }

            try {
                var ext = result.Data.substring(result.Data.lastIndexOf('.'));
                document.getElementById('divDoc').style.background = "";
                switch (ext) {
                    case ".pdf":
                        // PDF方式打开文书
                        document.getElementById('divDoc').style.display = "none";
                        document.getElementById('gaxx_panel').style.display = "";
                        CloseProgress();
                        var success = new PDFObject({ url: result.Data,
                            pdfOpenParams: { scrollbars: '0', toolbar: '0', statusbar: '0' }
                        }).embed("gaxx_panel");
                        break;
                    case ".doc":
                        // 加载文书
                        document.getElementById('gaxx_panel').style.display = "none";
                        document.getElementById('divDoc').style.display = "";
                        var error = OpenWSSL(result.Data, "TANGER_OCX");

                        CloseProgress();
                        if (!isNull(error)) {
                            Alert(error);
                        }

                        // 只读
                        SetSaveButtonState("TANGER_OCX", false);
                        break;
                    case ".png":
                    case ".jpg":
                    case ".bpm":
                        document.getElementById('divDoc').style.display = "none";
                        document.getElementById('gaxx_panel').style.display = "";
                        document.getElementById('gaxx_panel').style.image = result.Data;
                        break;
                    default:
                        // 附件
                        var arr = result.Data.split(',');

                        // 下载附件
                        data = boundObjectForJS.downloadFile(arr[1] + "," + arr[2]);

                        CloseProgress();
                        // 调用本机默认程序打开附件
                        boundObjectForJS.callDefaultEXE(data);
                        break;
                }
                //                if (type == '1') {
                //                    // 加载文书
                //                    document.getElementById('gaxx_panel').style.display = "none";
                //                    document.getElementById('divDoc').style.display = "";
                //                    var error = OpenWSSL(result.Data, "TANGER_OCX");

                //                    CloseProgress();
                //                    if (!isNull(error)) {
                //                        Alert(error);
                //                    }

                //                    // 只读
                //                    SetSaveButtonState("TANGER_OCX", false);
                //                } else if (type == '2') {
                //                    // 附件
                //                    var arr = result.Data.split(',');

                //                    // 下载附件
                //                    data = boundObjectForJS.downloadFile(arr[1] + "," + arr[2]);

                //                    CloseProgress();
                //                    // 调用本机默认程序打开附件
                //                    boundObjectForJS.callDefaultEXE(data);
                //                }

            } catch (e) {

                CloseProgress();
            }
        }
    });
}

// 打开用印后文书
function open_doc_file_sealed(node, bmsah, wsbh) {

    ShowProgress();

    // 获取用印后文书，IE打开
    $.ajax({
        type: 'POST',
        url: '/Handler/CaseInfo/index.ashx',
        data: { action: 'GetSealedFile', pcslbm: Tyyw_Pcslbm, bmsah: bmsah, yyhwsbh: wsbh },
        dataType: "json",
        success: function (result) {
            CloseProgress();

            try {
                if (result.ErrMsg != null && result.ErrMsg != undefined && result.ErrMsg != '') {
                    Alert(result.ErrMsg);
                    return;
                }

                boundObjectForJS.callEXE('iexplore,' + result.Data);
            } catch (e) {

            }
        }
    });
}

// 打开电子卷宗文件
function open_dossier_file(node, bmsah, jzbh) {

    document.getElementById('divDoc').style.display = "none";
    document.getElementById('gaxx_panel').style.display = "";
    var info = node.id.split("}@{");

    if (info != null && info.length > 2) {
        ShowProgress();

        // 获取电子卷宗文件
        $.ajax({
            type: 'POST',
            url: '/Handler/CaseInfo/index.ashx',
            data: { action: 'GetDossierFile', pcslbm: Tyyw_Pcslbm, bmsah: bmsah, bm: jzbh },
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

// 改变案卡信息的宽度和高度
function resize_lay_ajxx_and_divDoc() {
    var height = $('#lay_ajxx').height();
    var width = $('#lay_ajxx').width();
    $('#divDoc').height(height);
    $('#divDoc').width(width - 250);
}

// 通过编码展开节点，并选中文书
function ExpandWSNodeByBM() {
    //if (isNull(OpenWS_MBBH)) {
    //    return;
    //}
    //if (!$('#tree_caseinfo_doc_files')) return;
    //var rootNotes = $('#tree_caseinfo_doc_files').tree('getRoots'), children;
    //for (var i = 0; i < rootNotes.length; i++) {
    //    if (rootNotes[i].id == '-2') {
    //        //如果匹配到则展开选中节点
    //        $('#tree_caseinfo_doc_files').tree('select', rootNotes[i].target);
    //        $('#tree_caseinfo_doc_files').tree('expand', rootNotes[i].target);
    //    }
    //    children = $('#tree_caseinfo_doc_files').tree('getChildren', rootNotes[i].tartget);
    //    for (var j = 0; j < children.length; j++) {
    //        if (children[j].mbbh == OpenWS_MBBH) {
    //            //如果匹配到则选中节点，展开父节点
    //            $('#tree_caseinfo_doc_files').tree('select', children[j].target);
    //            $('#tree_caseinfo_doc_files').tree('expand', children[j].target);
    //            var pNode = $('#tree_caseinfo_doc_files').tree('getParent', children[j].target);
    //            $('#tree_caseinfo_doc_files').tree('expand', pNode.target);
    //            var ppNode = $('#tree_caseinfo_doc_files').tree('getParent', pNode.target);
    //            $('#tree_caseinfo_doc_files').tree('expand', ppNode.target);
    //            //return;
    //        }
    //    }
    //}
}
