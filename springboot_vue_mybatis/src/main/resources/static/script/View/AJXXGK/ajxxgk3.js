var dwbm;
var action;

$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('案件公开报表-数据导入导出内网情况');
    //查询
    $('#btn_ajxxgk3_Search').click(function () {
            reload();
    });

    //导出
    $('#btn_ajxxgk3_Export').click(function () {
            $('#dlg_lb').dialog('open');
    });

    // 单位编码ComboTree初始化
    $('#cboDWBM').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cboDWBM').combotree('setValue', user.UnitCode);
            reload();
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#ckbDWBM').attr("checked", false);
                $("#ckbDWBM").attr("disabled", "disabled");
            } else {
                $("#ckbDWBM").removeAttr("disabled");
            }
        },
        onLoadError: function (data) {
            //alert("Error:" + data.responseText);
        }
    });

    $('#dateStart_ajxxgkdg3').datebox('setValue', getStartDate());
    $('#dateEnd_ajxxgkdg3').datebox('setValue', getEndDate());
    $('#btn_ajxxgk3_Export').click(function () {
        $('.easy_model_kuang').css({ width: "350px", height: "250px" });
        $('.easy_model').show();
    });
    $('#dclb').combobox({
        data: [{ "id": 0, "text": "按市一级" }, { "id": 1, "text": "按层级"}],
        valueField: 'id',
        textField: 'text'

    });

});
$('.easy_model_gb').click(function () {
    $('.easy_model').hide();
});
$('.easy_model_kuang_fot_btqd').click(function () {
    exportExcel();
    $('.easy_model').hide();
});
//案件信息公开
function reload() {
    var time = new Date();

    var dwbm = $("#cboDWBM").combotree("getValue");

    var dateStart = $('#dateStart_ajxxgkdg3').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg3').datebox('getValue');

    var queryData = { action: 'Query_Ajxxgk_dg3', t: time.getMilliseconds(), dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };
    $('#dg_ajxxgk3').treegrid({
        idField: 'dwbm',
        queryParams: queryData,
        url: '/Handler/agxe/agxeHandler.ashx?t=' + time.getMilliseconds(),
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        treeField: 'dwmc',
        fitColumns: true,
        collapsible: true,
        scrollbarSize: 0,
        onLoadSuccess: function (row, data) {
            var data = $('#dg_ajxxgk3').treegrid('getData');
            if (data[0].state == 'closed') {
                data[0].state = 'open';
                $('#dg_ajxxgk3').treegrid('loadData', data);
            }
        },
        columns: [
            [
                { title: '地区', field: 'dwmc', width: 250, rowspan: 2, align: 'left' },
                {
                    title: '案件程序性信息',
                    field: 'AJCXXXX',
                    width: 150,
                    align: 'center',
                    colspan:2
                },
//                {
//                    title: '重要案件信息',
//                    field: 'BHYDLYY',
//                    width: 150,
//                    align: 'center',
//                    colspan: 2
//                },
                {
                    title: '法律文书',
                    field: 'BHYDLYY',
                    width: 150,
                    align: 'center',
                    colspan: 2
                }
            ], [
                {
                    title: '导入次数（次）',
                    field: 'AJDRCS',
                    width: 150,
                    rowspan: 1,
                    align: 'center'
                },
                {
                    title: '导入间隔（天）',
                    field: 'AJDRJG',
                    width: 150,
                    rowspan: 1,
                    align: 'center'
                },
//                {
//                    title: '导入次数（次）',
//                    field: 'ZYDRCS',
//                    width: 150,
//                    rowspan: 1,
//                    align: 'center'
//                },
//                {
//                    title: '导入间隔（天）',
//                    field: 'ZYDRJG',
//                    width: 150,
//                    rowspan: 1,
//                    align: 'center'
//                },
                {
                    title: '导入次数（次）',
                    field: 'WSDRCS',
                    width: 150,
                    rowspan: 1,
                    align: 'center'
                },
                {
                    title: '导入间隔（天）',
                    field: 'WSDRJG',
                    width: 150,
                    rowspan: 1,
                    align: 'center'
                }
            ]
        ]
    });


}

function click_aj(dwbm, gklx) {
    this.dwbm = dwbm;
    this.action = action;

    var dateStart = $('#dateStart_ajxxgkdg1').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg1').datebox('getValue');
    onClickAJXX('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk3_aj1', dateStart, dateEnd, gklx);
}

function onClickAJXX(handlerUrl, dateStart, dateEnd, gklx) {
    var time = new Date();
    var dwbm = this.dwbm;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        gklx:gklx,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function exportExcel() {
    var dclb = $("#dclb").combobox("getValue");

    var action = "ExportAjxxgk3Excel";
    if (dclb == 0) {
        action = "ExportAjxxgk3Excel_bak";
    }
    $.post('/Handler/agxe/agxeHandler.ashx?action=' + action,
        function (result) {
            frameObject.DownFiles(result);
        });
}