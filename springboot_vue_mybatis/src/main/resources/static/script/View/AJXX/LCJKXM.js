//@ sourceURL=lcjkxm.js
var dwbm;
$(document).ready(function () {
    AddOperationLog('流程监控-监控项目');
    this.dwbm = unitCode;
    loadAJJBXXGrid();
    //查询
    $('#btnSearch_lcjkxm').click(function () {

            loadAJJBXXData();
    });

    $('#btnAdd_lcjkxm').click( function () {
            openAddLcjkWindow();
    });

//    $('#dg_ljck_lcjkxm').pagination({
//        onSelectPage: function (pageNumber, pageSize) {
//            $(this).pagination('loading');
//            loadAJJBXXData(pageNumber, pageSize);
//            $(this).pagination('loaded');
//        }
//    });

    //单位下拉列表获取
    $("#ct_ajjbxx_dwbm").combotree({
        method: 'post',
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        editable: false,
        animate: false,
        onLoadSuccess: function (node, result) {
            $('#btnSearch_tjbb_ajjbxx').linkbutton({ disabled: false });
            $('#ct_ajjbxx_dwbm').combotree('setValue', unitCode);
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#cb_ajjbxx_sfbhxj').attr("checked", false);
                $("#cb_ajjbxx_sfbhxj").attr("disabled", "disabled");
            } else {
                $("#cb_ajjbxx_sfbhxj").removeAttr("disabled");
            }
        },
        onLoadError: function (data) {
            Alert("未获取到登录单位列表，请刷新重试或检查网络连接！" + data.responseText);
        }
    });

    

    // 取消添加按钮事件
    $('#btn_LCJKXM_Cancel').click( function () {
            $('#win_addlcjk').window('close');
    });

    //添加项目提交按钮事件
    $('#btn_LCJKXM_Submit').click(function() {
        SaveXmInfo();
    });
});

/*
*   加载监控项目grid数据
*/
function loadAJJBXXData() {
	this.dwbm = unitCode;
    var dwbm = $('#ct_ajjbxx_dwbm').textbox('getValue');
    var sfbhxj = document.getElementById('cb_ajjbxx_sfbhxj').checked?'2':'1';
    var lcjkmc = $('#cb_lcjkxm_lxmc').textbox('getValue');
    var yjtk = $('#cb_lcjkxm_yjtk').textbox('getValue');
    $('#dg_ljck_lcjkxm').datagrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetCJKXM_condition' + '&dwbm=' + escape(dwbm) + '&lcjkmc=' + escape(lcjkmc) + '&yjtk=' +
        escape(yjtk) + '&sjtype='+escape(sfbhxj);
    $('#dg_ljck_lcjkxm').datagrid("load");
}

function loadAJJBXXGrid() {
    $('#dg_ljck_lcjkxm').datagrid({
        width: 'auto',
        striped: true,
        fitColumns: true,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        sortable: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        columns: [
            [
                {
                    field: 'bm',
                    title: '类型编码',width:'3%',
                    sortable: true
                },
                { field: 'mc', title: '监控名称', width:'45%',sortable: true },
                { field: 'dwmc', title: '监控单位',width:'8%', sortable: true },
                { field: 'xh', title: '序号',width:'3%', sortable: true },
                { field: 'yjtk', title: '依据条款',width:'25%', sortable: true },
                { field: 'bz', title: '备注',width:'10%', sortable: true },
                { field: 'action', title: '操作',width:'5%', sortable: true,
                    formatter: function (value, row, index) {
						if(row.dwbm == dwbm){
							var r = '<a href="#" onclick="UpdateXmInfo(' + index + ')">编辑</a> ' +
									'<a href="#" onclick="DeleteXmInfo(' + index + ')">删除</a> ';
							return r;
						}
						else{
							return '';
						}
                    }
                }
            ]
        ],
        loadMsg: '数据加载中，请稍候...'
    });

    $('#dg_ljck_lcjkxm').datagrid('getPager').pagination({
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
    var panelHeight = $('#ajlcjkxm').height();

    $('#dg_ljck_lcjkxm').datagrid('options').height = panelHeight;
    $('#dg_ljck_lcjkxm').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizeAJJBXXWidth() {
    var panelWidth = $('#ajlcjkxm').width();
    $('#dg_ljck_lcjkxm').datagrid('options').width = panelWidth;
    $('#dg_ljck_lcjkxm').datagrid('resize');
}

var selectedbmsah = '';

function AJJD(index) {
    var rowDatas = $('#dg_ljck_lcjkxm').datagrid('getRows');
    $('#tb_bmsah').textbox('setValue', rowDatas[index].bmsah);
    $('#jdxm').window('open');

    $('#tree_ajlb').treegrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXM';
    $('#tree_ajlb').treegrid("load");
    //    $('.table_jdxm tr:even').addClass('even');
    //    $('.table_jdxm tr:odd').addClass('odd');
}

function openAddLcjkWindow() {
    $('#win_addlcjk').window({
        title: '新增监控项目'
    });

    $('#win_addlcjk').window('open');
    clearAddRyInfo();
    GetFlbbm();
    
}

function GetFlbbm() {
    //获取流程监控父项目
    var dwbm = unitCode;
    $("#inJK_flbbm").combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKFXM&dwbm=' + dwbm,
        editable: false,
        animate: false,
        onLoadError: function (data) {
            Alert("未获取到父项目列表，请刷新重试或检查网络连接！" + data.responseText);
        }
    });
}
/*
* 清空添加信息窗口的控件值
*/
function clearAddRyInfo() {
    $('#inJK_mc').textbox('setValue', '');
    $('#inJK_yjtk').textbox('setValue', '');
    $('#inJK_flbbm').textbox('setValue', '');
    $('#inJK_xh').textbox('setValue', '');
    $('#inJK_bz').textbox('setValue', '');
    $('#inJK_lxbm').textbox('setValue', '');
}


function SaveXmInfo() {
    //    获取按钮上的文本
    var title = $('#win_addlcjk').panel('options').title;
    var lxbm = $('#inJK_lxbm').textbox('getValue');
    var user = frameObject.GetUserInfo();
    var dwbm = user.UnitCode;
    var mc = trim($('#inJK_mc').textbox("getValue"));
    var flxbm = $('#inJK_flbbm').textbox('getValue');
    var yjtk = $('#inJK_yjtk').textbox("getValue");
    var bz = $('#inJK_bz').textbox('getValue');
    var xh = $('#inJK_xh').textbox("getValue");

    if (!isNull(xh)) {
        if (isNaN(xh)) {
            Alert('排序必须为数字');
            return;
        }
    } else {
        alert('请输入序号');
        return;
    }

    if (isNull(mc)) {
        Alert("请输入监控项目名称!");
        return;
    }
    if (title == '新增监控项目') {
        $.post("/Handler/AJXX/AJXXHandler.ashx?action=AddLCJKXM", { mc: mc, dwbm: dwbm, flxbm: flxbm, yjtk: yjtk, bz: bz, xh: xh },
            function (result) {
                Alert(result);
                //Alert(result);
            });
    }
    else {
        $.post("/Handler/AJXX/AJXXHandler.ashx?action=UpdateLCJKXM", { mc: mc, dwbm: dwbm, lxbm: lxbm, flxbm: flxbm, yjtk: yjtk, bz: bz, xh: xh },
            function (result) {
                Alert(result);
                //Alert(result);
            });
    }
    
    $('#win_addlcjk').window('close');
    //刷新数据
    $('#dg_ljck_lcjkxm').datagrid('load');
}

/*
* 修改监控流程操作
*/
function UpdateXmInfo(index) {
    var rowDatas = $('#dg_ljck_lcjkxm').datagrid('getRows');
    var bm = rowDatas[index].bm;
    var dwbm = unitCode;

    //查找监控流程信息
    $.post("/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXMByBM", { lxbm: bm, dwbm: dwbm },
         function (data) {
             if (!isNull(data)) {
                     FillContrl(data);
             }
         });
             $('#win_addlcjk').window({
        title: '编辑监控项目信息'
    });
    GetFlbbm();
    $('#win_addlcjk').window('open');
}

//删除流程监控操作
function DeleteXmInfo(index) {
    $.messager.confirm('确认', '您确认想要删除所选项目吗？', function (r) {
        if (r) {
            var rowDatas = $('#dg_ljck_lcjkxm').datagrid('getRows');
            var bm = rowDatas[index].bm;
            var dwbm = unitCode;
            $.post("/Handler/AJXX/AJXXHandler.ashx?action=DeleLCJKXM", { lxbm: bm, dwbm: dwbm },
                function (result) {
                    //Alert(result);
                    Alert(result);
                });
            //刷新数据
                $('#dg_ljck_lcjkxm').datagrid('load');
        }
    });
}

function FillContrl(data) {
    var lcjkxm = JSON.parse(data)[0];
    $('#inJK_mc').textbox('setValue', lcjkxm.lxmc);
    $('#inJK_yjtk').textbox('setValue', lcjkxm.yjtk);
    $('#inJK_flbbm').textbox('setValue', lcjkxm.flxbm);
    $('#inJK_xh').textbox('setValue', lcjkxm.xh);
    $('#inJK_bz').textbox('setValue', lcjkxm.bz);
    $('#inJK_lxbm').textbox('setValue', lcjkxm.lxbm);

}
