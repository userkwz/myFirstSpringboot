//@ sourceURL=ajxxgk1.js
var dwbm;
var action;

$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('案件公开报表-发布信息统计表');
    var date = new Date();
    var yearList = getYearList();
    var monthList = getMonthList();
    $('#cmbYearS_ajxxgkdg1').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearE_ajxxgkdg1').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthS_ajxxgkdg1').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthE_ajxxgkdg1').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearS_ajxxgkdg1').combobox('select', date.getFullYear());
    $('#cmbMonthS_ajxxgkdg1').combobox('select', 1);
    $('#cmbYearE_ajxxgkdg1').combobox('select', date.getFullYear());
    $('#cmbMonthE_ajxxgkdg1').combobox('select', date.getMonth() + 1);
    //查询
    $('#btn_ajxxgk1_Search').click(function () {
            reload();
    });

    //导出
        $('#btn_ajxxgk1_Export').click(function () {
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

    $('#dateStart_ajxxgkdg1').datebox('setValue', getStartDate());
    $('#dateEnd_ajxxgkdg1').datebox('setValue', getEndDate());
    
    $('#btn_ajxxgk1_Export').click(function () {
        $('.easy_model_kuang').css({ width: "350px", height: "250px" });
        $('.easy_model').show();
    });
    $('#dclb').combobox({
        data: [{ "id": 0, "text": "按市一级" }, { "id": 1, "text": "按层级"}],
        valueField: 'id',
        textField: 'text'

    });
    //resizeGridMainRySize();

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

    var years = $("#cmbYearS_ajxxgkdg1").combobox("getValue");
    var months = $("#cmbMonthS_ajxxgkdg1").combobox("getValue");
    var yeare = $("#cmbYearE_ajxxgkdg1").combobox("getValue");
    var monthe = $("#cmbMonthE_ajxxgkdg1").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    
    var queryData = { action: 'Query_Ajxxgk_dg1', dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };
    $('#dg_ajxxgk1').treegrid({
        idField: 'dwbm',
        queryParams: queryData,
        url: '/Handler/agxe/agxeHandler.ashx?t=' + time.getMilliseconds(),
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        treeField: 'dwmc',
        fitColumns: true,
        scrollbarSize: 0,
        collapsible: true,
        onLoadSuccess: function (row, data) {
            var data = $('#dg_ajxxgk1').treegrid('getData');
            if (data[0].state == 'closed') {
                data[0].state = 'open';
                $('#dg_ajxxgk1').treegrid('loadData', data);
            }
        },
        columns: [
            [
                { title: '地区', field: 'dwmc', width: 250, rowspan: 2, align: 'left' },
                {
                    title: '案件程序性信息（件）',
                    field: 'XXSL',
                    width: 150,
                    align: 'center',
                    rowspan: 2,
                    formatter: function(value, row) {
                        if (row.XXSL > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 0 + '&quot;,&quot;' + 26 + '&quot;)">' + row.XXSL + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
//                {
//                    title: '辩护与代理预约（件）',
//                    field: 'YYSL',
//                    width: 150,
//                    align: 'center',
//                    rowspan: 2,
//                    formatter: function(value, row) {
//                        if (row.YYSL > 0) {
//                            return '<a href="javascript:void(0)" onclick="onClickGKXX(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;,&quot;' + 27 + '&quot;)">' + row.YYSL + '</a>';
//                        } else {
//                            return 0;
//                        }
//                    }
//                },
                { title: '法律文书', colspan: 4 }
            ], [
                {
                    title: '应公开数量（件）',
                    field: 'GKWS',
                    width: 150,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.GKWS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;,&quot;' + 32 + '&quot;)">' + row.GKWS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '已公开数量（件）',
                    field: 'YGKWS',
                    width: 150,
                    rowspan: 1,
                    align: 'center',
                    formatter: function(value, row) {
                        if (row.YGKWS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 2 + '&quot;,&quot;' + 32 + '&quot;)">' + row.YGKWS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '未公开数量（件）',
                    field: 'WGKWS',
                    width: 150,
                    rowspan: 1,
                    align: 'center',
                    formatter: function(value, row) {
                        if (row.WGKWS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 3 + '&quot;,&quot;' + 33 + '&quot;)">' + row.WGKWS + '</a>';
                        } else {
                            return '--';
                        }
                    }
                },
                {
                    title: '公开百分比（%）', field: 'BL', width: 150, rowspan: 1, align: 'center',
                    formatter: function (value, row) {
                        if (row.GKWS > 0 && row.GKWS != undefined) {
                            return row.BL + "%";
                        }
                        else
                            return '--';
                    }
                }
            ]
        ]
    });

}


function click_aj(dwbm, type, exportExcel) {
    this.dwbm = dwbm;
    this.action = type;

    var years = $("#cmbYearS_ajxxgkdg1").combobox("getValue");
    var months = $("#cmbMonthS_ajxxgkdg1").combobox("getValue");
    var yeare = $("#cmbYearE_ajxxgkdg1").combobox("getValue");
    var monthe = $("#cmbMonthE_ajxxgkdg1").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    
    var showColumn = action == 0 ? 0 : 6;
    onClickAJXX('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_ajgktj_ajxx', dateStart, dateEnd, showColumn, exportExcel);
}


function onClickAJXX(handlerUrl, dateStart, dateEnd, showColumn,exportExcel) {
    var time = new Date();
    var dwbm = this.dwbm;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        type: this.action,
        childType: 0,
        sjtype:2,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        showColumn: showColumn,
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '','');
}

function onClickGKXX(dwbm, index, exportExcel) {
    this.dwbm = dwbm;
    var years = $("#cmbYearS_ajxxgkdg1").combobox("getValue");
    var months = $("#cmbMonthS_ajxxgkdg1").combobox("getValue");
    var yeare = $("#cmbYearE_ajxxgkdg1").combobox("getValue");
    var monthe = $("#cmbMonthE_ajxxgkdg1").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    
    onClickAJXX2('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_ajgktj_ajxx', index, dateStart, dateEnd, '', '', 0, exportExcel);
}

function onClickAJXX2(handlerUrl, type, dateStart, dateEnd, lxmc, gklx, index,exportExcel) {
    var time = new Date();
    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: this.dwbm,
        type: type,
        sjtype: 2,
        childType: 0,
        dateStart: dateStart,
        dateEnd: dateEnd,
        lxmc: lxmc,
        gklx: gklx,
        index: index,
        sendEmail: 0, //是否显示发送邮件按钮
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}
function exportExcel() {
    var dclb = $("#dclb").combobox("getValue");

    var action = "ExportAjxxgk1Excel";
    if (dclb == 0) {
        action = "ExportAjxxgk1Excel_bak";
    }
    $.post('/Handler/agxe/agxeHandler.ashx?action=' + action,
        function (result) {
            frameObject.DownFiles(result);
        });
}