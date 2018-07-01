$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('电子卷宗报表-按类别统计');
    var date = new Date();
    var yearList = getYearList();
    var monthList = getMonthList();
    $('#cmbYearS').combobox({
        data:yearList,
        valueField: 'id',
		textField: 'text'

    });
    $('#cmbYearE').combobox({
        data:yearList,
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
    $('#cmbYearS').combobox('select', date.getFullYear());
    $('#cmbMonthS').combobox('select', 1);
    $('#cmbYearE').combobox('select', date.getFullYear());
    $('#cmbMonthE').combobox('select', date.getMonth() + 1);

    //查询
    $('#btn_dzjzlbtj_Search').click(function () {
            reload();
    });

    //导出
    $('#btn_dzjzlbtj_Export_excel').click(function() {
        $.post('/Handler/DZJZ/DZJZHandler.ashx?action=ExportDzjz2Excel',
            function(result) {
                //window.location.href = result;
                frameObject.DownFiles(result);
            });

    });

    //导出
    $('#btn_dzjzlbtj_Export_word').click(function() {
        $.post('/Handler/DZJZ/DZJZHandler.ashx?action=ExportDzjz2Word',
            function(result) {
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

//电子卷宗
function reload() {
    var time = new Date();

    var dwbm = $("#cboDWBM").combotree("getValue");

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    var sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
    var startTime = years + "-" + months + "-1";
    var endTime = "";
    if(monthe<=12)
        endTime = yeare + "-" + monthe + "-1";
    else {
        endTime = (parseInt(yeare) + 1) + "-1-1";
    }
    var queryData = { action: 'Query_DZJZ_AJLBTJ', t: time.getMilliseconds(), dwbm: dwbm, sjtype:sjtype, dateStart: startTime, dateEnd: endTime, monthe: monthe, type: '1'};

    
    $('#dg_dzjz2').datagrid({
        queryParams: queryData,
        url: '/Handler/DZJZ/DZJZHandler.ashx?t=' + time.getMilliseconds(),
        loadMsg: '数据加载中，请稍候...',
        scrollbarSize:0,
        fitColumns: true,
        columns: [[
//            { title: '案件类别编码', field: 'bm', width: 100, align: 'center' },
            {title: '案件类别名称', field: 'mc', width: 200, rowspan: 2, align: 'center' },
            { title: '应制作数量（件）', field: 'zs', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zs > 0 && row.children == undefined) {
                        var x = '<a href="javascript:void(0)" onclick="reloadCaseInfo(&quot;' + row.bm + '&quot;,&quot;' + 2 + '&quot;,&quot;' + 23 + '&quot;)">' + row.zs + '</a>';
                        return x;
                    }
                    else
                        return '--';
                }
            },
            { title: '已制作数量（件）', field: 'yzzs', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.yzzs > 0 && row.children == undefined) {
                        var x = '<a href="javascript:void(0)" onclick="reloadCaseInfo(&quot;' + row.bm + '&quot;,&quot;' + 0 + '&quot;,&quot;' + 24 + '&quot;)">' + row.yzzs + '</a>';
                        return x;
                    }
                    else
                        return row.yzzs;
                }
            },
            { title: '未制作数量（件）', field: 'wzzs', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.wzzs > 0 && row.children == undefined) {
                        var x = '<a href="javascript:void(0)" onclick="reloadCaseInfo(&quot;' + row.bm + '&quot;,&quot;' + 1 + '&quot;,&quot;' + 3 + '&quot;)">' + row.wzzs + '</a>';
                        return x;
                    }
                    else
                        return row.wzzs;
                }
            },
            {
                title: '制作率（%）', field: 'zzl', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zs == 0 || row.zs == undefined) {
                        return '--';
                    }
                    else
                        return row.zzl;
                }
            }
        ],[]]
    });
}


var v_ajlb;
var v_count;

////应制作
//function click_aj(ajlb, count) {
//    //$('#div_aj').window('open');
//    reloadCaseInfo(ajlb, count, 'Query_Dzjz_albtj_ygzz_ajxx');
//}

////已制作
//function click_aj2(ajlb, count) {
//    //$('#div_aj').window('open');
//    reloadCaseInfo(ajlb, count, 'Query_Dzjz_albtj_yjzz_ajxx');
//}

function reloadCaseInfo(ajlb, index, exportExcel) {

    v_ajlb = ajlb;
    //如果是二审抗诉案件或审判监督案件则查询此类案件的源案件类别
    var ajlbjh = '';
    if (ajlb == '0304') {
        ajlb = '';
        ajlbjh = '(\'0304\',\'0311\',\'0325\',\'0326\')';
    }
    else if (ajlb == '0305') {
        ajlb = '';
        ajlbjh = '(\'0305\',\'0901\',\'0903\',\'0913\')';
    }
    v_count = index;

    var dwbm = $("#cboDWBM").combotree("getValue");
    var bmsah = $('#txt_case_bmsah').val();
    var ajmc = $('#txt_case_ajmc').val();
    var sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");

    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    //入库
    var queryData = { 
        action: 'Query_Dzjz_dzjztj_ajxx',
        ajmc: ajmc,
        bmsah: bmsah,
        dwbm: dwbm,
        cbr: '',
        dateStart: dateStart,
        dateEnd: dateEnd,
        type: index,
        ajlb: ajlb,
        lbbmjh: ajlbjh,
        sjtype: sjtype, 
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };

    var time = new Date();
    var jsonStr = JSON.stringify(queryData);
    var handlerUrl = "/Handler/DZJZ/DZJZHandler.ashx?t=" + time.getMilliseconds();
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

