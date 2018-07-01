//@ sourceURL=index_bm.js

var bm_curindex = -1;
var bm_dwNode;

$(document).ready(function () {
    //$.ajaxSetup({ async: false });
    var user = frameObject.GetUserInfo();
    var dwbm = user.UnitCode;
    bm_dwNode = dwbm;
    BaGridInit();
    
    $('#bm_dwbm_zzjg').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetDwbmTree&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#bm_dwbm_zzjg').combotree('setValue', dwbm);
            bm_dwNode = dwbm;
        },
        onSelect: function (node) {
            bm_dwNode = node.id;
        }
    });
});

function BaGridInit() {
    var oldRowIndex = -1;
    $('#dg_babm').datagrid({
        width: 'auto',
   
        striped: true,
        singleSelect: true,
        loadMsg: '数据加载中，请稍候...',
        pagination: false,
        rownumbers: true,
        fitColumns: true,
        page: 1,
        pageRows: 10,
        height: 850,
        //pageList: [10, 20, 30, 50, 100],
        toolbar: $('#toolBabm'),
        columns: [
            [
                //{ field: 'rn', title: '序号', hidden: true },
                { field: 'DWBM', title: '单位编码', hidden: true, width: 10 },
                { field: 'BMBM', title: '部门编码', hidden: true, width: 10 },
                { field: 'FBMMC', title: '(父)部门名称', hidden: false, width: 200 },
                {
                    field: 'AGZS_BMMC',
                    title: '部门名称（案管助手）',
                    hidden: false,
                    width: 200,
                    editor: { type: 'validatebox', options: { required: true, missingMessage: '新部门名称！' } }
                },
                {
                    field: 'action',
                    title: '',
                    width: 50,
                    align: 'center',
                    formatter: function(value, row, index) {
                        var e = '<a href="javascript:void(0)" onclick="TyywToAgzs(' + index + ')"><</a> ';
                        return e;
                    }
                },
                { field: 'TYYW_BMMC', title: '部门名称（统一业务）', hidden: false, width: 200 },
                {
                    field: 'SFBABM',
                    title: '是否办案部门',
                    hidden: false,
                    width: 200,
                    formatter: function (value) {
                        var a;
                        if (value == "0") {
                            a = '<select onchange="comChange(value)" class="combobox" onclick="selectone(value)" ><option value="0">否</option><option value="1">是</option></select>';
                        }
                        else if (value == "1") {
                            a = '<select onchange="comChange(value)" class="combobox" onclick="selectone(value)" ><option value="1">是</option><option value="0">否</option></select>';
                        }
                        return a;
                    }
                },
//                {
//                    field: 'sfupdate',
//                    title: '更新',
//                    hidden: false,
//                    width: 200,
//                    formatter: function() {
//                        var c = '<input type="checkbox" onclick="checkUpdate(value)">';
//                        return c;
//                    }}
                //{field: "ck",title: '更新',width: 200,checkbox:true }
                {
                field: 'sfupdate', align: 'center', title: '更新', width: 30,
                formatter: function (value, rec, rowIndex) {
                    return "<input type=\"checkbox\"  name=\"PD\" value=\"" + rowIndex + "\" >";
                }
            }
            ]
        ],
        onClickRow: function(rowIndex, rowData) {
            //$('#dg_babm').datagrid('clearSelections');
            //$('#dg_babm').datagrid('highlightRow', rowIndex);
            //alert(rowIndex);
            bm_curindex = rowIndex;
            if (oldRowIndex != -1) {
                $('#dg_babm').datagrid('endEdit', oldRowIndex);
                $('#dg_babm').datagrid("getPanel").find(".datagrid-view2 .datagrid-body table input[type='checkbox']:eq(" + oldRowIndex + ") ").attr("checked", true);
            }
        },
        onDblClickRow: function(rowIndex, rowData) {
            //alert(rowIndex);
            oldRowIndex = rowIndex;
            EditDataGridRow(rowIndex);
        },
        groupField: 'FBMMC',
        view: groupview,
        groupFormatter: function(value, rows) {
            return ((value == '') ? "父单位未知" : value); // +' - ' + rows.length + ' 条';
        }
    });

    loadBabmGrid(bm_dwNode, '');
    //resizePTJSDYHeight();
    //resizePTJSDYWidth();
}

function comChange(value) {
    //alert(value);
    var rowDatas = $('#dg_babm').datagrid('getRows');
    rowDatas[bm_curindex].SFBABM = value;
    $('#dg_babm').datagrid("getPanel").find(".datagrid-view2 .datagrid-body table input[type='checkbox']:eq(" + bm_curindex + ") ").attr("checked", true);
}

function checkUpdate(value) {
    //alert(value);
}

function selectone(q) {
    //var va = $(this).text();
    //alert(q);
    //$('#dg_babm').datagrid("getPanel").find(".datagrid-view2 .datagrid-body table input[type='checkbox']:eq(" + bm_curindex + ") ").attr("checked", true);
}

function loadBabmGrid(dwbm,bmmc) {
    $('#dg_babm').datagrid({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetBabm' + '&t=' + new Date().getTime() + '&dwbm=' + dwbm + '&bmmc=' + escape(bmmc),
        onLoadSuccess: function (data) {
            //alert(1);
        },
        onLoadError: function () {
            //alert(0);
        }

    });
}

function EditDataGridRow(index) {
    $('#dg_babm').datagrid('beginEdit', index);
}

function TyywToAgzs(index) {
    //alert(index);
    var rowDatas = $('#dg_babm').datagrid('getRows');
    var tyyw_bmmc = rowDatas[index].TYYW_BMMC;
    rowDatas[index].AGZS_BMMC = tyyw_bmmc;

    ///////////////////////////////////////////////
//    var items = $("input[name='PD']:checked");
//    var result = "";
//    $.each(items, function (index, item) {

//        result = result + "|" + item.value;

//    });


    ///////////////////////////////////////////////
   
    //rowDatas[index].sfupdate = true;
    $('#dg_babm').datagrid('endEdit', index).datagrid('refreshRow', index);
    $('#dg_babm').datagrid("getPanel").find(".datagrid-view2 .datagrid-body table input[type='checkbox']:eq(" + index + ") ").attr("checked", true);
}

function GetUpdateCBBMmcList() {
//    var s = $('#dg_babm').datagrid('getChecked');  //勾选的数组
//    if (s.length == 0) {
//        alert("没有需要更新的行，请先勾选！");
//        return;
//    }
//    var dwbm;
//    var bmbm;
//    var bmmc;
//    var sfbabm;
//    var result;
//    var resMsg = "";
//    for (var i = 0; i < s.length; i++) {
//        dwbm = s[i].DWBM;
//        bmbm = s[i].BMBM;
//        bmmc = s[i].AGZS_BMMC;
//        sfbabm = s[i].SFBABM;
//    
//        result = UpdateCBBMmc(dwbm, bmbm, bmmc, sfbabm);
//        //alert(result);
//        if (result != "1") {
//            resMsg = bmmc + ",";
//        }
//    }
//    if (resMsg == "") {
//        alert("更新成功!");
//    } else {
//        resMsg = resMsg.substr(0, resMsg.length - 1);
//        alert("[" + resMsg + "] 更新失败！");
//    }
    //alert(sfbabm)

    var items = $("input[name='PD']:checked");
    if (items.length == 0) {
        alert("没有需要更新的行，请先勾选！");
        return;
    }
    var rowDatas = $('#dg_babm').datagrid('getRows');
    var dwbm;
    var bmbm;
    var bmmc;
    var sfbabm;
    var result;
    var resMsg = "";
    
    $.each(items, function(index, item) {

        //result = result + "|" + item.value;
        dwbm = rowDatas[item.value].DWBM;
        bmbm = rowDatas[item.value].BMBM;
        bmmc = rowDatas[item.value].AGZS_BMMC;
        sfbabm = rowDatas[item.value].SFBABM;

        result = UpdateCBBMmc(dwbm, bmbm, bmmc, sfbabm);
        //alert(result);
        if (result != "1") {
            resMsg = resMsg + bmmc + ",";
        }

    });

    if (resMsg == "") {
        alert("更新成功!");
    } else {
        resMsg = resMsg.substr(0, resMsg.length - 1);
        alert("[" + resMsg + "] 更新失败！");
    }
}

function UpdateCBBMmc(dwbm, bmbm, bmmc, sfbabm) {
    var queryData = {
        action: 'UpdateCBBMmc',
        dwbm: dwbm,
        bmbm: bmbm,
        bmmc: bmmc,
        sfbabm: sfbabm
    };
    var result;
//    $.post('/Handler/ZZJG/ZZJGHandler.ashx', queryData,
//            function (result) {
//                return result;
    //            });
    $.ajax({
        type: "post",
        url: "/Handler/ZZJG/ZZJGHandler.ashx",
        data: queryData,
        async: false,
        success: function (data) {
            result = data;
        }
    });
    //alert(result);
    return result;
}

function searchBabm() {
    //
    var bmmc = trim($('#bm_tbbmmc').textbox('getValue'));
    //alert([bm_dwNode,bmmc]);
    loadBabmGrid(bm_dwNode, bmmc);
}