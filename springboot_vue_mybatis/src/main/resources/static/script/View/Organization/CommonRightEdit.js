//@ sourceURL=CommonRightEdit.js
var gnbm;
var type;
var bmbm;
var jsbm;
var gh;
$(document).ready(function () {
    //if (CheckBrowser()) {
    //var url = new UrlSearch();
    //var gnbm = url.gnbm;
    gnbm = $('#org_gn_bm').val();
    type = $('#org_editType').val(); //表示对角色进行授权
    bmbm = $('#org_bmbm').val();
    jsbm = $('#org_jsbm').val();
    gh = $('#org_ry_gh').val();
    $('#win_org_gnryqx').window('open');
    //查询案件类别
    //$('#cb_right_ajlb').treegrid({
    //    method: 'post',
    //    url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
    //    editable: false,
    //    animate: false,
    //    multiple: true, loadMsg: '数据加载中，请稍候...',
    //    rownumbers: true,
    //    fitColumns: true,
    //    collapsible: true,
    //    columns: [[
    //           {
    //               title: '案件类别名称', field: 'ajlb_mc', width: 150, align: 'center'
    //           }]],
    //    //onLoadSuccess: function () {
    //    //    $.ajax({
    //    //        type: "post",
    //    //        url: "/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnsq",
    //    //        data: { dwbm: unitCode, type: type, typebm: type == 0 ? gh : jsbm, bmbm: bmbm, gnbm: gnbm },
    //    //        dataType: "json",
    //    //        success: function (data) {
    //    //            if (data.length > 0) {
    //    //                $('#cb_right_ajlb').combotree('setValues', data[0].ajlb);
    //    //            }
    //    //        },
    //    //    });
    //    //}
    //});

    $('#cb_right_ajlb').tree({
        idField: 'id',
        treeField: 'text',
        multiple: true,
        checkbox:true,
        width: 850,
        height: 200,
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        loadMsg: '数据加载中，请稍候...',
        columns: [
            [
            //{
            //    field: 'ck', width: 50, checkbox: false
            //},
                {
                    field: 'text', title: '案件类别名称',formatter: function(node) {
                        var s = '<font color="red" size="10">' + node.text + '</font>';
                        if (node.children) {
                            s += '&nbsp;<span style=\'color:blue\'>(' + node.children.length + ')</span>';
                        }
                        return s;
                    }
                }
            ]
        ],
        onLoadSuccess: function () {
                $.ajax({
                    type: "post",
                    url: "/Handler/ZZJG/ZZJGHandler.ashx?action=GetGnsq",
                    data: { dwbm: unitCode, type: type, typebm: type == 0 ? gh : jsbm, bmbm: bmbm, gnbm: gnbm },
                    dataType: "json",
                    success: function (data) {
                        var ajlbList = data[0].ajlb.split(',');
                        for (var i = 0; i < ajlbList.length; i++) {
                            var node = $('#cb_right_ajlb').tree('find', ajlbList[i]);
                            $('#cb_right_ajlb').tree('check', node.target);
                        }
                    },
                });
        },
        onSelect: function (node) {
            if (node.checked)
                $('#cb_right_ajlb').tree('uncheck', node.target);
            else
                $('#cb_right_ajlb').tree('check', node.target);
        }
    });
    //}
});


function addgnsq() {
    var lbbmjh = '';
    var ajlbbmList = $('#cb_right_ajlb').tree('getChecked');
    for (var i = 0; i < ajlbbmList.length; i++) {
        lbbmjh += ajlbbmList[i].id + (i != ajlbbmList.length - 1 ? ',' : '');
    }

    $.post('/Handler/ZZJG/ZZJGHandler.ashx?action=AddGnsq',
        {
            dwbm: unitCode,
            type: type, typebm: type == 0 ? gh : jsbm,
            bmbm: bmbm,
            gnbm: gnbm,
            ajlb: lbbmjh
        },
        function (result) {
            if (result == '1') {
                Alert("授权成功！");
                $('#win_org_gnryqx').window('close');
            } else {
                Alert("授权失败！");
            }
        });
}
function selectone(){
    var roots = $('#cb_right_ajlb').tree('getRoots');
       for ( var i = 0; i < roots.length; i++) {  
            var node = $('#cb_right_ajlb').tree('find', roots[i].id);
            $('#cb_right_ajlb').tree('check', node.target);
        }  
}
function show(checkid) {
    var s = '#check_' + checkid;
    //alert( $(s).attr("id"));
    // alert($(s)[0].checked);
    /*选子节点*/
    var nodes = $("#cb_right_ajlb").treegrid("getChildren", checkid);
    for (i = 0; i < nodes.length; i++) {
        $(('#check_' + nodes[i].ID))[0].checked = $(s)[0].checked;

    }
    //选上级节点
    if (!$(s)[0].checked) {
        var parent = $("#cb_right_ajlb").treegrid("getParent", checkid);
        $(('#check_' + parent.ID))[0].checked = false;
        while (parent) {
            parent = $("#cb_right_ajlb").treegrid("getParent", parent.ID);
            $(('#check_' + parent.ID))[0].checked = false;
        }
    } else {
        var parent = $("#cb_right_ajlb").treegrid("getParent", checkid);
        var flag = true;
        var sons = parent.sondata.split(',');
        for (j = 0; j < sons.length; j++) {
            if (!$(('#check_' + sons[j]))[0].checked) {
                flag = false;
                break;
            }
        }
        if (flag)
            $(('#check_' + parent.ID))[0].checked = true;
        while (flag) {
            parent = $("#cb_right_ajlb").treegrid("getParent", parent.ID);
            if (parent) {
                sons = parent.sondata.split(',');
                for (j = 0; j < sons.length; j++) {
                    if (!$(('#check_' + sons[j]))[0].checked) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag)
                $(('#check_' + parent.ID))[0].checked = true;
        }
    }
}