
var parm = new UrlSearch();

$(document).ready(function () {

    loaddzjzzzGrid();

    $("#dt_dzjzzz_begin").datebox("setValue", getStartDate());
    $("#dt_dzjzzz_end").datebox("setValue", getEndDate());


    //查询
    $('#btnSearch_tj_dzjzzz').linkbutton({
        iconCls: 'icon-search',
        onClick: function () {

            var option = $("#dg_tj_dzjzzz").datagrid("options");
            var number = option.pageNumber;
            var size = option.pageSize;
            loaddzjzzzData(number, size);
        }
    });

    $('#dg_tj_dzjzzz').pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            loaddzjzzzData(pageNumber, pageSize);
            $(this).pagination('loaded');
        }
    });

    //单位下拉列表获取
    $("#ct_dzjzzz_dwbm").combotree({
        method: 'post',
        url: '/Handler/Account/login.ashx?action=unit&fdwbm=100000&t=' + new Date().getMilliseconds(),
        editable: false,
        animate: false,
        onLoadSuccess: function (node, result) {
            //当载入成功后根据Cookies对单位进行默认选择
            if (parm.dwbm == null) {
                var rootNode = $('#ct_dzjzzz_dwbm').combotree('tree').tree("getRoot");
                if (rootNode == null) return;
                $('#ct_dzjzzz_dwbm').combotree('setValue', rootNode.id);
            } else {
                $("#ct_dzjzzz_dwbm").combotree('setValue', parm.dwbm);
            }
            var user = $.cookie('Cyvation.Cyvation.login.user');
            if (user != null) {
                $('#ct_dzjzzz_dwbm').val(decodeURI(user));
            }

            var unitTree = $('#ct_dzjzzz_dwbm').combotree('tree');
            if (unitTree == null) return;
            var selectNode = unitTree.tree("getSelected");
            var currNode = selectNode;
            while (currNode != null) {
                currNode = unitTree.tree("getParent", currNode.target);
                if (currNode != null) {
                    unitTree.tree("expand", currNode.target);
                }
            }
        },
        onLoadError: function (data) {
            Alert("未获取到登录单位列表，请刷新重试或检查网络连接！" + data.responseText);
        }
    });

});

/*
*   加载人员grid数据
*/
function loaddzjzzzData(page, rows) {

    var dwbm = $('#ct_dzjzzz_dwbm').textbox('getValue');
    var bmbmList = $('#cb_dzjzzz_bmbm').combotree('tree').tree('getChecked');
    var bmbm = '';
    for (var i = 0; i < bmbmList.length; i++) {
        if (i == 0) {
            bmbm = '(';
        }
        bmbm += "'" + bmbmList[i].id + "'" + (i != bmbmList.length - 1 ? ',' : ')');
    }

    var cbrmc = $('#tb_dzjzzz_cbrmc').textbox('getValue');
    var ajlbbm = $('#cb_dzjzzz_ajlb').textbox('getValue');
    var ajmc = $('#tb_dzjzzz_ajmc').textbox('getValue');
    var bmsah = $('#tb_dzjzzz_xtsah').textbox('getValue');
    var ajztbm = $('#cb_dzjzzz_ajzt').textbox('getValue');

    var begin = $('#dt_dzjzzz_begin').textbox('getValue');
    var end = $('#dt_dzjzzz_end').combobox('getValue');
    if (dwbm == "") {
        return;
    }
    if (begin == "") {
        Alert("请选择开始时间!");
        return;
    }
    if (end == "") {
        Alert("请选择结束时间!");
        return;
    }

//    $('#dg_tj_dzjzzz').datagrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=Getdzjzzz' + '&dwbm=' + escape(dwbm) + '&cbr=' + escape(cbrmc) + '&ajlbbm=' +
//    escape(ajlbbm) + '&bmbm=' + escape(bmbm) + '&begin=' + escape(begin) + '&end=' + escape(end) + '&ajmc=' + escape(ajmc) + '&bmsah=' + escape(bmsah) +
//        '&ajztbm=' + escape(ajztbm);
//    $('#dg_tj_dzjzzz').datagrid("load");
}

function loaddzjzzzGrid() {
    var time = new Date();
    var pre7Date = new Date(time.getTime() - 7 * 24 * 60 * 60 * 1000); //提前七天

    $('#dg_tj_dzjzzz').datagrid({
        width: 'auto',
        striped: true,
        fitColumns: true,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        toolbar: $('#panelTool_tj_dzjzzz'),
        sortable: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        columns: [
            [
                { field: 'dq', title: '地区', sortable: true },
                { field: 'zzsl', title: '制作数量', sortable: true },
                { field: 'js', title: '卷数', sortable: true },
                { field: 'wjys', title: '文件页数', sortable: true },
                { field: 'ccdx', title: '存储大小', sortable: true },
                { field: 'yzzajs', title: '应制作案件数', sortable: true },
                { field: 'zzl', title: '制作率', sortable: true },
                { field: 'dcajs', title: '律师阅卷导出案件数', sortable: true }
            ]
        ],
        loadMsg: '数据加载中，请稍候...'
    });

    $('#dg_tj_dzjzzz').datagrid('getPager').pagination({
        beforePageText: '第',
        afterPageText: '页   共{pages}页',
        displayMsg: '当前显示【{from} ~ {to}】条记录   共【{total}】条记录'
    });

    resizedzjzzzHeight();
    resizedzjzzzWidth();

}

/*
* 重置高度
*/
function resizedzjzzzHeight() {
    var panelHeight = $('#panel_tj_dzjzzz').height();

    $('#dg_tj_dzjzzz').datagrid('options').height = panelHeight;
    $('#dg_tj_dzjzzz').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizedzjzzzWidth() {
    var panelWidth = $('#panel_tj_dzjzzz').width();
    $('#dg_tj_dzjzzz').datagrid('options').width = panelWidth;
    $('#dg_tj_dzjzzz').datagrid('resize');
}



