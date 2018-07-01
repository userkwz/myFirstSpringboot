//@ sourceURL=index.js
var dNode;    /*tree的顶级节点*/
var sExpandNode; /*tree要选中并展开的节点*/
var jsNode; /*tree要选中的角色节点*/
var v_dwbm;
var v_ajlbbm;
var org_role_bmbm; //部门编码
var org_role_bmmc; // 部门名称
var org_role_jsbm; //角色编码
var org_role_gh; //选择的工号
var begin;
var end;
var dwNode;
var editoldurl; //所需修改的旧URL

//限制的案件类别
var limitAJLB = '';
$(document).ready(function () {
    //    var dwbm = $.cookie('Cyvation.Cyvation.login.dwbm');
    AddOperationLog('检察官办案统计');
    var dwbm = unitCode;
    $('#dt_ajjbxx_end').datebox('setValue', getEndDate());
    $('#dt_ajjbxx_begin').datebox('setValue', getStartDate());
    limitAJLB = frameObject.GetFunctionAjlb("/View/LDGBBA/index.htm");
    limitAJLB = limitAJLB.split(',').join('\',\'');
    //$('#btn_JCGBATJ_Search').linkbutton({ disabled: true });
    // 单位编码ComboTree初始化
    $('#dwbm_zzjg').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetDwbmTree&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#dwbm_zzjg').combotree('setValue', dwbm);
            dwNode = dwbm;
            dwChange(); //单位默认选择
            InitBMBMCombo(dwbm);
            //RegistEvent_MainRy();
            //初始化控件
            initControl();
            //注册控件事件
            RegistEvent();
            //loadAJJBXXData();
        },
        onSelect: function (node) {
            dwNode = node.id;
            dwChange();
            //RegistEvent_MainRy();
            //初始化控件
            initControl();
            //注册控件事件
            RegistEvent();
            InitBMBMCombo(node.id);
        }
    });

    //查询案件类别
    $('#cb_ajjbxx_ajlb').combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=Get_Jcgbatj_AJLB',
        editable: false,
        animate: false,
        multiple: true
    });

    //查询
    $('#btn_JCGBATJ_Search').click(function () {
            //查询按钮的查询条件以上方搜索条件为准，清除树形控件条件
            if ($("#cb_ajjbxx_ajlb").combotree('getValue')!=''||
                $("#tb_ajjbxx_cbrmc").textbox('getValue') != '' ||
                $("#tb_ajjbxx_ajmc").textbox('getValue') != '' ||
                $("#tb_ajjbxx_bmsah").textbox('getValue') != '') {
                org_role_bmbm = '';
                org_role_bmmc= '';
                org_role_jsbm= '';
                org_role_gh = '';
            }
            var root = $("#dWBmJs").tree('getRoot');
            $("#dWBmJs").tree('select', root.target);
        loadAJJBXXData();
    });
        //loadAJJBXXData();

        //导出
    $('#btnExportExcel_jcgbatj').click(function() {
        ShowProgress();
        var dwbm = $('#dwbm_zzjg').textbox('getValue');
        var cbrmc = $('#tb_ajjbxx_cbrmc').textbox('getValue');
        var ajlbbmList = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getChecked');
        var ajlbbm = '';
        for (var i = 0; i < ajlbbmList.length; i++) {
            if (i == 0) {
                ajlbbm = '(';
            }
            ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
        }
        
        begin = $('#dt_ajjbxx_begin').datebox('getValue');
        end = $('#dt_ajjbxx_end').datebox('getValue');

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        var s = $('#dg_tjbb_ajjbxx').datagrid('getChecked');  //勾选的数组
//        if (s == null || s == "") {
//            Alert("请先勾选要导入的行！");
//            CloseProgress();
//            return;
//        }
        var bmsahs = '';
        var null_bmsah = 0;
        for (var i = 0; i < s.length; i++) {
            if (s[i].bmsah != "") {
                bmsahs += s[i].bmsah + ",";
            } else {
                null_bmsah++;
            }
        }
//        CloseProgress();
//        return;
//        if (bmsahs != "")
//            bmsah += bmsahs;

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        var queryData = {
            action: 'ExportJCGBB2Excel',
            dwbm: dwbm,
            ajlbbm: ajlbbm,
            limitAJLB: limitAJLB,
            bmbm: org_role_bmbm,
            bmmc:org_role_bmmc,
            startDate: begin,
            endDate: end,
            cbrgh:org_role_gh,
            jsbm: org_role_jsbm,
            cbrmc:cbrmc,
            type: 'tj'
        };

        $.post('/Handler/JCGBB/JCGBBHandler.ashx', queryData,
            function(result) {
                CloseProgress();
                frameObject.DownFiles(result);
            });
    });
});

//初始化控件-----开始-----
function initControl() {
    //右侧人员列表初始化
    $('#dg_tjbb_ajjbxx').datagrid({
        loadMsg: '数据加载中，请稍候...',
        rownumbers: true,
        animate: true,
        fit:true,
        fitColumns: true,
        expandible: false,
        scrollbarSize: 0,
        columns: [[
            { title: '检察官', field: 'cbr', width: '23%', rowspan: 2, align: 'left' },
            {
                title: '办案量', field: 'zs', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zs > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.cbrgh + '&quot;,&quot;' + 0 + '&quot;)">' + row.zs + '</a>';
                        return x;
                    } else return row.zs;
                }
            },
            {
                title: '在办', field: 'zb', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.zb > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.cbrgh + '&quot;,&quot;' + 1 + '&quot;)">' + row.zb + '</a>';
                        return x;
                    } else return row.zb;
                }
            },
            {
                title: '已办', field: 'yb', width: 150, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.yb > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.cbrgh + '&quot;,&quot;' + 2 + '&quot;)">' + row.yb + '</a>';
                        return x;
                    } else return row.yb;
                }
            },
            {
                title: '归档', field: 'gd', width: 200, rowspan: 2, align: 'center',
                formatter: function (value, row) {
                    if (row.gd > 0) {
                        var x = '<a href="javascript:void(0)" onclick="onClickAJXX(&quot;' + row.cbrgh + '&quot;,&quot;' + 3 + '&quot;)">' + row.gd + '</a>';
                        return x;
                    } else return row.gd;
                }
            }
        ], []]
    });
    //重新设定右侧人员列表的宽度/高度
    resizeGridMainRySize();


}
//初始化控件-----结束-----

/*
*公共注册控件事件-----开始-----
*/
function RegistEvent() {
    RegistEvent_Tree();
}

//左侧单位部门树初始化及数据初始化
function dwChange() {
    $("#dWBmJs").tree({
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetDwBmJsRyByDwbm&dwbm=' + dwNode,
        method: 'post',
        lines: true,
        onLoadSuccess: function (node, data) {
            //加载成功，展开登录用户单位的子节点
            dNode = $('#dWBmJs').tree('find', '1' + dwNode); //获取顶级节点
            $('#dWBmJs').tree('select', dNode.target);
            $('#dWBmJs').tree('expand', dNode.target);
            loadAJJBXXData();
            //如果指定有需要展开的节点名称，展开该节点
            if (!isNull(sExpandNode)) {
                ExpandNodeByMc(sExpandNode);
                sExpandNode = '';
            }
        },
        onDblClick: function (node) {
            //双击树形控件的查询以树形组织机构条件为准，清除上方搜索控件条件
            var nodes = $("#cb_ajjbxx_ajlb").combotree('tree').tree('getChecked');
            for (var i = 0; i < nodes.length; i++) {
                $("#cb_ajjbxx_ajlb").combotree('tree').tree('uncheck', nodes[i].target);
            }
            //var bmNodes = $("#bmbm_zzjg").combotree('tree').tree('getChecked');
//            for (var i = 0; i < bmNodes.length; i++) {
//                $("#bmbm_zzjg").combotree('tree').tree('uncheck', bmNodes[i].target);
//            }
            $("#cb_ajjbxx_ajlb").textbox('setValue', '');
            $("#tb_ajjbxx_cbrmc").textbox('setValue', '');
            loadAJJBXXData();
        }
    });
    // 单位编码ComboTree初始化
    //    $('#winRyDw').combotree({
    //        method: 'get',
    //        lines: true,
    //        multiple: true,
    //        animate: true,
    //        cascadeCheck: true,
    //        url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetDwbmTree&dwbm=' + dwNode,
    //        onLoadSuccess: function () {
    //            $('#winRyDw').combotree('setValue', dwNode);
    //        }
    //    });
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

            org_role_bmbm = '';
            org_role_jsbm = '';
            org_role_gh = '';

            var bm = node.id;
            var mc = node.text;
            org_role_bmmc = "";
            var value = bm.indexOf("GH");
            if (value > 0) {
                //选择人员
                //$('#btn_JCGBATJ_Search').linkbutton({ disabled: false });
                org_role_gh = bm.substr(3, 4);
            }

            value = bm.indexOf("BM");
            if (value > 0) {
                org_role_bmbm = bm.substr(3, 4);
                org_role_bmmc = mc;
            }

            value = bm.indexOf("-");
            if (value > 0) {
                var list = bm.split('-');
                org_role_bmbm = list[0].substr(1, 4);
                //org_role_bmmc = mc;
                org_role_jsbm = list[1];
            }
        }
    });
}
/*
* 刷新树形控件数据
*/
function refreshTree() {
    $('#dWBmJs').tree('options').url = '/Handler/AJXX/AJXXHandler.ashx?action=GetDwBmJsRyByDwbm&dwbm=' + dwNode;
    $('#dWBmJs').tree('reload');
}
/*
* 重置人员信息的高度\宽度
*/
function resizeGridMainRySize() {
    var pRYInfoHeight = $('#pRYInfo').height();
    var h = $('#zzjgBMTool').height();
    var pRYInfoWidth = $('#panelMainRy').width();
    $('#dg_tjbb_ajjbxx').datagrid('options').width = pRYInfoWidth - 4;
    $('#dg_tjbb_ajjbxx').datagrid('options').height = pRYInfoHeight - h - 6;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
}
/*
* 重置弹出窗口选择人员信息的高度\宽度
*/
function resizeGridSelectRySize() {
    var pRYInfoHeight = $('#panelSelectRy').height();
    var pRYInfoWidth = $('#winZzjgRyInfo').window('options').width;
    var h = $('#divSelectRyTool').height();
    //$('#dg_tjbb_ajjbxx').datagrid('options').width = pRYInfoWidth;
    $('#dg_tjbb_ajjbxx').datagrid('options').height = pRYInfoHeight;
    $('#dg_tjbb_ajjbxx').datagrid('resize');
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
        children = $('#dWBmJs').tree('getChildren', rootNotes[i].tartget);
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


/*
*   加载人员grid数据
*/
function loadAJJBXXData() {

    v_dwbm = $('#dwbm_zzjg').textbox('getValue');

    var cbrmc = $('#tb_ajjbxx_cbrmc').textbox('getValue');
    var ajlbbmList = $('#cb_ajjbxx_ajlb').combotree('tree').tree('getChecked');
    v_ajlbbm = '';
    for (var i = 0; i < ajlbbmList.length; i++) {
        if (i == 0) {
            v_ajlbbm = '(';
        }
        v_ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
    }
    //var bmbm = $('#bmbm_zzjg').combotree('getValues').join('\',\'');
    //如果组织机构树中部门编码没有值则使用上方搜索栏中的值
    //org_role_bmbm = org_role_bmbm == '' ? bmbm : org_role_bmbm;

    begin = $('#dt_ajjbxx_begin').datebox('getValue');
    end = $('#dt_ajjbxx_end').datebox('getValue');
    if (v_dwbm == "") {
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
    var time = new Date();

    var queryData = { 
    action: 'Query_JCGBBTJ',
    dwbm: v_dwbm,
    bmbm: org_role_bmbm,
    jsbm: org_role_jsbm,
    gh: org_role_gh,
    ajlbbm: v_ajlbbm,
    cbrmc:cbrmc,
    startdate: begin, 
    enddate: end };
    $('#dg_tjbb_ajjbxx').datagrid("options").queryParams = queryData;
    $('#dg_tjbb_ajjbxx').datagrid("options").url = '/Handler/JCGBB/JCGBBHandler.ashx?t=' + time.getMilliseconds();
    $('#dg_tjbb_ajjbxx').datagrid("load");
    //$('#dg_tjbb_ajjbxx').datagrid({
    //    rowStyler: function (index, row) {
    //        if (row.cqts > 0) {
    //            return 'background-color:#FF0000;';
    //        }
    //    }
    //});
}

function onClickAJXX(cbrgh, ajzt, exportExcel) {
    var time = new Date();
    var sendEmail = 0;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: v_dwbm,
        cbrgh:cbrgh,
        ajzt: ajzt,
        dateStart: begin,
        dateEnd: end,
        sendEmail: sendEmail, //是否显示发送邮件按钮
        ajlb: v_ajlbbm,
        lbbmjh: v_ajlbbm,
        exportExcel: 37,
        selectedUrl: selectedUrl,
        showColumn: 7
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, '/Handler/JCGBB/JCGBBHandler.ashx?action=Query_JCGBBAJXX_Time', jsonStr, '', '');
}

function InitBMBMCombo(dwbm) {
    $('#bmbm_zzjg').combotree({
        method: 'get',
        editable: true,
        animate: false,
        multiple: true,
        url: '/Handler/common.ashx?action=GetBMBM_Combo&dwbm=' + dwbm,
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
}