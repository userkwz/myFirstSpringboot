//@ sourceURL=ajxxgk4.js
var dwbm;
var action;

$(function () {
    var user = frameObject.GetUserInfo();
    AddOperationLog('案件公开报表-法律文书公开统计表');
    //查询
    $('#btn_ajxxgk4_Search').click(function () {
            reload();
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

    $('#dateStart_ajxxgkdg4').datebox('setValue', getStartDate());
    $('#dateEnd_ajxxgkdg4').datebox('setValue', getEndDate());
    $('#btn_ajxxgk4_Export').click(function () {
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

    var dateStart = $('#dateStart_ajxxgkdg4').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg4').datebox('getValue');

    var queryData = { action: 'Query_Ajxxgk_dg4', t: time.getMilliseconds(), dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };

    $('#dg_ajxxgk4').treegrid({
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
            var data = $('#dg_ajxxgk4').treegrid('getData');
            if (data[0].state == 'closed') {
                data[0].state = 'open';
                $('#dg_ajxxgk4').treegrid('loadData', data);
            }
        },
        columns: [
            [
                { title: '地区', field: 'dwmc', width: 200, rowspan: 2, align: 'left' },
                {
                    title: '起诉书公开',
                    colspan: 3
                },
                {
                    title: '刑事抗诉书公开',
                    colspan: 3
                },
                {
                    title: '不起诉决定书公开',
                    colspan: 3
                },
                {
                    title: '刑事申诉复查决定书公开',
                    colspan: 3
                }
            ], [
                {
                    title: '已公开数量（件）',
                    field: 'QSS',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.QSS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;)">' + row.QSS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                }, {
                    title: '应公开数量（件）',
                    field: 'QSSY',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.QSSY > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj1(&quot;' + row.dwbm + '&quot;,&quot;' + 1 + '&quot;)">' + row.QSSY + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '比例（%）',
                    field: 'QSSBL',
                    width: 60,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.QSSY > 0 && row.QSSY != undefined) {
                            return (row.QSS*100/row.QSSY).toFixed(2)+"%";
                        }
                        else
                            return '--';
                    }
                },
                {
                    title: '已公开数量（件）',
                    field: 'XSKSS',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSKSS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 2 + '&quot;)">' + row.XSKSS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '应公开数量（件）',
                    field: 'XSKSSY',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSKSSY > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj1(&quot;' + row.dwbm + '&quot;,&quot;' + 2 + '&quot;)">' + row.XSKSSY + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '比例（%）',
                    field: 'XSKSSBL',
                    width: 60,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSKSSY > 0 && row.XSKSSY != undefined) {
                            return (row.XSKSS * 100 / row.XSKSSY).toFixed(2) + "%";
                        }
                        else
                            return '--';
                    }
                },
                {
                    title: '已公开数量（件）',
                    field: 'BQSJDS',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.BQSJDS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 0 + '&quot;)">' + row.BQSJDS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '应公开数量（件）',
                    field: 'BQSJDSY',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.BQSJDSY > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj1(&quot;' + row.dwbm + '&quot;,&quot;' + 0 + '&quot;)">' + row.BQSJDSY + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '比例（%）',
                    field: 'BQSJDSBL',
                    width: 60,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.BQSJDSY > 0 && row.BQSJDSY != undefined) {
                            return (row.BQSJDS * 100 / row.BQSJDSY).toFixed(2) + "%";
                        }
                        else
                            return '--';
                    }
                },
                {
                    title: '已公开数量（件）',
                    field: 'XSSSFCJDS',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSSSFCJDS > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj(&quot;' + row.dwbm + '&quot;,&quot;' + 3 + '&quot;)">' + row.XSSSFCJDS + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '应公开数量（件）',
                    field: 'XSSSFCJDSY',
                    width: 95,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSSSFCJDSY > 0) {
                            return '<a href="javascript:void(0)" onclick="click_aj1(&quot;' + row.dwbm + '&quot;,&quot;' + 3 + '&quot;)">' + row.XSSSFCJDSY + '</a>';
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    title: '比例（%）',
                    field: 'XSSSFCJDSBL',
                    width: 60,
                    rowspan: 1,
                    align: 'center',
                    formatter: function (value, row) {
                        if (row.XSSSFCJDSY > 0 && row.XSSSFCJDSY != undefined) {
                            return (row.XSSSFCJDS * 100 / row.XSSSFCJDSY).toFixed(2) + "%";
                        }
                        else
                            return '--';
                    }
                }
            ]
        ]
    });

    //$('#dg_ajxxgk4').datagrid({
    //    queryParams: queryData,
    //    url: '/Handler/agxe/agxeHandler.ashx?t=' + time.getMilliseconds(),
    //    loadMsg: '数据加载中，请稍候...'
    //});
}

function click_aj(dwbm, index) {
    this.dwbm = dwbm;
    this.action = index;

    var dateStart = $('#dateStart_ajxxgkdg4').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg4').datebox('getValue');

    onClickAJXX('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk4_aj1', dateStart, dateEnd, 1, index,0);
}


function click_aj1(dwbm, index) {
    this.dwbm = dwbm;
    this.action = index;

    var dateStart = $('#dateStart_ajxxgkdg4').datebox('getValue');
    var dateEnd = $('#dateEnd_ajxxgkdg4').datebox('getValue');

    onClickAJXX('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk4_aj1', dateStart, dateEnd, 0, index, 0);
}



function onClickAJXX(handlerUrl, dateStart, dateEnd, gklx, index, showColumn) {
    var time = new Date();
    var dwbm = this.dwbm;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        gklx:gklx,
        index:index,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        sjtype:2,
        showColumn: showColumn,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function exportExcel() {
    var dclb = $("#dclb").combobox("getValue");

    var action = "ExportAjxxgk4Excel";
    if (dclb == 0) {
        action = "ExportAjxxgk4Excel_bak";
    }
    $.post('/Handler/agxe/agxeHandler.ashx?action=' + action,
        function (result) {
            frameObject.DownFiles(result);
        });
}