//@ sourceURL=jcgbbMonth.js
var v_dwbm;
var v_bmbm;
var v_year;
var ajlb_all_select = false;
$(function () {
    var user = frameObject.GetUserInfo();
    v_dwbm = user.UnitCode;
    $('#jcgbbModal').window('close');
    AddOperationLog('检查官统计报表-按月统计');
    var date = new Date();
    var yearList = getYearList();
    var monthList = getMonthList();
    $('#cmbYear_jcgbbMonth').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text',

    });
    $('#cmbYear_jcgbbMonth').combobox('select', date.getFullYear());
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
    $('#cmbMonthS').combobox('select', 1);
    $('#cmbMonthE').combobox('select', date.getMonth() + 1);
    //查询
    $('#btnSearch_jcgbbMonth').click(function () {
        reload();
    });

    //导出
    $('#btnExportExcel_jcgbbMonth').click(function () {
        ShowProgress();
        v_dwbm = $("#cboDWBM").combotree("getValue");
        var cbrgh = $("#cboRYGH").combotree("getValues");
        var bmbm = $("#cboBMBM").combotree("getValues");
        v_year = $("#cmbYear_jcgbbMonth").combobox("getValue");
        var queryData = {
            action: 'ExportJCGBB2Excel',
            dwbm: v_dwbm,
            bmbm: bmbm.join('\',\''),
            year: v_year,
            cbrgh: cbrgh.join(),
            type: 'month'
        };

        $.post('/Handler/JCGBB/JCGBBHandler.ashx', queryData,
            function (result) {
                CloseProgress();
                frameObject.DownFiles(result);
            });
    });

    //图表分析
    //    $('#btnExportChart_jcgbbMonth').linkbutton({
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
    //                        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfoByBMBM&dwbm=' +v_dwbm+'&bmbm='+record
    //                    });
    //                }
    //            });
    //            var cbrghs = $("#cboRYGH").combotree("getValues");
    //            var bmbm = $("#cboBMBM").combotree("getValue");
    //            $('#cb_bmbm').combotree('setValue', bmbm);
    //            $('#cb_cbr').combotree('setValues', cbrghs);
    //            $('#JCGBBByMonth_Chart_window').window('open');
    //         }
    //    });
    $('#btnExportChart_jcgbbMonth').click(function () {
        $('#jcgbbModal').window('open');
        InitChart([]);
        //$('.easy_model_kuang').css({ width: "80%", height: "80%" });
        $('#cb_bmbm').combotree({
            method: 'get',
            lines: true,
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
        if (bmbm != "") {
            $('#cb_bmbm').combotree('setValue', bmbm);
        }
        $('#cb_cbr').combotree('setValues', cbrghs);
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
            reload();
        },
        onSelect: function (record) {
            $('#cboBMBM').combotree({
                method: 'get',
                lines: true,
                url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + record.id
            });
            v_dwbm = record.id;
            $('#cboRYGH').combotree('clear');
        },
        onLoadError: function (data) {
        }
    });

    //分析
    $('#btnAnalyze').click(function () {
        var cbrgh = $("#cb_cbr").combotree("getValues");
        var bmbm = $("#cb_bmbm").combotree("getValue");
        v_year = $("#cmbYear_jcgbbMonth").combobox("getValue");
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: v_dwbm, bmbm: bmbm, year: v_year, cbrgh: cbrgh.join(), isChart: 1 },
            url: "/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBTJ_Month",
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
            //data.splice(0, 0, {id:-1,text:"全选/反选"});
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
        onChange:function(record) {
           if (record[0] == -1 && !ajlb_all_select ) {
               ajlb_all_select = !ajlb_all_select;
               SelectChange();
           } else if(record[0] != -1 && ajlb_all_select ){
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

//检察官办案统计-按月
function reload() {
    v_dwbm = $("#cboDWBM").combotree("getValue");
    var cbrgh = $("#cboRYGH").combotree("getValues");
    v_bmbm = $("#cboBMBM").combotree("getValues");
    v_year = $("#cmbYear_jcgbbMonth").combobox("getValue");
    var months=$("#cmbMonthS").combobox("getValue");
    var monthe=$("#cmbMonthE").combobox("getValue");
    
    var ajlbbm=$("#cboAJLB").combotree("getValues");
    var queryData = { action: 'Query_JCGBBTJ_Month', dwbm: v_dwbm, year: v_year, bmbm: v_bmbm.join('\',\''), cbrgh: cbrgh.join(),ajlbbm:ajlbbm.join('\',\'') };

    $('#dg_jcgbbMonth').treegrid({
        idField: 'gh',
        treeField: 'mc',
        queryParams: queryData,
        url: '/Handler/JCGBB/JCGBBHandler.ashx',
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        fitColumns: true,
        expandible: false,
        columns: [[
            { title: '检察官', field: 'mc', width: 100, rowspan: 2, align: 'left' },
            {
                title: '1月', field: 'm1', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m1 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,1)">' + row.m1 + '</a>';
                        return x;
                    } else return row.m1;
                }
            },
            {
                title: '2月', field: 'm2', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m2 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,2)">' + row.m2 + '</a>';
                        return x;
                    } else return row.m2;
                }
            },
            {
                title: '3月', field: 'm3', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m3 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,3)">' + row.m3 + '</a>';
                        return x;
                    } else return row.m3;
                }
            },
            {
                title: '4月', field: 'm4', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m4 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,4)">' + row.m4 + '</a>';
                        return x;
                    } else return row.m4;
                }
            },
            {
                title: '5月', field: 'm5', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m5 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,5)">' + row.m5 + '</a>';
                        return x;
                    } else return row.m5;
                }
            },
            {
                title: '6月', field: 'm6', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m6 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,6)">' + row.m6 + '</a>';
                        return x;
                    } else return row.m6;
                }
            },
            {
                title: '7月', field: 'm7', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m7 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,7)">' + row.m7 + '</a>';
                        return x;
                    } else return row.m7;
                }
            },
            {
                title: '8月', field: 'm8', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m8 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,8)">' + row.m8 + '</a>';
                        return x;
                    } else return row.m8;
                }
            },
            {
                title: '9月', field: 'm9', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m9 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,9)">' + row.m9 + '</a>';
                        return x;
                    } else return row.m9;
                }
            },
            {
                title: '10月', field: 'm10', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m10 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,10)">' + row.m10 + '</a>';
                        return x;
                    } else return row.m10;
                }
            },
            {
                title: '11月', field: 'm11', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m11 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,11)">' + row.m11 + '</a>';
                        return x;
                    } else return row.m11;
                }
            },
            {
                title: '12月', field: 'm12', width: 50, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.m12 > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.gh + '&quot;,&quot;' + row.bmbm + '&quot;,12)">' + row.m12 + '</a>';
                        return x;
                    } else return row.m12;
                }
            }
        ], []]
    });

    for (var i = 1; i <= 12; i++) {
        if (i >= months && i <= monthe) {
            $('#dg_jcgbbMonth').treegrid('showColumn', 'm' + i);
        } else {
            $('#dg_jcgbbMonth').treegrid('hideColumn', 'm' + i);
        }
    }
}

var v_count;
var v_action;
function onClickAJXX(cbrgh, bmbm, month) {
    var time = new Date();
    var dateStart = v_year + "-" + month + "-1";
    var handlerUrl = '/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBAJXX_Time';
    var dateEnd = new Date(v_year, month, '1');
    dateEnd = new Date(dateEnd - 1000 * 60 * 60 * 24);
    var ajlbbmList = $('#cboAJLB').combotree('tree').tree('getChecked');
            var ajlbbm = '';
            for (var i = 0; i < ajlbbmList.length; i++) {
                if (i == 0) {
                    ajlbbm = '(';
                }
                ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
            }

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: v_dwbm,
        cbrgh: cbrgh,
        ajlbbm:ajlbbm,
        lbbmjh:ajlbbm,
        dateStart: dateStart,
        dateEnd: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
        sendEmail: 0, //是否显示发送邮件按钮
        exportExcel: 37,
        selectedUrl: selectedUrl,
        showColumn: 7
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function InitChart(data) {
    var mc = "[";
    for (var i = 1; i <= 12; i++) {
        mc += "'" + i + "月'";
        if (i < 12) {
            mc += ",";
        }
    }
    mc += "]";
    var series = [];
    for (var j = 0; j < data.length; j++) {
        var str = "[";
        for (var m = 1; m <= 12; m++) {
            str += data[j]["m" + m];
            if (m < 12) {
                str += ",";
            }
        }
        str += "]";
        series.push({
            name: data[j].mc,
            data: eval(str)
        });
    }
    $('#JCGBBByMonth_Chart').highcharts({
        chart: {
            type: 'column',
            //backgroundColor: 'transparent'
            backgroundColor: '#08143C'
        },
        title: {
            floating: true,
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
            width: myWidth
        },
        credits: {
            enabled: false
        },
        series: series
    });
}

