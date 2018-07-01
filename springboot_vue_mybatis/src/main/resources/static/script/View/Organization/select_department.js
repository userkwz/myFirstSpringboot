var bmbm = '';

$(document).ready(function () {
    
    // 获取当前所选部门的值
    var node = $('#tree_org_dwbmjs').tree('getSelected');
    if (node == null)
        return;
    bmbm = node.id;

    // 界面标签样式设置及事件绑定
    org_department_marksInit();

    // 标签初始化数据加载
    org_department_marksDataBind();

});

// 界面标签样式设置及事件绑定
function org_department_marksInit() {

    //添加部门按钮,添加部门切换panel
    $('#btn_org_dep_dep_add').linkbutton({
        onClick: function () {
            //将编辑框变为使能状态
            $('#txt_org_dep_select_bmmc').textbox('setText', '');
            $('#txt_org_dep_select_bmjc').textbox('setText', '');
            $('#txt_org_dep_select_bmxh').textbox('setText', '');
            $('#txt_org_dep_select_bmbz').textbox('setText', '');
            $('#txt_org_dep_select_bmmc').textbox('enable');
            $('#txt_org_dep_select_bmjc').textbox('enable');
            $('#txt_org_dep_select_bmxh').textbox('enable');
            $('#txt_org_dep_select_bmbz').textbox('enable');

            $('#btn_org_dep_select_edit').linkbutton({
                text: '添加',
                iconCls: 'icon-add'
            });

            $('#pnl_org_role_select').panel('close');
            $('#pnl_org_dep_select').panel('open');
        }
    });

    //删除部门
    $('#btn_org_dep_dep_del').linkbutton({
        onClick: function () {
            $.messager.confirm('确认', '您确认要删除该部门？', function (p) {
                if (p) {
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Organization/organization.ashx",
                        data: { action: 'DeleteDepartment', bmbm: bmbm },
                        dataType: "json", //此句不能少
                        success: function (result) {
                            refresh_tree_org_dwbmjs('');
                            Alert("删除成功！");
                        }
                    });
                }
            });
        }
    });

    //添加角色按钮,添加角色切换panel
    $('#btn_org_dep_role_add').linkbutton({
        onClick: function () {
            //将编辑框变为使能状态
            $('#pnl_org_dep_select').panel('close');
            $('#pnl_org_role_select').panel('open');
        }
    });

    //添加部门
    $('#btn_org_dep_select_edit').linkbutton({
        onClick: function () {
            var bmmc = trim($('#txt_org_dep_select_bmmc').textbox("getText"));
            var bmjc = trim($('#txt_org_dep_select_bmjc').textbox("getText"));
            var bmxh = trim($('#txt_org_dep_select_bmxh').textbox("getText"));
            var bz = trim($('#txt_org_dep_select_bmbz').textbox("getText"));
            
            var stat = $('#btn_org_dep_select_edit').linkbutton('options').text;
            if (stat == "编辑") {
                //将编辑框变为使能状态
                $('#txt_org_dep_select_bmmc').textbox('enable');
                $('#txt_org_dep_select_bmjc').textbox('enable');
                $('#txt_org_dep_select_bmxh').textbox('enable');
                $('#txt_org_dep_select_bmbz').textbox('enable');

                $('#btn_org_dep_select_edit').linkbutton({
                    text: '保存',
                    iconCls: 'icon-save'
                });
            }
            else if (stat == "保存") { //保存数据(编辑部门)
                if (isNull(bmmc) || isNull(bmjc) || isNull(bmxh)) {
                    Alert("部门名称或者部门简称或者部门序号不能为空");
                    return;
                }

                // 调用一般处理程序修改部门信息encodeURI
                $.ajax({
                    type: "POST",
                    url: "/Handler/Organization/organization.ashx",
                    data: { action: 'AddDepartment', bmmc: bmmc, bmjc: bmjc, bmxh: bmxh, bz: bz, bmbm: bmbm },
                    dataType: "json",
                    success: function (result) {
                        // 对一般处理程序返回的数据，进行错误处理及数据过滤
                        doActionWithErrorHandle(result, function (data) {
                            // 重新加载树形控件数据,data:bmbm
                            refresh_tree_org_dwbmjs(data);
                            //刷新添加人员窗口的部门combobox
                            //$('#inCbbm').combobox('reload', '/Handler/ZZJG/zzjg.ashx?action=GetBmInfoByDwbm');

                            Alert("编辑部门成功");
                        });
                    }
                });
            }
            else if (stat == "添加") { //添加部门
                if (isNull(bmmc) || isNull(bmjc) || isNull(bmxh)) {
                    Alert("部门名称或者部门简称或者部门序号不能为空");
                    return;
                }

                // 调用一般处理程序插入部门信息encodeURI
                $.ajax({
                    type: "POST",
                    url: "/Handler/Organization/organization.ashx",
                    data: { action: 'AddDepartment', bmmc: bmmc, bmjc: bmjc, bmxh: bmxh, bz: bz, fbmbm: bmbm },
                    dataType: "json",
                    success: function (result) {
                        // 对一般处理程序返回的数据，进行错误处理及数据过滤
                        doActionWithErrorHandle(result, function (data) {
                            // 重新加载树形控件数据,data:bmbm
                            refresh_tree_org_dwbmjs(data);
                            //刷新添加人员窗口的部门combobox
                            //$('#inCbbm').combobox('reload', '/Handler/ZZJG/zzjg.ashx?action=GetBmInfoByDwbm');

                            Alert("添加部门成功");
                        });
                    }
                });
            }
        }
    });

    //添加角色
    $('#btn_org_role_select_save').linkbutton({
        onClick: function () {
            var jsmc = trim($('#txt_org_role_select_jsmc').textbox('getText'));
            var jsxh = trim($('#txt_org_role_select_jsxh').textbox('getText'));
            if (isNull(jsmc) || isNull(jsxh)) {
                Alert("角色名称或者角色序号不能为空");
                return;
            }

            // 调用一般处理程序插入角色信息encodeURI
            $.ajax({
                type: "POST",
                url: "/Handler/Organization/organization.ashx",
                data: { action: 'AddRole', bmbm: bmbm, jsmc: jsmc, jsxh: jsxh },
                dataType: "json",
                success: function (result) {
                    // 对一般处理程序返回的数据，进行错误处理及数据过滤
                    doActionWithErrorHandle(result, function (data) {
                        // 重新加载树形控件数据,data:jsbm
                        refresh_tree_org_dwbmjs(data);
                        //刷新添加人员窗口的部门combobox
                        //$('#inCbbm').combobox('reload', '/Handler/ZZJG/zzjg.ashx?action=GetBmInfoByDwbm');

                        Alert('添加角色成功');
                    });
                }
            });
        }
    });
    
}

// 标签初始化数据加载
function org_department_marksDataBind() {

    // 调用一般处理程序获取部门信息encodeURI
    $.ajax({
        type: "GET",
        url: "/Handler/Organization/organization.ashx",
        data: { action: 'GetDepartmentInfo', bmbm: bmbm, t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            doActionWithErrorHandle(result, function (data) {
                // 设置部门信息
                $("#txt_org_dep_select_bmmc").textbox('setText', data.BMMC);
                $("#txt_org_dep_select_bmjc").textbox('setText', data.BMJC);
                $("#txt_org_dep_select_bmxh").textbox('setText', data.BMXH);
                $("#txt_org_dep_select_bmbz").textbox('setText', data.BZ);
                $("#txt_org_dep_select_bmmc").textbox("disable");
                $("#txt_org_dep_select_bmjc").textbox("disable");
                $("#txt_org_dep_select_bmxh").textbox("disable");
                $("#txt_org_dep_select_bmbz").textbox("disable");

                // 添加角色时显示所选部门
                $('#txt_org_role_select_ssbm').textbox('setText', data.BMMC);
                $("#txt_org_role_select_ssbm").textbox("disable");
            });
        }
    });
}
