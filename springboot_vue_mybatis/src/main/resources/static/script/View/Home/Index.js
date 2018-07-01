//@ sourceURL=index.js
$(function () {
      /*  暂时不做
      if (frameObject != null || frameObject != undefined) {
            frameObject.ClearPicture();
        }*/
        //setFunction();
        $("#userName").html("" + userInfo.name);
         $("#userRole").html("" + userInfo.BMMC);
        getHZTJ();
        getMarquee();
        //initList();
});

function getHZTJ() {
    $.ajax({
        type: "post",
        async: true,
        url: getRootPath()+"/PZHandler/GetRysjx",
        success: function (data) {
            var result = data.data.sjx;
            var sl = data.data.sl[0];
            if (result != null ) {
                var html = "";
                for (var i = 0; i < result.length; i++) {
                    var t = result[i];
                    var sjxName = t.SJLM.toUpperCase();
                    html += "<div class=\"item\" style=\"cursor: pointer;\" onclick=\"onClickAJXX(" + parseInt(t.FCBH) +
                        "," + parseInt(t.FCLBH) + "," + parseInt(t.FCDCBH) + "," + parseInt(t.FCFSYJBH) + ",'" + t.FCURL +
                        "','" + t.SJXMC + "')\"><div class=\"item_img\">" +
                        "<img src='"+t.TPLJ+"' alt=\"\" width=\"88\" height=\"88\"></div><div class=\"item_info\">" +
                        "<p class=\"title\">"+t.SJXMC+"</p>" +
                        "<p class=\"amount\">" + (sl[sjxName] != 0 ? ("<a style=\"text-decoration: none;\">" + sl[sjxName] + "</a>") : sl[sjxName]) +
                        "</p></div></div>";
                }
                $("#ulHome").html(html);
            }
        }
    });
}
/*function getHZTJ() {
    $.ajax({
        type: "post",
        async: true,
        url: getRootPath()+"/PZHandler/GetRysjx",
        success: function (data) {
            data = eval('(' + data + ')');

            if (data != null && data.tree != null && data.data != null) {
                data.tree = eval('(' + data.tree + ')');
                data.data = eval('(' + data.data + ')');
                var html = "";
                for (var i = 0; i < data.tree.length; i++) {
                    var t = data.tree[i];
                    html += "<div class=\"item\" style=\"cursor: pointer;\" onclick=\"onClickAJXX(" + parseInt(t.fcbh) +
                        "," + parseInt(t.fclbh) + "," + parseInt(t.fcdcbh) + "," + parseInt(t.fcfsyjbh) + ",'" + t.fcurl +
                        "','" + t.sjxmc + "')\"><div class=\"item_img\">" +
                        "<img src='"+t.tplj+"' alt=\"\" width=\"88\" height=\"88\"></div><div class=\"item_info\">" +
                        "<p class=\"title\">"+t.sjxmc+"</p>" +
                        "<p class=\"amount\">" + (data.data[0][t.sjlm] != 0 ? ("<a style=\"text-decoration: none;\">" + data.data[0][t.sjlm] + "</a>") : data.data[0][t.sjlm]) +
                        "</p></div></div>";



//                    html += "<li><div class=\"icon_tab\" style=\"background: url('" + t.tplj +
//                        "') no-repeat 50%, url('../../images/sye_06.png') no-repeat 100% 50%;\"></div><div class=\"num\" onclick=\"onClickAJXX(" + parseInt(t.fcbh) +
//                        "," + parseInt(t.fclbh) + "," + parseInt(t.fcdcbh) + "," + parseInt(t.fcfsyjbh) + ",'" + t.fcurl +
//                        "','" + t.sjxmc + "')\"><p id=\"pan_agslmc\">" + t.sjxmc + "</p><span title=\"\">" +
//                        (data.data[0][t.sjlm] != 0 ? ("<a style=\"text-decoration: none;\">" + data.data[0][t.sjlm] + "</a>") : data.data[0][t.sjlm]) +
//                        "</span></div></li>";
                }
                $("#ulHome").html(html);
            }
        }
    });
}*/
//获取通知公告
function getMarquee() {
    $.ajax({
        type: "post",
        async: true,
        url: getRootPath()+"/SCXD/GetUnitMsg1",
        success: function (data) {
            var xxList = data.data.xxList;
            if (xxList == null || xxList.length == 0) return;
            var content = '';
            for (var i = 0; i < xxList.length; i++) {
                var value = xxList[i];
                value.FSRQ= formatDate(value.FSRQ,"yyyy-MM-dd")
                value.XXNR = value.XXNR.replace("\n","")
                content += "<li id=\"" + value.XXXH + "\" onclick=\"onClickTZXX('" + value.XXNR + "<br>','" + value.FSRQ + "','" + value.XXBT + "')\"\>" +
                    "<span class=\"message fl\" >" + value.XXBT + "</span><span class=\"date fr\">" + value.FSRQ + "</span></li>";
            }
            $("#home_msg").html(content);
        },
        error: function (data) {

        }
    });
}

function onClickAJXX(index, showColumn, exportExcel, sendEmail, handlerUrl, title) {
    var time = new Date();
    if (userInfo != null || userInfo != undefined) {
        var dwbm = userInfo.DWBM;
         queryData = {
            t: time.getMilliseconds(),
            bmsah: '',
            ajmc: '',
            dwbm: dwbm,
            bmbm: '',
            type: index,
            cbr: '',
            sjtype: "2",
            dateStart: index == 5 || index == 8 ? '' : (time.getFullYear() + '-01-01'),
            dateEnd: index == 5 || index == 8 ? '' : getEndDate(),
            bjrqStart: '',
            bjrqEnd: '',
            wcrqStart: '',
            wcrqEnd: '',
            sendEmail: sendEmail, //是否显示发送邮件按钮
            showColumn: showColumn,
            exportExcel: exportExcel,
            selectedUrl: selectedUrl
        };
        var jsonStr = JSON.stringify(queryData);
        var url = caseListUrl;
        //if (index == 5 || index == 1) {
        //    url = caseListUrl1;
        //}
        init_window(0, url, handlerUrl, jsonStr, ' | ' + title, '',dwbm)
        $("#win_list").window('open')
    }
}

function onClickTZXX(value, sj, nrbt) {
    $("#tzxx_win_tzsj").textbox({
        
        multiline: true,
        fit:true
    })
    $("#tzxx_win").window('open');
    //$("#tzxx_win_tzsj").text(value);
    $("#tzxx_win_xxnr").html(value);
    $("#tzxx_win_tzsj").textbox('setText', value);
    $("#tzxx_win_sj").text(sj);
    $("#tzxx_win_bt").text(nrbt);
}

//快捷入口
function setFunction() {
    var data = eval(frameObject.GetUserFunctions());
    var content = '';
    var fun = data.length > 0 ? data[0] : [];
    if (fun.Number != 1) {
        return;
    }
    for (var i = 1; i < data.length; i++) {
        var value = data[i];
        //if (value.Caption == "今日简讯") continue;
        if (fun.Id == value.ParentId) {
            if (value.Url == "") {
                for (var j = 0; j < data.length; j++) {

                    var child = data[j];
                    if (child.ParentId == value.Id) {
                        content += "<div class=\"item\" style=\"cursor: pointer;\" onClick=\"opOnClick('" + child.Caption + "','" + child.Url + "','" + child.InitParam + "','" + child.BaseUrl + "')\">" +
                            "<div class=\"item_img\">" +
                            "<img src=\"../.." + child.IconPath + "\" alt=\"\" width=\"62\" height=\"62\"></div>" +
                            "<div class=\"item_info\">" +
                            "<span class=\"type\">" + child.Caption + "</span></div></div>";
                       
                        break;
                    }
                }
            } else {
                content += "<div class=\"item\" style=\"cursor: pointer;\" onClick=\"opOnClick('" + value.Caption + "','" + value.Url + "','" + value.InitParam + "','" + value.BaseUrl + "')\">" +
                            "<div class=\"item_img\">" +
                            "<img src=\"../.." + value.IconPath + "\" alt=\"\" width=\"62\" height=\"62\"></div>" +
                            "<div class=\"item_info\">" +
                            "<span class=\"type\">" + value.Caption + "</span></div></div>";
            }
        }
    }

    $('#tab_home_kjrk').append(content);
}

function initList() {

    $('#gridSJXList').datagrid({
        width: 720,
        striped: true,
        singleSelect: false,
        loadMsg: '数据加载中，请稍候...',
        pagination: false,
        rownumbers: true,
        checkOnSelect: false,
        dragSelection: false,
        fitColumns: true,
        idField: 'sjxbm',
        //treeField: 'gnmc',
        toolbar: $('#divSJXTool'),
        columns: [[
            { field: 'ck', width: 50, checkbox: true },
            { field: 'sjxmc', title: '数据项名称', width: 150 },
            //{
            //    field: 'PX', title: '排序', width: 150,
            //    formatter: function (value, row, index) {
            //        var result = parseInt(value) + 1;
            //        return result;
            //    }
            //},
                        {
                            field: 'action', title: '排序操作', width: 160, align: 'center',
                            formatter: function (value, row, index) {
                                var r = '<a href="javascript:void(0)" onclick="moveupRow(' + index + ')">向上</a> ';
                                r += '<a href="javascript:void(0)" onclick="movedownRow(' + index + ')">向下</a> ';
                                return r;
                            }
                        }
        ]],
        onLoadSuccess: function (data) {
            $(this).datagrid('enableDnd');
            var rowDatas = $('#gridSJXList').datagrid('getRows');
            for (i = 0; i < rowDatas.length; i++) {
                if (rowDatas[i].checked != "0") {
                    $('#gridSJXList').datagrid('checkRow', i);
                }
                else {
                    $('#gridSJXList').datagrid('uncheckRow', i);
                }
            }
        },
        onDrop: function (targetRow, sourceRow, point) {
            console.log(targetRow + "," + sourceRow + "," + point);
        }
    });

}


function openWin() {
    $('#winSJX').window('open');
    $('#gridSJXList').datagrid({
        url: '/Handler/PZ/PZHandler.ashx?action=GetRysjxfp'
    });
}

function openHelp() {
    frameObject.OpenDialogWeb(3, baseUrl + '/help.htm?p=1', '', '', '帮助', '');

}

function updateSJXfp() {
    var sjxjh = '';
    var pxjh = '';
    var data = $('#gridSJXList').datagrid('getChecked');
    if (data.length > 8) {
        Alert('选择显示的项请勿超过8个！');
        return;
    }
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            sjxjh += data[i].sjxbm;
            pxjh += parseInt($('#gridSJXList').datagrid('getRowIndex', data[i].sjxbm));
        } else {
            sjxjh += ',' + data[i].sjxbm;
            pxjh += ',' + parseInt($('#gridSJXList').datagrid('getRowIndex', data[i].sjxbm));
        }
    }
    //$('#btnRYQXAdd').linkbutton('disable');
    $.post("/Handler/PZ/PZHandler.ashx",
        { action: "UpdateRysjxfp", sjxjh: sjxjh, pxjh: pxjh },
        function (result) {
            if (result == "1") {
                //Alert("分配角色功能成功！");
                AlertAndDo('配置成功！', function () { opOnClick("首页", selectedUrl, "home"); });
                //$('#btnRYQXAdd').linkbutton('enable');
                //$('#winSJX').window('close');

            } else {
                //$('#btnRYQXAdd').linkbutton('enable');
                Alert("配置失败！");
            }
        });
}

/** 
 * 向上移动一行 
 *  
 * @param row 
 */
function moveupRow(index) {
    var datagrid = $('#gridSJXList');
    var row = datagrid.datagrid('getData').rows[index];
    if (isFirstRow(row)) {
        warn("已经是第一条！");
        return;
    }
    datagrid.datagrid("deleteRow", index);
    datagrid.datagrid("insertRow", {
        index: index - 1, // 索引从0开始  
        row: row
    });
    if (row.CHECKED != "0") {
        $('#gridSJXList').datagrid('checkRow', index - 1);
    }
    else {
        $('#gridSJXList').datagrid('uncheckRow', index - 1);
    }
    datagrid.datagrid("selectRow", index - 1);
}
/** 
 * 向下移动一行 
 *  
 * @param row 
 */
function movedownRow(index) {
    var datagrid = $('#gridSJXList');
    var row = datagrid.datagrid('getData').rows[index];
    if (isLastRow(row)) {
        warn("已经是最后一条！");
        return;
    }
    datagrid.datagrid("deleteRow", index);
    datagrid.datagrid("insertRow", {
        index: index + 1, // 索引从0开始  
        row: row
    });
    if (row.CHECKED != "0") {
        $('#gridSJXList').datagrid('checkRow', index + 1);
    }
    else {
        $('#gridSJXList').datagrid('uncheckRow', index + 1);
    }
    datagrid.datagrid("selectRow", index + 1);

}
/** 
 * 是否是第一条数据 
 *  
 * @param row 
 * @returns {Boolean} 
 */
function isFirstRow(row) {
    var index = $('#gridSJXList').datagrid("getRowIndex", row);
    if (index == 0) {
        return true;
    }
    return false;
}
/** 
 * 是否是最后一条数据 
 *  
 * @param row 
 * @returns {Boolean} 
 */
function isLastRow(row) {
    var rowNum = $('#gridSJXList').datagrid("getRows").length;
    var index = $('#gridSJXList').datagrid("getRowIndex", row);
    if (index == (rowNum - 1)) {
        return true;
    }
    return false;
}

function init_window(type,url, handlerUrl, jsonStr,title,programUrl,dwbm) {

  /*  $.ajax({
        url:getRootPath()+handlerUrl
    })*/
    $("#win_list").window({
        title:"案件列表"+title,
        //href:caseListUrl

    })
    $.ajax({
        url: getRootPath()+"/PZHandler/test",
        type:'get',
        data:{"action":jsonStr},
        dataType:'json',
        contentType:'application/json;charset=utf-8',
        cache: false,
        success: function (html) {
            var base = new Base64();
            var queryData = base.encode(jsonStr)
            var handlUrl = base.encode(handlerUrl)
            var key = "eyd1aWQnOicwMDAzJywnZHdibSc6JzM3MDAwMCcsJ3RpbWVzcGFuJzonMjAx ODA2MjAxNTM5NTMnfQ=="
            var urlHtml = '<iframe width="100%" height="100%" frameborder="0" src='+caseListUrl+"?query="+queryData+"&ashx="+handlUrl+"&key="+key+"&dwbm="+dwbm+'></iframe>'
            $("#win_list").html(urlHtml)
        }

    });


//ajax地址传参数，获取页面信息
}