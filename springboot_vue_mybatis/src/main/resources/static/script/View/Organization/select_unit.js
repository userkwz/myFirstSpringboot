
$(document).ready(function () {

    // 界面标签样式设置及事件绑定
    org_unit_marksInit();

    // 标签初始化数据加载
    org_unit_marksDataBind();
    
});

// 界面标签样式设置及事件绑定
function org_unit_marksInit() {
    //下级单位授权
    $('#btn_org_unit_assign').linkbutton({
        onClick: function () {

            Confirm('确认', '确认授权给所有下级单位？', function (r) {
                if (!r)
                    return;

                // 授权给所有下级单位
                ShowProgress(); // 显示进度条
                $.ajax({
                    asyn: false,
                    type: "POST",
                    url: "/Handler/Organization/organization.ashx",
                    data: { action: 'Assign' },
                    dataType: "json",
                    success: function (result) {
                        // 如果提交成功则隐藏进度条
                        CloseProgress(); 
                        doActionWithErrorHandle(result, function (data) {
                            Alert('授权给所有下级单位成功！');
                        });
                    }
                });

            });
        }
    });

    //添加部门按钮
    $('#btn_org_unit_add').linkbutton({
        onClick: function () {
            $('#pnl_org_unit_info').panel('close');
            $('#pnl_org_unit_department').panel('open');
        }
    });

    // 添加部门
    $('#btn_org_unit_bm_save').linkbutton({
        onClick: function () {
            var bmmc = trim($('#txt_org_unit_bmmc').textbox("getText"));
            var bmjc = trim($('#txt_org_unit_bmjc').textbox("getText"));
            var bmxh = trim($('#txt_org_unit_bmxh').textbox("getText"));
            var bz = trim($('#txt_org_unit_bmbz').textbox("getText"));

            // 判断输入是否为空值
            if (isNull(bmmc) || isNull(bmjc) || isNull(bmxh)) {
                Alert('部门名称或者部门简称或者部门序号不能为空');
                return;
            }

            // 调用一般处理程序插入部门信息encodeURI
            $.ajax({
                type: "POST",
                url: "/Handler/Organization/organization.ashx",
                data: { action: 'AddDepartment', bmmc: bmmc, bmjc: bmjc, bmxh: bmxh, bz: bz, fbmbm: '' },
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
    });
}

// 标签初始化数据加载
function org_unit_marksDataBind() {

    // 调用一般处理程序获取单位信息encodeURI
    $.ajax({
        type: "GET",
        url: "/Handler/Organization/organization.ashx",
        data: { action: 'GetUnitInfo', t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            doActionWithErrorHandle(result, function (data) {
                $("#txt_org_unit_dwmc").textbox('setText', data.DWMC);
                $("#txt_org_unit_dwjc").textbox('setText', data.DWJC);
                $("#txt_org_unit_dwjb").textbox('setText', data.DWJB);
                $("#txt_org_unit_dwmc").textbox("disable");
                $("#txt_org_unit_dwjc").textbox("disable");
                $("#txt_org_unit_dwjb").textbox("disable");
            });
        }
    });
}
