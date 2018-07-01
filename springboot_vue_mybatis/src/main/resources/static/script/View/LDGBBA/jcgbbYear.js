//@ sourceURL=jcgbbYear.js
var v_dwbm;
var v_years;
var v_yeare;
var ajlb_all_select = false;
$(function () {
    var user = frameObject.GetUserInfo();
    $('#jcgbbModal').window('close');
    v_dwbm = user.UnitCode;
    AddOperationLog('检查官统计报表-按年统计');
    var date = new Date();
    var yearList = getYearList();
    $('#cmbYearS_jcgbbYear').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearE_jcgbbYear').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });

    $('#cmbYearS_jcgbbYear').combobox('select', date.getFullYear() - 2);
    $('#cmbYearE_jcgbbYear').combobox('select', date.getFullYear());
    //查询
    $('#btnSearch_jcgbbYear').click(function () {
        reload();
    });

    //导出
    $('#btnExportExcel_jcgbbYear').click(function () {
        ShowProgress();
        v_dwbm = $("#cboDWBM").combotree("getValue");
        var cbrgh = $("#cboRYGH").combotree("getValues");
        var bmbm = $("#cboBMBM").combotree("getValues");
        v_years = $("#cmbYearS_jcgbbYear").combobox("getValue");
        v_yeare = $("#cmbYearE_jcgbbYear").combobox("getValue");
        var queryData = {
            action: 'ExportJCGBB2Excel',
            dwbm: v_dwbm,
            bmbm: bmbm.join('\',\''),
            years: v_years,
            yeare: v_yeare,
            cbrgh: cbrgh.join(),
            type: 'year'
        };

        $.post('/Handler/JCGBB/JCGBBHandler.ashx', queryData,
            function (result) {
                CloseProgress();
                frameObject.DownFiles(result);
            });

    });

    //图表分析
    //    $('#btnExportChart_jcgbbYear').linkbutton({
    //        onClick: function () {
    //            $('#cb_bmbm').combotree({
    //                method: 'get',
    //                lines: true,
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
    //            var cbrghs = $("#cboRYGH").combotree("getValues");
    //            var bmbm = $("#cboBMBM").combotree("getValue");
    //            $('#cb_bmbm').combotree('setValue', bmbm);
    //            $('#cb_cbr').combotree('setValues', cbrghs);
    //            $('#JCGBBByYear_Chart_window').window('open');
    //         }
    //    });

    $('#btnExportChart_jcgbbYear').click(function () {
        $('#jcgbbModal').window('open');
        InitChart([]);
        //$('.easy_model_kuang').css({ width: "80%", height: "80%" });
        $('#cb_bmbm').combotree({
            method: 'get',
            lines: true,
            multiple: true,
            url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + v_dwbm,
            onChange: function (record) {
                if (record != undefined) {
                    $('#cb_cbr').combotree({
                        method: 'get',
                        lines: true,
                        multiple: true,
                        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfoByBMBM&dwbm=' + v_dwbm + '&bmbm=' + record
                    });
                }
            },
            onLoadSuccess: function (node, data) {
                $('#cb_bmbm').combotree('setValue', data[0].id);
            }
        });
        var cbrghs = $("#cboRYGH").combotree("getValues");
        var bmbm = $("#cboBMBM").combotree("getValue");
        $('#cb_bmbm').combotree('setValue', bmbm);
        $('#cb_cbr').combotree('setValues', cbrghs);
        $('#cb_sjlx').combobox({
            data: [{ 'id': "1", "text": "在办" },
                    { 'id': "2", "text": "已办" },
                    { 'id': "3", "text": "归档" }],
            valueField: 'id',
            textField: 'text'
        });
        $('#cb_sjlx').combobox('setValue', "1");
        //$('.easy_model').show();
    });

    // 单位编码ComboTree初始化
    $('#cboDWBM').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + v_dwbm,
        onLoadSuccess: function () {
            $('#cboDWBM').combotree('setValue', v_dwbm);
            $('#cboBMBM').combotree({
                method: 'get',
                lines: true,
                multiple: true,
                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + v_dwbm,
                onSelect: function (record) {
                    $('#cboRYGH').combotree({
                        method: 'get',
                        lines: true,
                        multiple: true,
                        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfoByBMBM&dwbm=' + v_dwbm + '&bmbm=' + record.id
                    });

                }
            });
            reload(true);
        },
        onSelect: function (record) {
            $('#cboBMBM').combotree({
                method: 'get',
                lines: true,
                multiple: true,
                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + record.id
            });
            v_dwbm = record.id;
            $('#cboRYGH').combotree('clear');
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });

    //分析
    $('#btnAnalyze').click(function () {
        var cbrgh = $("#cb_cbr").combotree("getValues");
        var bmbm = $("#cb_bmbm").combotree("getValue");
        v_years = $("#cmbYearS_jcgbbYear").combobox("getValue");
        v_yeare = $("#cmbYearE_jcgbbYear").combobox("getValue");
        v_ajzt = $("#cb_sjlx").combobox("getValue");
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: v_dwbm, bmbm: bmbm, years: v_years, yeare: v_yeare, cbrgh: cbrgh.join() },
            url: "/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBTJ_Year",
            success: function (result) {
                var data = eval(result);
                InitChart(data);
            },
            error: function (data) {

            }
        });
    });
    $.ajax({
        type: "post",
        url: "/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB",
        dataType: "json",
        success: function (data) {
            //data.splice(0, 0, { id: -1, text: "全选/反选" });
            $('#cboAJLB').combotree({
                data: data
            });
        }
    });
    //查询案件类别
    $('#cboAJLB').combotree({
        //        method: 'post',
        //        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        editable: true,
        animate: false,
        multiple: true,
        onSelect: function (record) {
            if (record.id == -1) {
                //treeChecked(!record.checked);
                //SelectChange();
            }
        },
        onChange: function (record) {
            if (record[0] == -1 && !ajlb_all_select) {
                ajlb_all_select = !ajlb_all_select;
                SelectChange();
            } else if (record[0] != -1 && ajlb_all_select) {
                ajlb_all_select = !ajlb_all_select;
                SelectChange();
            }
        },
        keyHandler: {
            query: function (q) {
                queryComboTree(q, "cboAJLB");
            }
        }
    });

});
// 过滤查询
function queryComboTree(q, comboid) {
    var datalist = []; //用平面的combobox来展示过滤的结果
    var childrenlist = [];
    var combotreeid = "#" + comboid;
    var roots = $(combotreeid).combotree('tree').tree('getRoots'); //得到根节点数组
    var children;
    var entertext = $(combotreeid).combotree('getText');
    $(combotreeid).combotree('setText', q);
    if (entertext == null || entertext == "") {
        //如果文本框的值为空，或者将文本框的值删除了，重新reload数据
        if (q == "") {
            $(combotreeid).combotree('reload');
            $(combotreeid).combotree('clear');
            $(combotreeid).combotree('setText', q);
        }
        return;
    }
    //循环数组，找到与输入值相似的，加到前面定义的数组中，
    for (var i = 0; i < roots.length; i++) {
        if (q == roots[i].text) {
            $(combotreeid).combotree('tree').tree('select', roots[i].target);
            return;
        } else {
            if (roots[i].text.indexOf(q) >= 0 && roots[i].text != "") {
                var org = {
                    "id": roots[i].id,
                    "text": roots[i].text
                };
                datalist.push(org);
            }
        }
        //找子节点（递归）
        childrensTree(combotreeid, roots[i].target, datalist, q);
    }
    //如果找到相似的结果，则加载过滤的结果
    if (datalist.length > 0) {
        $(combotreeid).combotree('loadData', datalist);
        $(combotreeid).combotree('setText', q);
        datalist = []; //这里重新赋值是避免再次过滤时，会有重复的记录
        return;
    } else {
        if (q == "") {
            $(combotreeid).combotree('reload');
            $(combotreeid).combotree('clear');
            $(combotreeid).combotree('setText', q);
        }
        return;
    }
}

function childrensTree(combotreeid, rootstarget, datalist, q) {
    var children = $(combotreeid).combotree('tree').tree('getChildren', rootstarget);
    console.log(children);
    for (j = 0; j < children.length; j++) {
        if (q == children[j].text) {
            $(combotreeid).combotree('tree').tree('select',
                children[j].target);
            return;
        } else {
            if (children[j].text.indexOf(q) >= 0 && children[j].text != "") {
                var org = {
                    "id": children[j].id,
                    "text": children[j].text
                };
                datalist.push(org);
            }
        }
        //childrensTree(combotreeid,children[j].target,datalist,q);
    }
}
$('.easy_model_gb').click(function () {
    $('.easy_model').hide();
});
$('.easy_model_kuang_fot_btqd').click(function () {
    exportExcel();
    $('.easy_model').hide();
});

var v_ajzt;
var currentYear;
function initDataGrid(queryData) {
    var option = {
        width: 'auto',
        //striped: true,
        fitColumns: true,
        singleSelect: true,
        rownumbers: true,
        sortable: true,
        columns: getColumn(v_years, v_yeare),
        loadMsg: '数据加载中，请稍候...',
        url: '/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBTJ_Year',
        queryParams:queryData,
        onClickCell: function (rowIndex, field, value) {
            //alert(field);
            currentYear = field.substr(2, 4);
            var dateStart = currentYear + "-01-01";
            var dateEnd = currentYear + "-12-31";
            var handlerUrl = '/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBAJXX_Time';
            var reg = new RegExp("^[0-9]{4}$");

            var ajlbbmList = $('#cboAJLB').combotree('tree').tree('getChecked');
            var ajlbbm = '';
            for (var i = 0; i < ajlbbmList.length; i++) {
                if (i == 0) {
                    ajlbbm = '(';
                }
                ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
            }
            if (reg.test(currentYear) && value > 0) {
                var queryData = {
                    bmsah: '',
                    ajmc: '',
                    dwbm: v_dwbm,
                    ajzt: currentAjzt,
                    cbrgh: currentCbrgh,
                    lbbmjh: ajlbbm,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    sendEmail: 0, //是否显示发送邮件按钮
                    exportExcel: 37,
                    showColumn: 7,
                    selectedUrl: selectedUrl
                };
                var jsonStr = JSON.stringify(queryData);
                frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
            }
        }
    };
    $('#dg_jcgbbYear').datagrid(option);
}

function getColumn(years, yeare) {
    var yearList = [];
    for (var i = years; i <= yeare; i++) {
        yearList.push(i);
    }
    var data = [[
                { title: '检察官', field: 'mc', width: 100, rowspan: 2, align: 'left' }
    ]
    ];
    data[1] = [];
    for (var y = years; y <= yeare; y++) {
        data[0].push({ title: y + '年', colspan: 3, align: 'center' });
        var year = y;
        data[1].push(
        {
            title: '在办', field: 'zb' + y, width: 50, rowspan: 1, align: 'center',
            formatter: function (value, row) {
                if (value > 0) {
                    var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + 1 + '&quot;,&quot;' + year + '&quot;)">' + value + '</a>';
                    return x;
                } else return value;
            }
        });
        data[1].push(
        {
            title: '已办', field: 'yb' + y, width: 50, rowspan: 1, align: 'center',
            formatter: function (value, row) {
                if (value > 0) {
                    var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + 2 + '&quot;,&quot;' + year + '&quot;)">' + value + '</a>';
                    return x;
                } else return value;
            }
        });
        data[1].push(
        {
            title: '归档', field: 'gd' + y, width: 50, rowspan: 1, align: 'center',
            formatter: function (value, row) {
                if (value > 0) {
                    var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + 3 + '&quot;,&quot;' + year + '&quot;)">' + value + '</a>';
                    return x;
                } else return value;
            }
        });
    }
    return data;
}

//检察官办案统计-按年
function reload(isInit) {
    var time = new Date();
    v_dwbm = $("#cboDWBM").combotree("getValue");
    v_dwbm = v_dwbm == null ? unitCode : v_dwbm;
    var cbrgh = $("#cboRYGH").combotree("getValues");
    var bmbm = $("#cboBMBM").combotree("getValues");
    v_years = $("#cmbYearS_jcgbbYear").combobox("getValue");
    v_yeare = $("#cmbYearE_jcgbbYear").combobox("getValue");
    var ajlbbm = $("#cboAJLB").combotree("getValues");
    var queryData = { dwbm: v_dwbm, bmbm: bmbm.join('\',\''), years: v_years, yeare: v_yeare, cbrgh: cbrgh.join(), ajlbbm: ajlbbm.join('\',\'') };

    initDataGrid(queryData);

    //$('#dg_jcgbbYear').datagrid('reload');

//    if (isInit) {
//        $('#dg_jcgbbYear').datagrid('load');
//    }

    $('#dg_jcgbbYear').datagrid('fitColumns');
    //    $.ajax({
    //        type: "post",
    //        async: true,
    //        data: queryData,
    //        url: "/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBTJ_Year",
    //        success: function (result) {
    //            $('#dg_jcgbbYear').datagrid('loadData',result);
    //        },
    //        error: function (data) {

    //        }
    //    });

}

var currentCbrgh;
var currentAjzt;
function onClickAJXX(cbrgh, ajzt) {
    currentCbrgh = cbrgh;
    currentAjzt = ajzt;

}

function InitChart(data) {
    var mc = "[";
    for (var i = v_years; i <= v_yeare; i++) {
        mc += "'" + i + "年'";
        if (i < v_yeare) {
            mc += ",";
        }
    }
    mc += "]";
    var series = [];
    for (var j = 0; j < data.length; j++) {
        var str = "[";
        for (var y = v_years; y <= v_yeare; y++) {
            switch (v_ajzt) {
                case "1":
                    str += data[j]["zb" + y];
                    if (y < v_yeare) {
                        str += ",";
                    }
                    break;
                case "2":
                    str += data[j]["yb" + y];
                    if (y < v_yeare) {
                        str += ",";
                    }
                    break;
                case "3":
                    str += data[j]["gd" + y];
                    if (y < v_yeare) {
                        str += ",";
                    }
                    break;
            }

        }
        str += "]";
        series.push({
            name: data[j].mc,
            data: eval(str)
        });
    }
    $('#JCGBBByYear_Chart').highcharts({
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