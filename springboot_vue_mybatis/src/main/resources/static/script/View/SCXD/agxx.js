//@ sourceURL=xxlb.js

$(document).ready(function () {

    $("#dt_ajjbxx_begin").datebox("setValue", getStartDate());
    $("#dt_ajjbxx_end").datebox("setValue", getEndDate());

    $("#cb_xxlx").combobox({
        data: [
            { "id": -1, "text": "全部" },
            { "id": 0, "text": "发送" },
            { "id": 1, "text": "接收" }
        ],
        valueField:'id',    
        textField:'text'
    });
    $("#cb_xxzt").combobox({
        data: [
                { "id": -1, "text": "全部" },
                { "id": 0, "text": "未读" },
                { "id": 1, "text": "已读" }],
        valueField: 'id',
        textField: 'text'
    });
    loadAJJBXXGrid();

    //查询
    $('#btnSearch_tjbb_ajjbxx').click( function () {
            loadAJJBXXData();
        }
    );

    //添加
    $('#btnSearch_xx').click(function () {
            showAddMessage();
    });

    //添加
    $('#btnInsert_xx').click( function () {
            addXX();
    });

    $('#dg_tjbb_ajjbxx').pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            loadAJJBXXData(pageNumber, pageSize);
            $(this).pagination('loaded');
        }
    });

    loadAJJBXXData();

    

});

/*
*   加载人员grid数据
*/
function loadAJJBXXData() {

   

    //var dwbm = $('#ct_ajjbxx_dwbm').textbox('getValue');
    //var bmbmList = $('#cb_ajjbxx_bmbm').combotree('tree').tree('getChecked');
    //var bmbm = '';
    //for (var i = 0; i < bmbmList.length; i++) {
    //    if (i == 0) {
    //        bmbm = '(';
    //    }
    //    bmbm += "'" + bmbmList[i].id + "'" + (i != bmbmList.length - 1 ? ',' : ')');
    //}

    var xxlx = $('#cb_xxlx').combobox('getValue');
    var xxzt = $('#cb_xxzt').combobox('getValue');

    var begin = $('#dt_ajjbxx_begin').datebox('getValue');
    var end = $('#dt_ajjbxx_end').datebox('getValue');
    //if (dwbm == "") {
    //    return;
    //}
    if (begin == "") {
        Alert("请选择开始时间!");
        return;
    }
    if (end == "") {
        Alert("请选择结束时间!");
        return;
    }

    $('#dg_tjbb_ajjbxx').datagrid("options").url = '/Handler/SCXD/SCXDHandler.ashx?action=GetMsgByPage' + '&xxdm=agxx'+
        '&xxlx=' + escape(xxlx) + '&xxzt=' + escape(xxzt) + '&begin=' + escape(begin) + '&end=' + escape(end);
    $('#dg_tjbb_ajjbxx').datagrid("load");
    resizeAJJBXXHeight();
    resizeAJJBXXWidth();
}

function loadAJJBXXGrid() {

    $('#dg_tjbb_ajjbxx').datagrid({
        width: 'auto',
        striped: true,
        fitColumns: true,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        toolbar: $('#panelTool_tjbb_ajjbxx'),
        sortable: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        autoSizeColumn: true,
        onDblClickCell: function (index, field, value) {
            showMessage(index);
        },
        columns: [
            [
            {
                field: 'xxxh',
                hidden: true
            },
                {
                    field: 'xxbt',
                    title: '消息标题',
                    sortable: true,
                    width:'10%',
                    //formatter: function(value, row, index) {
                    //    return '<a href="#" onclick="showMessage(' + index + ')">' + value + '</a>';
                    //}
                },
                { field: 'fsr', title: '发送人', width: '10%', sortable: true },
                { field: 'fsrdwmc', title: '发送人单位', width: '10%', sortable: true },
                { field: 'jsr', title: '接收人', width: '10%', sortable: true },
                { field: 'jsrdwmc', title: '接收人单位', width: '10%', sortable: true },
                { field: 'xxnr', title: '内容', width: '30%', sortable: true },
                { field: 'fsrq', title: '发送日期', width: '10%', sortable: true },
                {
                    field: 'xxzt', title: '消息状态', sortable: true,
                    formatter: function (value, row, index) {
                        if (value == 0) {
                            return "未读";
                        }else {
                            return "已读";
                        }
                    }
                }
            ]
        ],
        loadMsg: '数据加载中，请稍候...'
    });

    $('#dg_tjbb_ajjbxx').datagrid('getPager').pagination({
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
    var panelHeight = $('#panel_tjbb_ajjbxx').height();

    $('#dg_tjbb_ajjbxx').datagrid('options').height = panelHeight;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizeAJJBXXWidth() {
    var panelWidth = $('#panel_tjbb_ajjbxx').width();
    $('#dg_tjbb_ajjbxx').datagrid('options').width = panelWidth;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}


function addDC(index) {
    var rowDatas = $('#dg_tjbb_ajjbxx').datagrid('getRows');
    var xxxh = rowDatas[index].xxxh;

    $.post("/Handler/SCXD/SCXDHandler.ashx?action=UpdateDCState",
        {
            xxxh: xxxh
        },
        function (result) {
            if (result == '1') {
                //刷新数据
                $('#dg_tjbb_ajjbxx').datagrid('load');
                Alert('发送成功！');
            } else {
                Alert(result);
            }
        });
}

function showMessage(index) {
    var rowDatas = $('#dg_tjbb_ajjbxx').datagrid('getRows');
    $('#tb_xx_fsr').textbox('setValue', rowDatas[index].fsr);
    $('#tb_xx_fsrdwmc').textbox('setValue', rowDatas[index].fsrdwmc);
    $('#tb_xx_xxbt').textbox('setValue', rowDatas[index].xxbt);
    $('#tb_xx_xxnr').textbox('setValue', rowDatas[index].xxnr);
    $('#tb_xx_jsr').textbox('setValue', rowDatas[index].jsr);
    $('#tb_xx_jsrdwmc').textbox('setValue', rowDatas[index].jsrdwmc);
    $('#tb_xx_dcrq').textbox('setValue', rowDatas[index].dcrq);
    $('#tb_xx_xxzt').textbox('setValue',  rowDatas[index].xxzt == 0?"未读":"已读");

    var xxxh = rowDatas[index].xxxh;
    $.post("/Handler/SCXD/SCXDHandler.ashx?action=UpdateMsgState",
    {
        xxxh: xxxh
    },
    function (result) {
        if (result == '1') {
            $('#dg_bl').datagrid('load');
        } else {
            Alert(result);
        }
    });

    $('#xxxq').window('open');
}

function showAddMessage() {

    $('#tb_add_jsrdwmc').combotree('setValue','');
    $('#tb_add_jsr').combotree('setValue', '');
    $('#tb_add_xxbt').textbox('setValue', '');
//    $('#tb_add_yqhfrq').datebox('setValue', '');
    $('#tb_add_xxnr').textbox('setValue', '');
    ////单位下拉列表获取
    $("#tb_add_jsrdwmc").combotree({
        method: 'get',
        url: '/Handler/Account/login.ashx?action=unit&fdwbm=100000&t=' + new Date().getMilliseconds(),
        editable: false,
        animate: false,
        multiple: false,
        onLoadSuccess: function (node, result) {
        },
        onLoadError: function (data) {
            Alert("未获取到登录单位列表，请刷新重试或检查网络连接！" + data.responseText);
        },
        onSelect: function (node) {

            $('#tb_add_jsr').combotree("clear");
            if (node == null) {
                return;
            }
            $('#tb_add_jsr').combotree({
                method: 'post',
                url: '/Handler/SCXD/SCXDHandler.ashx?action=GetRYByDWBM&dwbm=' + node.id,
                valueField: 'gh',
                textField: 'mc',
                editable: false,
                animate: false,
                checkbox: true,
                cascadeCheck: true,
                multiple: false
            });
        }
    });

    $('#tjxx').window('open');
}

function addXX() {

    var jsrdwbm = $('#tb_add_jsrdwmc').combotree('getValue');
    var jsr = $('#tb_add_jsr').combotree('getValue');
    var xxbt = $('#tb_add_xxbt').textbox('getValue');
    //var yqhfrq = $('#tb_add_yqhfrq').datebox('getValue');
    var xxnr = $('#tb_add_xxnr').textbox('getValue');

    $.post("/Handler/SCXD/SCXDHandler.ashx?action=AddMessage",
        {
            jsrdwbm: jsrdwbm,
            jsr: jsr,
            xxbt: xxbt,
            yqhfrq: null,
            xxnr: xxnr,
            xxdm:'agxx'
        },
        function (result) {
            if (result == '1') {
                //刷新数据
                $('#dg_tjbb_ajjbxx').datagrid('load');
                Alert('发送成功！');
                $('#tjxx').window('close');
            } else {
                Alert(result);
            }
        });
}

