var rqlx = "4";
var rqtext = "本年";
var startdate = "";
var enddate = "";
var dqdwbm = "";
var procName = "";
var type = "";
var sjtype = "2";
var ywmc = "";
var ajlbmc = "";
var childType = ""; 
$(document).ready(function () {
    $('#tyywModal_zzs1').window('close');
    $('#tyywModal_zzs2').window('close');
    $('#tyywModal_zzs3').window('close');
    $('#tyywModal_zzs4').window('close');
    AddOperationLog('统一业务助手');
    $('.ajsl_date li').click(function () {
        $('.ajsl_date .date_fl_click').removeClass("date_fl_click");
        $(this).addClass("date_fl_click");
        rqlx = $(this).val();
        startdate = "";
        enddate = "";
        $("#txtStartDate").datebox('setValue','');
        $("#txtEndDate").datebox('setValue','');
        $(".dzjz_zzaj").find('li').eq(0).find('p').eq(0).text($(this).attr("changeAtrr") + "受理案件数");
        //        $(".dzjz_zzaj").find('li').eq(1).find('p').eq(0).text($(this).attr("changeAtrr") + "转结案件数");
        $(".dzjz_zzaj").find('li').eq(2).find('p').eq(0).text($(this).attr("changeAtrr") + "审结案件数");
        $(".dzjz_zzaj").find('li').eq(3).find('p').eq(0).text($(this).attr("changeAtrr") + "未结案件数");
        zx(2);
    });
    var url = new UrlSearch();
    dqdwbm = url.dwbm;
    var map = "../Map/Index.html?dwbm=" + dqdwbm + "&child=1&key=" + url.key;
    //    var map = "../Map/Index1.html?zoom=7&fdwbm=420000&dwbm=420000&child=1"; //湖北省院
    //var map = "../View/Map/Index.html?zoom=9&fdwbm=420000&dwbm=420100"; //武汉市院
    //var map = "../View/Map/Index.html?zoom=10&fdwbm=420100&dwbm=420102"; //江岸区院
    document.getElementById("iframe_tyyw").src = map;
    zx();
    
    // 单位编码ComboTree初始化
    $('#cb_ajjbxx_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + url.dwbm,
        onLoadSuccess: function () {
            $('#cb_ajjbxx_dwbm').combotree('setValue', dqdwbm);
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#ckbDWBM').attr("checked", false);
                $("#ckbDWBM").attr("disabled", "disabled");
            } else {
                $('#ckbDWBM').attr("checked", true);
                $("#ckbDWBM").removeAttr("disabled");
            }
            dqdwbm = node.id;
            //zx(2);
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
    var ckbDwbm = document.getElementById('ckbDWBM');
    ckbDwbm.onclick = function () {
        sjtype = this.checked ? 2 : 1;
    }

    $("#btnSearch").click(function () {
        try {
            startdate = $("#txtStartDate").datebox('getValue');
            enddate = $("#txtEndDate").datebox('getValue');
            if (startdate != "" || enddate != "") {
                if (startdate == "" || enddate == "") {
                    alert("请选择时间范围！");
                    return;
                }
                $(".date_fl_click").removeClass("date_fl_click");
                rqlx = "";
                rqtext = "";
                $(".dzjz_zzaj").find('li').eq(0).find('p').eq(0).text("受理案件数");
                $(".dzjz_zzaj").find('li').eq(1).find('p').eq(0).text("往年转结案件数");
                $(".dzjz_zzaj").find('li').eq(2).find('p').eq(0).text("审结案件数");
                $(".dzjz_zzaj").find('li').eq(3).find('p').eq(0).text("未结案件数");
            }
            zx(2);
        } catch (e) {
            console.log(e);
        }
    });
    //查询
    $('#btnSearch_ajxx').bind('click', function () {
        reload();
    });
    $("#btnYWFX").click(function () {
        var url = new UrlSearch();
        window.location.href = window.location.origin + "/View/TJ/TYYWLYST.htm?key=" + url.key + "&dwbm=" + url.dwbm + "&clickdwbm=" + (dqdwbm == '420000' ? '420100' : dqdwbm) + "&showType=" + (dqdwbm == '420000' ? 1 : 2);
        //        frameObject.ChangeUrl(window.location.origin + "/View/TJ/TYYWLYST.htm?key=" + url.key + "&dwbm=" + dqdwbm);
    });

    $("#btnSearch_ajlb").click(function () {
        try {
            startdate = $("#dt_ajlb_begin").datebox('getValue');
            enddate = $("#dt_ajlb_end").datebox('getValue');
            if (startdate != "" || enddate != "") {
                if (startdate == "" || enddate == "") {
                    alert("请选择时间范围！");
                    return;
                }

                var ajlbbmList = $('#cb_ajlb_ajlb').combotree('tree').tree('getChecked');
                var ajlbbm = '';
                for (var i = 0; i < ajlbbmList.length; i++) {
                    if (i == 0) {
                        ajlbbm = '(';
                    }
                    ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
                }


                var ysayList = $('#cb_ajlb_ysay').combotree('tree').tree('getChecked');
                var ysay = '';
                for (var i = 0; i < ysayList.length; i++) {
                    if (i == 0) {
                        ysay = '(';
                    }
                    ysay += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
                }

                var queryData = { dwbm: dqdwbm, ywbm: '', rqlx: rqlx, sjtype: sjtype, startdate: startdate, enddate: enddate, ajlbbm: ajlbbm, ysay: ysay };
                $('#xiaoer_tyyw_zzs1').treegrid({
                    queryParams: queryData,
                    url: '/Handler/TYYW/TYYWHandler.ashx?action=GetAJLBTJ1'
                });
            }
        } catch (e) {
            console.log(e);
        }
    });
});

function reload() {
    var bmsah = $("#txt_case_bmsah").val();
    var ajmc = $("#txt_case_ajmc").val();
    var queryData = { action: procName, dwbm: dqdwbm, ywmc: ywmc, type: type, childType: childType, ajlbmc: ajlbmc, bmsah: bmsah, ajmc: ajmc, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype };
    $('#dg_ybaj').datagrid({
        queryParams: queryData,
        url: '/Handler/TYYW/TYYWHandler.ashx',
        loadMsg: '数据加载中，请稍候...'
    });
}

function zx(t) {

    if (t != 1) {
        ShowProgress(); // 显示进度条
    }

    //表格
    //sjtype = $('#cbType').combobox('getValue', '');

    sjtype = document.getElementById('ckbDWBM').checked ? "2" : "1";
    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetAJTJ",
        success: function (result) {
            var data = result == "[]" ? null : eval(result);
            var wsjajsl = data != null ? (data[0].slajsl - data[0].sjajsl) : 0;
            if (data != null && data[0].slajsl != 0) {
                $("#div_a1").html("<a class='quantity' onclick=\"getIndexAJXX(1,0,true, 17)\" href='javascript:void(0)'>" + data[0].slajsl + "</a>");
            } else {
                $("#div_a1").html("<a class='quantity'>" + 0 + "</a>");
            }
            if (data != null && data[0].fpajsl != 0) {
                $("#div_a2").html("<a class='quantity' onclick=\"getIndexAJXX(2,0,false, 4)\" href='javascript:void(0)'>" + data[0].fpajsl + "</a>");
            } else {
                $("#div_a2").html("<a class='quantity'>" + 0 + "</a>");
            }
            if (data != null && data[0].sjajsl != 0) {
                $("#div_a3").html("<a class='quantity' onclick=\"getIndexAJXX(3,1,true, 18)\" href='javascript:void(0)'>" + data[0].sjajsl + "</a>");
            } else {
                $("#div_a3").html("<a class='quantity'>" + 0 + "</a>");
            }
            if (wsjajsl == 0) {
                //$("#div_a4").html("<a class='quantity'>" + data[0].wsjajsl + "</a>");
                $("#div_a4").html("<a class='quantity'>" + wsjajsl + "</a>");
            } else {
                $("#div_a4").html("<a class='quantity' onclick=\"getIndexAJXX(4,0,false, 19)\" href='javascript:void(0)'>" + data[0].wsjajsl + "</a>");
                //$("#div_a4").html("<a class='quantity' onclick=\"getIndexAJXX(4)\" href='javascript:void(0)'>" + wsjajsl + "</a>");
            }
            if (data == null) {
                data = [];
                data.push({ slajtb: 0, slajhb: 0, fpajtb: 0, fpajhb: 0, sjajtb: 0, sjajhb: 0, wsjajtb: 0, wsjajhb: 0, agsl: 0, kgsl: 0, sssl: 0, zjsl: 0, qtsl: 0 });
            }
            if (data[0].slajtb == 0) {
                data[0].slajtb = "0";
                data[0].sltbcolor = "color:black;";
            } else if (data[0].slajtb > 0) {
                data[0].sltbcolor = "color:red;";
            } else {
                data[0].sltbcolor = "color:green;";
            }
            if (data[0].slajhb == 0) {
                data[0].slajhb = "0";
                data[0].slhbcolor = "color:black;";
            } else if (data[0].slajhb > 0) {
                data[0].slhbcolor = "color:red;";
            } else {
                data[0].slhbcolor = "color:green;";
            }
            if (data[0].fpajtb == 0) {
                data[0].fpajtb = "0";
                data[0].fptbcolor = "color:black;";
            } else if (data[0].fpajtb > 0) {
                data[0].fptbcolor = "color:red;";
            } else {
                data[0].fptbcolor = "color:green;";
            }
            if (data[0].fpajhb == 0) {
                data[0].fpajhb = "0";
                data[0].fphbcolor = "color:black;";
            } else if (data[0].fpajhb > 0) {
                data[0].fphbcolor = "color:red;";
            } else {
                data[0].fphbcolor = "color:green;";
            }
            if (data[0].sjajtb == 0) {
                data[0].sjajtb = "0";
                data[0].sjtbcolor = "color:black;";
            } else if (data[0].sjajtb > 0) {
                data[0].sjtbcolor = "color:red;";
            } else {
                data[0].sjtbcolor = "color:green;";
            }
            if (data[0].sjajhb == 0) {
                data[0].sjajhb = "0";
                data[0].sjhbcolor = "color:black;";
            } else if (data[0].sjajhb > 0) {
                data[0].sjhbcolor = "color:red;";
            } else {
                data[0].sjhbcolor = "color:green;";
            }
            if (data[0].wsjajtb == 0) {
                data[0].wsjajtb = "0";
                data[0].wsjtbcolor = "color:black;";
            } else if (data[0].wsjajtb > 0) {
                data[0].wsjtbcolor = "color:red;";
            } else {
                data[0].wsjtbcolor = "color:green;";
            }
            if (data[0].wsjajhb == 0) {
                data[0].wsjajhb = "0";
                data[0].wsjhbcolor = "color:black;";
            } else if (data[0].wsjajhb > 0) {
                data[0].wsjhbcolor = "color:red;";
            } else {
                data[0].wsjhbcolor = "color:green;";
            }
            $("#div_a1-1").html("<p class='quantity'><font style='" + data[0].sltbcolor + "'>" + data[0].slajtb + "</font>/<font style='" + data[0].slhbcolor + "'>" + data[0].slajhb + "</font></p>");
            $("#div_a2-1").html("<p class='quantity'><font style='" + data[0].fptbcolor + "'>" + data[0].fpajtb + "</font>/<font style='" + data[0].fphbcolor + "'>" + data[0].fpajhb + "</font></p>");
            $("#div_a3-1").html("<p class='quantity'><font style='" + data[0].sjtbcolor + "'>" + data[0].sjajtb + "</font>/<font style='" + data[0].sjhbcolor + "'>" + data[0].sjajhb + "</font></p>");
            $("#div_a4-1").html("<p class='quantity'><font style='" + data[0].wsjtbcolor + "'>" + data[0].wsjajtb + "</font>/<font style='" + data[0].wsjhbcolor + "'>" + data[0].wsjajhb + "</font></p>");

        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetLSAJTJ",
        success: function (result) {
            var data = eval(result);
            init_tyyw2(data);
        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetAJTJS",
        success: function (result) {
            var value = new Array();
            value = result.split(";"); //分号
            init_tyyw3(value[0], value[1], value[2]);
        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetYWAJTJ",
        success: function (result) {
            init_tyyw4(result);
        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetAJSLTJ",
        success: function (result) {
            var data = eval(result);

            var html1 = "<p>案管：<span>" + (data[0].slajagsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(1,0,true,0,true, 0)\" href='javascript:void(0)'>" + data[0].slajagsl + "</a>" : data[0].slajagsl)
                + "</span></p><p>控告：<span>" + (data[0].slajkgsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(1,1,true,0,true, 0)\" href='javascript:void(0)'>" + data[0].slajkgsl + "</a>" : data[0].slajkgsl)
                + "</span></p><p>申诉：<span>" + (data[0].slajsssl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(1,2,true,0,true, 0)\" href='javascript:void(0)'>" + data[0].slajsssl + "</a>" : data[0].slajsssl)
                + "</span></p><p>执检：<span>" + (data[0].slajzjsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(1,3,true,0,true, 0)\" href='javascript:void(0)'>" + data[0].slajzjsl + "</a>" : data[0].slajzjsl)
                + "</span></p><p>其他：<span>" + (data[0].slajqtsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(1,4,true,0,true, 0)\" href='javascript:void(0)'>" + data[0].slajqtsl + "</a>" : data[0].slajqtsl)
                + "</span></p>";
            $("#span_v1").html(html1);

            var html2 = "<p>案管：<span>" + (data[0].fpajagsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(2,0,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].fpajagsl + "</a>" : data[0].fpajagsl)
                + "</span></p><p>控告：<span>" + (data[0].fpajkgsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(2,1,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].fpajkgsl + "</a>" : data[0].fpajkgsl)
                + "</span></p><p>申诉：<span>" + (data[0].fpajsssl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(2,2,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].fpajsssl + "</a>" : data[0].fpajsssl)
                + "</span></p><p>执检：<span>" + (data[0].fpajzjsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(2,3,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].fpajzjsl + "</a>" : data[0].fpajzjsl)
                + "</span></p><p>其他：<span>" + (data[0].fpajqtsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(2,4,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].fpajqtsl + "</a>" : data[0].fpajqtsl)
                + "</span></p>";
            $("#span_v2").html(html2);

            var html3 = "<p>案管：<span>" + (data[0].sjajagsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(3,0,true,1,true, 0)\" href='javascript:void(0)'>" + data[0].sjajagsl + "</a>" : data[0].sjajagsl)
                + "</span></p><p>控告：<span>" + (data[0].sjajkgsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(3,1,true,1,true, 0)\" href='javascript:void(0)'>" + data[0].sjajkgsl + "</a>" : data[0].sjajkgsl)
                + "</span></p><p>申诉：<span>" + (data[0].sjajsssl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(3,2,true,1,true, 0)\" href='javascript:void(0)'>" + data[0].sjajsssl + "</a>" : data[0].sjajsssl)
                + "</span></p><p>执检：<span>" + (data[0].sjajzjsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(3,3,true,1,true, 0)\" href='javascript:void(0)'>" + data[0].sjajzjsl + "</a>" : data[0].sjajzjsl)
                + "</span></p><p>其他：<span>" + (data[0].sjajqtsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(3,4,true,1,true, 0)\" href='javascript:void(0)'>" + data[0].sjajqtsl + "</a>" : data[0].sjajqtsl)
                + "</span></p>";
            $("#span_v3").html(html3);

            var html4 = "<p>案管：<span>" + (data[0].wsjajagsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(4,0,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].wsjajagsl + "</a>" : data[0].wsjajagsl)
                + "</span></p><p>控告：<span>" + (data[0].wsjajkgsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(4,1,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].wsjajkgsl + "</a>" : data[0].wsjajkgsl)
                + "</span></p><p>申诉：<span>" + (data[0].wsjajsssl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(4,2,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].wsjajsssl + "</a>" : data[0].wsjajsssl)
                + "</span></p><p>执检：<span>" + (data[0].wsjajzjsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(4,3,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].wsjajzjsl + "</a>" : data[0].wsjajzjsl)
                + "</span></p><p>其他：<span>" + (data[0].wsjajqtsl != 0 ? "<a class='quantity1' onclick=\"getIndexAJXX2(4,4,true,0,false, 11)\" href='javascript:void(0)'>" + data[0].wsjajqtsl + "</a>" : data[0].wsjajqtsl)
                + "</span></p>";
            $("#span_v4").html(html4);
            CloseProgress(); // 如果提交成功则隐藏进度条
        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetAJBLTJ",
        success: function (result) {
            var data = eval(result);
            init_tyyw1(data);

        },
        error: function (data) {

        }
    });
}

function init_tyyw1(data) {
    if (data == null || data == "[]" || data.length == 0) {
        data = [];
        data.push({ slajsl: 0, zbajsl: 0, ybajsl: 0, gdajsl: 0 });
    }

    var series = "[['受理'," + data[0].slajsl + "],['已办'," + data[0].ybajsl + "],['在办、未办'," + data[0].zbajsl + "],['归档'," + data[0].gdajsl + "]]";
    $('#tyyw_pie1').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        colors: ['#7cb5ec', '#90ed7d', '#f45b5b', 'gray'],
        plotOptions: {
            column: {
                colorByPoint: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        var exportExcel = 0;
                        if (e.point.name == "受理") {
                            type = "0";
                            exportExcel = 13;
                        } else if (e.point.name == "在办、未办") {
                            type = "1";
                            exportExcel = 14;
                        } else if (e.point.name == "已办") {
                            type = "2";
                            exportExcel = 12;
                        } else if (e.point.name == "归档") {
                            type = "3";
                            exportExcel = 15;
                        }

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX', '', '', sjtype, rqlx, type, 0, '', startdate, enddate, 0, '', '', false, 0, exportExcel);

                    }
                }
            },
            //bar: {
            //    dataLabels: {
            //        enabled: true,
            //        allowOverlap: true
            //    }
            //}
        },
        series: [{
            name: '案件数量',
            data: eval(series),
                //dataLabels: {
                //    enabled: true
                //}
        }]
    });
    $('#xiaoer_tyyw_zzs4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        colors: ['#7cb5ec', '#90ed7d', '#f45b5b', 'gray'],
        plotOptions: {
            column: {
                colorByPoint: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        var exportExcel = 0;
                        if (e.point.name == "受理") {
                            type = "0";
                            exportExcel = 13;
                        } else if (e.point.name == "在办、未办") {
                            type = "1";
                            exportExcel = 14;
                        } else if (e.point.name == "已办") {
                            type = "2";
                            exportExcel = 12;
                        } else if (e.point.name == "归档") {
                            type = "3";
                            exportExcel = 15;
                        }
                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX', '', '', sjtype, rqlx, type, 0, '', startdate, enddate, 0, '', '', false, 0, exportExcel);
                    }
                }
            }
        },
        series: [
            {
                name: '案件数量',
                data: eval(series),
                //dataLabels: {
                //    enabled: true
                //}
            }
        ]
    });
}

function init_tyyw2(data) {
    var mc = "[";
    var series1 = "[";
    var series2 = "[";
    var series3 = "[";
    for (var i = 0; i < data.length; i++) {
        mc += "'" + data[i].yf + "月'";
        series1 += data[i].slajsl;
        series2 += data[i].sjajsl;
        series3 += data[i].gdajsl;
        if (i < data.length - 1) {
            mc += ",";
            series1 += ",";
            series2 += ",";
            series3 += ",";
        }
    }
    mc += "]";
    series1 += "]";
    series2 += "]";
    series3 += "]";
    $('#tyyw_pie2').highcharts({
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: eval(mc)
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        //plotOptions: {
        //    line: {
        //        dataLabels: {
        //            enabled: true
        //        },
        //        enableMouseTracking: false
        //    }
        //},
        credits: {
            enabled: false
        },
        colors: ['#7cb5ec', '#90ed7d', 'gray'],
        series: [{
            name: '受理',
            data: eval(series1)
        }
        , {
            name: '审结',
            data: eval(series2)
        }
        , {
            name: '归档',
            data: eval(series3)
        }]
    });
    $('#xiaoer_tyyw_zzs3').highcharts({
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: eval(mc)
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        //plotOptions: {
        //    line: {
        //        dataLabels: {
        //            enabled: true
        //        },
        //        enableMouseTracking: false
        //    }
        //},
        credits: {
            enabled: false
        },
        colors: ['#7cb5ec', '#90ed7d', 'gray'],
        series: [{
            name: '受理',
            data: eval(series1)
        }
        , {
            name: '审结',
            data: eval(series2)
        }
        , {
            name: '归档',
            data: eval(series3)
        }]
    });
}

function init_tyyw3(categories, data1, data2) {
    data1 = eval(data1);
    data2 = eval(data2);
    $('#tyyw_pie3').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: eval(categories)
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        plotOptions: {
            //bar: {
            //    dataLabels: {
            //        enabled: true,
            //        allowOverlap: true
            //    }
            //}
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        colors: ['#7cb5ec', '#90ed7d'],
        series: [
            {
                name: '受理',
                data: data1
            },
            {
                name: '审结',
                data: data2
            }
        ]
    });
    $('#xiaoer_tyyw_zzs2').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: eval(categories)
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        plotOptions: {
            //bar: {
            //    dataLabels: {
            //        enabled: true,
            //        allowOverlap: true
            //    }
            //}
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        colors: ['#7cb5ec', '#90ed7d'],
        series: [
            {
                name: '受理',
                data: data1
            },
            {
                name: '审结',
                data: data2
            }
        ]
    });
}

function init_tyyw4(data) {
    $('#tyyw_pie4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                cursor: 'pointer',
                events: {
                    click: function(e) {
                        ywmc = e.point.name;
                        $.post('/Handler/TYYW/TYYWHandler.ashx', { action: 'GetLBAJTJ', dwbm: dqdwbm, ywmc: ywmc, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype},
                            function(result) {
                                init_tyyw5(result);
                            }
                        );
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        colors: [
            '#9ed6f1',
            '#fdc882',
            '#f9b8b6',
            '#d1dfaa',
            '#60bfec',
            '#fdc882',
            '#9ed6f1',
            '#fdc882',
            '#f9b8b6',
            '#d1dfaa',
            '#60bfec',
            '#9ed6f1',
            '#fdc882',
            '#9ed6f1',
            '#60bfec',
            '#fdc882',
            '#f9b8b6',
            '#9ed6f1'
        ],
        series: [
            {
                name: '受理数量',
                data: eval(data),
                //dataLabels: {
                //    enabled: true
                //}
            }
        ]
    });

    var queryData = { dwbm: dqdwbm, ywbm: '', rqlx: rqlx, sjtype: sjtype, startdate: startdate, enddate: enddate };
    $('#xiaoer_tyyw_zzs1').treegrid({
        idField: 'LBMC',
        treeField: 'LBMC',
        queryParams: queryData,
        loadMsg: '数据加载中，请稍候...',
        columns: [[
        { field: 'LBBM', title: '类别编码', width: 200, align: 'center' },
        { field: 'LBMC', title: '名称', width: 400 },
        {
            field: 'YBSL', title: '已办（件）', width: 100,
            formatter: function (value, row) {
                if (row.BJSL > 0) {
                    var ajzt = '2';
                    var x = '<a href="javascript:void(0)" onclick="click_aj2(&quot;' + row.LBBM + '&quot;,&quot;' + row.ZBSL + '&quot;,&quot;' + ajzt + '&quot;)">' + row.BJSL + '</a>';
                    return x;
                }
                else
                    return row.BJSL;
            }
        },{
            field: 'ZBSL', title: '在办（件）', width: 100,
            formatter: function (value, row) {
                if (row.ZBSL > 0) {
                    var ajzt = '1';
                    var x = '<a href="javascript:void(0)" onclick="click_aj2(&quot;' + row.LBBM + '&quot;,&quot;' + row.ZBSL + '&quot;,&quot;' + ajzt + '&quot;)">' + row.ZBSL + '</a>';
                    return x;
                }
                else
                    return row.ZBSL;
            }
        }
        ]],
        url: '/Handler/TYYW/TYYWHandler.ashx?action=GetAJLBTJ1'
    });
}

function click_aj2(ajlb, count, ajzt) {

    v_ajlb = ajlb;
    v_count = count;
    v_action = 'GetAJLBTJ2';


    var ajlbbmList = $('#cb_ajlb_ajlb').combotree('tree').tree('getChecked');
    var ajlbbm = '';
    for (var i = 0; i < ajlbbmList.length; i++) {
        if (i == 0) {
            ajlbbm = '(';
        }
        ajlbbm += "'" + ajlbbmList[i].id + "'" + (i != ajlbbmList.length - 1 ? ',' : ')');
    }


    var ysayList = $('#cb_ajlb_ysay').combotree('tree').tree('getChecked');
    var ysay = '';
    for (var i = 0; i < ysayList.length; i++) {
        if (i == 0) {
            ysay = '(';
        }
        ysay += "'" + ysayList[i].id + "'" + (i != ysayList.length - 1 ? ',' : ')');
    }

    var startTime = $("#txtStartDate").datebox('getValue');
    var endTime = $("#txtEndDate").datebox('getValue');
    var queryData = {
        action: v_action,
        ajmc: '',
        bmsah: '',
        dwbm: dqdwbm,
        cbr: '',
        start: startTime,
        end: endTime,
        rqlx: rqlx,
        ajlb: ajlb,
        ajzt: ajzt,
        sjtype: sjtype,
        lbbmjh: ajlbbm,
        ysayjh: ysay,
        selectedUrl: selectedUrl
    };

    var time = new Date();
    var jsonStr = JSON.stringify(queryData);
    var handlerUrl = "/Handler/TYYW/TYYWHandler.ashx?t=" + time.getMilliseconds();
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}

function init_tyyw5(data) {
    data = eval('(' + data + ')');
    $('#xiaoer_tyyw_zzs5').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: eval(data.lbmc)
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
          url: '/Handler/common.ashx?action=UpdateBmp',
          filename: 'MyChart',
          width: 1200
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        ajlbmc = e.point.category;
                        if (e.currentTarget.innerHTML.indexOf("受理") != -1) {
                            type = "0";
                        } else if (e.currentTarget.innerHTML.indexOf("在办") != -1) {
                            type = "1";
                        } else if (e.currentTarget.innerHTML.indexOf("已办") != -1) {
                            type = "2";
                        } else if (e.currentTarget.innerHTML.indexOf("归档") != -1) {
                            type = "3";
                        }

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetLBAJXX', '', '', sjtype, rqlx, type, 0, '', startdate, enddate, 0, ywmc, ajlbmc, true, 0,16);
                    }
                }
            }
        },
        series: [
            {
                name: '受理',
                data: eval(data.slsl),
                colors: ['#7cb5ec'],
                //dataLabels: {
                //    enabled: true
                //}
            }, {
                name: '已办',
                data: eval(data.bjsl),
                colors: ['#90ed7d'],
                //dataLabels: {
                //    enabled: true
                //}
            }, {
                name: '在办',
                data: eval(data.zbsl),
                colors: ['#f45b5b'],
                //dataLabels: {
                //    enabled: true
                //}
            }
        ]
    });

    $("#tyywModal_zzs5").window('open');
}

function show_map(dwbm) {

    //ShowProgress(); // 显示进度条
    dqdwbm = dwbm;
    var url = new UrlSearch();
    //dqdwbm = "370100";
    $.post("/Handler/TYYW/TYYWHandler.ashx", { action: 'GetAJTJ', dwbm: dwbm, rqlx: rqlx, sjtype: sjtype },
        function (result) {

            var data = eval(result);
            //绑定地图
            //var map = "<a target='_parent' href='../TJ/TYYWLYST.htm?key="+url.key+"&dwbm=" + dwbm + "'>进入</a></br>";
            var map = $('.ajsl_date .date_fl_click').attr("changeAtrr") + "受理案件数量：" + data[0].slajsl + "</br>";
            map += $('.ajsl_date .date_fl_click').attr("changeAtrr") + "分配案件数量：" + data[0].fpajsl + "</br>";
            map += $('.ajsl_date .date_fl_click').attr("changeAtrr") + "审结案件数量：" + data[0].sjajsl + "</br>";
            map += $('.ajsl_date .date_fl_click').attr("changeAtrr") + "未审结案件数量：" + data[0].wsjajsl;

            iframe_tyyw.window.show_value(map);
        });

    $('#cb_ajjbxx_dwbm').combotree('setValue', dqdwbm);
    zx(1);
}

function getywajsl() {

    $("#dt_ajlb_begin").datebox("setValue", getStartDate());
    $("#dt_ajlb_end").datebox("setValue", getEndDate());

    //查询案件类别
    $('#cb_ajlb_ajlb').combotree({
        method: 'post',
        url: '/Handler/AJXX/AJXXHandler.ashx?action=GetAJLB',
        editable: false,
        animate: false,
        multiple: true
    });

    //移送案由
    $('#cb_ajlb_ysay').combotree({
        method: 'post',
        queryParams: { lbbm: '9903' },
        url: '/Handler/Dictionary/dictionary.ashx?action=GetDataItemListByRemote',
        editable: false,
        animate: false,
        multiple: true
    });

    $('#tyywModal_zzs1').window('open');
}

function getajsls() {
    $('#tyywModal_zzs2').window('open');
}

function getlsajsls() {
    $('#tyywModal_zzs3').window('open');
}

function getajblhj() {
    $('#tyywModal_zzs4').window('open');
}

function getIndexAJXX(type, showColumn, showTime, exportExcel) {
    this.type = type;
    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX1', '', '', sjtype, rqlx, type, 0, '', showTime ? startdate : '', showTime ? enddate : '', 0, '', '', false, showColumn, exportExcel);
}

function getIndexAJXX2(type, childType, isShowSendMail, showColumn, showTime, exportExcel) {
    if (isShowSendMail == true) {
        document.getElementById('btnSendEmail').style.display = "inline-block";
    }
    this.type = type;

    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX2', '', '', sjtype, rqlx, type, childType, '', showTime ? startdate : '', showTime ? enddate : '', isShowSendMail, '', '', false, showColumn, exportExcel);

}

function onClickAJXX(handlerUrl, bmsah, ajmc, sjtype, rqlx, index, childType, cbr, dateStart, dateEnd, sendEmail, ywmc, ajlbmc, disableDate, showColumn, exportExcel) {
    var time = new Date();
    var dwbm = dqdwbm;
    if (handlerUrl.indexOf('GetAJXX') != -1 && index == 2) {
        sendEmail = 1;
    }
    if (index == "4") {
        disableDate = true;
    }
    if (handlerUrl.indexOf('GetAJXX2') != -1 && index == "2") {
        disableDate = true;
    }

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: bmsah,
        ajmc: ajmc,
        dwbm: dwbm,
        rqlx: rqlx,
        sjtype: sjtype,
        type: index,
        childType: childType,
        cbr: cbr,
        disableDate: disableDate,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: sendEmail, //是否显示发送邮件按钮
        ywmc: ywmc,
        ajlbmc: ajlbmc,
        showColumn: showColumn,
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}