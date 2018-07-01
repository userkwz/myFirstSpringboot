//@ sourceURL=czwt.js
$(document).ready(function () {
    AddOperationLog('流程监控-监控报告');
    //loadAJJBXXGrid();

    $("#dt_ajjbxx_begin").datebox("setValue", getStartDate());
    $("#dt_ajjbxx_end").datebox("setValue", getEndDate());


    //修改
    $('#btn_update_wts').click(function () {
            updateWT();
    });

    $('#btnSendEmails').click(function () {
        var bmsah = $('#tb_xq_bmsah').textbox('getText');
        var nr = $('#tb_xq_fxwt').textbox('getText');
        var cbdwmc = $('#tb_xq_cbbm').textbox('getText');
        var cbbm = $('#tb_xq_cbbm').textbox('getText');
        frameObject.OpenDialogWeb(2,
            baseUrl + sendMailUrl +
            '?key=' + key +
            '&dwbm=' + unitCode +
            '&sendMail=4&cbdw=' + cbdwmc +
            '&bmsah=' + bmsah +
            '&cbbm=' + cbbm +
            '&nr=' + nr,
            '', '', '发送邮件','');
    });

    //查询
    $('#btnSearch_czwt_ajjbxx').click(function () {
            loadAJJBXXData();
    });

    //导出
    $('#btnExport_tjbb_ajjbxxs').click(function() {
        ShowProgress(); // 显示进度条
        $.post('/Handler/AJXX/AJXXHandler.ashx?action=ExportWTExcel',
            function(result) {
                CloseProgress(); // 如果提交成功则隐藏进度条
                //window.location.href = result;
                frameObject.DownFiles(result);
            });
    });

    //导出
    $('#btnExport_czwts').click(function() {
        ShowProgress(); // 显示进度条
        var cjsj = $('#tb_xq_cjsj').textbox('getValue');
        var jkr = $('#tb_xq_jkr').textbox('getValue');
        var fxwt = $('#tb_xq_fxwt').textbox('getValue');

        var clyj = $('#tb_xq_clyj').textbox('getValue');
        var cljg = $('#tb_xq_cljg').textbox('getValue');
        var bz = $('#tb_xq_bz').textbox('getValue');
        var dwmc = $('#ct_ajjbxx_dwbm').textbox('getText');
        var bmmc = $('#cb_ajjbxx_bmbm').textbox('getText');
        $.post('/Handler/AJXX/AJXXHandler.ashx?action=ExportWTWord', {
                date: cjsj,
                jkr: jkr,
                gznr: '',
                fxwt: fxwt,
                clyj: clyj,
                cljg: cljg,
                bz: bz,
                dwmc: dwmc,
                bmmc: bmmc
            },
            function(result) {
                CloseProgress(); // 如果提交成功则隐藏进度条
                //window.location.href = result;
                frameObject.DownFiles(result);
            });
    });

//    $('#dg_tjbb_ajjbxx').pagination({
//        onSelectPage: function (pageNumber, pageSize) {
//            $(this).pagination('loading');
//            loadAJJBXXData(pageNumber, pageSize);
//            $(this).pagination('loaded');
//        }
//    });

    //单位下拉列表获取
    $("#ct_ajjbxx_dwbm").combotree({
        method: 'post',
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + unitCode,
        editable: false,
        animate: false,
        onLoadSuccess: function (node, result) {
            //当载入成功后根据Cookies对单位进行默认选择
            if (unitCode.length != 6) {
                unitCode = unitCode.substring(0, 6);
            }
            $('#ct_ajjbxx_dwbm').combotree('setValue', unitCode);

            var unitTree = $('#ct_ajjbxx_dwbm').combotree('tree');
            if (unitTree == null) return;
            var selectNode = unitTree.tree("getSelected");
            var currNode = selectNode;
            while (currNode != null) {
                currNode = unitTree.tree("getParent", currNode.target);
                if (currNode != null) {
                    unitTree.tree("expand", currNode.target);
                }
            }

            $('#cb_ajjbxx_bmbm').combotree({
                method: 'post',
                url: '/Handler/AJXX/AJXXHandler.ashx?action=GetBMBM&dwbm=' + unitCode,
                valueField: 'bm',
                textField: 'mc',
                editable: false,
                animate: false,
                checkbox: true,
                cascadeCheck: true,
                multiple: true,
                onLoadSuccess: function (node, result) {
//                    if (result.length == 1) {
//                        $('#cb_ajjbxx_bmbm').combotree('setValue', result[0].id);
//                    }
                    $('#btnSearch_tjbb_ajjbxx').linkbutton({ disabled: false });
                }
                //                editable: false
            });
        },
        onLoadError: function (data) {
            Alert("未获取到登录单位列表，请刷新重试或检查网络连接！" + data.responseText);
        },
        onSelect: function (node) {

            $('#cb_ajjbxx_bmbm').combotree("clear");
            if (node == null) {
                return;
            }

            if (node.id == '000000') {
                $('#cb_ajjbxx_sfbhxj').attr("checked", false);
                $("#cb_ajjbxx_sfbhxj").attr("disabled", "disabled");
            } else {
                $("#cb_ajjbxx_sfbhxj").removeAttr("disabled");
            }

            var dwbm = node.id;
            $('#cb_ajjbxx_bmbm').combotree({
                method: 'post',
                url: '/Handler/AJXX/AJXXHandler.ashx?action=GetBMBM&dwbm=' + dwbm,
                valueField: 'bm',
                textField: 'mc',
                editable: false,
                animate: false,
                checkbox: true,
                cascadeCheck: true,
                multiple: true
                //                editable: false
            });
        }
    });


    //查询案件类别
    $('#cb_ajjbxx_ajlb').combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        editable: false,
        animate: false,
        multiple: true
    });
});

/*
*   加载人员grid数据
*/
function loadAJJBXXData() {

    var dwbm = $('#ct_ajjbxx_dwbm').textbox('getValue');
    var sfbhxj = document.getElementById('cb_ajjbxx_sfbhxj').checked;
    if (sfbhxj) {
        if (dwbm.substr(2, 2) == "00") {
            dwbm = dwbm.substr(0, 2);
        }
        else if (dwbm.substr(4, 2) == "00") {
            dwbm = dwbm.substr(0, 4);
        } else {
            dwbm = dwbm;
        }
    }
    var bmbmList = $('#cb_ajjbxx_bmbm').combotree('tree').tree('getChecked');
    var bmbm = '';
    for (var i = 0; i < bmbmList.length; i++) {
        if (i == 0) {
            bmbm = '(';
        }
        bmbm += "'" + bmbmList[i].id + "'" + (i != bmbmList.length - 1 ? ',' : ')');
    }

    var cbrmc = $('#tb_ajjbxx_cbrmc').textbox('getValue');
    var ajlbbmList = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getChecked');
    var ajlbbm = '';
    for (var i = 0; i < ajlbbmList.length; i++) {
        if (i == 0) {
            ajlbbm = '(';
        }
        ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
    }
    var ajmc = $('#tb_ajjbxx_ajmc').textbox('getValue');
    var bmsah = $('#tb_ajjbxx_xtsah').textbox('getValue');

    var begin = $('#dt_ajjbxx_begin').textbox('getValue');
    var end = $('#dt_ajjbxx_end').combobox('getValue');
    if (dwbm == "") {
        return;
    }
    if (begin == "") {
        Alert("请选择开始时间!");
        return;
    }
    if (end == "") {
        Alert("请选择结束时间!");
        return;
    }

    $('#dg_tjbb_ajjbxx').datagrid({
        //fitColumns: true,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        pageSize: 20,
        onDblClickCell: function (index, field, value) {
            //跳转到统一业务
            var row = $('#dg_tjbb_ajjbxx').datagrid('getSelected');
            parent.showAJXX(row.bmsah);
        },
        pageList: [10, 20, 30, 50, 100],
        columns: [
                    [
        //                        { field: 'bh', width: 0, align: 'left', hidden: 'true' },
        //                        { field: 'bz', width: 0, align: 'left', hidden: 'true' },
                        {field: 'cjsj', width: '6.25%', align: 'center', title: '日期', rowspan: 2 },
                        { field: 'ajmc', width: '6.25%', align: 'center', title: '案件名称', rowspan: 2,
                            formatter: function (value, row, index) {
                                return '<a href="#"; onclick="WTXQ(&quot;' + index + '&quot;)">' + row.ajmc + +'</a>';
                            }
                        },
                        { field: 'ajlb_mc', width: '6.25%', align: 'center', title: '案件类型', rowspan: 2 },
                        { field: 'cbbm_mc', width: '6.25%', align: 'center', title: '办案部门', rowspan: 2 },
                        { field: 'cbr', width: '6.25%', align: 'center', title: '办案人员', rowspan: 2 },
                        { title: '违法违规内容', colspan: 3 },
                        { title: '流程监控情况', colspan: 3 },
                        { title: '处理情况', colspan: 3 },
                        { field: 'jkr', width: '6.25%', align: 'center', title: '监控人员', rowspan: 2 }
                    ],
                    [
                        { field: 'wtlbmc', width: '15.25%', align: 'left', title: '类别' },
                        { field: 'fxfs', width: '6.25%', align: 'center', title: '发现方式' },
                        { field: 'gznr', width: '6.25%', align: 'center', title: '具体情况' },
                        { field: 'jkcs', width: '6.25%', align: 'center', title: '监控措施',
                            formatter: function (value, row) {
                                if (row.jkcs > 0) {
                                    return '书面警告 ';
                                } else return '口头警告';
                            } 
                        },
                        { field: 'g', width: '6.25%', align: 'center', title: '反馈日期' },
                        { field: 'x', width: '6.25%', align: 'center', title: '反馈结果' },
                        { field: 'clyj', width: '6.25%', align: 'center', title: '处理意见' },
                        { field: 'cljg', width: '6.25%', align: 'center', title: '处理结果' },
                        { field: 'clbz', width: '6.25%', align: 'center', title: '处理备注' }
                    ]
                ],
                        loadMsg: '数据加载中，请稍候...',
                        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKLB' + '&dwbm=' + escape(dwbm) + '&cbr=' + escape(cbrmc) + '&ajlbbm=' +
        escape(ajlbbm) + '&bmbm=' + escape(bmbm) + '&begin=' + escape(begin) + '&end=' + escape(end) + '&ajmc=' + escape(ajmc) + '&bmsah=' + escape(bmsah)

    });
//    $('#dg_tjbb_ajjbxx').datagrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKLB' + '&dwbm=' + escape(dwbm) + '&cbr=' + escape(cbrmc) + '&ajlbbm=' +
//        escape(ajlbbm) + '&bmbm=' + escape(bmbm) + '&begin=' + escape(begin) + '&end=' + escape(end) + '&ajmc=' + escape(ajmc) + '&bmsah=' + escape(bmsah);
//    $('#dg_tjbb_ajjbxx').datagrid("load");
}

function loadAJJBXXGrid() {
    

//    $('#dg_tjbb_ajjbxx').datagrid('getPager').pagination({
//        beforePageText: '第',
//        afterPageText: '页   共{pages}页',
//        displayMsg: '当前显示【{from} ~ {to}】条记录   共【{total}】条记录'
//    });

    resizeAJJBXXHeight();
    resizeAJJBXXWidth();
}

/*
* 重置高度
*/
function resizeAJJBXXHeight() {
    var panelHeight = $('#datagridtable').height();

    $('#dg_tjbb_ajjbxx').datagrid('options').height = panelHeight;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizeAJJBXXWidth() {
    var panelWidth = $('#datagridtable').width();
    $('#dg_tjbb_ajjbxx').datagrid('options').width = panelWidth;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}

var selectedbmsah = '';

function AJJD(index) {
    var rowDatas = $('#dg_tjbb_ajjbxx').datagrid('getRows');
    $('#tb_bmsah').textbox('setValue', rowDatas[index].bmsah);
    $('#jdxm').window('open');

    $('#tree_ajlb').treegrid({
        //        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXM',
        //        method: 'get',
        fit: true,
        fitColumns: true,
        border: false,
        singleSelect: false,
        rownumbers: false,
        idField: 'bm',
        treeField: 'mc',
        columns: [[
                { field: '', title: '选择', checkbox: true },
                { field: 'mc', title: '监督项目', width: 720 },
                { field: 'YJTK', title: '依据条款', width: 340 }
            ]],
        onCheck: function (row) {
            var t = $(this);
            var opts = t.treegrid("options");
            if (opts.checkOnSelect && opts.singleSelect) {
                return;
            }
            var idField = opts.idField, id = row[idField];
            $.each(t.treegrid("getChildren", id), function (i, n) {
                t.treegrid("select", n[idField]);
            });
        },
        onUncheck: function (row) {
            var t = $(this);
            var opts = t.treegrid("options");
            if (opts.checkOnSelect && opts.singleSelect) {
                return;
            }
            var idField = opts.idField, id = row[idField];
            $.each(t.treegrid("getChildren", id), function (i, n) {
                t.treegrid("unselect", n[idField]);
            });
        }
    });

    $('#tree_ajlb').treegrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXM';
    $('#tree_ajlb').treegrid("load");
    //    $('.table_jdxm tr:even').addClass('even');
    //    $('.table_jdxm tr:odd').addClass('odd');
}

var bh = 0;
function WTXQ(index) {
    var rowDatas = $('#dg_tjbb_ajjbxx').datagrid('getRows');
    $('#tb_xq_cjsj').textbox('setValue', rowDatas[index].cjsj);
    $('#tb_xq_jkr').textbox('setValue', rowDatas[index].jkr);
    $('#tb_xq_fxwt').textbox('setValue', ReplaceAll(rowDatas[index].wtlbmc));

    $('#tb_xq_bmsah').textbox('setValue', rowDatas[index].bmsah);
    $('#tb_xq_ajlb').textbox('setValue', rowDatas[index].ajlb_mc);
    $('#tb_xq_cbbm').textbox('setValue', rowDatas[index].cbbm_mc);
    $('#tb_xq_cbr').textbox('setValue', rowDatas[index].cbr);

    $('#tb_xq_clyj').textbox('setValue', rowDatas[index].clyj);
    $('#tb_xq_cljg').textbox('setValue', rowDatas[index].cljg);
    $('#tb_xq_bz').textbox('setValue', rowDatas[index].clbz);
    bh = rowDatas[index].bh;

    $('#jkxq').window('open');
}

function ReplaceAll(value) {
    for (var i = 0; i < 1000; i++) {
        if (value.indexOf('<br>') != -1) {
            value = value.replace('<br>', '\r\n');
        } else {
            return value;
        }
    }
    return value;
}

function updateWT() {

    var clyj = $('#tb_xq_clyj').textbox('getValue');
    var cljg = $('#tb_xq_cljg').textbox('getValue');
    var clbz = $('#tb_xq_bz').textbox('getValue');
    $.post("/Handler/AJXX/AJXXHandler.ashx?action=UpdateAJLBXM",
        {
            bh: bh,
            clyj: clyj,
            cljg: cljg,
            clbz: clbz
        },
        function (result) {
            if (result == '1') {
                $('#jkxq').window('close');
                //刷新数据
                $('#dg_tjbb_ajjbxx').datagrid('load');
                $.messager.alert('提示信息', '保存成功！');
                //$('#jdxm').window('close');
            } else {
                Alert("修改失败，请重试！");
            }
        });
}