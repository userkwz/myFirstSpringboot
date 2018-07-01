
$(document).ready(function () {
    //加载承办单位
    $('#CommonRightEdit_cbdwcondition').combotree({
        url: '/Handler/Authority/SearchCondition.ashx?action=GetCBDW'
    });

    //加载承办部门
    $('#CommonRightEdit_cbbmcondition').combotree('reload', '/Handler/Authority/SearchCondition.ashx?action=GetCBBM');
    //加载承办人
    $('#CommonRightEdit_cbr').combotree('reload', '/Handler/Authority/SearchCondition.ashx?action=GetCBR');
});

//保存配置
function CommonRightEdit_save() {
    //获取单位
    var dwjson = "";
    var dwbms = $('#CommonRightEdit_cbdwcondition').combotree("tree").tree('getChecked');
    //查询所有子节点
    var dwchildrenNodes = getAllLeafNode(dwbms, "CommonRightEdit_cbdwcondition");
    var dwnodes = dwchildrenNodes;
    for (var i = 0; i < dwchildrenNodes.length; i++) {
        dwnodes = addParentNode(dwchildrenNodes[i], "CommonRightEdit_cbdwcondition", dwnodes);
    }
    dwjson = JSON.stringify(exchangeObject(dwnodes));
    //获取根节点
    var dwRootNode = $('#CommonRightEdit_cbdwcondition').combotree("tree").tree('getRoots');

    //获取部门
    var bmjson = "";
    var bmbms = $('#CommonRightEdit_cbbmcondition').combotree("tree").tree('getChecked');
    //查询所有子节点
    var bmchildrenNodes = getAllLeafNode(bmbms, "CommonRightEdit_cbbmcondition");
    var bmnodes = bmchildrenNodes;
    for (var i = 0; i < bmchildrenNodes.length; i++) {
        bmnodes = addParentNode(bmchildrenNodes[i], "CommonRightEdit_cbbmcondition", bmnodes);
    }
    bmjson = JSON.stringify(exchangeObject(bmnodes));
    //获取根节点
    var bmRootNode = $('#CommonRightEdit_cbbmcondition').combotree("tree").tree('getRoots');

    //获取人员
    var ryjson = "";
    var rybms = $('#CommonRightEdit_cbr').combotree("tree").tree('getChecked');
    //查找所有子节点
    var rychildrenNodes = getAllLeafNode(rybms, "CommonRightEdit_cbr");
    var rynodes = rychildrenNodes;
    for (var i = 0; i < rychildrenNodes.length; i++) {
        rynodes = addParentNode(rychildrenNodes[i], "CommonRightEdit_cbr", rynodes);
    }
    ryjson = JSON.stringify(exchangeObject(rynodes));
    //获取根节点
    var ryRootNode = $('#CommonRightEdit_cbr').combotree("tree").tree('getRoots');

    //获取编辑器类型
    var editType = $('#org_editType').val();
    if (editType == '1') {
        //获取功能编码
        var gnbm = $('#org_gn_bm').val();
        //获取部门编码
        var bmbm = $('#org_bmbm').val();
        //获取角色编码
        var jsbm = $('#org_jsbm').val();

        $.ajax({
            async: false,
            type: "POST",
            url: "/Handler/Authority/AuthorityHandler.ashx",
            data: { action: 'SaveJSRight', gnbm: gnbm, bmbm: bmbm,jsbm:jsbm, dwjson: dwjson, dwroot: dwRootNode[0].id,
                bmjson: bmjson, bmroot: bmRootNode[0].id, ryjson: ryjson, ryroot: ryRootNode[0].id
            },
            success: function (data) {
                if (data == -1) {
                    Alert("保存失败");
                    return;
                } else {
                    Alert("保存成功");
                }
            },
            error: function (data) {
                MaskUtil.unmask();
                Alert("系统有误，请联系管理员！" + data.responseText);
            }
        });
    } else if (editType == '2') {
        //获取功能编码
        var gnbm = $('#org_gn_bm').val();
        //获取工号
        var gh = $("#org_ry_gh").val();

        $.ajax({
            async: false,
            type: "POST",
            url: "/Handler/Authority/AuthorityHandler.ashx",
            data: { action: 'SaveRight', gnbm: gnbm, gh: gh, dwjson: dwjson, dwroot: dwRootNode[0].id,
                bmjson: bmjson, bmroot: bmRootNode[0].id, ryjson: ryjson, ryroot: ryRootNode[0].id
            },
            success: function (data) {
                if (data == -1) {
                    Alert("保存失败");
                    return;
                } else {
                    Alert("保存成功");
                }
            },
            error: function (data) {
                MaskUtil.unmask();
                Alert("系统有误，请联系管理员！" + data.responseText);
            }
        });
    } else {
        Alert("编辑权限发生错误");
        return;
    }
}



//获取所有的叶子节点
//nodes:选中的节点
function getAllLeafNode(nodes, comboxTreeId) {
    var leafNodes = new Array();
    var j = 0;
    for (var i = 0; i < nodes.length; i++) {
        var chirldNode = $("#" + comboxTreeId).combotree("tree").tree('getChildren', nodes[i].target);
        if (chirldNode == null || chirldNode == "" || chirldNode == undefined) {
            //该节点为子节点
            leafNodes[j] = nodes[i];
            j++;
        }
    }
    return leafNodes;
}

//添加子节点的所有父节点
//node:要操作的节点
//nodes:已经添加的节点容器
function addParentNode(node, comboxTreeId, nodes) {
    //判断是否还有父节点
    var pNode = $("#" + comboxTreeId).combotree("tree").tree('getParent', node.target);
    if (pNode == null || pNode == "" || pNode == undefined) {
        return nodes;
    } else {
        //判断该节点在节点容器中是否已经存在
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == pNode.id)
                return nodes; //如果已经存在则退出
        }
        if (i == nodes.length) {
            //如果没有找到，那么将该节点加入到节点容器中
            nodes[nodes.length] = pNode;
            //再向上递归父节点
            return addParentNode(pNode, comboxTreeId, nodes);
        }
    }
}

//将节点转化成id、text、pid的对象列表
function exchangeObject(nodes) {
    var list = new Array();
    for (var i = 0; i < nodes.length; i++) {
        var obj = new Object();
        obj.id = nodes[i].id;
        obj.text = nodes[i].text;
        obj.pid = nodes[i].pid;
        list[i] = obj;
    }
    return list;
}
