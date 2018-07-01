//@ sourceURL=index.js

$(document).ready(function () {

    $('#txl_lxfs').window('close');
    init();
});

function init() {
    $("#txl_dwbm").tree({
        url: '/Handler/TXL/TXLHandler.ashx?action=GetDwBm&dwbm=' + unitCode,
        method: 'post',
        lines: true,
        onLoadSuccess: function (node, data) {
            //加载成功，展开登录用户单位的子节点
            var dNode = $('#txl_dwbm').tree('find', unitCode); //获取顶级节点
            $('#txl_dwbm').tree('select', dNode.target);
            $('#txl_dwbm').tree('expand', dNode.target);
        },
        onSelect: function (node) {
            var bm = node.id;
            getTxlByBm(bm);
        }
    });
    // 置空输入项
    $('#txl_panel_gw').textbox('setValue', '');
    $('#txl_panel_mc').textbox('setValue', '');
    $('#txl_panel_xh').textbox('setValue', '');
    $('#txl_panel_gh').textbox('setValue', '');
    $('#txl_panel_sjhm').textbox('setValue', '');
    $('#txl_panel_bgdh').textbox('setValue', '');
    $('#txl_panel_dzyx').textbox('setValue', '');
    $('#txl_panel_xb').combotree({
        data: [
                { "id": 1, "text": "男" },
                { "id": 0, "text": "女" } ]
    });
    $('#txl_panel_xb').textbox('setValue', '男');
}

function getTxlByBm(bm) {
    var mc = $('#txl_mc').val();
    $('#txl_rylb').html("");
    $.ajax({
        type: "post",
        async: true,
        data: { mc: mc, dwbm: bm },
        url: "/Handler/TXL/TXLHandler.ashx?action=GetTXL",
        success: function(result) {
            var str = '';
            var data = eval('(' + result + ')');
    var user = frameObject.GetUserInfo();
            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                str += "<div class=\"grxx_tow\"><div style=\"width:100%;height:100%\" onclick=\"showTxl('"+value.xh+"','"+value.gh+"','" + value.dwmc + "','" + value.gwmc + "','" + 
                value.mc + "','" + value.sjhm + "','" + value.bgdh + "','" + value.dzyx + "','" + value.xb + "','" + value.dwbm + "','" + value.gwbm + 
                "');\"><div class=\"grxx_tow_lf\"><div class=\"tx_tow\"></div>" +
                    "<div class=\"tx_xxx_tow\">" + value.mc + "</div><div class=\"tx_nq_tow\">（" + value.gwmc + "）</div></div><div class=\"grxx_tow_rg\">" +
                    "<div class=\"grxx_dh_tow\">手机号码<span class=\"fhkw\">|</span>" + value.sjhm + "</div>" +
                    "<div class=\"grxx_dh_tow bgdh\">办公电话<span class=\"fhkw\">|</span>" + value.bgdh + "</div>" +
                    "<div class=\"grxx_dh_tow yx\"> <span class='dzyx-yx'>电子邮箱</span> <span class=\"fhkw\" style='float: left;display: inline-block'>|</span>" +  "<span class='yxtext'title='" + value.dzyx +" '>"+ value.dzyx + "</span>"+ "</div></div>" +
                    "</div>";
                if (value.gh == user.UserID) {
                    str += "<div class=\"txl_xx_gb_tow\" onclick=\"deleteTxl('"+ value.dwbm +"','"+ value.xh +"')\"></div></div>";
                } else {
                    str += "</div>";
                }

            }
            $('#txl_rylb').html(str);
        },
        error: function(data) {

        }
    });
}

function getTxl() {
    var selected = $('#txl_dwbm').tree('getSelected');
    getTxlByBm(selected.id);
}

function showTxl(xh, gh, dwmc, gwmc, mc, sjhm, bgdh, dzyx, sex,dwbm,gwbm) {
    $('#txl_panel_xh').textbox('setValue', xh);
    $('#txl_panel_dwbm').textbox('setValue', dwmc);
    $('#txl_panel_gw').textbox('setValue', gwmc);
    $('#txl_panel_mc').textbox('setValue', mc);
    $('#txl_panel_sjhm').textbox('setValue', sjhm);
    $('#txl_panel_bgdh').textbox('setValue', bgdh);
    $('#txl_panel_dzyx').textbox('setValue', dzyx);
    $('#txl_panel_xb').textbox('setValue', sex==1?'男':'女');
    document.getElementById('txl_but_add').style.display = 'none';
    var user = frameObject.GetUserInfo();
    if (user.UserID == gh) {
        document.getElementById('txl_but_update').style.display = 'block';
    // 单位编码ComboTree初始化
    $('#txl_panel_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#txl_panel_dwbm').combotree('setValue', dwbm);
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
    $('#txl_panel_gw').combotree({
        method: 'get',
        lines: true,
        valueField: 'dm',
        textField: 'mc',
        url: '/Handler/Dictionary/dictionary.ashx?action=GetDataItemListByLocal&lbbm=1002',
        onLoadSuccess: function() {
            $('#txl_panel_gw').combotree('setValue', gwbm);
        },
        onLoadError: function(data) {
            alert("Error:" + data.responseText);
        }
    });
    }
    $('#txl_lxfs').window('open');

    //$('#txl_lxfs').val(sex);
}

function showAddTxl() {
    // 单位编码ComboTree初始化
    $('#txl_panel_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        onLoadSuccess: function () {
            $('#txl_panel_dwbm').combotree('setValue', unitCode);
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
    $('#txl_panel_gw').combotree({
        method: 'get',
        lines: true,
        valueField: 'dm',
        textField: 'mc',
        url: '/Handler/Dictionary/dictionary.ashx?action=GetDataItemListByLocal&lbbm=1002',
        onLoadSuccess: function() {
        },
        onLoadError: function(data) {
            alert("Error:" + data.responseText);
        }
    });
    $('#txl_panel_gw').textbox('setValue', '');
    $('#txl_panel_mc').textbox('setValue', '');
    $('#txl_panel_sjhm').textbox('setValue', '');
    $('#txl_panel_bgdh').textbox('setValue', '');
    $('#txl_panel_dzyx').textbox('setValue', '');
    $('#txl_panel_xb').combotree({
        data: [
                { "id": 1, "text": "男" },
                { "id": 0, "text": "女" } ]
    });
    $('#txl_panel_xb').textbox('setValue', '男');
    
    document.getElementById('txl_but_add').style.display = 'block';
    document.getElementById('txl_but_update').style.display = 'none';
    $('#txl_lxfs').window('open');
}

function addTxl() {
    var dwbm = $('#txl_panel_dwbm').combotree('getValue');
    var sjhm = $('#txl_panel_sjhm').textbox('getValue');
    var bgdh = $('#txl_panel_bgdh').textbox('getValue');
    var dzyx = $('#txl_panel_dzyx').textbox('getValue');
    var gwbm = $('#txl_panel_gw').textbox('getValue');
    var mc = $('#txl_panel_mc').textbox('getValue');
    var xb = $('#txl_panel_xb').combotree('getValue');
    xb = xb == '男' ? 1 : 0;
    $.post('/Handler/TXL/TXLHandler.ashx?action=AddTXL',
    {
        dwbm: dwbm,
        sjhm: sjhm,
        bgdh: bgdh,
        dzyx: dzyx,
        gwbm: gwbm,
        mc: mc,
        xb: xb,
    },
    function (result) {
        if (result == '1') {
            Alert("添加成功！");
            init();
        } else {
            Alert("添加失败！");
        }
    });
}

function updateTxl() {
    var xh = $('#txl_panel_xh').textbox('getValue');
    var dwbm = $('#txl_panel_dwbm').combotree('getValue');
    var sjhm = $('#txl_panel_sjhm').textbox('getValue');
    var bgdh = $('#txl_panel_bgdh').textbox('getValue');
    var dzyx = $('#txl_panel_dzyx').textbox('getValue');
    var gwbm = $('#txl_panel_gw').textbox('getValue');
    var mc = $('#txl_panel_mc').textbox('getValue');
    var xb = $('#txl_panel_xb').combotree('getValue');
    xb = xb == '男' ? 1 : 0;
    $.post('/Handler/TXL/TXLHandler.ashx?action=UpdateTxl',
        {
            dwbm: dwbm,
            sjhm: sjhm,
            bgdh: bgdh,
            dzyx: dzyx,
            gwbm: gwbm,
            mc: mc,
            xb: xb,
            xh: xh
        },
        function(result) {
            if (result == '1') {
                Alert("修改成功！");
                init();
            } else {
                Alert("修改失败！");
            }
        });
}

function deleteTxl(dwbm,xh) {
        $.post('/Handler/TXL/TXLHandler.ashx?action=DeleteTxl',
        {
            dwbm: dwbm,
            xh: xh
        },
        function(result) {
            if (result == '1') {
                Alert("删除成功！");
                init();
            } else {
                Alert("删除失败！");
            }
        });
}