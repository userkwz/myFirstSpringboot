function load() {
    var parm = new UrlSearch();
    var bmsah = parm.bmsah;
    loadCaseInfo(bmsah);
    loadCaseLCJD(bmsah);
    loadJZDataGrid(bmsah);
}

//加载案件信息
function loadCaseInfo(bmsah) {
    $.post("/Handler/SAGL/SAGLHandler.ashx", { action: 'GetCaseInfo', bmsah: bmsah },
        function (result) {
            var data = eval('(' + result + ')');
            $('#form1').form('load', data[0]);

            if (data[0].sfswaj == 'Y') {
                $('#sfswaj').prop('checked', true);
            }
            if (data[0].sfdbaj == 'Y') {
                $('#sfdbaj').prop('checked', true);
            }
            if (data[0].sfgzaj == 'Y') {
                $('#sfgzaj').prop('checked', true);
            }
            if (data[0].sfjbaj == 'Y') {
                $('#sfjbaj').prop('checked', true);
            }
            if (data[0].sfzxhd == 'Y') {
                $('#sfzxhd').prop('checked', true);
            }


        });
}

function loadCaseLCJD(bmsah) {
    $.post("/Handler/SAGL/SAGLHandler.ashx", { action: 'GetCaseLCJD', bmsah: bmsah },
        function (result) {
            var data = eval('(' + result + ')');
            for (var i = 0; i < data.length; i++) {
                var html = '<div style="margin:0 auto;height: 50px;width: 650px; background-color: #76eec6; padding:5px;margin-top: 5px; font-size: 14px; color: blue;"> <div style="width: 215px; height: 50px; float: left; text-align: center; overflow: hidden; line-height: 50px; font-size: 16px;"> <span>' + data[i].lcjdmc + '</span></div> <div style="width: 215px; height: 50px; float: left; text-align: center; overflow: hidden;"> <div style="width: 50%; height: 50px; float: left; text-align: right;margin-top: 6px;"> <span style="display: block;">开始时间：</span> <span style="display: block;">处理时间：</span></div> <div style="width: 50%; height: 50px; float: left; text-align: left;margin-top: 6px;font-weight: bolder;"><span style="display: block;">' + data[i].cjsj + '</span> <span style="display: block;">' + data[i].jdjrsj + '</span></div></div><div style="width: 215px; height: 50px; float: left; text-align: center; overflow: hidden;"><div style="width: 50%; height: 50px; float: left; text-align: right;margin-top: 6px;"><span style="display: block;">到期日期：</span> <span style="display: block;">所用时长：</span></div><div style="width: 50%; height: 50px; float: left; text-align: left;margin-top: 6px;font-weight: bolder;"><span style="display: block;">' + data[i].jdlksj + '</span> <span style="display: block;">' + data[i].blgs + '</span></div></div></div>';
                if(i != data.length -1){
                    html += '<div style="background-image: url(../../images/lc/lc_down.png);margin: auto;width:20px;height:14px;margin-top: 5px;"></div>';
                }
                $('#lcjd').append(html);
            }
        });
}


//加载案件卷宗
function loadJZDataGrid(bmsah) {
    $("#dgSALBJZList").tree({
        url: '/Handler/SAGL/SAGLHandler.ashx?action=GetAJJZList&bmsah=' + bmsah,
        method: 'post',
        lines: true,
        onDblClick: function (node) {
            if (node.jzlx != '') {
                loadJZLR(node.id, node.jzlx);
            }
        }
    });
}

//加载卷宗内容
function loadJZLR(jzid, jzlx) {
    MaskUtil.mask();
    $.post("/Handler/SAGL/SAGLHandler.ashx", { action: 'GetAJJZ', jzid: jzid, jzlx: jzlx },
        function (data) {
            if (data.substr(0, 3) == 'err') {
                alert(data.substr(4));
                MaskUtil.unmask();
            } else {
                $('#showPdf').html('');
                if (data.substr(data.lastIndexOf('.') + 1) != 'pdf') {
                    loadTP(data);
                } else {
                    loadPDF(data);
                }
            }
        });
}


function loadPDF(pdfPath) {
    var success = new PDFObject({
        url: pdfPath,
        pdfOpenparams: {
            scrollbars: '0',
            toolbar: '0',
            statusbar: '0'
        }
    }).embed('showPdf');
    MaskUtil.unmask();
}

function loadTP(tpPath) {
    $('#showPdf').append('<img src="' + tpPath + '" alt="图片1" >');
    MaskUtil.unmask();
}

var MaskUtil = (function () {
    var $mask, $maskMsg;
    var defMsg = '正在加载卷宗，请稍等......';
    function init() {
        if (!$mask) {
            $mask = $("<div class=\"datagrid-mask mymask\"></div>").appendTo("#tt");
        }
        if (!$maskMsg) {
            $maskMsg = $("<div class=\"datagrid-mask-msg mymask\">" + defMsg + "</div>")
                .appendTo("#tt").css({ 'font-size': '12px' });
        }
        $mask.css({ width: "100%", height: $(document).height() });
        var scrollTop = $(document.body).scrollTop();
        $maskMsg.css({
            left: ($(document.body).outerWidth(true) - 190) / 2
            , top: (($(window).height() - 45) / 2) + scrollTop
        });
    }
    return {
        mask: function (msg) {
            init();
            $mask.show();
            $maskMsg.html(msg || defMsg).show();
        }
        , unmask: function () {
            $mask.hide();
            $maskMsg.hide();
        }
    }
} ());
