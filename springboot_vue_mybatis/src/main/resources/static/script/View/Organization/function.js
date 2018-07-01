$(document).ready(function () {

    initControl();

    registControlEvent();

    AddOperationLog('功能管理');
});

/*
* 初始化控件
*/
function initControl() {
    initControl_tree();

    $('#gnfl').combobox({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnflByDwbm',
        valueField: 'id',
        textField: 'text'
    });

    /*
    * 显示功能信息的grid
    */
    $('#dgGngl').datagrid({
        width: 'auto',
        striped: true,
        singleSelect: false,
        fitColumns: true,
        loadMsg: '数据加载中，请稍候...',
        pagination: true,
        rownumbers: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        onClickRow: function (rowIndex, rowData) {
            $('#dgGngl').datagrid('clearSelections');
            $('#dgGngl').datagrid('highlightRow', rowIndex);
        },
        toolbar: [{
            text: '增加',
            iconCls: 'icon-add',
            handler: function () {
                clearQxData();
                /*
                * 设置窗口标题
                */
                $('#winAddGnQx').window('setTitle', '添加功能权限');
                $('#winAddGnQx').window('open');
            }
        }, '-', {
            text: '刷新',
            iconCls: 'icon-reload',
            handler: function () {
                $('#dgGngl').datagrid('reload');
            }
        }],
        columns: [[
        { field: 'gnmc', title: '功能名称', width: 150 },
        { field: 'gnsm', title: '功能说明', width: 100 },
        { field: 'gnct', title: '功能图标', width: 200 },
        { field: 'gncxj', title: '功能窗体', width: 200 },
        { field: 'rightediturl', title: '权限编辑器窗体', width: 200 },
        { field: 'gnxh', title: '功能序号', width: 70 },
        { field: 'gncs', title: '功能参数', width: 100 },
        { field: 'cscs', title: '初始参数', width: 100 },
        { field: 'gnxsmc', title: '功能显示名称', width: 150 },
        { field: 'gnbm', title: '功能编码', width: 100 },
        { field: 'gnfl', title: '功能分类', width: 100 },
        { field: 'programtype', title: '程序类型', width: 100 },
        { field: 'msgtype', title: '消息打开方式', width: 100 },
        { field: 'msggeturl', title: '消息获取路径', width: 100 },
        { field: 'msgclickurl', title: '消息打开路径', width: 100 },
        { field: 'baseurl', title: '基础路径', width: 100 },
        { field: 'action', title: '操作', width: 100, align: 'center',
            formatter: function (value, row, index) {
                var e = '<a href="#" onclick="editRow(' + index + ')">编辑</a> ';
                var d = '<a href="#" onclick="deleteRow(' + index + ')">删除</a>';
                return e + d;
            }
        }
        ]]
    });

    /*
    * 隐藏功能编码这一列
    */
    //    $('#dgGngl').datagrid('hideColumn','Gnbm');
    //    $('#dgGngl').datagrid('hideColumn', 'Gnfl');
    //    $('#dgGngl').datagrid('hideColumn', 'Cscs');



    /*
    * 添加功能权限窗口
    */
    $('#winAddGnQx').window({
        modal: true,
        maximizable: false,
        minimizable: false,
        closed: true,
        collapsible: false,
        title: '添加功能权限'
    });

    resizeGnmkHeight();

}
function initControl_tree() {
    time = new Date();
    $('#trfl_gnmk').tree({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnfltree&t=' + time.getMilliseconds(),
        method: 'post',
        lines: true,
        loadMsg: '数据加载中，请稍候...',
        onLoadError: function (arguments) {
            Alert(arguments.responseText);
        },
        onDblClick: function () {
            if ($('#trfl_gnmk').tree('getSelected').state == "open") {
                $('#trfl_gnmk').tree('collapse', $('#trfl_gnmk').tree('getSelected').target);
            }
            else {
                $('#trfl_gnmk').tree('expand', $('#trfl_gnmk').tree('getSelected').target);
            }
        },
        onSelect: function (node) {
            //右侧treegrid信息初始化
            loadGnQxGrid();
        }
    });
}

//右侧treegrid信息初始化


/*
* 注册控件事件
*/
function registControlEvent() {
    /*
    * 打开添加功能权限窗口
    */
    $('#btnAdd_ZzjgQxGl').textbox({
        onClickButton: function () {
            clearQxData();
            /*
            * 设置窗口标题
            */
            $('#winAddGnQx').window('setTitle', '添加功能权限');
            $('#winAddGnQx').window('open');
        }
    });
    /*
    * 添加权限功能提交按钮
    */
    $('#btnSave_ZzjgQxGl').linkbutton({
        iconCls: 'icon-ok',
        onClick: function () {
            var title = $('#winAddGnQx').panel('options').title;
            var isExistedFlb = 1; //是否存在的父类别 1:存在，0:不存在
            var gnfl = $('#gnfl').combobox('getValue');
            if (isNull(gnfl)) {
                gnfl = $('#gnfl').combobox('getText');
                isExistedFlb = 0;
                if (isNull(gnfl)) {
                    Alert('功能分类不能为空');
                    return;
                }
            }
            var gnbm = document.getElementById('gnbm').value;
            /*
            * 如果;是保存gnbm为空表示是添加新的功能
            */
            if (title == '添加功能权限') {
                gnbm = '';
            }
            var gnmc = $('#gnmc').textbox('getValue');
            var gncxj = $('#gncxj').textbox('getValue');
            var gnxsmc = $('#gnxsmc').textbox('getValue');
            var gnxh = $('#gnxh').textbox('getValue');
            var cscs = $('#cscs').textbox('getValue');
            var gnsm = $('#gnsm').textbox('getValue');
            var rightediturl = $('#rightediturl').textbox('getValue');
            var programtype = $('#programtype').textbox('getValue');
            var msgtype = $('#msgtype').textbox('getValue');
            var msggeturl = $('#msggeturl').textbox('getValue');
            var msgclickurl = $('#msgclickurl').textbox('getValue');
            var baseurl = $('#baseurl').textbox('getValue');

            $('#btnSave_ZzjgQxGl').linkbutton('disable');
            $.post("/Handler/ZZJG/ZZJGHandler.ashx?action=AddGnQx", {
                isExistedFlb: isExistedFlb,
                gnfl: encodeURI(gnfl),
                gnbm: encodeURI('1' + gnbm),
                gnmc: encodeURI(gnmc), 
                gncxj: encodeURI(gncxj),
                rightediturl: encodeURI(rightediturl),
                gnxsmc: encodeURI(gnxsmc), 
                gnxh: gnxh,
                cscs: encodeURI(cscs),
                gnsm: encodeURI(gnsm),
                programtype: encodeURI(programtype),
                msgtype: encodeURI(msgtype),
                msggeturl: encodeURI(msggeturl),
                msgclickurl: encodeURI(msgclickurl),
                baseurl: encodeURI(baseurl)
            },
            function (result) {
                $('#btnSave_ZzjgQxGl').linkbutton('enable');
                //Alert("操作结果: " + result);

                Alert(result);
            });
            $('#winAddGnQx').window('close');

            /*
            * 重新载入grid数据
            */
            $('#dgGngl').datagrid('load');

            if (isExistedFlb == 0) {
                /*
                * 添加了新的分类则刷新下拉列表
                */
                $('#gnfl').combobox('reload', '/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnflByDwbm');
                $('#inSslb').combobox('reload', '/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnflByDwbm');
            }
        }
    });

    /*
    *取消添加功能权限      
    */
    $('#btnCancel_ZzjgQxGl').linkbutton({
        iconCls: 'icon-cancel',
        onClick: function () {
            $('#winAddGnQx').window('close');
        }
    });

    //    //功能信息面板大小改变事件
    //    $('#sGnInfo').panel({
    //        onResize: function (width, height) {
    //            resizeGnInfoHeight();
    //            //resizeGnInfoWidth();
    //        }
    //    });

}


/*
*   载入功能权限grid数据
*/
function loadGnQxGrid() {
    var gnfl = $('#trfl_gnmk').tree('getSelected');
    $('#dgGngl').datagrid({
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnflInfo' + '&gnfl=' + gnfl.id
    });
}

/*
* 开始编辑或删除grid行
*/
function editRow(index) {
    /*
    * 设置窗口标题
    */
    $('#winAddGnQx').window('setTitle', '编辑功能权限');
    $('#winAddGnQx').window({
        title: '编辑模块功能'
    });
    /*
    * 清空所有选中的行
    * 让该行高亮
    */
    //    $('#dgGngl').datagrid('clearSelections');
    //    $('#dgGngl').datagrid('highlightRow', index);

    var rowDatas = $('#dgGngl').datagrid('getRows');
    /*
    * 将信息显示到编辑界面
    */
    var flbm = rowDatas[index].gnfl;
    var gnmc = rowDatas[index].gnmc;
    var gnsm = rowDatas[index].gnsm;
    var gncxj = rowDatas[index].gncxj;
    var rightediturl = rowDatas[index].rightediturl;
    var gnxh = rowDatas[index].gnxh;
    var gncs = rowDatas[index].gncs;
    var gnxsmc = rowDatas[index].gnxsmc;
    var gnbm = rowDatas[index].gnbm;
    var cscs = rowDatas[index].cscs;
    var programtype = rowDatas[index].programtype;
    var msgtype = rowDatas[index].msgtype;
    var msggeturl = rowDatas[index].msggeturl;
    var msgclickurl = rowDatas[index].msgclickurl;
    var baseurl = rowDatas[index].baseurl;
    /*
    * 设置功能分类
    */
    var data = $('#gnfl').combobox('getData');
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (('1' + flbm) == data[i].id) {
                $('#gnfl').combobox('select', data[i].id);
                break;
            }
        }
    }

    $('#gnmc').textbox('setValue', gnmc);
    $('#gncxj').textbox('setValue', gncxj);
    $('#rightediturl').textbox('setValue', rightediturl);
    $('#gnxsmc').textbox('setValue', gnxsmc);
    $('#gnxh').textbox('setValue', gnxh);
    $('#cscs').textbox('setValue', cscs);
    $('#gnsm').textbox('setValue', gnsm);
    $('#programtype').textbox('setValue', programtype);
    $('#msgtype').textbox('setValue', msgtype);
    $('#msggeturl').textbox('setValue', msggeturl);
    $('#msgclickurl').textbox('setValue', msgclickurl);
    $('#baseurl').textbox('setValue', baseurl);
    document.getElementById('gnbm').value = gnbm;

    $('#winAddGnQx').window('open');

}
function deleteRow(index) {
    var rowDatas = $('#dgGngl').datagrid('getRows');
    var gnbm = rowDatas[index].gnbm;
    Confirm("确认", "确定删除选中模块？", function(r) {
        if (r) {
            $.post("/Handler/ZZJG/ZZJGHandler.ashx?action=DeleteGnQx", { gnbm: ('1' + gnbm) },
                function(result) {
                    //Alert("操作结果: " + result);

                    Alert(result);
                    $('#dgGngl').datagrid('load');
                });
        }
    });
    /*
    * 重新载入grid数据
    */
}


/*
* 清空添加功能权限的窗体数据
*/
function clearQxData() {
    $('#gnmc').textbox('setValue', '');
    $('#gncxj').textbox('setValue', '');
    $('#rightediturl').textbox('setValue', '');
    $('#gnxsmc').textbox('setValue', '');
    $('#gnxh').textbox('setValue', '');
    $('#cscs').textbox('setValue', '');
    $('#gnsm').textbox('setValue', '');
    $('#programtype').textbox('setValue', '');
    $('#msgtype').textbox('setValue', '');
    $('#msggeturl').textbox('setValue', '');
    $('#msgclickurl').textbox('setValue', '');
    $('#baseurl').textbox('setValue', '');
}

function isNull(data) {
    return (data == "" || data == undefined || data == null) ? true : false;
}

/*
* 重置功能权限信息的高度
*/
function resizeGnmkHeight() {
    var panelGnInfoHeight = $('#TableGnmk').height();
    $('#dgGngl').datagrid('options').height = panelGnInfoHeight;
    $('#dgGngl').datagrid('resize');
}