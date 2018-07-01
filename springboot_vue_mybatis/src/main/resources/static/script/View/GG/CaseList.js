//@ sourceURL=caseList.js
var queryData;
var ashxUrl;
var param;
var rqlx;
var ajlb_all_select = false;
var userInfo;
//不用计算效率的案件类别
var noEfficiencyAJLB = ['0101', '0102', '0103', '0207', '0208', '0221', '0223', '0299', '0302', '0308', '0316', '0318', '0319', '0321', '0324', '0325', '0326', '0327', '0403', '0406', '0408', '0410', '0411', '0412', '0416', '0419', '0503', '0505', '0506', '0508', '0510', '0511', '0512', '0516', '0519', '0702', '0703', '0704', '0709', '0710', '1006', '1007', '1008', '1009', '1010', '1011', '1101', '1102', '1103', '1104', '1105', '1106', '1107', '1301', '1303', '1306', '1401', '1402', '1403', '1404', '1501', '1502', '1503', '1504', '1505'];

$(function () {
    //加载用户信息
    load_userifno()
    param = new UrlSearch();
    var base = new Base64();
    queryData = JSON.parse(base.decode(param.query));
    selectedUrl = queryData.selectedUrl;
    ashxUrl = base.decode(param.ashx);
    init(queryData.showColumn); //1、完成时间，2、卷宗册数，3、超期天数
    //AddOperationLog('案件反查列表',ashxUrl);
    if (queryData.sendEmail != null && queryData.sendEmail != 0) {
        document.getElementById('btnSendEmail').style.display = "inline-block";
        $('#btnSendEmail').bind('click', function () {
            var cbdwmc = $('#cb_ajjbxx_dwbm').combotree('getText').replace(/院/g, "");
            var dwmc = userInfo.DWMC.replace(/院/g, "");
            //AddOperationLog('案件反查列表','发送邮件');
            var ajsl = $('#dg_ajjbxx').datagrid('getData').total;
            //frameObject.OpenDialogWeb(2, baseUrl + sendMailUrl + '?key=' + param.key + '&dwbm=' + param.dwbm + '&sendMail=' + queryData.sendEmail + '&dwmc=' + dwmc + '&cbdw=' + cbdwmc + '&ajsl=' + ajsl, '', '', '发送邮件', '');
        });
        if (queryData.sendEmail == 1 && document.getElementById('btnSendEmailBack')!= null) {
            document.getElementById('btnSendEmailBack').style.display = "inline-block";
            $('#btnSendEmailBack').bind('click', function () {
                var cbdwmc = $('#cb_ajjbxx_dwbm').combotree('getText').replace(/院/g, "");
                var dwmc = userInfo.DWMC.replace(/院/g, "");
                AddOperationLog('案件反查列表', '回复邮件');
                var ajsl = $('#dg_ajjbxx').datagrid('getData').total;
                //frameObject.OpenDialogWeb(2, baseUrl + sendMailUrl + '?key=' + param.key + '&dwbm=' + param.dwbm + '&sendMail=' + 6 + '&dwmc=' + dwmc + '&cbdw=' + cbdwmc + '&ajsl=' + ajsl, '', '', '发送邮件', '');
            });
        }
    }

    if (queryData.exportExcel != null && queryData.exportExcel != 0) {
        document.getElementById('btnExportExcel').style.display = "inline-block";
        //导出excel
        $("#btnExportExcel").click(function () {
            var options = $("#dg_ajjbxx").datagrid("getPager").data("pagination").options;
            if (options.total == 0) {
                ShowWarning('无数据，未能导出！');
                return;
            }
            ShowWarningAndDo('请确认导出数据量在60000万条以内，超出请缩小数据范围。', function () {
                AddOperationLog('案件反查列表', '导出Excel');
                ShowProgress();
                queryData.isPaging = 0;
                $.post('/Handler/ajxx/AJXXHandler.ashx?action=ExportCaseList2Excel2', queryData,
                    function (result) {
                        CloseProgress();
                        //.DownFiles(result);
                    });
            });
        });
    }
    if (queryData.dwbm.substr(0, 1) == 'B') {
        queryData.sjtype = 1;
    }
    var dwbm = queryData.dwbm = queryData.dwbm.length > 6 ? queryData.dwbm.substr(1, 6) : queryData.dwbm;
    
    rqlx = queryData.rqlx;

    // 单位编码ComboTree初始化
    $('#cb_ajjbxx_dwbm').combotree({
        method: 'get',
        lines: true,
        url: getNewRootPath()+'/account/loginDwbmTree',
        onLoadSuccess: function () {
            $('#cb_ajjbxx_dwbm').combotree('setValue', dwbm);
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#ckbDWBM').attr("checked", false);
                $("#ckbDWBM").attr("disabled", "disabled");
                InitBMBMCombo(dwbm);
            } else {
                $("#ckbDWBM").removeAttr("disabled");
                InitBMBMCombo(node.id);
            }
        },
        onCheck: function (node) {
            $('#cb_ajjbxx_bmbm').combotree('setValue', '');
                if (node.id == '000000') {
                    $('#ckbDWBM').attr("checked", false);
                    $("#ckbDWBM").attr("disabled", "disabled");
                } else {
                    $("#ckbDWBM").removeAttr("disabled");
                }
        },
        onLoadError: function (data) {
            console.log("Error:" + data.responseText);
        }
    });
    // 部门编码ComboTree初始化
    InitBMBMCombo(dwbm);

    //alert(queryData.sjtype);
    if (queryData.sjtype != null && queryData.sjtype == "2") {
        //        document.getElementById('ckbDWBM').check = true;
        $('#ckbDWBM').attr("checked", true);
    } else {
        document.getElementById('ckbDWBM').disabled = "disabled";
        $('#ckbDWBM').attr("checked", false);
    }
    if (queryData.dateStart != null) {
        $('#dt_ajjbxx_begin').datebox("setValue", queryData.dateStart);
    }
    if (queryData.dateEnd != null) {
        $('#dt_ajjbxx_end').datebox("setValue", queryData.dateEnd);
    }
    if (queryData.dcsjStart != null) {
        $('#dt_dcsj_begin').datebox("setValue", queryData.dcsjStart);
    }
    if (queryData.dcsjEnd != null) {
        $('#dt_dcsj_end').datebox("setValue", queryData.dcsjEnd);
    }

    onLoad(false, true);
    if(queryData.bmbm!=null&&queryData.bmbm!=''&&queryData.bmbm!=undefined)
        $('#cb_ajjbxx_bmbm').combotree("setValue", queryData.bmbm);
    
    $('#btnSearchAjxx').unbind('click');
    $("#btnSearchAjxx").click(function () {
        onLoad(true, false);
    });

    $.ajax({
        type: "post",
        url: getNewRootPath()+"/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB",
        dataType: "json",
        success: function (data) {
            data.splice(0, 0, {id:-1,text:"全选/反选"});
            $('#cb_ajjbxx_ajlb').combotree({
                data: data
            });
            if (queryData.lbbmjh != null) {
                var jh = queryData.lbbmjh.substr(1, queryData.lbbmjh.length - 2).replace(/'/g, "").split(',');
                $('#cb_ajjbxx_ajlb').combotree('setValues', jh);
            }
        },
    });

    //查询案件类别
    $('#cb_ajjbxx_ajlb').combotree({
        //method: 'post',
        //url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        editable: true,
        animate: false,
        multiple: true,
        onSelect: function (record) {
            if (record.id == -1) {
                //treeChecked(!record.checked);
                //SelectChange();
            }
        },
        onChange:function(record) {
           if (record[0] == -1 && !ajlb_all_select ) {
               ajlb_all_select = !ajlb_all_select;
               SelectChange();
           } else if(record[0] != -1 && ajlb_all_select ){
               ajlb_all_select = !ajlb_all_select;
               SelectChange();
           }
        },
        keyHandler: {
            query: function (q) {
                queryComboTree(q, "cb_ajjbxx_ajlb");
            }
        }
    });

    //移送案由
    $('#cb_ajjbxx_ysay').combotree({
        method: 'post',
        queryParams: { lbbm: '9903' },
        url: getNewRootPath()+'/Handler/Dictionary/dictionary.ashx?action=GetDataItemListByRemote',
        editable: true,
        animate: false,
        multiple: true,
        onLoadSuccess: function () {
            if (queryData.ysayjh != null) {
                var jh = queryData.ysayjh.substr(1, queryData.ysayjh.length - 2).replace(/'/g, "").split(',');
                $('#cb_ajjbxx_ysay').combotree('setValues', jh);
            }
        },
        keyHandler: {
            query: function (q) {
                queryComboTree(q, "cb_ajjbxx_ysay");
            }
        }
    });
    //frameObject.ClearPicture();
});

function InitBMBMCombo(dwbm) {
    $('#cb_ajjbxx_bmbm').combotree({
        method: 'get',
        editable: true,
        animate: false,
        multiple: true,
        url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + dwbm,
        onLoadSuccess: function () {
            if (queryData.bmbm != null) {
                $('#cb_ajjbxx_bmbm').combotree('setValue', queryData.bmbm);
            }
        },
        onLoadError: function(data) {
            console.log("Error:" + data.responseText);
        },
        keyHandler : {
            query: function(q) {
                queryComboTree(q, "cb_ajjbxx_bmbm");
            }
        },
        onSelect: function(data) {
            document.getElementById('ckbDWBM').checked = false;
        }

    });
}

function treeChecked(selected) {
    var roots = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getRoots');//返回tree的所有根节点数组  
    if (selected) {
        for (var i = 1; i < roots.length; i++) {
            var node = $('#cb_ajjbxx_ajlb').combotree('tree').tree('find', roots[i].id);//查找节点  
            $('#cb_ajjbxx_ajlb').combotree('tree').tree('check', node.target);//将得到的节点选中  
        }
    } else {
        for (var i = 1; i < roots.length; i++) {
            var node = $('#cb_ajjbxx_ajlb').combotree('tree').tree('find', roots[i].id);
            $('#cb_ajjbxx_ajlb').combotree('tree').tree('uncheck', node.target);
        }
    }
}


function size() {
    var div = document.getElementById("panel_ajjbxx");
    div.style.height = window.innerHeight + "px";
    div.style.width = window.innerWidth + "px";
    //document.getElementById("panelTool_ajjbxx").style.width = window.innerWidth + "px";

    resizeAJJBXXHeight();
    resizeAJJBXXWidth();
}

function init(showColumn) {
    var option = {
        width: 'auto',
        striped: true,
        fitColumns: true,
        singleSelect: true,
        //设置复选框和行的选择状态不同步
        checkOnSelect: false, 
        selectOnCheck: false,
        pagination: true,
        rownumbers: true,
        toolbar: $('#panelTool_ajjbxx'),
        sortable: true,
        pageSize: 20,
        pageList: [10, 20, 30, 50, 100],
        columns: getColumn(showColumn),
        loadMsg: '数据加载中，请稍候...',
        //rowStyler: function (index, row) {
        //    if (index % 2 == 0) { return 'background-color:#FFFFFF;'; }
        //}
    };
    $('#dg_ajjbxx').datagrid(option);

    $('#dg_ajjbxx').datagrid('getPager').pagination({
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
    var panelHeight = $('#panel_ajjbxx').height();
    $('#dg_ajjbxx').datagrid('options').height = panelHeight;
    $('#dg_ajjbxx').datagrid('resize');
}

/*
* 重置的宽度
*/
function resizeAJJBXXWidth() {
    var panelWidth = $('#panel_ajjbxx').width();
    $('#dg_ajjbxx').datagrid('options').width = panelWidth;
    $('#dg_ajjbxx').datagrid('resize');
}

function onLoad(value, isInit) {
    if (!isInit) {
        var dwbm = $("#cb_ajjbxx_dwbm").combotree("getValue");
        
        var bmsah = $("#txt_ajjbxx_bmsah").val();
        var ajmc = $("#txt_ajjbxx_ajmc").val();
        var cbr = $("#txt_ajjbxx_cbr").val();
        var begin = $('#dt_ajjbxx_begin').textbox('getValue');
        var end = $('#dt_ajjbxx_end').textbox('getValue');
        //var bmbm = $("#cb_ajjbxx_bmbm").combotree("getValue");

        var bmbm = $("#cb_ajjbxx_bmbm").textbox("getText") != "" ? $("#cb_ajjbxx_bmbm").combotree("getValues").join('\',\'') : '';

        var bjrqBegin = $('#dt_bjrq_begin').textbox('getValue');
        var bjrqEnd = $('#dt_bjrq_end').textbox('getValue');
        if ($('#dt_wcrq_begin') != null) {
            var wcrqBegin = $('#dt_wcrq_begin').textbox('getValue');
        }
        if ($('#dt_wcrq_end') != null) {
            var wcrqEnd = $('#dt_wcrq_end').textbox('getValue');
        }
        if ($('#dt_dcsj_begin') != null) {
            var dcsjBegin = $('#dt_wcrq_begin').textbox('getValue');
        }
        if ($('#dt_dcsj_end') != null) {
            var dcsjEnd = $('#dt_wcrq_end').textbox('getValue');
        }
        var sjtype = document.getElementById('ckbDWBM').checked ? "2" : "1";
        //var ysay = $("#cb_ajjbxx_ysay").val();
        var lbbmjh = '';
        if (value == true) {
            var ajlbbmList = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getChecked');
            for (var i = 0; i < ajlbbmList.length; i++) {
                if (i == 0) {
                    lbbmjh = '(';
                }
                lbbmjh += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
            }

            var ysayList = $('#cb_ajjbxx_ysay').combotree('tree').tree('getChecked');
            var ysayjh = '';
            for (var i = 0; i < ysayList.length; i++) {
                if (i == 0) {
                    ysayjh = '(';
                }
                if (i == 9) {
                    // 只能选11个
                    ysayjh += "'" + ysayList[i].id + "')";
                    if (ysayList.length > 9) {
                        alert("您选择过多的案由，默认只取前面十个！");
                    }
                    break;
                }
                ysayjh += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
                
            }
            queryData.lbbmjh = lbbmjh;
            queryData.ysayjh = ysayjh;
        }
        queryData.bmsah = bmsah;
        queryData.ajmc = ajmc;
        queryData.dwbm = dwbm;
        queryData.bmbm = bmbm;
        queryData.cbr = cbr;
        queryData.ysay = '';
        queryData.sjtype = sjtype;
        queryData.dateStart = begin;
        queryData.dateEnd = end;
        queryData.bjrqStart = bjrqBegin;
        queryData.bjrqEnd = bjrqEnd;
        queryData.wcrqStart = wcrqBegin;
        queryData.wcrqEnd = wcrqEnd;
        queryData.dcsjStart = dcsjBegin;
        queryData.dcsjEnd = dcsjEnd;
        if (begin != "" || end != "") {
            if (ashxUrl == "/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX") {
                queryData.rqlx = "";
            }
            else if (ashxUrl == "/Handler/AJXX/AJXXHandler.ashx?action=GetHZTJ_Ajxx" && queryData.type == 5) {
                queryData.rqlx = "";
            }
            else {
                queryData.rqlx = rqlx;
            }
        } else {
            queryData.rqlx = rqlx;
        }
    }
    
    $('#dg_ajjbxx').datagrid("options").queryParams = queryData;
    $('#dg_ajjbxx').datagrid("options").url = ashxUrl;
    $('#dg_ajjbxx').datagrid("load");
}

function openCase(bmsah, ajlbbm) {
    var url = '';
    if (queryData.caseType == null || queryData.caseType == 0) {
        url = caseUrl;
    }
    else if (queryData.caseType == 1) {
        url = caseLCJKUrl;
    }
    else if (queryData.caseType == 2) {
        url = caseErrorUrl;
    }
    var base = new Base64();
    var jsonStr = base.encode('{ "AJLBBM": "' + ajlbbm + '" }')
    bmsah = base.encode(bmsah)
    $("#win_case").window({
        title:"案件案卡",
    })
    var urlHtml = '<iframe width="100%" height="100%" frameborder="0" src='+url+"?bmsah="+bmsah+'></iframe>'
    $("#win_case").html(urlHtml)
    $("#win_case").window('open')
}

function exportExcel() {

}

function checkIsShowLower() {
    if (param.sjtype == null) {
        document.getElementById('ckbDWBM').check = false;
    }
}

function getColumn(showColumn) {
    if (showColumn != null && showColumn == 1) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function (value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field: 'bjrq', title: '办结日期', width: 80 }
            ]
        ];
    } if (showColumn != null && showColumn == 2) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function (value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field :'sjsarjdh',title:'送卷人及电话',width: 80 },
                { field :'qtjsr',title:'前台经手人',width: 80 },
                { field :'lqrmc',title:'领取人',width: 80 },
                { field :'lqrq',title:'领取日期',width: 80 },
                { field: 'jzcs', title: '卷宗册数', width: 80 },
                { field: 'wjzs', title: '文件总数', width: 80, hidden: true  },
                { field: 'wjyzs', title: '文件页总数', width: 80, hidden: true }
            ]
        ];
    } if (showColumn != null && showColumn == 3) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function (value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field: 'bjrq', title: '办结日期', width: 80 },
                { field: 'cqts', title: '超期天数', width: 80 }
            ]
        ];
    }
    else if (showColumn != null && showColumn == 4) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function (value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field: 'sqrxm', title: '申请人姓名', width: 80 },
                { field: 'sqsx', title: '申请事项', width: 80 },
                //{ field: 'szlssws', title: '所在的律师事务所', width: 120 },
                { field: 'sqrq', title: '申请日期', width: 80 }
            ]
        ];
    }
    else if (showColumn != null && showColumn == 5) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function(value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb', title: '案件类别', width: 120 },
                { field: 'ajzt', title: '案件状态', width: 80,
                    formatter: function(value, row, index) {
                        if (value == "0") {
                            return "受理";
                        }
                        else if (value == "1") {
                            return "在办";
                        }
                        else if (value == "2") {
                            return "已办";
                        }
                        else if (value == "3") {
                            return "归档";
                        } else {
                            return '';
                        }
                    } },
                { field: 'slrq', title: '受理日期', width: 80 }
            ]
        ];
    } else if (showColumn != null && showColumn == 6) {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function(value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbbm_mc', title: '承办部门', width: 80 },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                //{ field: 'wssl', title: '文书数量', width: 80 },
                { field: 'fhyj', title: '复核意见', width: 120 },
                { field: 'gkzt', title: '公开状态', width: 100 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field: 'bjrq', title: '办结日期', width: 80 },
                { field: 'wcrq', title: '完成日期', width: 80 }
            ]
        ];
    } else if (showColumn != null && showColumn == 7) {
        return [
        [
            //{ field: 'ck', checkbox: true },
            { field: 'bmsah', title: '部门受案号', width: 230, fixed: true },
            {
                field: 'ajmc',
                title: '案件名称',
                width: 200,
                formatter: function(value, row, index) {
                    return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                }
            },
            { field: 'cbbm_mc', title: '承办部门', width: 80 },
            { field: 'cbr', title: '承办人', width: 80 },
            {
                field: 'baxl', title: '办案效率', width: 400,
                formatter: function(value, row, index) {
                if ($.inArray(row.ajlb_bm, noEfficiencyAJLB) == -1) {
                    if (row.bjrq == '') {
                        return "<li style=\"100%\" ><div class=\"ywcd_jdt\"><div class=\"ywcd_jd\" style=\"width:0%;background:red;color:white\">用时" + row.bats + "天</div></div><span class=\"ywcd_sz\">结余" + row.syts + "天</span><span class=\"ywcd_bfb\">--%</span></li>";
                    } else {
                        var width = row.baxl > 100 ? 100 : row.baxl;
                        var red = Math.round(255 * (width / 100));
                        var green = Math.round(255 * (1 - width / 100));
                        if (red < 16)
                            red = "0" + red.toString(16);
                        else {
                            red = red.toString(16);
                        }
                        if (green < 16)
                            green = "0" + green.toString(16);
                        else {
                            green = green.toString(16);
                        }
                        var color = "-webkit-linear-gradient(left , #00ff00 , #" + red + green + "00)";
                        return "<li style=\"100%\" ><div class=\"ywcd_jdt\"><div class=\"ywcd_jd\" style=\"width:" + width + "%;background:" + color + ";color:white\">用时" + row.bats + "天</div></div><span class=\"ywcd_sz\">提前" + row.syts + "天办结</span><span class=\"ywcd_bfb\">" + row.baxl + "%</span></li>";
                    }
                } else {
                    return "<li style=\"100%\" ><div class=\"ywcd_jdt\"><div class=\"ywcd_jd\" style=\"width:0%;background:red;color:white\">此类案件不计算效率</div></div><span class=\"ywcd_sz\"></span><span class=\"ywcd_bfb\">--%</span></li>";
                }
            }
            },
            { field: 'ajlb_mc', title: '案件类别', width: 120 },
            { field: 'dqjd', title: '当前阶段', width: 80 },
            { field: 'slrq', title: '受理日期', width: 80 },
            { field: 'bjrq', title: '办结日期', width: 80 },
            { field: 'dqrq', title: '到期日期', width: 80 },
            { field: 'wcrq', title: '完成日期', width: 80 }
                
            ]
        ];
    } else {
        return [
            [
                //{ field: 'ck', checkbox: true },
                { field: 'bmsah', title: '部门受案号', width: 250, fixed: true },
                {
                    field: 'ajmc',
                    title: '案件名称',
                    width: 200,
                    formatter: function(value, row, index) {
                        return "<a onclick='openCase(\"" + row.bmsah + "\",\"" + row.ajlb_bm + "\")' href='javascript:void(0)'>" + value + "</a>";
                    }
                },
                { field: 'cbbm_mc', title: '承办部门', width: 80 },
                { field: 'cbr', title: '承办人', width: 80 },
                //{ field: 'ajlb_bm', title: '案件类别编码', width: 0 },
                { field: 'ajlb_mc', title: '案件类别', width: 120 },
                { field: 'dqjd', title: '当前阶段', width: 80 },
                { field: 'slrq', title: '受理日期', width: 80 },
                { field: 'bjrq', title: '办结日期', width: 80 },
                { field: 'wcrq', title: '完成日期', width: 80 }
            ]
        ];
    }
}

// 全选/反选实现
function SelectChange() {
    var roots = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getRoots');//返回tree的所有根节点数组  
    for (var i = 1; i < roots.length; i++) {
        var node = $('#cb_ajjbxx_ajlb').combotree('tree').tree('find', roots[i].id); //查找节点  
        if (node.checked) {
            $('#cb_ajjbxx_ajlb').combotree('tree').tree('uncheck', node.target); //将得到的节点不选中 
        } else {
            $('#cb_ajjbxx_ajlb').combotree('tree').tree('check', node.target); //将得到的节点选中  
        }
    }
}

// 过滤查询
function queryComboTree(q, comboid) {
    var datalist = []; //用平面的combobox来展示过滤的结果
    var childrenlist = [];
    var combotreeid = "#" + comboid;
    var roots = $(combotreeid).combotree('tree').tree('getRoots'); //得到根节点数组
    var children;
    var entertext = $(combotreeid).combotree('getText');
    $(combotreeid).combotree('setText', q);
    if (entertext == null || entertext == "") {
        //如果文本框的值为空，或者将文本框的值删除了，重新reload数据
        if (q == "") {
            $(combotreeid).combotree('reload');
            $(combotreeid).combotree('clear');
            $(combotreeid).combotree('setText', q);
        }
        return;
    }
    //循环数组，找到与输入值相似的，加到前面定义的数组中，
    for (var i = 0; i < roots.length; i++) {
        if (q == roots[i].text) {
            $(combotreeid).combotree('tree').tree('select', roots[i].target);
            return;
        } else {
            if (roots[i].text.indexOf(q) >= 0 && roots[i].text != "") {
                var org = {
                    "id": roots[i].id,
                    "text": roots[i].text
                };
                datalist.push(org);
            }
        }
        //找子节点（递归）
        childrensTree(combotreeid, roots[i].target, datalist, q);
    }
    //如果找到相似的结果，则加载过滤的结果
    if (datalist.length > 0) {
        $(combotreeid).combotree('loadData', datalist);
        $(combotreeid).combotree('setText', q);
        datalist = []; //这里重新赋值是避免再次过滤时，会有重复的记录
        return;
    } else {
        if (q == "") {
            $(combotreeid).combotree('reload');
            $(combotreeid).combotree('clear');
            $(combotreeid).combotree('setText', q);
        }
        return;
    }
}

function childrensTree(combotreeid, rootstarget, datalist, q) {
    var children = $(combotreeid).combotree('tree').tree('getChildren', rootstarget);
    console.log(children);
    for (j = 0; j < children.length; j++) {
        if (q == children[j].text) {
            $(combotreeid).combotree('tree').tree('select',
                children[j].target);
            return;
        } else {
            if (children[j].text.indexOf(q) >= 0 && children[j].text != "") {
                var org = {
                    "id": children[j].id,
                    "text": children[j].text
                };
                datalist.push(org);
            }
        }
        //childrensTree(combotreeid,children[j].target,datalist,q);
    }
}
// 用户信息加载
function load_userifno() {
    $.ajax({
        url: getNewRootPath()+"/account/getUserInfo",
        type: 'post',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.status == 200){
                userInfo = data.value;
                //userFuction();
                // get_userJsbm();
            }else if(data.status ==500){
                //获取用户信息失败，重新登陆：
                goLogin();
            }else {
                alert("获取用户信息失败！");
            }
        }
    });


}