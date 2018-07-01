//@ sourceURL=ajxxgk2.js
var dwbm;
var action;
$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('案件公开报表-案件程序性公开统计表');
    //查询
    $('#btn_ajxxgk2_Search').click( function () {
            reload();
    });

    //导出
        $('#btn_ajxxgk2_Export').click( function () {
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

    $('#dateStart_ajxxgkdg2').datebox('setValue', getStartDate());
    $('#dateEnd_ajxxgkdg2').datebox('setValue', getEndDate());
    $('#btn_ajxxgk2_Export').click(function () {
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

    var dateStart = $('#dateStart_ajxxgkdg2').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg2').datebox('getValue');

    var queryData = { action: 'Query_Ajxxgk_dg2', dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };

    $('#dg_ajxxgk2').treegrid({
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
            var data = $('#dg_ajxxgk2').treegrid('getData');
            if (data[0].state == 'closed') {
                data[0].state = 'open';
                $('#dg_ajxxgk2').treegrid('loadData', data);
            }
        },
        columns: [
            [
                { title: '地区', field: 'dwmc', width: 250, rowspan: 2, align: 'left' },
                {
                    title: '已公开案件（件）',
                    field: 'YGK',
                    width: 150,
                    align: 'center', 
                    rowspan: 2,
                    formatter: function(value, row) {
                        if (row.YGK > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 2 + '&quot;,&quot;' + 34 + '&quot;)">' + row.YGK + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '已办结案件（件）',
                    field: 'YBJ',
                    width: 150,
                    align: 'center', 
                    rowspan: 2,
                    formatter: function(value, row) {
                        if (row.YBJ > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;,&quot;' + 35 + '&quot;)">' + row.YBJ + '</a>';
                        } else {
                            return '--';
                        }
                    }
                },
                {
                    title: '案件程序性信息公开百分比（%）',
                    field: 'BL',
                    width: 150, 
                    rowspan: 2,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.YBJ > 0 && row.YBJ != undefined) {
                            return row.BL;
                        }
                        else
                            return '--';
                    }
                }
            ],[]
        ]
    });


    //$('#dg_ajxxgk2').datagrid({
    //    queryParams: queryData,
    //    url: '/Handler/agxe/agxeHandler.ashx?t=' + time.getMilliseconds(),
    //    loadMsg: '数据加载中，请稍候...'
    //});
}

function click_aj(dwbm, action,exportExcel) {
    this.dwbm = dwbm;
    this.action = action;

    var dateStart = $('#dateStart_ajxxgkdg2').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg2').datebox('getValue');
    //    reloadCaseInfo(dwbm, action);
    onClickAJXX('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk2_aj' + action, dateStart, dateEnd,exportExcel);

}


function onClickAJXX(handlerUrl, dateStart, dateEnd, exportExcel) {
    var time = new Date();
    var dwbm = this.dwbm;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function exportExcel() {
    var dclb = $("#dclb").combobox("getValue");

    var action = "ExportAjxxgk2Excel";
    if (dclb == 0) {
        action = "ExportAjxxgk2Excel_bak";
    }
    $.post('/Handler/agxe/agxeHandler.ashx?action=' + action,
        function (result) {
            frameObject.DownFiles(result);
        });
}