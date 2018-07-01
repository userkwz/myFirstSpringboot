
$(document).ready(function () {
    var url = new UrlSearch();
    selectedbmsah = decodeURI(url.bmsah);

    AJJD();

    //添加
    $('#btnInsert_ajjbxx').linkbutton({
        onClick: function () {
            addAJLBXM();
        }
    });
    var dwbm = url.dwbm;
    $('#cb_bmbm').combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetBMBM&dwbm=' + dwbm,
        editable: false,
        animate: false,
        checkbox: true,
        cascadeCheck: true,
        onSelect: function (record) {
            var bmbm = record.id;
            $('#cb_cbr').combotree({
                disabled: false,
                url: '/Handler/ZZJG/ZZJGHandler.ashx?action=GetRyInfoByBMBM&dwbm=' + dwbm + '&bmbm=' + bmbm,
                valueField: 'GH',
                textField: 'MC',
                editable: false,
                animate: false
            });
        }
    });

    //导出
    $('#btnExport_czwt').linkbutton({
        onClick: function () {

            ShowProgress(); // 显示进度条
            var user = frameObject.GetUserInfo();
            user = eval(user);

            var jkr = user.UserName;

            var dwmc = user.UnitName;

            var selections = $('#tree_ajlb').treegrid("getSelections");
            var mc = '';
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].bm.substring(2, 4) == "00") {
                       continue;
                }
                mc += selections[i].mc + (i != selections.length - 1 ? '\r\n' : '');
            }
            var date = new Date();
            var strMonth = date.getMonth();
            strMonth = strMonth + 1;
            strMonth = strMonth == 13 ? 0 : strMonth;
            if (strMonth < 10) {
                strMonth = '0' + strMonth;
            }
            var strDay = date.getDate();
            if (strDay < 10) {
                strDay = '0' + strDay;
            }
            var startDate = date.getFullYear() + '-' + strMonth + '-' + strDay;
            $.post('/Handler/AJXX/AJXXHandler.ashx?action=ExportWTWord', {
                date: startDate,
                jkr: jkr,
                gznr: '',
                fxwt: mc,
                clyj: '',
                cljg: '',
                bz: '',
                dwmc: dwmc,
                bmmc: ''
            },
                function (result) {
                    CloseProgress(); // 如果提交成功则隐藏进度条
                    //window.location.href = result;
                    frameObject.DownFiles(result);
                });
        }
        });

    $('#btnSendEmail').linkbutton({
        onClick: function () {
            var bmsah = $('#tb_bmsah').textbox('getText');
            var nr = $('#tb_gznr').textbox('getText');
            var cbdwmc = '';
            var cbbm = $('#cb_bmbm').textbox('getText');
            frameObject.OpenDialogWeb(2,
                baseUrl + sendMailUrl +
                '?key=' + key +
                '&dwbm=' + unitCode +
                '&sendMail=4&cbdw=' + cbdwmc +
                '&bmsah=' + bmsah +
                '&cbbm=' + cbbm +
                '&nr=' + nr,
                '', '', '发送邮件', '');
        }
    });
    frameObject.ClearPicture();

});

var selectedbmsah = '';

function AJJD() {
    $('#tb_bmsah').textbox('setValue', selectedbmsah);
    $('#jdxm').window('open');

    $('#tree_ajlb').treegrid({
        //        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXM',
        //        method: 'get',
        fit: true,
        fitColumns: true,
        border: false,
        checkbox:true,
        singleSelect: false,
        rownumbers: false,
        cascadeCheck:true,
        idField: 'bm',
        treeField: 'mc',
        columns: [[
                { field: '', title: '选择', checkbox: true },
                { field: 'mc', title: '监督项目', width: 720 },
                { field: 'YJTK', title: '依据条款', width: 340 }
        ]],
        onCheck: function (row) {
            var t = $(this);
            var opts = t.treegrid("options");
            if (opts.checkOnSelect && opts.singleSelect) {
                return;
            }
            var idField = opts.idField, id = row[idField];
            $.each(t.treegrid("getChildren", id), function (i, n) {
                t.treegrid("select", n[idField]);
            });
        },
        onUncheck: function (row) {
            var t = $(this);
            var opts = t.treegrid("options");
            if (opts.checkOnSelect && opts.singleSelect) {
                return;
            }
            var idField = opts.idField, id = row[idField];
            $.each(t.treegrid("getChildren", id), function (i, n) {
                t.treegrid("unselect", n[idField]);
            });
        }
    });

    $('#tree_ajlb').treegrid("options").url = '/Handler/AJXX/AJXXHandler.ashx?action=GetLCJKXM';
    $('#tree_ajlb').treegrid("load");
    //    $('.table_jdxm tr:even').addClass('even');
    //    $('.table_jdxm tr:odd').addClass('odd');
}

//添加问题
function addAJLBXM() {
    var bmsah = $('#tb_bmsah').textbox('getValue');
    var gznr = $('#tb_gznr').textbox('getValue');
    var fxfs = $('#cb_ajjbxx_fxfs').textbox("getValue");
    var jkcs = $('#cb_ajjbxx_jkcs').combobox("getValue");
    var selections = $('#tree_ajlb').treegrid("getSelections");
    var agcbrgh = $('#cb_cbr').combobox('getValue');
    var agcbrmc = $('#cb_cbr').combobox('getText');
    var agcbrbmbm = $('#cb_bmbm').combobox('getValue');
    var bm = '';
    var mc = '';
    if (selections.length == 0) {
        alert("请选择监控项目");
        return;
    }


    for (var i = 0; i < selections.length; i++) {
        bm += "'" + selections[i].bm + "'" + (i != selections.length - 1 ? ',' : '');
        mc += selections[i].mc + (i != selections.length - 1 ? '<br>' : '');
    }

    $.post("/Handler/AJXX/AJXXHandler.ashx?action=AddAJLBXM",
        {
            bmsah: bmsah,
            fxfs: fxfs,
            bm: bm,
            mc: mc,
            gznr: gznr,
            jkcs: jkcs,
            agcbr_gh:agcbrgh,
            agcbr_mc:agcbrmc,
            agcbr_bmbm:agcbrbmbm
        },
        function (result) {
            if (result == '1') {
                //刷新数据
                $('#dg_bl').datagrid('load');
                $.messager.alert('提示信息', '保存成功！');
                $('#lcjk_aj_tt input').attr('disabled', true);
                document.getElementById('btnInsert_ajjbxx').style.display = 'none';
                document.getElementById('btnExport_czwt').style.display = 'inline-block';
                document.getElementById('btnSendEmail').style.display = 'inline-block';
                //$('#jdxm').window('close');
            } else {
                Alert(result);
            }
        });
}

function ReplaceAll(value) {
    for (var i = 0; i < 1000; i++) {
        if (value.indexOf('<br>') != -1) {
            value = value.replace('<br>', '\r\n');
        } else {
            return value;
        }
    }
    return value;
}