//@ sourceURL=tyywywbb.js
var dwbm;
var action;
var sjtype;
$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('统一业务报表-各业务统计');
    //查询
    $("#btn_tyywywbb_Search").click(function() {
        btnQueryClick();
    });

    // 单位编码ComboTree初始化
    $('#cb_tyywywbb_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cb_tyywywbb_dwbm').combotree('setValue', user.UnitCode);
            dwbm = user.UnitCode;
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#radio_tyywywbb_sjtype').attr("checked", false);
                $("#radio_tyywywbb_sjtype").attr("disabled", "disabled");
            } else {
                $('#radio_tyywywbb_sjtype').attr("checked", true);
                $("#radio_tyywywbb_sjtype").removeAttr("disabled");
            }
            dwbm = node.id;
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });

    $('#datebox_tyywywbb_start').datebox('setValue', getStartDate());
    $('#datebox_tyywywbb_end').datebox('setValue', getEndDate());

    //查询案件类别
    $('#cb_tyywywbb_ajlb').combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        editable: false,
        animate: false,
        multiple: true
    });

    //移送案由
    $('#cb_tyywywbb_ysay').combotree({
        method: 'post',
        queryParams: { lbbm: '9903' },
        url: '/Handler/Dictionary/dictionary.ashx?action=GetDataItemListByRemote',
        editable: false,
        animate: false,
        multiple: true
    });

    //导出
    $('#btnExportExcel_tyywywbb').click(function () {
        ShowProgress();
        dwbm = $('#cb_tyywywbb_dwbm').textbox('getValue');
        var startdate = $("#datebox_tyywywbb_start").datebox('getValue');
        var enddate = $("#datebox_tyywywbb_end").datebox('getValue');
        if (startdate != "" || enddate != "") {
            if (startdate == "" || enddate == "") {
                alert("请选择时间范围！");
                return;
            }
            sjtype = document.getElementById('radio_tyywywbb_sjtype').checked ? "2" : "1";
            var ajlbbmList = $('#cb_tyywywbb_ajlb').combotree('tree').tree('getChecked');
            var ajlbbm = '';
            for (var i = 0; i < ajlbbmList.length; i++) {
                if (i == 0) {
                    ajlbbm = '(';
                }
                ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
            }
            var ysayList = $('#cb_tyywywbb_ysay').combotree('tree').tree('getChecked');
            var ysay = '';
            for (var i = 0; i < ysayList.length; i++) {
                if (i == 0) {
                    ysay = '(';
                }
                ysay += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
            };

            var queryData = {
                action: 'ExportTYYWBB2Excel',
                dwbm: dwbm,
                ywbm: '',
                sjtype: sjtype,
                startdate: startdate,
                enddate: enddate,
                ajlbbm: ajlbbm,
                ysay: ysay
            };
            $.post('/Handler/TYYW/TYYWHandler.ashx', queryData,
                function(result) {
                    CloseProgress();
                    frameObject.DownFiles(result);
                });
        }
    });
    btnQueryClick();

});


function click_aj2(ajlb, count, ajzt) {

    v_ajlb = ajlb;
    v_count = count;
    v_action = 'GetAJLBTJ2';


    var ajlbbmList = $('#cb_tyywywbb_ajlb').combotree('tree').tree('getChecked');
    var ajlbbm = '';
    for (var i = 0; i < ajlbbmList.length; i++) {
        if (i == 0) {
            ajlbbm = '(';
        }
        ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
    }


    var ysayList = $('#cb_tyywywbb_ysay').combotree('tree').tree('getChecked');
    var ysay = '';
    for (var i = 0; i < ysayList.length; i++) {
        if (i == 0) {
            ysay = '(';
        }
        ysay += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
    }
    var startTime = $("#datebox_tyywywbb_start").datebox('getValue');
    var endTime = $("#datebox_tyywywbb_end").datebox('getValue');
    var queryData = {
        ajmc: '',
        bmsah: '',
        dwbm: dwbm,
        cbr: '',
        dateStart: startTime,
        dateEnd: endTime,
        ajlb: ajlb,
        ajzt: ajzt,
        sjtype: sjtype,
        lbbmjh: ajlbbm,
        ysayjh: ysay,
        selectedUrl: selectedUrl
    };

    var time = new Date();
    var jsonStr = JSON.stringify(queryData);
    var handlerUrl = "/Handler/TYYW/TYYWHandler.ashx?action=" + v_action;
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function btnQueryClick() {
    try {
        dwbm = $('#cb_tyywywbb_dwbm').textbox('getValue');
        var startdate = $("#datebox_tyywywbb_start").datebox('getValue');
        var enddate = $("#datebox_tyywywbb_end").datebox('getValue');
        if (startdate != "" || enddate != "") {
            if (startdate == "" || enddate == "") {
                alert("请选择时间范围！");
                return;
            }
            sjtype = document.getElementById('radio_tyywywbb_sjtype').checked ? "2" : "1";

            var ajlbbmList = $('#cb_tyywywbb_ajlb').combotree('tree').tree('getChecked');
            var ajlbbm = '';
            for (var i = 0; i < ajlbbmList.length; i++) {
                if (i == 0) {
                    ajlbbm = '(';
                }
                ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
            }


            var ysayList = $('#cb_tyywywbb_ysay').combotree('tree').tree('getChecked');
            var ysay = '';
            for (var i = 0; i < ysayList.length; i++) {
                if (i == 0) {
                    ysay = '(';
                }
                ysay += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
            }

            var queryData = { dwbm: dwbm, ywbm: '', sjtype: sjtype, startdate: startdate, enddate: enddate, ajlbbm: ajlbbm, ysay: ysay };
            $('#dg_tyywzs_ywbb').treegrid({
                idField: 'LBMC',
                treeField: 'LBMC',
                queryParams: queryData,
                loadMsg: '数据加载中，请稍候...',
                columns: [
                        [
                            { field: 'LBMC', title: '名称', width: '33%' },
                            {
                                field: 'YBSL',
                                title: '已办（件）',
                                width: '33%',
                                align: 'center',
                                formatter: function (value, row) {
                                    if (row.BJSL > 0) {
                                        var ajzt = '2';
                                        var x = '<a href="javascript:void(0)" onclick="click_aj2(&quot;' + row.LBBM + '&quot;,&quot;' + row.ZBSL + '&quot;,&quot;' + ajzt + '&quot;)">' + row.BJSL + '</a>';
                                        return x;
                                    } else
                                        return row.BJSL;
                                }
                            }, {
                                field: 'ZBSL',
                                title: '在办（件）',
                                width: '33%',
                                align: 'center',
                                formatter: function (value, row) {
                                    if (row.ZBSL > 0) {
                                        var ajzt = '1';
                                        var x = '<a href="javascript:void(0)" onclick="click_aj2(&quot;' + row.LBBM + '&quot;,&quot;' + row.ZBSL + '&quot;,&quot;' + ajzt + '&quot;)">' + row.ZBSL + '</a>';
                                        return x;
                                    } else
                                        return row.ZBSL;
                                }
                            }
                        ]
                    ],
                url: '/Handler/TYYW/TYYWHandler.ashx?action=GetAJLBTJ1'

            });
        }
    } catch (e) {
        console.log(e);
    }
}