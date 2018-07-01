//@ sourceURL=dzjz1_tree.js
$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('电子卷宗报表-按单位统计');
    var date = new Date();
    var yearList = getYearList();
    var monthList = getMonthList();
    $('#cmbYearS').combobox({
        data:yearList,
        valueField: 'id',
		textField: 'text'

    });
    $('#cmbYearE').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthS').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthE').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#dclb').combobox({
        data: [{ "id": 0, "text": "按市一级" }, { "id": 1, "text": "按层级"}],
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearS').combobox('select', date.getFullYear());
    $('#cmbMonthS').combobox('select', 1);
    $('#cmbYearE').combobox('select', date.getFullYear());
    $('#cmbMonthE').combobox('select', date.getMonth() + 1);


    //查询
    $('#btn_dzjzdwtj_Search').click(function () {
            reload();
    });

    $('#btn_dzjzdwtj_Export_excel').click(function () {
        $('.easy_model_kuang').css({ width: "350px", height: "250px" });
        $('.easy_model').show();
    });

    //导出
    $('#btn_dzjzdwtj_Export_word').click( function () {
            ShowProgress();
            $.post('/Handler/DZJZ/DZJZHandler.ashx?action=ExportDzjz1Word',
            function (result) {
                CloseProgress();
                //window.location.href = result;
                frameObject.DownFiles(result);
            });
        
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
            alert("Error:" + data.responseText);
        }
    });
});

$('.easy_model_gb').click(function() {
    $('.easy_model').hide();
});
$('.easy_model_kuang_fot_btqd').click(function () {
    ExportDzjz1();
    $('.easy_model').hide();
});
//电子卷宗
function reload() {
    var time = new Date();

    var dwbm = $("#cboDWBM").combotree("getValue");

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    
    var queryData = { action: 'Query_Dzjz_dg1_tree', t: time.getMilliseconds(), dwbm: dwbm, years: years, yeare: yeare, months: months, monthe: monthe };

    $('#dg_dzjz1').treegrid({
        idField: 'dwbm',
        queryParams: queryData,
        url: '/Handler/DZJZ/DZJZHandler.ashx?t=' + time.getMilliseconds(),
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        treeField: 'dwmc',
        fitColumns: true,
        expandible: false,
        scrollbarSize:0,
        columns: [[
            { title: '地区', field: 'dwmc', width: 250, rowspan: 2, align: 'left' },
            {
                title: '应制作案件数（件）', field: 'ZSL', width: 120, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.ZSL > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX2(&quot;' + row.dwbm + '&quot;,&quot;' + 2 + '&quot;,&quot;' + 23 + '&quot;)">' + row.ZSL + '</a>';
                        return x;
                    }
                    else
                        return '--';
                }
            },
            { title: '已制作案件', colspan: 2 },
            {
                title: '未制作案件数（件）', field: 'WZZSL', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.WZZSL > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX2(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;,&quot;' + 3 + '&quot;)">' + row.WZZSL + '</a>';
                        return x;
                    }
                    else
                        return row.WZZSL;
                }
            },
            {
                title: '制作率（%）', field: 'ZZL', width: 100, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.ZSL > 0 && row.ZSL != undefined) {
                        return row.ZZL;
                    }
                    else
                        return '--';
                }
            },
            {
                title: '自定义制作案件数（件）', field: 'ZDYSL', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.ZDYSL > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX2(&quot;' + row.dwbm + '&quot;,&quot;' + 3 + '&quot;,&quot;' + 3 + '&quot;)">' + row.ZDYSL + '</a>';
                        return x;
                    }
                    else
                        return row.ZDYSL;
                }
            },
            { title: '律师阅卷导出案件数（件）', field: 'DCAJS', width: 150, rowspan: 2, align: 'center' },
        ],
        [
            {
                title: '制作数量（件）', field: 'YZZSL', width: 120, align: 'center', rowspan: 1,
                formatter: function (value, row) {
                    if (row.YZZSL > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX2(&quot;' + row.dwbm + '&quot;,&quot;' + 0 + '&quot;,&quot;' + 24 + '&quot;)">' + row.YZZSL + '</a>';
                        return x;
                    }
                    else
                        return row.YZZSL;
                }
            },
            { title: '卷（数）', field: 'JZCS', width: 120, align: 'center', rowspan: 1 },
            //{ title: '文件页数（页）', field: 'WJYS', width: 150, align: 'center', rowspan: 1 },
            //{ title: '存储大小（GB）', field: 'CCDX', width: 150, align: 'center', rowspan: 1 }
        ]],
        onLoadSuccess: function () {
            var data = $('#dg_dzjz1').treegrid('getData');
            if (data[0].state == 'closed') {
                data[0].state = 'open';
                $('#dg_dzjz1').treegrid('loadData', data);
            }
        }
    });
}

var v_dwbm;
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

function onClickAJXX2(dwbm, type, exportExcel) {
    var time = new Date();
    var sendEmail = 0;
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");

    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        type: type,
        sjtype: '2',
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: sendEmail, //是否显示发送邮件按钮
        ajlb: '',
        lbbm: '',
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, '/Handler/DZJZ/DZJZHandler.ashx?action=Query_Dzjz_dzjztj_ajxx', jsonStr, '', '');
}

