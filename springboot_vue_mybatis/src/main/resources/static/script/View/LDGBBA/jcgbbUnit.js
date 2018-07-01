var v_dwbm;
var v_bmbm;
var v_year;
var v_ajzt;
$(function () {
    var user = frameObject.GetUserInfo();
    $('#jcgbbModal').window('close');
    v_dwbm = user.UnitCode;
    AddOperationLog('检查官统计报表-按单位统计');

    $('#dateStart_jcgbbUnit').datebox('setValue', getStartDate());
    $('#dateEnd_jcgbbUnit').datebox('setValue', getEndDate());
    //查询
    $('#btn_Search_jcgbbUnit').click(function () {
        reload();

    });

    //导出
    $('#btnExport_excel_jcgbbUnit').click(function () {
        ShowProgress();
        v_dwbm = $("#cboDWBM").combotree("getValue");
        var bmbm = $('#cboBMBM').combotree('getValues');
        dateStart = $('#dateStart_jcgbbUnit').datebox('getValue');
        dateEnd = $('#dateEnd_jcgbbUnit').datebox('getValue');
        var queryData = {
            action: 'ExportJCGBB2Excel',
            dwbm: v_dwbm,
            bmbm: bmbm.join('\',\''),
            startdate: dateStart,
            enddate: dateEnd,
            type: 'unit'
        };

        $.post('/Handler/JCGBB/JCGBBHandler.ashx', queryData,
            function (result) {
                CloseProgress();
                frameObject.DownFiles(result);
            });

    });


    //图表分析
    //        $('#btnExport_chart_jcgbbUnit').linkbutton({
    //        onClick: function () {
    //            $('#cb_bmbm').combotree({
    //                method: 'get',
    //                lines: true,
    //                multiple:true,
    //                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + v_dwbm,
    //                onChange: function (record) {
    //                    $('#cb_cbr').combotree({
    //                        method: 'get',
    //                        lines: true,
    //                        multiple: true,
    //                        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfoByBMBM&dwbm=' + v_dwbm+'&bmbm='+record
    //                    });
    //                }
    //            });
    //            var bmbm = $("#cboBMBM").combotree("getValues");
    //            $('#cb_bmbm').combotree('setValues', bmbm);
    //            $("#cb_sjlx").combotree({
    //                multiple: true,
    //                valueField: 'id',
    //                textField: 'text',
    //                data: ajztData
    //            });
    //            
    //            $('#JCGBBByUnit_Chart_window').window('open');
    //         }
    //    });

    $('#btnExport_chart_jcgbbUnit').click(function () {
        $('#jcgbbModal').window('open');
        InitChart([]);
        //$('.easy_model_kuang').css({ width: "80%", height: "80%" });
        $('#cb_bmbm').combotree({
            multiple: true,
            method: 'get',
            lines: true,
            url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + v_dwbm
        });

        var bmbm = $("#cboBMBM").combotree("getValues");
        if (bmbm != undefined)
            $('#cb_bmbm').combotree('setValues', bmbm);
        $('#cb_sjlx').combobox({
            data: ajztData,
            valueField: 'id',
            textField: 'text'
        });
        $('#cb_sjlx').combobox('select', 'zs');
        //$('.easy_model').show();
    });
    // 单位编码ComboTree初始化
    $('#cboDWBM').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cboDWBM').combotree('setValue', user.UnitCode);
            $('#cboBMBM').combotree({
                method: 'get',
                lines: true,
                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + user.UnitCode
            });
            reload();
        },
        onSelect: function (record) {
            $('#cboBMBM').combotree({
                method: 'get',
                lines: true,
                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + record.id
            });
            v_dwbm = record.id;
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });

    //分析
    $('#btnAnalyze').click(function () {
        var bmbm = $("#cb_bmbm").combotree("getValues");
        dateStart = $('#dateStart_jcgbbUnit').datebox('getValue');
        dateEnd = $('#dateEnd_jcgbbUnit').datebox('getValue');
        v_ajzt = $("#cb_sjlx").combotree("getValues");
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: v_dwbm, bmbm: bmbm.join('\',\''), startdate: dateStart, ebddate: dateEnd },
            url: "/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBTJ_Unit",
            success: function (result) {
                var data = eval(result);
                InitChart(data);
            }
        });

    });
    // 部门编码ComboTree初始化
    InitBMBMCombo(user.UnitCode);
});

$('.easy_model_gb').click(function () {
    $('.easy_model').hide();
});
$('.easy_model_kuang_fot_btqd').click(function () {
    exportExcel();
    $('.easy_model').hide();
});

var dateStart;
var dateEnd;
//检察官办案统计-按部门
function reload() {
    var time = new Date();

    v_dwbm = $("#cboDWBM").combotree("getValue");

    v_bmbm = $('#cboBMBM').combotree('getValues');
    dateStart = $('#dateStart_jcgbbUnit').datebox('getValue');
    dateEnd = $('#dateEnd_jcgbbUnit').datebox('getValue');
    var queryData = { action: 'Query_JCGBBTJ_Unit', dwbm: v_dwbm, bmbm: v_bmbm.join('\',\''), startdate: dateStart, enddate: dateEnd };

    $('#dg_jcgbbUnit').datagrid({
        queryParams: queryData,
        url: '/Handler/JCGBB/JCGBBHandler.ashx?t=' + time.getMilliseconds(),
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        fitColumns: true,
        expandible: false,
        columns: [[
            { title: '部门名称', field: 'bmmc', width: 200, rowspan: 2, align: 'left' },
            {
                title: '办案量', field: 'zs', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zs > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.bmbm + '&quot;,&quot;' + 0 + '&quot;)">' + row.zs + '</a>';
                        return x;
                    } else return row.zs;
                }
            },
            {
                title: '在办', field: 'zb', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.yb > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.bmbm + '&quot;,&quot;' + 1 + '&quot;)">' + row.zb + '</a>';
                        return x;
                    } else return row.yb;
                }
            },
            {
                title: '已办', field: 'yb', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zb > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.bmbm + '&quot;,&quot;' + 2 + '&quot;)">' + row.yb + '</a>';
                        return x;
                    } else return row.zb;
                }
            },
            {
                title: '归档', field: 'gd', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.gd > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.bmbm + '&quot;,&quot;' + 3 + '&quot;)">' + row.gd + '</a>';
                        return x;
                    } else return row.gd;
                }
            }
        ], []]
    });
}

var v_count;
var v_action;

function ExportDzjz1() {
    var dclb = $("#dclb").combobox("getValue");

    var action = "ExportDzjz1Excel";
    if (dclb == 0) {
        action = "ExportDzjz1Excel_bak";
    }
    $.post('/Handler/DZJZ/DZJZHandler.ashx?action=' + action,
        function (result) {
            //window.location.href = result;
            frameObject.DownFiles(result);
            $('#dlg_lb').window('close');
        });
}

function onClickAJXX(bmbm, ajzt, exportExcel) {
    var time = new Date();
    var sendEmail = 0;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: v_dwbm,
        bmbm: bmbm,
        ajzt: ajzt,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: sendEmail, //是否显示发送邮件按钮
        ajlb: '',
        lbbm: '',
        showColumn: 7,
        exportExcel: 37,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, '/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBAJXX_Time', jsonStr, '', '');
}

function InitBMBMCombo(dwbm) {
    $('#cboBMBM').combotree({
        multiple: true,
        method: 'get',
        lines: true,
        url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + dwbm,
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
}

var ajztData = [
        {
            id: 'zs',
            text: '总数'
        }, {
            id: 'zb',
            text: '在办'
        }, {
            id: 'yb',
            text: '已办'
        }, {
            id: 'gd',
            text: '归档'
        }
];
function InitChart(data) {
    var mc = "[";
    for (var j = 0; j < data.length; j++) {
        mc += "'" + data[j].bmmc + "'";
        if (j < data.length) {
            mc += ",";
        }
    }
    mc += "]";

    var series = [];
    for (var i = 0; i < v_ajzt.length; i++) {
        var str = "[";
        for (j = 0; j < data.length; j++) {
            str += data[j][v_ajzt[i]];
            if (j < data.length) {
                str += ",";
            }

        }
        str += "]";
        series.push({
            name: ajztData[i].text,
            data: eval(str)
        });
    }

    $('#JCGBBByUnit_Chart').highcharts({
        chart: {
            //backgroundColor: 'transparent'
            backgroundColor: '#08143C'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        xAxis: {
            categories: eval(mc),
            labels: {
                style: {
                    color: '#00e1e1'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: 'MyChart',
            width: 1200
        },
        credits: {
            enabled: false
        },
        series: series
    });
}
