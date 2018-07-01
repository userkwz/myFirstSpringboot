var dNode;    /*tree的顶级节点*/
var sExpandNode; /*tree要选中并展开的节点*/
var jsNode; /*tree要选中的角色节点*/
var org_role_bmbm; //部门编码
var org_role_jsbm; //角色编码
var org_role_gh;//工号
var dwNode;
var editoldurl; //所需修改的旧URL
var dwbm;//当前登录人单位
var selectdwbm;//选中的单位
$(document).ready(function() {
    //    var dwbm = $.cookie('Cyvation.Cyvation.login.dwbm');
        selectdwbm = dwbm = userInfo.DWBM;
        // 单位编码ComboTree初始化
        AddOperationLog('组织机构');
        $('#dwbm_zzjg').combotree({
            method: 'get',
            lines: true,
            url:getRootPath()+ '/account/loginDwbmTree',
            onLoadSuccess: function() {
                $('#dwbm_zzjg').combotree('setValue', dwbm);
                dwNode = dwbm;
                dwChange(); //单位默认选择
                //RegistEvent_MainRy();
                //初始化控件
                initControl();
                //注册控件事件
                RegistEvent();
            },
            onSelect: function(node) {
                dwNode = node.id;
                dwChange();
                //RegistEvent_MainRy();
                //初始化控件
                initControl();
                //注册控件事件
                RegistEvent();
            }
        });
});

//初始化控件-----开始-----
function initControl() {
    //右侧人员列表初始化
    $('#gridMainRyList').datagrid({
        width: 'auto',
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: true,
        rownumbers: true,

        fit: true,
        fitColumns: true,
        pageSize: 20,
        scrollbarSize: 0,
        pageList: [10, 20, 30, 50, 100],
        toolbar: $('#divRyReseach'),
        columns: [
            [
                { field: 'MC', title: '姓名', width: '10%', minwidth: '80px' },
                { field: 'XB', title: '性别', width: 50 },
                { field: 'GH', title: '工号', width: 50 },
                { field: 'BMMC', title: '部门', width: 130 },
                { field: 'JSMC', title: '角色', width: 120 },
                { field: 'DLBM', title: '登录别名', width: 80 },
                { field: 'GZZH', title: '工作证号', width: 80 },
                { field: 'YDDHHM', title: '联系电话', width: 80 },
                { field: 'DZYJ', title: '电子邮件', width: 100 },
                { field: 'DLIP', title: '登陆IP', width: 100 },
                { field: 'BMBM', title: '部门编码', hidden: true },
                { field: 'JSBM', title: '角色编码', hidden: true },
                {
                    field: 'action',
                    title: '操作',
                    width: 100,
                    align: 'center',
                    formatter: function(value, row, index) {
                        var node = $('#dWBmJs').tree('getSelected');
                        if (node == null) {
                            return '';
                        } else {
                            var e = '<a href="javascript:void(0)" onclick="loadRYQX(' + index + ')">授予人员权限</a> ';
                            return e;
                        }
                    }
                }
            ]

        ],
        onClickRow: function(rowIndex, rowData) {
            $('#gridMainRyList').datagrid('clearSelections');
            $('#gridMainRyList').datagrid('highlightRow', rowIndex);
        },
        groupField: 'JSMC',
        view: groupview,
        groupFormatter: function(value, rows) {
            return ((value == '') ? "未分配角色" : value); // +' - ' + rows.length + ' 条';
        }
    });
    //获取人员数据
    loadGrid('', '', '', '', '', dwNode);

    //重新设定右侧人员列表的宽度/高度
    resizeGridMainRySize();


}
//初始化控件-----结束-----

/*
*公共注册控件事件-----开始-----
*/
function RegistEvent() {
    RegistEvent_Tree();
    //RegistEvent_MainRy();
    RegistEvent_WinRy();
    RegistEvent_JSQX();
    RegistEvent_RYQX();
}

//左侧单位部门树初始化及数据初始化
function dwChange() {
    $("#dWBmJs").tree({
        url: getRootPath()+'/ZZJGHandler/GetDwBmJsByDwbm',
        method: 'post',
        lines: true,
        onLoadSuccess: function (node, data) {
            //加载成功，展开登录用户单位的子节点
            dNode = $('#dWBmJs').tree('find',dwNode); //获取顶级节点
            $('#dWBmJs').tree('select', dNode.target);//.target
            $('#dWBmJs').tree('expand', dNode.target);//.target
            //如果指定有需要展开的节点名称，展开该节点
            if (!isNull(sExpandNode)) {
                ExpandNodeByMc(sExpandNode);
                sExpandNode = '';
            }
        }
    });
}

//树形控件页面跳转
function RegistEvent_Tree() {
    $('#dWBmJs').tree({
        onSelect: function (node) {
            if (node.state == "closed") {
                $("#dWBmJs").tree('expand', node.target);
            }
            else {
                if (node.id.length < 6) {
                    $("#dWBmJs").tree('collapse', node.target);
                }
            }
            var bm = node.id;//节点编码
            var mc = node.text;
            var bits = getLength(bm.toString())+1;//所有id属性位数+1进入下面判断
            if (bits == 7) {
                //选择单位：增加部门
                //刷新人员信息            
                document.getElementById('btn_ZZJG_JSQX').style.display = "none";
                loadGrid('', '', '', '', '', dwNode);
            }
            else if (bits == 5) {
                //选择部门：增删改部门、增加角色
                //刷新人员信息
                document.getElementById('btn_ZZJG_JSQX').style.display = "none";
                loadGrid(bm, '', '', '', '', dwNode);
            }
            else if (bits == 4) {
                //选择角色：删改角色、角色权限、增加人员
                document.getElementById('btn_ZZJG_JSQX').style.display = "";
                //获取父节点
                var pNode = $('#dWBmJs').tree('getParent', node.target);
                //刷新人员信息
                loadGrid(pNode.id, bm, '', '', '', dwNode);
            }
        }
    });
}
function RegistEvent_MainRy() {
    /*
    * 主页搜索按钮事件
    */
    var xm = trim($('#xm').textbox('getValue'));
    var gh = trim($('#gh').textbox('getValue'));
    var gzzh = trim($('#gzzh').textbox('getValue'));
    var bm = $('#dWBmJs').tree('getSelected');
    if (getLength(bm.id.toString()) == 7) {
        loadGrid('', '', xm, gh, gzzh, dwNode);
    }
    if (getLength(bm.id.toString()) == 5) {
        loadGrid(bm.id, '', xm, gh, gzzh, dwNode);
    }
    if (getLength(bm.id.toString()) == 4) {
        var bmbm = $('#dWBmJs').tree('getParent', bm.target);
        loadGrid(bmbm.id, bm.id, xm, gh, gzzh, dwNode);
    }
//    $('#btnMainSearchRy').linkbutton({
//        iconCls: 'icon-search',
//        onClick: function () {
//            var xm = trim($('#xm').textbox('getValue'));
//            var gh = trim($('#gh').textbox('getValue'));
//            var gzzh = trim($('#gzzh').textbox('getValue'));
//            var bm = $('#dWBmJs').tree('getSelected');
//            if (getLength(bm.id.toString()) == 7) {
//                loadGrid('', '', xm, gh, gzzh, dwNode);
//            }
//            if (getLength(bm.id.toString()) == 5) {
//                loadGrid(bm.id, '', xm, gh, gzzh, dwNode);
//            }
//            if (getLength(bm.id.toString()) == 4) {
//                var bmbm = $('#dWBmJs').tree('getParent', bm.target);
//                loadGrid(bmbm.id, bm.id, xm, gh, gzzh, dwNode);
//            }
//        }
//    });
}
function RegistEvent_WinRy() {

    //选择人员列表初始化
    $('#gridSelectRyList').datagrid({
        width: 635,
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: true,
        rownumbers: true,
        fitColumns: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        toolbar: $('#divSelectRyTool'),
        columns: [[
            { field: 'ck', width: 50, checkbox: true },
            { field: 'MC', title: '姓名', width: 100 },
            { field: 'XB', title: '性别', width: 50 },
            { field: 'GH', title: '工号', width: 50 },
            { field: 'DWMC', title: '单位', width: 200 },
            { field: 'DLBM', title: '登录别名', width: 100 },
            { field: 'GZZH', title: '工作证号', width: 100 }
        ]]
    });
    //选择人员窗口 -- 按钮：查询
    $('#btnSelectRySearch').linkbutton({
        onClick: function () {
            var node = $('#dWBmJs').tree('getSelected');
            var jsbm = node.id;
            var pNode = $('#dWBmJs').tree('getParent', node.target);
            var bmbm = pNode.id;
            var xm = trim($('#winRyXm').textbox('getValue'));
            var gh = trim($('#winRyGh').textbox('getValue'));
            loadWinRyGrid(dwNode, bmbm, jsbm, xm, gh);
        }
    });
    //选择人员窗口 -- 按钮：添加
    $('#btnSelectRyAdd').linkbutton({
        onClick: function () {
            var ghj = '';
            var data = $('#gridSelectRyList').datagrid('getChecked');
            for (var i = 0; i < data.length; i++) {
                ghj = ghj + ',' + data[i].GH;
            }
            if (ghj == '') {
                return;
            }
            var node = $('#dWBmJs').tree('getSelected');
            var jsbm = node.id;
            var pNode = $('#dWBmJs').tree('getParent', node.target);
            var bmbm = pNode.id;
            var dwbm = dwNode;
            $('#btnSelectRyAdd').linkbutton('disable');
            $.post(getRootPath()+"/ZZJGHandler/AddRYJSFP",
            { ghj: ghj, bmbm: bmbm, jsbm: jsbm, dwbm: dwbm },
            function (result) {
                if (result == "ok") {
                    //Alert("分配人员角色成功！");
                    Alert('分配人员角色成功！');
                    $('#btnSelectRyAdd').linkbutton('enable');
                    $('#winZzjgRyInfo').window('close');
                    //刷新数据
                    //$('#gridMainRyList').datagrid('load');
                    $('#btnMainSearchRy').click();
                }
                else {
                    $('#btnSelectRyAdd').linkbutton('enable');
                    Alert("系统出错：" + result);
                }
            });
        }
    });

}
function RegistEvent_JSQX() {
    $('#btn_ZZJG_JSQX').click(function () {
            var node = $('#dWBmJs').tree('getSelected');
            var dwbm = dwNode;
            var jsbm = node.id;
            var pNode = $('#dWBmJs').tree('getParent', node.target);
            var bmbm = pNode.id;
            org_role_bmbm = bmbm;
            org_role_jsbm = jsbm;
            refreshJSQX(dwbm, bmbm, jsbm);
            $('#winZzjgJSQX').window({
                title: '【' + node.text + '】角色权限'
            });
            $('#winZzjgJSQX').window('open');
    });

    $('#btn_ZZJG_FPQXGXJY').click(function () {
            $("#ZzjgDwTree").tree({
                url: getRootPath()+'/ZZJGHandler/GetDwbmTree?dwbm=' + dwbm,
                method: 'post',
                lines: true,
                onLoadSuccess: function (node, data) {
                    //加载成功，展开登录用户单位的子节点
                    dNode = $('#ZzjgDwTree').tree('find', dwbm); //获取顶级节点
                    $('#ZzjgDwTree').tree('select', dNode.target);
                    $('#ZzjgDwTree').tree('expand', dNode.target);
                    //如果指定有需要展开的节点名称，展开该节点
                    if (!isNull(sExpandNode)) {
                        ExpandNodeByMc(sExpandNode);
                        sExpandNode = '';
                    }

                    $('#dgZzjgDwqxInfo').datagrid({
                        url: getRootPath()+'/ZZJGHandler/GetAllGnqx?dwbm=' + dwbm
                    });

                    $('#winZzjgXJYQX').window('open');
                },
                onSelect: function (node) {
                    var xzdwbm = node.id;
                    var pid = node.pid;

                    var djdwbm = $.cookie('Cyvation.Cyvation.login.djdwbm');
                    if (xzdwbm == djdwbm) {
                        $('#btnDwqxfp1').linkbutton({ disabled: false });
                    }
                    else {
                        if (xzdwbm == dwbm && pid != "100000") {
                            $('#btnDwqxfp1').linkbutton({ disabled: true });
                        }
                        else {
                            $('#btnDwqxfp1').linkbutton({ disabled: false });
                        }
                    }
                    $('#dgZzjgDwqxInfo').datagrid({
                        url: getRootPath()+'/ZZJGHandler/GetAllGnqx?dwbm=' + xzdwbm
                    });
                }
            });
    });
    //角色权限列表初始化
    $('#gridJSQXList').datagrid({
        width: 720,
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: false,
        rownumbers: true,
        checkOnSelect: false,
        fitColumns: true,
        idField: 'gnbm',
        //treeField: 'gnmc',
        toolbar: $('#divJSQXTool'),
        columns: [[
            { field: 'ck', width: 50, checkbox: true },
            { field: 'gnmc', title: '功能名称', width: 150 },
            { field: 'gnsm', title: '功能说明', width: 100 },
            { field: 'gncxj', title: '功能窗体', width: 200 },
            { field: 'rightediturl', title: '权限编辑器', width: 200 },
            { field: 'gnxsmc', title: '功能显示名称', width: 100 },
            { field: 'action', title: '操作', width: 160, align: 'center',
                formatter: function (value, row, index) {
                    var r = '<a href="javascript:void(0)" onclick="functionJSRight(' + index + ',1)">功能授权</a> ';
                    return r;
                }
            }
        ]],
        onLoadSuccess: function (data) {
            var rowDatas = $('#gridJSQXList').datagrid('getRows');
            for (i = 0; i < rowDatas.length; i++) {
                if (rowDatas[i].jsgn.length > 0) {
                    $('#gridJSQXList').datagrid('checkRow', i);
                }
                else {
                    $('#gridJSQXList').datagrid('uncheckRow', i);
                }
            }
        },
        groupField: 'flmc',
        view: groupview,
        groupFormatter: function (value, rows) {
            return ((value == '') ? "未分配权限" : value); // +' - ' + rows.length + ' 条';
        }
    });


    //初始化角色功能权限窗口
    $('#win_org_gnryqx').window({
        title: '角色功能权限分配',
        width: 600,
        height: 350,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closable: true,
        closed: true,
        draggable: true,
        resizable: false,
        modal: true
    });
    //初始化关闭
    $('#win_org_gnryqx').window('close');

    //角色权限列表初始化
    $('#dgZzjgDwqxInfo').datagrid({
        height: 415,
        width: 490,
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: false,
        rownumbers: true,
        checkOnSelect: false,
        fitColumns: true,
        idField: 'gnbm',
        toolbar: $('#divDwqxfpTool'),
        //treeField: 'gnmc',
        columns: [[
            { field: 'ck', width: 50, checkbox: true },
            { field: 'gnmc', title: '功能名称', width: 150 }
        ]],
        onLoadSuccess: function (data) {
            var rowDatas = $('#dgZzjgDwqxInfo').datagrid('getRows');
            for (i = 0; i < rowDatas.length; i++) {
                if (rowDatas[i].zt == 1) {
                    $('#dgZzjgDwqxInfo').datagrid('checkRow', i);
                }
                else {
                    $('#dgZzjgDwqxInfo').datagrid('uncheckRow', i);
                }
            }
        },
        groupField: 'flmc',
        view: groupview,
        groupFormatter: function (value, rows) {
            return ((value == '') ? "未分配权限" : value); // +' - ' + rows.length + ' 条';
        }
    });

}  
 //角色权限 -- 按钮：添加
function jsqxfp() {
    var gnbmj = '';
    var data = $('#gridJSQXList').datagrid('getChecked');
    for (var i = 0; i < data.length; i++) {
        gnbmj = gnbmj + ',' + data[i].gnbm;
    }
    //            if (gnbmj == '') {
    //                return;
    //            }
    var node = $('#dWBmJs').tree('getSelected');
    var jsbm = node.id;
    var pNode = $('#dWBmJs').tree('getParent', node.target);
    var bmbm = pNode.id;
    var dwbm = dwNode;
    //$('#btnJSQXAdd').linkbutton('disable');
    $.post(getRootPath()+"/ZZJGHandler/AddJsgnfp",
        { gnbmj: gnbmj, bmbm: bmbm, jsbm: jsbm, dwbm: dwbm },
        function(result) {
            if (result == "ok") {
                Alert('分配角色功能成功');
                //$('#btnJSQXAdd').linkbutton('enable');
                $('#winZzjgJSQX').window('close');
            } else {
                //$('#btnJSQXAdd').linkbutton('enable');
                Alert("系统出错：" + result);
            }
        });
}


//单位权限分配
function dwqxfp() {
    var node = $('#ZzjgDwTree').tree('getSelected');
    var dwbm = node.id;

    var gnbmj = '';
    var data = $('#dgZzjgDwqxInfo').datagrid('getChecked');
    for (var i = 0; i < data.length; i++) {
        gnbmj = gnbmj + data[i].gnbm + ',';
    }
    //$('#btnDwqxfp1').linkbutton('disable');
    $.post(getRootPath()+"/ZZJGHandler/AddDwGnQx",
        {  gnbmj: gnbmj, dwbm: dwbm },
        function(result) {
            if (result == "ok") {
                //Alert("分配成功！"); 
                Alert('分配成功');
                //$('#btnDwqxfp1').linkbutton('enable');
            } else {
                Alert("系统出错：" + result);
                //$('#btnDwqxfp1').linkbutton('enable');
            }
        });
}

function RegistEvent_RYQX() {

    //角色权限列表初始化
    $('#gridRYQXList').datagrid({
        width: 720,
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: false,
        rownumbers: true,
        checkOnSelect: false,
        fitColumns: true,
        idField: 'gnbm',
        //treeField: 'gnmc',
        toolbar: $('#divRYQXTool'),
        columns: [[
            { field: 'ck', width: 50, checkbox: true },
            { field: 'gnmc', title: '功能名称', width: 150 },
            { field: 'gnsm', title: '功能说明', width: 100 },
            { field: 'gncxj', title: '功能窗体', width: 200 },
            { field: 'rightediturl', title: '权限编辑器', width: 200 },
            { field: 'gnxsmc', title: '功能显示名称', width: 100 },
            { field: 'action', title: '操作', width: 160, align: 'center',
                formatter: function (value, row, index) {
                    var r = '<a href="javascript:void(0)" onclick="functionJSRight(' + index + ',0)">功能授权</a> ';
                    return r;
                }
            }
        ]],
        onLoadSuccess: function (data) {
            var rowDatas = $('#gridRYQXList').datagrid('getRows');
            for (i = 0; i < rowDatas.length; i++) {
                if (rowDatas[i].jsgn.length > 0) {
                    $('#gridRYQXList').datagrid('checkRow', i);
                }
                else {
                    $('#gridRYQXList').datagrid('uncheckRow', i);
                }
            }
        },
        groupField: 'flmc',
        view: groupview,
        groupFormatter: function (value, rows) {
            return ((value == '') ? "未分配权限" : value); // +' - ' + rows.length + ' 条';
        }
    });


    //初始化角色功能权限窗口
    $('#win_org_gnryqx').window({
        title: '功能授权',
        width: 550,
        height: 800,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closable: true,
        closed: true,
        draggable: true,
        resizable: false,
        modal: true
    });
    //初始化关闭
    $('#win_org_gnryqx').window('close');

 
}
   //角色权限 -- 按钮：添加
function ryqxfp() {
    var gnbmj = '';
    var data = $('#gridRYQXList').datagrid('getChecked');
    for (var i = 0; i < data.length; i++) {
        gnbmj = gnbmj + ',' + data[i].gnbm;
    }
    //            if (gnbmj == '') {
    //                return;
    //            }
    var dwbm = dwNode;
    //$('#btnRYQXAdd').linkbutton('disable');
    $.post(getRootPath()+"/ZZJGHandler/AddRygnfp",
        { gnbmj: gnbmj, gh: org_role_gh, dwbm: dwbm },
        function(result) {
            if (result == "ok") {
                //Alert("分配角色功能成功！");
                Alert('分配角色功能成功');
                //$('#btnRYQXAdd').linkbutton('enable');
                $('#winZzjgRYQX').window('close');
            } else {
                //$('#btnRYQXAdd').linkbutton('enable');
                Alert("系统出错：" + result);
            }
        });
}

//功能授权
function functionJSRight(index,type) {
    // $("#win_org_ry_gnqx").window('open');
    var rowDatas = type == 1 ? $('#gridJSQXList').datagrid('getRows') : $('#gridRYQXList').datagrid('getRows');
    if (rowDatas == null || rowDatas[index] == null) {
        return;
    }
    var data = rowDatas[index];
    if (data.rightediturl == null || data.rightediturl == "") {
        Alert("功能没有配置权限编辑器");
        return;
    }
    //将人员工号和功能编码传递过去
    $('#org_gn_bm').val(data.gnbm);
    $('#org_editType').val(type); //表示对角色进行授权
    $('#org_bmbm').val(org_role_bmbm);
    $('#org_jsbm').val(org_role_jsbm);
    $('#org_ry_gh').val(org_role_gh);
    $('#win_org_gnryqx').window('open');
    $('#panel_org_right').panel('open').panel('refresh', data.rightediturl);
}

function UpdateZYPZInfo(index) {
    var rowDatas = $('#gridJSZYPZList').datagrid('getRows');
    if (rowDatas == null || rowDatas[index] == null) {
        return;
    }
    if (rowDatas[index].lx=='其他') {
        Alert("数据配置不支持编辑，请直接删除后重新添加");
        return;
    }
    $('#winZzjgJSZYPZEdit').window('open');

    $('#editurl').textbox('setValue', rowDatas[index].url);
    editoldurl = rowDatas[index].url;
    $('#editzbt').textbox('setValue', rowDatas[index].zbt);
    $('#editdw').textbox('setValue', rowDatas[index].dw);
    $('#editfbt').textbox('setValue', rowDatas[index].fbt);
    $('#editflx').combobox('setValue', rowDatas[index].lx);
}
function DeleteZYPZInfo(index) {
    var rowDatas = $('#gridJSZYPZList').datagrid('getRows');
    if (rowDatas == null || rowDatas[index] == null) {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/ZZJGHandler/Jszypzdelete",
        data: {  dwbm: dwbm, bmbm: org_role_bmbm, jsbm: org_role_jsbm, url1: rowDatas[index].url },
        success: function (data) {
            refreshJSZYPZ(dwbm, org_role_bmbm, org_role_jsbm);
            // $('#winZzjgJSZYPZADD').window('close');
        },
        error: function (data) {
            Alert("系统有误，请联系管理员！" + data.responseText);
        }
    });

}



//公共注册控件事件-----结束-----

/*
*   显示人员权限
*/
function loadRYQX(index) {
    var rowDatas = $('#gridMainRyList').datagrid('getRows');
    var gh = org_role_gh = rowDatas[index].GH;
    var dwbm = dwNode;
    refreshRYQX(dwbm, gh);
    $('#winZzjgRYQX').window({
        title: '【' + rowDatas[index].MC + '】人员权限'
    });
    $('#winZzjgRYQX').window('open');
}


/*
*   载入grid数据
*/
function loadGrid(bmbm, jsbm, xm, gh, gzzh, dwbm) {
    $('#gridMainRyList').datagrid({
        //Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfo&mt=LoadRyInfo&xm=&gh=&gzzh=&bmbm=&jsbm=&dwbm=370000
        url: getRootPath()+'/ZZJGHandler/GetRyInfo' + '?xm=' + xm + '&gh=' + gh + '&gzzh=' + gzzh
                + '&bmbm=' + bmbm + '&jsbm=' + jsbm + '&dwbm=' + dwbm
    });
}
/*
*   载入弹出窗口未分配角色人员数据
*/
function loadWinRyGrid(dwbm, bmbm, jsbm, xm, gh) {
    $('#gridSelectRyList').datagrid({

        url: getRootPath()+'/ZZJGHandler/GetWfpRyInfo?xm=' + encodeURI(xm) + '&gh=' + gh + '&bmbm=' + bmbm + '&jsbm=' + jsbm + '&dwbm=' + dwbm
    });
}
/*
* 刷新树形控件数据
*/
function refreshTree() {
    $('#dWBmJs').tree('options').url = getRootPath()+"/ZZJGHandler/GetDwBmJsByDwbm";
    $('#dWBmJs').tree('reload');
}
function refreshJSQX(dwbm, bmbm, jsbm) {
    $('#gridJSQXList').datagrid({
        url: getRootPath()+'/Handler/ZZJG/ZZJGHandler.ashx?action=GetJsGnqx&bmbm=' + bmbm + '&jsbm=' + jsbm + '&dwbm=' + dwbm
    });
}

function refreshRYQX(dwbm, gh) {
    $('#gridRYQXList').datagrid({
        url: getRootPath()+'/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyGnqx&gh=' + gh + '&dwbm=' + dwbm
    });
}

function refreshJSZYPZ(dwbm, bmbm, jsbm) {
    $('#gridJSZYPZList').datagrid({
        url: getRootPath()+'/Handler/ZZJG/ZZJGHandler.ashx?action=GetJsZypz&bmbm=' + bmbm + '&jsbm=' + jsbm + '&dwbm=' + dwbm
    });
}
/*
* 重置人员信息的高度\宽度
*/
function resizeGridMainRySize() {
    var pRYInfoHeight = $('#pRYInfo').height();
    var h = $('#zzjgBMTool').height();
    var pRYInfoWidth = $('#panelMainRy').width();
    $('#gridMainRyList').datagrid('options').width = pRYInfoWidth - 4;
    $('#gridMainRyList').datagrid('options').height = pRYInfoHeight - h - 6;
    $('#gridMainRyList').datagrid('resize');
}
/*
* 重置弹出窗口选择人员信息的高度\宽度
*/
function resizeGridSelectRySize() {
    var pRYInfoHeight = $('#panelSelectRy').height();
    var pRYInfoWidth = $('#winZzjgRyInfo').window('options').width;
    var h = $('#divSelectRyTool').height();
    //$('#gridSelectRyList').datagrid('options').width = pRYInfoWidth;
    $('#gridSelectRyList').datagrid('options').height = pRYInfoHeight;
    $('#gridSelectRyList').datagrid('resize');
}
//通过名称展开节点
function ExpandNodeByMc(mc) {
    if (isNull(mc)) {
        return;
    }
    var rootNotes = $('#dWBmJs').tree('getRoots'), children;
    for (var i = 0; i < rootNotes.length; i++) {
        if (rootNotes[i].text == mc) {
            //如果匹配到则展开选中节点
            $('#dWBmJs').tree('select', rootNotes[j].target);
            $('#dWBmJs').tree('expand', rootNotes[j].target);
            return;
        }
        children = $('#dWBmJs').tree('getChildren', rootNotes[i].target);
        for (var j = 0; j < children.length; j++) {
            if (children[j].text == mc) {
                //如果匹配到则选中节点，展开父节点
                $('#dWBmJs').tree('select', children[j].target);
                //$('#dWBmJs').tree('expand', children[j].target);
                var pNode = $('#dWBmJs').tree('getParent', children[j].target);
                $('#dWBmJs').tree('expand', pNode.target);
                return;
            }
        }
    }
}


function zy_jszypz_save() {

    var url1 = $('#zy_fwurl').val();
    var zbt = $('#zy_zbt').val();
    var fbt = $('#zy_fbt').val();
    var dw = $('#zy_dw').val();
    var lx = $('#zy_lx').combobox('getValue');
//    if (url == '' || zbt == '' || fbt == '' || lx == '') {
//    Alert("不能有空选项")；
//    }
    $.ajax({
        type: "POST",
        url: getRootPath()+"/Handler/ZZJG/ZZJGHandler.ashx",
        data: { action: 'Jszypzadd', dw: dw, lx: lx, dwbm: dwbm, bmbm: org_role_bmbm, jsbm: org_role_jsbm, url1: url1, zbt: zbt, fbt: fbt },
        success: function (data) {
            refreshJSZYPZ(dwbm, org_role_bmbm, org_role_jsbm);
             $('#winZzjgJSZYPZADD').window('close');
        },
        error: function (data) {
            Alert("系统有误，请联系管理员！" + data.responseText);
        }
    });
}
function zy_jszypz_editsave() {
    var url1 = $('#editurl').val();
    var zbt = $('#editzbt').val();
    var fbt = $('#editfbt').val();
    var dw = $('#editdw').val();
    var lx = $('#editlx').combobox('getValue');
    $.ajax({
        type: "POST",
        url: getRootPath()+"/Handler/ZZJG/ZZJGHandler.ashx",
        data: { action: 'Jszypzedit',dw:dw, oldurl:editoldurl, lx: lx, bmbm: org_role_bmbm, jsbm: org_role_jsbm, url1: url1, zbt: zbt, fbt: fbt },
        success: function (data) {
            refreshJSZYPZ(dwbm, org_role_bmbm, org_role_jsbm);
            $('#winZzjgJSZYPZEdit').window('close');
        },
        error: function (data) {
            Alert("系统有误，请联系管理员！" + data.responseText);
        }
    });
}


function zy_jszysjpz_save() {
    var url2 = $('#sjpzaddurl').val();
    var t = $('#sjpzeditxsyw').combotree('tree'); // 获取树对象
    var n = t.tree('getSelected'); 	// 获取选择的节点

    $.ajax({
        type: "POST",
        url: getRootPath()+"/Handler/ZZJG/ZZJGHandler.ashx",
        data: { action: 'Jszypzadd', lx: '4', dwbm: dwbm, bmbm: org_role_bmbm, jsbm: org_role_jsbm, url1: url2, zbt: n.text },
        success: function (data) {
            refreshJSZYPZ(dwbm, org_role_bmbm, org_role_jsbm);
            $('#winZzjgJSZYPZADD').window('close');
        },
        error: function (data) {
            Alert("系统有误，请联系管理员！" + data.responseText);
        }
    });
}