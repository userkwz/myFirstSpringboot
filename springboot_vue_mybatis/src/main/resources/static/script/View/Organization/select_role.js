var org_role_jsbm = '';
var org_role_bmbm = '';
var org_role_bmmc = '';

$(document).ready(function () {
    // 获取当前所选角色的值
    var node = $('#tree_org_dwbmjs').tree('getSelected');
    if (node == null)
        return;
    org_role_jsbm = node.id;
    // 获取当前所选部门的值
    var pNode = $('#tree_org_dwbmjs').tree('getParent', node.target);
    if (pNode == null)
        return;
    org_role_bmbm = pNode.id;
    org_role_bmmc = pNode.text;

    // 界面标签样式设置及事件绑定
    org_role_marksInit();

    // 标签初始化数据加载
    org_role_marksDataBind();
});

// 界面标签样式设置及事件绑定
function org_role_marksInit() {

    // 删除角色
    $('#btn_org_role_delete').linkbutton({
        onClick: function () {
            $.messager.confirm('确认', '您确认要删除该角色吗？', function (p) {
                if (p) {
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Organization/organization.ashx",
                        data: { action: 'DeleteRole', bmbm: org_role_bmbm, jsbm: org_role_jsbm },
                        dataType: "json", //此句不能少
                        success: function (result) {
                            refresh_tree_org_dwbmjs(org_role_bmbm);
                            Alert("删除成功！");
                        }
                    });
                }
            });
        }
    });

    // 编辑角色信息
    $('#btn_org_role_edit').linkbutton({
        onClick: function () {
            var stat = $('#btn_org_role_edit').linkbutton('options').text;
            if (stat == "编辑") {
                //将编辑框变为使能状态
                $("#txt_org_role_jsmc").textbox("enable");
                $("#txt_org_role_jsxh").textbox("enable");

                $('#btn_org_role_edit').linkbutton({
                    text: '保存',
                    iconCls: 'icon-save'
                });
            }
            else if (stat == "保存") {
                var jsmc = trim($('#txt_org_role_jsmc').textbox('getText'));
                var jsxh = trim($('#txt_org_role_jsxh').textbox('getText'));
                
                if (isNull(jsmc) || isNull(jsxh)) {
                    Alert("角色名称或者角色序号不能为空");
                    return;
                }
                if (jsmc.indexOf('\\') != -1) {
                    Alert("角色名称不能包含特殊符号“\\”");
                    return;
                }

                // 调用一般处理程序修改角色信息encodeURI
                $.ajax({
                    type: "POST",
                    url: "/Handler/Organization/organization.ashx",
                    data: { action: 'AddRole', jsmc: jsmc, jsxh: jsxh, jsbm: org_role_jsbm, bmbm: org_role_bmbm },
                    dataType: "json",
                    success: function (result) {
                        // 对一般处理程序返回的数据，进行错误处理及数据过滤
                        doActionWithErrorHandle(result, function (data) {
                            // 重新加载树形控件数据,data:bmbm
                            refresh_tree_org_dwbmjs(data);
                            
                            Alert("修改角色信息成功");
                        });
                    }
                });
            }
        }
    });

    // 添加角色功能按钮
    $('#btn_org_role_right_edit').linkbutton({
        onClick: function () {

            //角色权限列表初始化
            $('#dg_org_role_rightlist').datagrid({
                width: 'auto',
                width: 725,
                striped: true,
                singleSelect: false,
                loadMsg: '数据加载中，请稍候...',
                pagination: false,
                rownumbers: true,
                idField: 'gnbm',
                toolbar: $('#toolbar_org_role_right'),
                url: '/Handler/Organization/organization.ashx?action=GetRoleRight&bmbm=' + org_role_bmbm + '&jsbm=' + org_role_jsbm + '&t=' +(new Date()).getMilliseconds(),
                columns: [[
                    { field: 'ck', width: 50, checkbox: true },
                    { field: 'gnmc', title: '功能名称', width: 130 },
                    { field: 'gnxsmc', title: '功能显示名称', width: 130 },
                    { field: 'flmc', title: '功能分类', width: 130 },
                    { field: 'gnct', title: '功能窗体', width: 300, hidden: true },
                    { field: 'rightEditUrl', title: '功能权限配置器窗体', width: 300, hidden: true },
                    { field: 'action', title: '操作', width: 150, align: 'center',
                        formatter: function (value, row, index) {
                            var e = '<a href="#" onclick="functionJSRight(' + index + ')">功能授权</a>';
                            return e;
                        }
                    },
                    { field: 'gnsm', title: '功能说明', width: 300 }
                ]],
                onLoadSuccess: function (data) {
                    var rowDatas = $('#dg_org_role_rightlist').datagrid('getRows');
                    for (i = 0; i < rowDatas.length; i++) {
                        if (rowDatas[i].jsgn.length > 0) {
                            $('#dg_org_role_rightlist').datagrid('checkRow', i);
                        }
                        else {
                            $('#dg_org_role_rightlist').datagrid('uncheckRow', i);
                        }
                    }
                },
                groupField: 'flmc',
                view: groupview,
                groupFormatter: function (value, rows) {
                    return ((value == '') ? "未分类" : value); // +' - ' + rows.length + ' 条';
                }
            });

            //角色权限 -- 按钮：添加
            $('#btn_org_role_right_add').linkbutton({
                onClick: function () {
                    var gnbmj = '';
                    var data = $('#dg_org_role_rightlist').datagrid('getChecked');
                    for (var i = 0; i < data.length; i++) {
                        gnbmj = gnbmj + ',' + data[i].gnbm;
                    }
                    
                    // 调用一般处理程序修改角色权限信息encodeURI
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Organization/organization.ashx",
                        data: { action: 'AddRoleRight', bmbm: org_role_bmbm, jsbm: org_role_jsbm, gnbm: gnbmj },
                        dataType: "json",
                        success: function (result) {
                            // 对一般处理程序返回的数据，进行错误处理及数据过滤
                            doActionWithErrorHandle(result, function (data) {
                                $('#win_org_role_right').window('close');

                                Alert("角色功能权限分配成功");
                            });
                        }
                    });
                }
            });

            $('#win_org_role_right').window('open');
        }
    });

}

// 标签初始化数据加载
function org_role_marksDataBind() {

    // 调用一般处理程序获取角色信息encodeURI
    $.ajax({
        type: "GET",
        url: "/Handler/Organization/organization.ashx",
        data: { action: 'GetRoleInfo', bmbm: org_role_bmbm, jsbm: org_role_jsbm, t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            doActionWithErrorHandle(result, function (data) {
                // 设置角色信息
                $("#txt_org_role_jsmc").textbox('setText', data.JSMC);
                $("#txt_org_role_jsxh").textbox('setText', data.JSXH);
                $("#txt_org_role_ssbm").textbox('setText', org_role_bmmc);
                $("#txt_org_role_jsmc").textbox("disable");
                $("#txt_org_role_jsxh").textbox("disable");
                $("#txt_org_role_ssbm").textbox("disable");
            });
        }
    });
}

// 重置角色权限信息的大小
function resize_dg_org_role_rightlist() {
    var panelJsQxInfoWidth = $('#pnl_org_role_rightlist').width() - 6;
    $('#dg_org_role_rightlist').datagrid('options').width = panelJsQxInfoWidth;
    $('#dg_org_role_rightlist').datagrid('resize');

    //    var panelJsQxInfoHeight = $('#win_org_role_right').height() - $('#gnTable_ZzjgSelectJs').height()
    //                        - $('#gnButtons_ZzjgSelectJs').height()-50;
    $('#dg_org_role_rightlist').datagrid('options').height = 400;
    //    $('#dg_org_role_rightlist').datagrid('options').height = panelJsQxInfoHeight;
    $('#dg_org_role_rightlist').datagrid('resize');
}


//功能授权
function functionJSRight(index) {
    var rowDatas = $('#dg_org_role_rightlist').datagrid('getRows');
    if (rowDatas == null || rowDatas[index] == null) {
        return;
    }
    var data = rowDatas[index];
    if (data.rightEditUrl == null || data.rightEditUrl == "") {
        Alert("功能没有配置权限编辑器");
        return;
    }
    //将人员工号和功能编码传递过去
    $('#org_gn_bm').val(data.gnbm);
    $('#org_editType').val('1'); //表示对角色进行授权
    $('#org_bmbm').val(org_role_bmbm);
    $('#org_jsbm').val(org_role_jsbm);
    $('#win_org_gnryqx').window('open');
    $('#panel_org_right').panel('open').panel('refresh', data.rightEditUrl);
}
