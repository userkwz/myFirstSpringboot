$(document).ready(function () {

    // 界面标签样式设置及事件绑定
    dic_marksInit();

    // 标签初始化数据加载
    dic_marksDataBind();
    AddOperationLog('数据字典');
});

// 界面标签样式设置及事件绑定
function dic_marksInit() {

    // 分类代码类别
    $('#tree_dic_fldmlb').tree({
        method: 'get',
        lines: true,
        loadMsg: '数据加载中，请稍候...',
        onLoadError: function (arguments) {
            Alert(arguments.responseText);
        },
        onDblClick: function (node) {
            if (node.state == "closed")
                $("#tree_dic_fldmlb").tree('expand', node.target);
            else
                $("#tree_dic_fldmlb").tree('collapse', node.target);
        },
        onSelect: function (node) {
            //右侧treegrid信息初始化
            if (node == null || node.id == null || node.pid == '')
                return;

            load_treedg_dic_fldm(node.id);
        }
    });

    // 分类代码treegrid初始化
    $('#treedg_dic_fldm').treegrid({
        method: 'get',
        rownumbers: true,
        animate: true,
        idField: 'dm',
        treeField: 'mc',
        loadMsg: '数据加载中，请稍候...',
        collapsible: true, //是否显示可折叠按钮
        toolbar: [
        {
            iconCls: 'icon-add',
            text: '新增分类',
            handler: function () {

                // 获取分类代码类别
                var node = $('#tree_dic_fldmlb').tree('getSelected');
                $('#txt_dic_fldm_edit_dm').textbox('setValue', '');
                if (node == null || node.id == null || node.pid == '') {
                    Alert("请选中分类代码类别！");
                    return;
                }
                load_tree_dic_mostlbbm(node.id);

                $('#txt_dic_fldm_edit_lbbm').textbox('setValue', node.text);
                $('#txt_dic_fldm_edit_fdm').textbox('setValue', '');

                $('#txt_dic_fldm_edit_mc').textbox('setValue', '');
                $('#txt_dic_fldm_edit_sm').textbox('setValue', '');
                $('#txt_dic_fldm_edit_lbbm').textbox('disable');
                $('#txt_dic_fldm_edit_fdm').textbox('disable');
                $('#txt_dic_fldm_edit_dm').textbox('enable');

                // 确认
                $('#btn_dic_fldm_edit_confirm').linkbutton({
                    onClick: function () {
                        // 输入值验证
                        var isnull = validate_fldm();
                        if (!isnull)
                            return;

                        var dm = $('#txt_dic_fldm_edit_dm').textbox('getValue');
                        var mc = $('#txt_dic_fldm_edit_mc').textbox('getValue');
                        var sm = $('#txt_dic_fldm_edit_sm').textbox('getValue');

                        // 调用一般处理程序
                        $.ajax({
                            type: "POST",
                            url: "/Handler/Dictionary/dictionary.ashx",
                            data: { action: 'AddDataItem', lbbm: node.id, fdm: '', dm: dm, mc: mc, sm: sm },
                            dataType: "json",
                            success: function (result) {
                                // 对一般处理程序返回的数据，进行错误处理及数据过滤
                                doActionWithErrorHandle(result, function (data) {
                                    //刷新数据
                                    load_treedg_dic_fldm(node.id);
                                    $('#win_dic_fldm_edit').window('close');
                                });
                            }
                        });
                    }
                });

                // 取消
                $('#btn_dic_fldm_edit_cancel').linkbutton({
                    iconCls: 'icon-cancel',
                    onClick: function () {
                        $('#win_dic_fldm_edit').window('close');
                    }
                });

                $('#win_dic_fldm_edit').window({
                    title: '新增分类代码'
                });
                $('#win_dic_fldm_edit').window('open');
            }
        }, {
            iconCls: 'icon-add',
            text: '新增子分类',
            handler: function () {
                // 获取分类代码类别
                var node = $('#tree_dic_fldmlb').tree('getSelected');
                if (node == null || node.id == null || node.pid == '') {
                    Alert("请选中分类代码类别！");
                    return;
                }
                // 获取父分类代码
                var datarow = $('#treedg_dic_fldm').treegrid('getSelected');
                $('#txt_dic_fldm_edit_dm').textbox('setValue', '');
                if (datarow == null || datarow.dm == null || datarow.dm == '') {
                    Alert("请选中父分类！");
                    return;
                }

                load_tree_dic_mostdmbyf(datarow.dm)

                $('#txt_dic_fldm_edit_lbbm').textbox('setValue', node.text);
                $('#txt_dic_fldm_edit_fdm').textbox('setValue', '(' + datarow.dm + ')' + datarow.mc);
               
                $('#txt_dic_fldm_edit_mc').textbox('setValue', '');
                $('#txt_dic_fldm_edit_sm').textbox('setValue', '');
                $('#txt_dic_fldm_edit_lbbm').textbox('disable');
                $('#txt_dic_fldm_edit_fdm').textbox('disable');
                $('#txt_dic_fldm_edit_dm').textbox('enable');

                // 确认
                $('#btn_dic_fldm_edit_confirm').linkbutton({
                    onClick: function () {
                        // 输入值验证
                        var isnull = validate_fldm();
                        if (!isnull)
                            return;

                        var dm = $('#txt_dic_fldm_edit_dm').textbox('getValue');
                        var mc = $('#txt_dic_fldm_edit_mc').textbox('getValue');
                        var sm = $('#txt_dic_fldm_edit_sm').textbox('getValue');

                        // 调用一般处理程序
                        $.ajax({
                            type: "POST",
                            url: "/Handler/Dictionary/dictionary.ashx",
                            data: { action: 'AddDataItem', lbbm: node.id, fdm: datarow.dm, dm: dm, mc: mc, sm: sm },
                            dataType: "json",
                            success: function (result) {
                                // 对一般处理程序返回的数据，进行错误处理及数据过滤
                                doActionWithErrorHandle(result, function (data) {
                                    //刷新数据
                                    load_treedg_dic_fldm(node.id);
                                    $('#win_dic_fldm_edit').window('close');
                                });
                            }
                        });
                    }
                });

                // 取消
                $('#btn_dic_fldm_edit_cancel').linkbutton({
                    iconCls: 'icon-cancel',
                    onClick: function () {
                        $('#win_dic_fldm_edit').window('close');
                    }
                });

                $('#win_dic_fldm_edit').window({
                    title: '新增子分类代码'
                });
                $('#win_dic_fldm_edit').window('open');
            }
        }, {
            iconCls: 'icon-edit',
            text: '编辑',
            handler: function () {
                // 获取分类代码类别
                var node = $('#tree_dic_fldmlb').tree('getSelected');
                if (node == null || node.id == null || node.pid == '') {
                    Alert("请选中分类代码类别！");
                    return;
                }
                // 获取父分类代码
                var datarow = $('#treedg_dic_fldm').treegrid('getSelected');
                if (datarow == null || datarow.dm == null || datarow.dm == '') {
                    Alert("请选中父分类！");
                    return;
                }
                // 获取父分类代码
                var pdatarow = $('#treedg_dic_fldm').treegrid('getParent', datarow.dm);
                var fdm = '';
                if (pdatarow != null && pdatarow.dm != null && pdatarow.dm != '') {
                    fdm = '(' + pdatarow.dm + ')' + pdatarow.mc;
                }


                $('#txt_dic_fldm_edit_lbbm').textbox('setValue', node.text);
                $('#txt_dic_fldm_edit_fdm').textbox('setValue', fdm);
                $('#txt_dic_fldm_edit_dm').textbox('setValue', datarow.dm);
                $('#txt_dic_fldm_edit_mc').textbox('setValue', datarow.mc);
                $('#txt_dic_fldm_edit_sm').textbox('setValue', datarow.sm);
                $('#txt_dic_fldm_edit_lbbm').textbox('disable');
                $('#txt_dic_fldm_edit_fdm').textbox('disable');
                $('#txt_dic_fldm_edit_dm').textbox('disable');

                // 确认
                $('#btn_dic_fldm_edit_confirm').linkbutton({
                    onClick: function () {
                        // 输入值验证
                        var isnull = validate_fldm();
                        if (!isnull)
                            return;

                        var mc = $('#txt_dic_fldm_edit_mc').textbox('getValue');
                        var sm = $('#txt_dic_fldm_edit_sm').textbox('getValue');

                        // 调用一般处理程序
                        $.ajax({
                            type: "POST",
                            url: "/Handler/Dictionary/dictionary.ashx",
                            data: { action: 'UpdateDataItem', lbbm: datarow.lbbm, fdm: datarow.fdm, dm: datarow.dm, mc: mc, sm: sm },
                            dataType: "json",
                            success: function (result) {
                                // 对一般处理程序返回的数据，进行错误处理及数据过滤
                                doActionWithErrorHandle(result, function (data) {
                                    //刷新数据
                                    load_treedg_dic_fldm(datarow.lbbm);
                                    $('#win_dic_fldm_edit').window('close');
                                });
                            }
                        });
                    }
                });

                // 取消
                $('#btn_dic_fldm_edit_cancel').linkbutton({
                    iconCls: 'icon-cancel',
                    onClick: function () {
                        $('#win_dic_fldm_edit').window('close');
                    }
                });

                $('#win_dic_fldm_edit').window({
                    title: '编辑分类代码【' + datarow.mc + '】'
                });
                $('#win_dic_fldm_edit').window('open');
            }
        }, {
            iconCls: 'icon-remove',
            text: '删除',
            handler: function () {
                // 获取父分类代码
                var datarow = $('#treedg_dic_fldm').treegrid('getSelected');
                if (datarow == null || datarow.dm == null || datarow.dm == '') {
                    Alert("请选中需删除分类代码！");
                    return;
                }

                Confirm('确认', '确认删除分类代码【' + datarow.mc + '】？', function (r) {
                    if (r) {
                        // 调用一般处理程序encodeURI
                        $.ajax({
                            type: "POST",
                            url: "/Handler/Dictionary/dictionary.ashx",
                            data: { action: 'DeleteDataItem', dm: datarow.dm },
                            dataType: "json",
                            success: function (result) {
                                // 对一般处理程序返回的数据，进行错误处理及数据过滤
                                doActionWithErrorHandle(result, function (data) {
                                    load_treedg_dic_fldm(datarow.lbbm);

                                    Alert('删除成功！');
                                });
                            }
                        });
                    }
                });
            }
        }],
        columns: [[
                    { title: '代码', field: 'dm', width: 150 },
                    { title: '名称', field: 'mc', width: 260 },
                    { title: '说明', field: 'sm', width: 550 }
        //                    { title: '是否启用', align: 'center', field: 'sfsc', width: 90, 
        //                        formatter: function (value, row, index) {
        //                            if (value) {
        //                                var s = '<div><img src="/Script/jquery-easyui-1.4.3/themes/icons/ok.png"/></div>';
        //                                return s;
        //                            }
        //                            else {
        //                                return '';
        //                            }
        //                        }
        //                    }
         ]]
    });

    // 刷新分类代码类别
    $('#btn_dic_fldmlb_refresh').linkbutton({
        onClick: function () {
            load_tree_dic_fldmlb('');
        }
    });

    // 新增分类代码类别
    $('#btn_dic_fldmlb_add').linkbutton({
        onClick: function () {

            $('#txt_dic_fldmlb_edit_dmsslb').textbox('enable', true);
            $('#txt_dic_fldmlb_edit_dmsslb').textbox('setValue', '');
            $('#txt_dic_fldmlb_edit_lbbm').textbox('setValue', '');
            var node = $('#tree_dic_fldmlb').tree('getSelected');
            if (node != null && node != '') {
                $('#txt_dic_fldmlb_edit_dmsslb').textbox('setValue', node.text);
                Load_tree_dic_mostllbbm(node.text)
                if (node != null && node.id != null && node.pid != '') {
                    var parent = $('#tree_dic_fldmlb').tree('getParent', node.target);
                    if (parent != null) {
                        $('#txt_dic_fldmlb_edit_dmsslb').textbox('setValue', parent.text);
                        Load_tree_dic_mostllbbm(parent.text)
                    }
                }
            }
            $('#txt_dic_fldmlb_edit_lbmc').textbox('setValue', '');
            $('#txt_dic_fldmlb_edit_lbbz').textbox('setValue', '');
            $('#txt_dic_fldmlb_edit_lbgbdm').textbox('setValue', '');
            $('#txt_dic_fldmlb_edit_lbbm').textbox('enable', true);



            // 确认
            $('#btn_dic_fldmlb_edit_confirm').linkbutton({
                onClick: function () {
                    // 输入值验证
                    var isnull = validate_fldmlb();
                    if (!isnull)
                        return;

                    var lbbm = $('#txt_dic_fldmlb_edit_lbbm').textbox('getValue');
                    var lbmc = $('#txt_dic_fldmlb_edit_lbmc').textbox('getValue');
                    var lbbz = $('#txt_dic_fldmlb_edit_lbbz').textbox('getValue');
                    var lbgbdm = $('#txt_dic_fldmlb_edit_lbgbdm').textbox('getValue');
                    var dmsslb = $('#txt_dic_fldmlb_edit_dmsslb').textbox('getValue');
                    var sfzdydm = '';

                    // 调用一般处理程序
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Dictionary/dictionary.ashx",
                        data: { action: 'AddCategory', lbbm: lbbm, lbmc: lbmc, lbbz: lbbz,
                            lbgbdm: lbgbdm, dmsslb: dmsslb, sfzdydm: sfzdydm
                        },
                        dataType: "json",
                        success: function (result) {
                            // 对一般处理程序返回的数据，进行错误处理及数据过滤
                            doActionWithErrorHandle(result, function (data) {
                                //刷新数据
                                load_tree_dic_fldmlb(lbbm);
                                $('#win_dic_fldmlb_edit').window('close');
                            });
                        }
                    });
                }
            });

            // 取消
            $('#btn_dic_fldmlb_edit_cancel').linkbutton({
                iconCls: 'icon-cancel',
                onClick: function () {
                    $('#win_dic_fldmlb_edit').window('close');
                }
            });

            $('#win_dic_fldmlb_edit').window({
                title: '新增分类代码类别'
            });
            $('#win_dic_fldmlb_edit').window('open');
        }
    });

    // 编辑分类代码类别
    $('#btn_dic_fldmlb_edit').linkbutton({
        onClick: function () {

            var node = $('#tree_dic_fldmlb').tree('getSelected');
            if (node == null || node.id == null || node.pid == '') {
                Alert("请选中需编辑分类！");
                return;
            }

            // 调用一般处理程序获取分类信息encodeURI
            $.ajax({
                type: "GET",
                url: "/Handler/Dictionary/dictionary.ashx",
                data: { action: 'GetCategoryInfo', lbbm: node.id, t: (new Date()).getMilliseconds() },
                dataType: "json",
                success: function (result) {
                    // 对一般处理程序返回的数据，进行错误处理及数据过滤
                    doActionWithErrorHandle(result, function (data) {
                        $('#txt_dic_fldmlb_edit_lbbm').textbox('setValue', data.LBBM);
                        $('#txt_dic_fldmlb_edit_lbmc').textbox('setValue', data.LBMC);
                        $('#txt_dic_fldmlb_edit_lbbz').textbox('setValue', data.LBBZ);
                        $('#txt_dic_fldmlb_edit_lbgbdm').textbox('setValue', data.LBGBDM);
                        $('#txt_dic_fldmlb_edit_dmsslb').textbox('setValue', data.DMSSLB);
                        $('#txt_dic_fldmlb_edit_lbbm').textbox('disable');
                        $('#txt_dic_fldmlb_edit_dmsslb').textbox('disable');
                    });
                }
            });

            // 确认
            $('#btn_dic_fldmlb_edit_confirm').linkbutton({
                onClick: function () {
                    // 输入值验证
                    var isnull = validate_fldmlb();
                    if (!isnull)
                        return;

                    var lbbm = $('#txt_dic_fldmlb_edit_lbbm').textbox('getValue');
                    var lbmc = $('#txt_dic_fldmlb_edit_lbmc').textbox('getValue');
                    var lbbz = $('#txt_dic_fldmlb_edit_lbbz').textbox('getValue');
                    var lbgbdm = $('#txt_dic_fldmlb_edit_lbgbdm').textbox('getValue');
                    var dmsslb = $('#txt_dic_fldmlb_edit_dmsslb').textbox('getValue');
                    var sfzdydm = '';

                    // 调用一般处理程序
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Dictionary/dictionary.ashx",
                        data: { action: 'UpdateCategory', lbbm: lbbm, lbmc: lbmc, lbbz: lbbz,
                            lbgbdm: lbgbdm, dmsslb: dmsslb, sfzdydm: sfzdydm
                        },
                        dataType: "json",
                        success: function (result) {
                            // 对一般处理程序返回的数据，进行错误处理及数据过滤
                            doActionWithErrorHandle(result, function (data) {
                                //刷新数据
                                load_tree_dic_fldmlb(lbbm);
                                $('#win_dic_fldmlb_edit').window('close');
                            });
                        }
                    });
                }
            });

            // 取消
            $('#btn_dic_fldmlb_edit_cancel').linkbutton({
                iconCls: 'icon-cancel',
                onClick: function () {
                    $('#win_dic_fldmlb_edit').window('close');
                }
            });

            $('#win_dic_fldmlb_edit').window({
                title: '编辑分类【' + node.text + '】'
            });
            $('#win_dic_fldmlb_edit').window('open');
        }
    });

    // 删除分类代码类别
    $('#btn_dic_fldmlb_delete').linkbutton({
        onClick: function () {

            var node = $('#tree_dic_fldmlb').tree('getSelected');
            if (node == null || node.id == null || node.pid == '') {
                Alert("请选中需编辑分类！");
                return;
            }

            Confirm('确认', '确认删除分类【' + node.text + '】？', function (r) {
                if (r) {
                    // 调用一般处理程序encodeURI
                    $.ajax({
                        type: "POST",
                        url: "/Handler/Dictionary/dictionary.ashx",
                        data: { action: 'DeleteCategory', lbbm: node.id },
                        dataType: "json",
                        success: function (result) {
                            // 对一般处理程序返回的数据，进行错误处理及数据过滤
                            doActionWithErrorHandle(result, function (data) {
                                load_tree_dic_fldmlb('');
                                Alert('删除成功！');
                            });
                        }
                    });
                }
            });
        }
    });
}

// 标签初始化数据加载
function dic_marksDataBind() {
    load_tree_dic_fldmlb('');
}

// 加载分类代码类别
function load_tree_dic_fldmlb(focusID) {
    $('#tree_dic_fldmlb').tree({
        url: '/Handler/Dictionary/dictionary.ashx?action=GetCategoryList&t=' + (new Date()).getMilliseconds(),
        onLoadSuccess: function (node, data) {
            // 选中默认节点
            if (focusID != null && focusID != '') {
                var node = $('#tree_dic_fldmlb').tree('find', focusID);
                if (node) {
                    $('#tree_dic_fldmlb').tree('select', node.target);
                    expand_all_parentNode_tree_dic_fldmlb(node);
                }
            } else {
                if (data.length != 0) {
                    var findNode = $('#tree_dic_fldmlb').tree('find', data[0].id);

                    if (findNode) {
                        $('#tree_dic_fldmlb').tree('expand', findNode.target);

                        var cNodes = $('#tree_dic_fldmlb').tree('getChildren', findNode.target);
                        if (cNodes != null && cNodes.length >= 1) {
                            $('#tree_dic_fldmlb').tree('select', cNodes[0].target);
                        }
                    } 
                }
            }
        }
    });
}

// 展开所有父节点
function expand_all_parentNode_tree_dic_fldmlb(node) {
    if (node != null)
        $('#tree_dic_fldmlb').tree('expand', node.target);

    if ($('#tree_dic_fldmlb').tree('getParent', node.target) != null)
        expand_all_parentNode_tree_dic_fldmlb($('#tree_dic_fldmlb').tree('getParent', node.target));
}

//获得最大类别编码
function load_tree_dic_mostlbbm(lbbm) {
    $.ajax({
        type: "GET",
        url: "/Handler/Dictionary/dictionary.ashx",
        data: { action: 'GetMostZLbbm', lbbm: lbbm, t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            $('#txt_dic_fldm_edit_dm').textbox('setValue', result);
        }
    });
}

//已知父代码获得最大代码
function load_tree_dic_mostdmbyf(fdm) {
    $.ajax({
        type: "GET",
        url: "/Handler/Dictionary/dictionary.ashx",
        data: { action: 'GetMostDMBYF', fdm: fdm, t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            $('#txt_dic_fldm_edit_dm').textbox('setValue', result);
        }
    }); 
}
// 加载对应所属类别的分类代码
function load_treedg_dic_fldm(lbbm) {
    var queryData = { lbbm: lbbm };
    $('#treedg_dic_fldm').treegrid({
        queryParams: queryData,
        url: '/Handler/Dictionary/dictionary.ashx?action=GetDataItemList&t=' + (new Date()).getMilliseconds()
    });
}

//获取当前分类代码类别下最大类别编码
function Load_tree_dic_mostllbbm(dmsslb) {
    

    $.ajax({
        type: "GET",
        url: "/Handler/Dictionary/dictionary.ashx",
        data: { action: 'GetMostLbbm', dmsslb: dmsslb ,t: (new Date()).getMilliseconds() },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            $('#txt_dic_fldmlb_edit_lbbm').textbox('setValue', result);
        }
    });
}

// 添加分类代码类别验证
function validate_fldmlb() {
    if ($('#txt_dic_fldmlb_edit_lbbm').textbox('getValue') == "") {
        ShowWarningAndDo("类别编码不能为空！", function () {
            $('#txt_dic_fldmlb_edit_lbbm').next('span').find('input').focus();
        });
        return false;
    }
    if ($('#txt_dic_fldmlb_edit_lbmc').textbox('getValue') == "") {
        ShowWarningAndDo("类别名称不能为空！", function () {
            $('#txt_dic_fldmlb_edit_lbmc').next('span').find('input').focus();
        });
        return false;
    }
    if ($('#txt_dic_fldmlb_edit_dmsslb').textbox('getValue') == "") {
        ShowWarningAndDo("所属类别不能为空！", function () {
            $('#txt_dic_fldmlb_edit_dmsslb').next('span').find('input').focus();
        });
        return false;
    }
    return true;
}

// 添加分类代码验证
function validate_fldm() {
    if ($('#txt_dic_fldm_edit_dm').textbox('getValue') == "") {
        ShowWarningAndDo("分类代码不能为空！", function () {
            $('#txt_dic_fldm_edit_dm').next('span').find('input').focus();
        });
        return false;
    }
    if ($('#txt_dic_fldm_edit_mc').textbox('getValue') == "") {
        ShowWarningAndDo("分类名称不能为空！", function () {
            $('#txt_dic_fldm_edit_mc').next('span').find('input').focus();
        });
        return false;
    }
    return true;
}
