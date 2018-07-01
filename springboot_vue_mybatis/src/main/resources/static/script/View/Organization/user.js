
var parm = new UrlSearch();
$(document).ready(function () {

    loadUserInfoGrid();
    initWindow_ry();
    AddOperationLog('用户管理');
    //查询人员
    $('#btnSearch_ry').linkbutton({
        iconCls: 'icon-search',
        onClick: function () {
            var xm = $('#xm_ry').val();
            var gh = $('#gh_ry').val();
            var dwbm = $('#dwbm_ry').combotree('getValue');
            loadUserGrid(xm, gh, dwbm);
        }
    });

    //弹出添加人员窗口
    $('#btnAdd_ry').linkbutton({
        iconCls: 'icon-add',
        onClick: function () {
            openRyWindow();
        }
    });

    //    //弹出添加人员窗口
    //    $('#btnUpdate_ry').linkbutton({
    //        iconCls: 'icon-edit',
    //        onClick: function () {
    //            UpdateRyInfo();
    //        }
    //    });

    //    //弹出添加人员窗口
    //    $('#btnDelete_ry').linkbutton({
    //        iconCls: 'icon-remove',
    //        onClick: function () {
    //            DeleteRyInfo();
    //        }
    //    });

    //添加人员提交按钮事件
    $('#btnSubmit_ry').linkbutton({
        iconCls: 'icon-ok',
        onClick: function () {
            SaveRyInfo();
        }
    });

    // 取消添加人员按钮事件
    $('#btnCancel_ry').linkbutton({
        iconCls: 'icon-cancel',
        onClick: function () {
            $('#win_ry').window('close');
        }
    });

    //    // 重置密码按钮事件
    //    $('#btnResetPwd_ry').linkbutton({
    //        iconCls: 'icon-ok',
    //        onClick: function () {
    //            ResetPwd_ry();
    //        }
    //    });

    // 查看详细按钮事件
    $('#btnDetail_ry').linkbutton({
        iconCls: 'icon-search',
        onClick: function () {
            Detail_ry();
        }
    });


    // 关闭按钮事件
    $('#btnClose_ry').linkbutton({
        iconCls: 'icon-cancel',
        onClick: function () {
            $('#winDetail_ry').window('close');
        }
    });

    //评查组人员信息
    $('#dg_ry').datagrid({
        onClickRow: function (rowIndex, rowData) {
            $('#dg_ry').datagrid('clearSelections');
            $('#dg_ry').datagrid('highlightRow', rowIndex);
        }
    });

    var dwbm = parm.dwbm;

    // 单位编码ComboTree初始化
    $('#dwbm_ry').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetDwbmTree&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#dwbm_ry').combotree('setValue', dwbm);
        }
    });

    // 单位编码ComboTree初始化
    $('#inDwbm_ry').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetDwbmTree&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#inDwbm_ry').combotree('setValue', dwbm);
        }
    });
});

function loadUserInfoGrid() {
    $('#dg_ry').datagrid({
        width: 'auto',
        striped: true,
        fitColumns: true,
        singleSelect: false,
        pagination: true,
        rownumbers: true,
        toolbar: $('#ryInfoTool'),
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        columns: [[
        { field: 'dwmc', title: '单位名称', width: 100 },
        { field: 'mc', title: '姓名', width: 100 },
        { field: 'gh', title: '工号', width: 60 },
        { field: 'xb', title: '性别', width: 60 },
        { field: 'dlbm', title: '登录别名', width: 100 },
        { field: 'gzzh', title: '工作证号', width: 100 },
        { field: 'yddhhm', title: '联系电话', width: 110 },
        { field: 'dzyj', title: '电子邮件', width: 200 },
        { field: 'dlip', title: '登陆IP', width: 150 },
        //        { field: 'sftz', title: '是否在职',align:'center', width: 100,formatter: function (value) {
        //            if (value == "N") {
        //                var s = '<div><img src="./Scripts/jquery-easyui-1.4.3/themes/icons/ok.png"/></div>';
        //                return s;
        //            }
        //            else {
        //                var s = '<div><img src="./Scripts/jquery-easyui-1.4.3/themes/icons/cross.png"/></div>';
        //                return s;
        //            }
        //        } },
        //        { field: 'sfsc', title: '是否启用',align:'center', width: 100,formatter: function (value) {
        //            if (value == "N") {
        //                var s = '<div><img src="./Scripts/jquery-easyui-1.4.3/themes/icons/ok.png"/></div>';
        //                return s;
        //            }
        //            else {
        //                var s = '<div><img src="./Scripts/jquery-easyui-1.4.3/themes/icons/cross.png"/></div>';
        //                return s;
        //            }
        //        } },
         {field: 'action', title: '操作', width: 160, align: 'center',
         formatter: function (value, row, index) {
             var r = '<a href="#" onclick="UpdateRyInfo(' + index + ')">编辑</a> ';
//             var d = '<a href="#" onclick="DeleteRyInfo(' + index + ')">删除</a> ';
//             var s = '<a href="#" onclick="ResetPwd_ry(' + index + ')">密码重置</a> ';
             return r ;
         }
     }
        ]],
        loadMsg: '数据加载中，请稍候...'
        //onDblClickRow: onDblClickRow
    });

    $('#dg_ry').datagrid('getPager').pagination({
        beforePageText: '第',
        afterPageText: '页   共{pages}页',
        displayMsg: '当前显示【{from} ~ {to}】条记录   共【{total}】条记录'
    });

    resizeRYXXInfoHeight();
    resizeRYXXInfoWidth();

    $('#pZzjgRyInfo').panel({
        onResize: function (width, height) {
            resizeRYXXInfoHeight();
            resizeRYXXInfoWidth();
        }
    });

    loadUserGrid('', '', parm.dwbm);

}

/*
*   加载人员grid数据
*/
function loadUserGrid(xm, gh, dwbm) {
    $('#dg_ry').datagrid({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyList' + '&xm=' + escape(xm) + '&gh=' + gh + '&dwbm=' + dwbm
    });
}
/*
* 重置人员信息的高度
*/
function resizeRYXXInfoHeight() {
    var panelRYInfoHeight = $('#panelRYXX').height();
    var h = $('#ryInfoTool').height() + 20;

    $('#dg_ry').datagrid('options').height = panelRYInfoHeight;
    $('#dg_ry').datagrid('resize');
}

/*
* 重置人员信息的宽度
*/
function resizeRYXXInfoWidth() {
    var panelRYInfoWidth = $('#panelRYXX').width();
    $('#dg_ry').datagrid('options').width = panelRYInfoWidth;
    $('#dg_ry').datagrid('resize');
}

function openRyWindow() {
    $('#win_ry').window({
        title: '新增人员信息'
    });


    $('#win_ry').window('open');
    clearAddRyInfo();
}

/*
* 清空添加人员信息窗口的控件值
*/
function clearAddRyInfo() {
    $('#inMc_ry').textbox('setValue', '');
    $('#inDlbm_ry').textbox('setValue', '');
    $('#inGzzh_ry').textbox('setValue', '');
    $('#inYdDhhm_ry').textbox('setValue', '');
    $('#inDzyx_ry').textbox('setValue', '');
    $('#inCAID_ry').textbox('setValue', '');
    $('#inDlip_ry').textbox('setValue', '');
}

function SaveRyInfo() {
    //    获取按钮上的文本
    var title = $('#win_ry').panel('options').title;
    var dwbm = $('#inDwbm_ry').combotree("getValue");
    var mc = trim($('#inMc_ry').textbox("getValue"));
    if (!isNull(mc)) {
        if (getLength(mc) > 60) {
            Alert('名称不能超过60个字符,汉字则不能超过30个字符');
            return;
        }
    }
    var dlbm = trim($('#inDlbm_ry').textbox("getValue"));
    if (!isNull(dlbm)) {
        if (getLength(dlbm) > 60) {
            Alert('登录别名不能超过60个字符,汉字则不能超过30个字符');
            return;
        }
    }
    var gzzh = trim($('#inGzzh_ry').textbox('getValue'));
    if (!isNull(gzzh)) {
        if (getLength(gzzh) > 20) {
            Alert("工作证号不能超过20位!");
            return;
        }
    }
    var dlip = trim($('#inDlip_ry').textbox('getValue'));
    if (!isNull(dlip)) {
        if (getLength(dlip) > 20) {
            Alert("登陆IP不能超过20位!");
            return;
        }
    }
    var xb = $("input[name='xb_ry']:checked").val();
    var lsry = $("input[name='isLsry_ry']:checked").val();
    var yddhhm = trim($('#inYdDhhm_ry').textbox('getValue'));
    if (!isNull(yddhhm)) {
        if (!HRFilePhonevalidate(yddhhm)) {
            Alert("请输入正确的移动电话号码!");
            return;
        }
    }
    var dzyx = trim($('#inDzyx_ry').textbox('getValue'));
    if (!isNull(dzyx)) {
        if (!(mainIsValidate(dzyx))) {
            Alert("请输入正确的邮箱");
            return;
        }
    }
    var CAIDH = trim($('#inCAID_ry').textbox('getValue'));
    if (!isNull(CAIDH)) {
        if (getLength(CAIDH) > 100) {
            Alert('CAID号不能超过100个字符,汉字则不能超过50个字符');
            return;
        }
    }
    var action = '';
    var gh = '';
    if (title == '新增人员信息') {
        action = 'AddRyInfo';
    }
    else {
        action = 'UpdateRyInfo';
        gh = $('#inGh_ry').textbox('getValue');
    }
    $.post("/Handler/ZZJG/ZZJGHandler.ashx", { action: action, mc: mc, dlbm: dlbm, gzzh: gzzh,
        xb: xb, lsry: lsry, yddhhm: yddhhm, dzyx: dzyx, CAIDH: CAIDH, gh: gh, dlip: dlip, dwbm: dwbm
    },
            function (result) {
                Alert(result);
                //Alert(result);
            });
    $('#win_ry').window('close');
    //刷新数据
    $('#dg_ry').datagrid('load');
}

/*
* 修改人员操作
*/
function UpdateRyInfo(index) {
    var rowDatas = $('#dg_ry').datagrid('getRows');
    var gh = rowDatas[index].gh;
    var dwbm = rowDatas[index].dwbm;

    //查找人员信息
    $.post("/Handler/ZZJG/ZZJGHandler.ashx", { action: 'GetRyinfoByGh', gh: gh, dwbm: dwbm },
         function (data) {
             if (!isNull(data)) {
                 var arrRyinfo = new Array();
                 arrRyinfo = data.split(',', 11);
                 for (var i = 0; i < arrRyinfo.length; i++) {
                     var tmp = arrRyinfo[i].split(':', 2);
                     matchContrl(tmp);
                 }
             }
         });
    $('#win_ry').window({
        title: '编辑人员信息'
    });
    $('#win_ry').window('open');
}
/*s
* 匹配控件进行赋值
*/
function matchContrl(data) {
    switch (data[0]) {
        case "gh": $('#inGh_ry').textbox('setValue', data[1]);
            break;
        case "dwbm": $('#inDwbm_ry').combotree('setValue', data[1]);
            $('#dwmc_ry').combotree('setValue', data[1]);
            break;
        case "mc": $('#inMc_ry').textbox('setValue', data[1]);
            $('#mc_ry').textbox('setValue', data[1]);
            break;
        case "dlbm": $('#inDlbm_ry').textbox('setValue', data[1]);
            $('#dlbm_ry').textbox('setValue', data[1]);
            break;
        case "gzzh": $('#inGzzh_ry').textbox('setValue', data[1]);
            $('#gzzh_ry').textbox('setValue', data[1]);
            break;
        case "xb":
            {
                var xb = data[1];
                if (xb == "男") {
                    //                    $("input[name='xb_ry'][value=1]").attr("checked", true);
                    //                    $("input[name='sex_ry'][value=1]").attr("checked", true);
                    document.getElementsByName('xb_ry')[0].checked = true;
                    document.getElementsByName('sex_ry')[0].checked = true;
                }
                else {
                    //                    $("input[name='xb_ry'][value=0]").attr("checked", true);
                    //                    $("input[name='sex_ry'][value=1]").attr("checked", true);
                    document.getElementsByName('xb_ry')[1].checked = true;
                    document.getElementsByName('sex_ry')[1].checked = true;
                }
            }
            break;
        case "sflsry":
            {
                var lsry = data[1];
                if (lsry == "1") {
                    //                    $("input[name='isLsry_ry'][value=Y]").attr("checked", true);
                    //                    $("input[name='lsry_ry'][value=Y]").attr("checked", true);
                    document.getElementsByName('isLsry_ry')[0].checked = true;
                    document.getElementsByName('lsry_ry')[0].checked = true;
                }
                else {
                    //                    $("input[name='isLsry_ry'][value=N]").attr("checked", true);
                    //                    $("input[name='lsry_ry'][value=N]").attr("checked", true);
                    document.getElementsByName('isLsry_ry')[1].checked = true;
                    document.getElementsByName('lsry_ry')[1].checked = true;
                }
            }
            break;
        case "yddhhm": $('#inYdDhhm_ry').textbox('setValue', data[1]);
            $('#dhhm_ry').textbox('setValue', data[1]);
            break;
        case "dzyj": $('#inDzyx_ry').textbox('setValue', data[1]);
            $('#email_ry').textbox('setValue', data[1]);
            break;
        case "caid": $('#inCAID_ry').textbox('setValue', data[1]);
            $('#caid_ry').textbox('setValue', data[1]);
            break;
        case "dlip": $('#inDlip_ry').textbox('setValue', data[1]);
            $('#dlip_ry').textbox('setValue', data[1]);
            break;
    }
}

/*
* 删除人员操作
*/
function DeleteRyInfo(index) {
    $.messager.confirm('确认', '您确认想要删除所选人员吗？', function (r) {
        if (r) {
            var rowDatas = $('#dg_ry').datagrid('getRows');
            var gh = rowDatas[index].gh;
            var dwbm = rowDatas[index].dwbm;
            var ghj = '';
            var data = $('#dg_ry').datagrid('getChecked');
            ghj = gh;
            if (ghj == '') {
                return;
            };
            $.post("/Handler/ZZJG/ZZJGHandler.ashx", { action: "DeleteRyInfo", ghj: ghj, dwbm: dwbm
            },
                function (result) {
                    //Alert(result);
                    Alert(result);
                });
            //刷新数据
            $('#dg_ry').datagrid('load');
        }
    });

}

function ResetPwd_ry(index) {
    $.messager.confirm('确认', '您确认想要将所选人员重置密码吗？', function (r) {
        if (r) {
            var ghj = '';
            var rowDatas = $('#dg_ry').datagrid('getRows');
            var dwbm = rowDatas[index].dwbm;
            var gh = rowDatas[index].gh;
            ghj = gh;

            if (ghj == '') {
                return;
            };
            $.post("/Handler/ZZJG/ZZJGHandler.ashx", { action: "ResetPwd", ghj: ghj, dwbm: dwbm
            },
                function (result) {
                    //Alert(result);
                    Alert(result);
                });
        }
    });
}

function initWindow_ry() {
    /*
    * 添加角色功能
    */
    $('#win_ry').window({
        //        width: 990,
        //        height: 530,
        modal: true,
        maximizable: false,
        minimizable: false,
        closed: true,
        collapsible: false,
        title: '新增人员信息'
    });

    $('#winDetail_ry').window({
        //        width: 990,
        //        height: 530,
        modal: true,
        maximizable: false,
        minimizable: false,
        closed: true,
        collapsible: false,
        title: '人员详细信息'
    });

    $('#winRole_ry').window({
        //        width: 990,
        //        height: 530,
        modal: true,
        maximizable: false,
        minimizable: false,
        closed: true,
        collapsible: false,
        title: '角色信息'
    });
}

function Detail_ry() {
    var gh = '';
    var dwbm = '';
    var data = $('#dg_ry').datagrid('getChecked');
    var i = data.length;
    if (i == 0) {
        return;
    }
    //    if (i > 1) {
    //        Alert('一次只能查看一个人员！');
    //        return;
    //    }
    gh = data[0].gh;
    dwbm = data[0].dwbm;
    //查找人员信息
    $.post("/Handler/ZZJG/ZZJGHandler.ashx", { action: 'GetRyinfoByGh', gh: gh, dwbm: dwbm },
         function (data) {
             if (!isNull(data)) {
                 var arrRyinfo = new Array();
                 arrRyinfo = data.split(',', 11);
                 for (var i = 0; i < arrRyinfo.length; i++) {
                     var tmp = arrRyinfo[i].split(':', 2);
                     matchContrl(tmp);
                 }
             }
         });
    $('#winDetail_ry').window('open');
}

function Role_ry() {
    var gh = '';
    var data = $('#dg_ry').datagrid('getChecked');
    var i = data.length;
    if (i == 0) {
        return;
    }
    //    if (i > 1) {
    //        Alert('一次只能查看一个人员！');
    //        return;
    //    }
    gh = data[0].gh;
    //查找人员信息
    $('#tree_ry').tree({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyJsData&gh=' + gh,
        method: 'post',
        lines: true,
        title: '已分配角色',
        onLoadError: function (arguments) {
            Alert(arguments.responseText);
        },
        onLoadSuccess: function (node, data) {
            if (data && data.length > 0) {
                //展开根节点到指定节点
                $('#tree_ry').tree('expandAll');
            }
        }
    });
    $('#winRole_ry').window('open');
}




