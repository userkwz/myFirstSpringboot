$(document).ready(function () {

    // 界面标签样式设置及事件绑定
    syslog_marksInit();

    // 标签初始化数据加载
    syslog_marksDataBind();

});


// 界面标签样式设置及事件绑定
function syslog_marksInit() {

    //单位树初始化
    $('#tree_syslog_dwandson').combotree({
        url: '/Handler/MsgRecord/index.ashx?action=GetDwAndSonTree&t=' + (new Date()).getMilliseconds(),
        onLoadSuccess: function () {
            $('#tree_syslog_dwandson').combotree('setValue', v_current_userInfo.DWBM);
        }
    });

    //日志等级初始化
    $('#txt_syslog_rzdj').combobox({
        method: 'get',
        valueField: 'text',
        textField: 'text',
        url: '/Handler/Organization/organization.ashx?action=GetRZDJ&t=' + (new Date()).getMilliseconds()
    });

    //记录人初始化
    $('#txt_syslog_jlr').combobox({
        method: 'get',
        valueField: 'text',
        textField: 'text',
        url: '/Handler/Organization/organization.ashx?action=GetJLR&t=' + (new Date()).getMilliseconds()
    });

    //日志列表
    $('#dg_syslog_list').datagrid({
        width: 'auto',
        striped: true,
        singleSelect: true,
        pageSize: 20,
        loadMsg: '数据加载中，请稍候...',
        pagination: true,
        rownumbers: true,
        columns: [[
        { field: 'logid', title: '日志id', width: 120 ,hidden:true},
        { field: 'logger', title: '记录人', width: 240 },
        { field: 'loglevel', title: '日志等级', width: 130 },
        { field: 'logdatetime', title: '记录时间', width: 170 },
        { field: 'runinfo', title: '运行信息', width: 300 },
        { field: 'action', title: '操作', width: 180, align: 'center',
            formatter: function (value, row, index) {
                var r = '<a href="#" onclick="get_dg_syslog_list(' + index + ')">详情</a> ';
                return r;
            }
        }
        ]],
        groupField: 'loglevel',
        view: groupview,
        groupFormatter: function (value, rows) {
            return ((value == '') ? "未分配" : value);
        }
    });
    $('#dg_syslog_list').datagrid('getPager').pagination({
        pageList: [10, 20, 30, 50, 100],
        beforePageText: '第',
        afterPageText: '页   共{pages}页',
        displayMsg: '当前显示【{from} ~ {to}】条记录   共【{total}】条记录'
    });
    //面板大小改变事件
    $('#pnl_syslog_list').panel({
        onResize: function (width, height) {
            resize_dg_syslog_list();
        }
    });

    //查询
    $('#btn_syslog_search').linkbutton({
        onClick: load_dg_syslog_listcx
    });

    //关闭窗口事件
    $('#btn_syslog_confirm').linkbutton({
        onClick: function () {
            $('#win_syslog_view').window('close');
        }
    })
}

// 页面分页控件放置到底部
function resize_dg_syslog_list() {
    var h = $('#pnl_syslog_list').height();

    $('#dg_syslog_list').datagrid('options').height = h - 52;
    $('#dg_syslog_list').datagrid('resize');
}

// 标签初始化数据加载
function syslog_marksDataBind() {

    // 加载日志列表
    load_dg_syslog_list();
}

// cx加载日志列表
function load_dg_syslog_listcx() {
    var jlr = '';
    var rzdj = '';
    var kssj = '';
    var jssj = '';
    try {
        rzdj = $('#txt_syslog_rzdj').combobox('getValue');
        jlr = $('#txt_syslog_jlr').combobox('getValue');
        kssj = $('#txt_syslog_kssj').datebox('getValue');
        jssj = $('#txt_syslog_jssj').datebox('getValue');
    } catch (e) {
    }

    var queryData = { action: 'GetSysLogListcx', rzdj: rzdj,
        dwbm: $('#tree_syslog_dwandson').combotree('getValue'),
        jlr: jlr,
        kssj: kssj, jssj: jssj,
        t: (new Date()).getMilliseconds()
    };
    $('#dg_syslog_list').datagrid({
        queryParams: queryData,
        url: '/Handler/Organization/organization.ashx'
    });

}

// 加载日志列表
function load_dg_syslog_list() {

    var jlr = '';
    var rzdj = '';
    var kssj = '';
    var jssj = '';
    try {
        rzdj = $('#txt_syslog_rzdj').combobox('getValue');
        jlr = $('#txt_syslog_jlr').combobox('getValue');
        kssj = $('#txt_syslog_kssj').datebox('getValue');
        jssj = $('#txt_syslog_jssj').datebox('getValue');
    } catch (e) {
    }

    var queryData = { action: 'GetSysLogList', rzdj: rzdj,
        jlr: jlr,
        kssj: kssj, jssj: jssj,
        t: (new Date()).getMilliseconds()
    };
    $('#dg_syslog_list').datagrid({
        queryParams: queryData,
        url: '/Handler/Organization/organization.ashx'
    });

}

//加载日志详情
function get_dg_syslog_list(index) {

    //清空
    $('#txt_syslog_view_jlr').textbox('setValue', '');
    $('#txt_syslog_view_rzdj').textbox('setValue', '');
    $('#txt_syslog_view_jlsj').textbox('setValue', '');
    $('#txt_syslog_view_cw').textbox('setValue', '');
    $('#txt_syslog_view_xx').textbox('setValue', '');
    $('#txt_syslog_view_yxxx').textbox('setValue', '');
    var rowDatas = $('#dg_syslog_list').datagrid('getRows');
    if (rowDatas == null || rowDatas[index] == null) {
        Alert("请选中要查看详情的行！");
        return;
    }
    var data = rowDatas[index];

    // 调用一般处理程序获取律师信息encodeURI
    $.ajax({
        type: "GET",
        url: "/Handler/Organization/organization.ashx",
        data: { action: 'GetRZInfo', logid: data.logid, t: (new Date()).getMilliseconds()
        },
        dataType: "json",
        success: function (result) {
            // 对一般处理程序返回的数据，进行错误处理及数据过滤
            doActionWithErrorHandle(result, function (data) {
                $('#txt_syslog_view_jlr').textbox('setValue', data.LOGGER);
                $('#txt_syslog_view_rzdj').textbox('setValue', data.LOGLEVEL);
                $('#txt_syslog_view_jlsj').textbox('setValue', data.LOGDATETIME);
                $('#txt_syslog_view_cw').textbox('setValue', data.EXCEPTION);
                $('#txt_syslog_view_xx').textbox('setValue', data.MESSAGE);
                $('#txt_syslog_view_yxxx').textbox('setValue', data.RUNINFO);
            });
        }
    });
    $('#win_syslog_view').window({
        title: '日志详情'
    });
    $('#win_syslog_view').window('open');
}