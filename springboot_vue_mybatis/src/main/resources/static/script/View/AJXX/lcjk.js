//@ sourceURL=lcjk.js
$(document).ready(function () {
    AddOperationLog('流程监控');
    loadAJJBXXGrid();

    $("#dt_ajjbxx_begin").datebox("setValue", getStartDate());
    $("#dt_ajjbxx_end").datebox("setValue", getEndDate());


    //查询
    $('#btn_lcjk_Search').click( function () {
            loadAJJBXXData();
    });

    //添加
    $('#btnInsert_ajjbxx').linkbutton({
        onClick: function () {
            addAJLBXM();
        }
    });


    //导出word
    $('#btn_lcjk_Exportfxwd').click( function () {
            exportWord();
    });

    $('#dg_tjbb_ajjbxx').pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            loadAJJBXXData(pageNumber, pageSize);
            $(this).pagination('loaded');
        }
    });
    //$('#btn_lcjk_Search').linkbutton({ disabled: true });

    //单位下拉列表获取
    $("#ct_ajjbxx_dwbm").combotree({
        method: 'post',
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + unitCode,
        editable: false,
        animate: false,
        onLoadSuccess: function (node, result) {
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

                    loadAJJBXXData();
//                    if (result.length == 1) {
//                        $('#cb_ajjbxx_bmbm').combotree('setValue', result[0].id);
//                    }
                    //$('#btn_lcjk_Search').linkbutton({ disabled: false });
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

    var sjtype = document.getElementById("cb_ajjbxx_sfbhxj").checked ? "2" : "1";
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
    var end = $('#dt_ajjbxx_end').textbox('getValue');
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

    $('#dg_tjbb_ajjbxx').datagrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetAJJBXX' + '&dwbm=' + escape(dwbm) + '&cbr=' + escape(cbrmc) + '&ajlbbm=' +
        escape(ajlbbm) + '&bmbm=' + escape(bmbm) + '&begin=' + escape(begin) + '&end=' + escape(end) + '&ajmc=' + escape(ajmc) + '&bmsah=' + escape(bmsah) + '&sjtype=' + escape(sjtype);
    $('#dg_tjbb_ajjbxx').datagrid("load");
    //$('#dg_tjbb_ajjbxx').datagrid({
    //    rowStyler: function (index, row) {
    //        if (row.cqts > 0) {
    //            return 'background-color:#FF0000;';
    //        }
    //    }
    //});

    resizeAJJBXXHeight();
    resizeAJJBXXWidth();
}

function loadAJJBXXGrid() {
    var time = new Date();
    var pre7Date = new Date(time.getTime() - 7 * 24 * 60 * 60 * 1000); //提前七天

    $('#dg_tjbb_ajjbxx').datagrid({
        width: 'auto',
        //striped: true,
        fitColumns: true,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        toolbar: $('#panelTool_tjbb_ajjbxx'),
        sortable: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        columns: [
            [
                {
                    field: 'cq',
                    title: '',
                    width: '30px',
                    formatter: function(value, row, index) {
                        if (row.cqts > 0) {
                            return "<img src='../../images/yjzt_2.gif' />";
                        }
                        if (row.syts != "" && row.syts < 10) {
                            return "<img src='../../images/yjzt_1.gif' />";
                        }
                        return "";
                    }
                },
                {
                    field: 'bmsah',
                    title: '部门受案号',
                    sortable: true
                    //                formatter: function (value, row, index) {
                    //                    return "<a target='_blank' href='/View/AJXX/ajxx1.htm?xtsah=" + row.base64 + "'>" + value + "</a>";
                    //                }
                },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    sortable: true,
                    formatter: function(value, row, index) {
                        return "<a onclick='openAJXX(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'ajlb_mc', title: '案件类别', sortable: true },
                { field: 'cbr', title: '承办人', sortable: true },
                { field: 'cbdw_mc', title: '承办单位', sortable: true },
                { field: 'cbbm_mc', title: '承办部门', sortable: true },
                { field: 'slrq', title: '受理日期', sortable: true },
                { field: 'dqrq', title: '到期日期', sortable: true },
                //{
                //    field: 'cqts', title: '已超期天数', sortable: true,
                //    formatter: function (value, row, index) {
                //        if (value < 0) {
                //            return "";
                //        } else {
                //            return value;
                //        }
                //    }
                //},
                {
                    field: 'syts',
                    title: '剩余天数',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value < 0) {
                            return "";
                        } else {
                            return value;
                        }
                    }
                },
                {
                    field: 'ajzt',
                    title: '案件状态',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == 0) {
                            return "受理";
                        } else if (value == 1) {
                            return "办理";
                        } else if (value == 2) {
                            return "已办";
                        } else if (value == 3) {
                            return "归档";
                        } else {
                            return "";
                        }
                    }
                },
                //{ field: 'action', title: '操作', sortable: true,
                //    formatter: function (value, row, index) {

                //        var r = '<a href="#" onclick="AJJD(' + index + ')">监督</a> ';
                //        return r;
                //        //                        if (row.ajztbm == '2') {
                //        //                            var r = '<a href="#" onclick="AJJD(' + index + ')">监督</a> ';
                //        //                            return r;
                //        //                        } else {
                //        //                            return '';
                //        //                        }
                //    }
                //}
            ]
        ],
        loadMsg: '数据加载中，请稍候...'
    });

    $('#dg_tjbb_ajjbxx').datagrid('getPager').pagination({
        beforePageText: '第',
        afterPageText: '页   共{pages}页',
        displayMsg: '当前显示【{from} ~ {to}】条记录   共【{total}】条记录'
    });

    resizeAJJBXXHeight();
    resizeAJJBXXWidth();
}

/*
* 重置高度
*/
function resizeAJJBXXHeight() {
    var panelHeight = $('#lcjk_panel').height();
    var h = $('#blbb_title').height();
    $('#dg_tjbb_ajjbxx').datagrid('options').height = panelHeight - h - 25;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizeAJJBXXWidth() {
    var panelWidth = $('#ajlcjklb').width();
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
        onCheck: function(row) {
            var t = $(this);
            var opts = t.treegrid("options");
            if (opts.checkOnSelect && opts.singleSelect) {
                return;
            }
            var idField = opts.idField, id = row[idField];
            $.each(t.treegrid("getChildren",id), function(i, n) {
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

//添加问题
function addAJLBXM() {

    var bmsah = $('#tb_bmsah').textbox('getValue');
    var gznr = $('#tb_gznr').textbox('getValue');
    var fxfs = $('#cb_ajjbxx_fxfs').textbox("getValue");
    var jkcs = $('#cb_ajjbxx_jkcs').combobox("getValue");
    var selections = $('#tree_ajlb').treegrid("getSelections");
    var bm = '';
    var mc = '';
    for (var i = 0; i < selections.length; i++) {
        bm += "'" + selections[i].bm + "'" + (i != selections.length - 1 ? ',' : '');
        mc +=  selections[i].mc + (i != selections.length - 1 ? ';<br>' : '');
    }

    $.post("/Handler/AJXX/AJXXHandler.ashx?action=AddAJLBXM",
        {
            bmsah: bmsah,
            fxfs: fxfs,
            bm: bm,
            mc: mc,
            gznr: gznr,
            jkcs: jkcs
        },
        function(result) {
            if (result == '1') {
                //刷新数据
                $('#dg_bl').datagrid('load');
                Alert('保存成功！');
                $('#tree_ajlb').treegrid("unselectAll");
                $('#jdxm').window('close');
            } else {
                Alert("保存失败，请重试！");
            }
        });
}


function exportWord() {
    ShowProgress(); // 显示进度条
    $.post("/Handler/AJXX/AJXXHandler.ashx?action=ExportFXWord",
           function (result) {
               CloseProgress(); // 如果提交成功则隐藏进度条
               frameObject.DownFiles(result);
               //var xx = frameObject.AddMessage('山东省院起诉受[2014]37000000034号', 'aaaaaa');
               //console.log(xx);
           });

}

function openAJXX(bmsah,ajlbbm) {
    frameObject.OpenDialogWeb(1, baseUrl + caseLCJKUrl + '?bmsah=' + bmsah, '', '{ "AJLBBM": "' + ajlbbm + '" }', '', selectedUrl);
}