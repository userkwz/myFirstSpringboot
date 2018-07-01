//@ sourceURL=slfx.js
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
//var myWidth = $(window).width();
$(document).ready(function () {
    if (!CheckBrowser()) {
        return;
    }
    $('#tyywModal_zzs1').window('close');
    $('#tyywModal_zzs2').window('close');
    $('#tyywModal_zzs3').window('close');
    $('#tyywModal_zzs4').window('close');
    $('#tyywModal_zzs5').window('close');
    //    $('#datebox_tyywzs_Start').datebox('setValue', getStartDate());
    //    $('#datebox_tyywzs_End').datebox('setValue', getEndDate());
    AddOperationLog('统一业务助手');
    $('.date_but div').click(function () {
        $('.date_but>div').removeClass("date_but_click");
        $(this).addClass("date_but_click");
        rqlx = $(this).attr("value");
        startdate = "";
        enddate = "";
        $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(0).find('p').eq(0).text($(this).attr("changeAtrr") + "受理案件数");
        $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(2).find('p').eq(0).text($(this).attr("changeAtrr") + "审结案件数");
        //$(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(3).find('p').eq(0).text($(this).attr("changeAtrr") + "未结案件数");
        var map = "../../View/Map/Index.html?dwbm=" + unitCode + "&dataType=1&rqlx=" + rqlx + "&sjtype=" + sjtype + "&key=" + key;
        document.getElementById("iframe_tyyw").src = map;
        zx(2);
    });
    var url = new UrlSearch();
    var map = "../../View/Map/Index.html?dwbm=" + unitCode + "&dataType=1&rqlx=4&sjtype=2&key=" + key;
    document.getElementById("iframe_tyyw").src = map;
    var user = frameObject.GetUserInfo();
    dqdwbm = user.UnitCode;
    zx();

    // 单位编码ComboTree初始化
    $('#cb_tyywzs_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cb_tyywzs_dwbm').combotree('setValue', dqdwbm);
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#radio_tyywzs_sjtype').attr("checked", false);
                $("#radio_tyywzs_sjtype").attr("disabled", "disabled");
            } else {
                $('#radio_tyywzs_sjtype').attr("checked", true);
                $("#radio_tyywzs_sjtype").removeAttr("disabled");
            }
            dqdwbm = node.id;
            
            //zx(2);
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });
    var ckbDwbm = document.getElementById('radio_tyywzs_sjtype');
    ckbDwbm.onclick = function () {
        sjtype = this.checked ? 2 : 1;
    }

    $("#btn_tyywzs_Search").click(function () {
        try {
            startdate = $("#dateStart_tyywzs").datebox('getValue');
            enddate = $("#dateEnd_tyywzs").datebox('getValue');
            if (startdate != "" || enddate != "") {
                if (startdate == "" || enddate == "") {
                    alert("请选择时间范围！");
                    return;
                }
                // 给时间加上天
                if (startdate.length == 7) {
                    startdate = startdate + '-01';
                }
                if (enddate.length == 7) {
                    var yearmonth = enddate.split('-');
                    if (yearmonth.length == 2) {
                        enddate = enddate + '-' + getlastday(yearmonth[0], yearmonth[1]);
                    }
                }

                // 重新设置标头
                $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(0).find('p').eq(0).text("受理案件数");
                $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(2).find('p').eq(0).text("审结案件数");
                
                $(".date_fl_click").removeClass("date_fl_click");
                rqlx = "0";
//                rqlx = "";
//                rqtext = "";
                $(".dzjz_zzaj").find('li').eq(0).find('p').eq(0).text("受理案件数");
                $(".dzjz_zzaj").find('li').eq(1).find('p').eq(0).text("往年转结案件数");
                $(".dzjz_zzaj").find('li').eq(2).find('p').eq(0).text("审结案件数");
                $(".dzjz_zzaj").find('li').eq(3).find('p').eq(0).text("未结案件数");
            }

            var map = "../../View/Map/Index.html?dwbm=" + dqdwbm + "&dataType=1&rqlx=" + rqlx + "&dateStart=" + startdate + "&dateEnd=" + enddate + "&sjtype=" + sjtype + "&key=" + key;
            document.getElementById("iframe_tyyw").src = map;
            zx(2);
        } catch (e) {
            console.log(e);
        }
    });

    $("#btn_tyywzs_Search_ajlb").click(function () {
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
    dateboxForMonth("dateStart_tyywzs");
    dateboxForMonth("dateEnd_tyywzs");
});

function zx(t) {

    sjtype = document.getElementById('radio_tyywzs_sjtype').checked ? "2" : "1";

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dqdwbm, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetZTFX",
        success: function (result) {
            var data = eval('(' + result + ')');
            init_tyyw_ajtj(data.ajtj);
            init_tyyw2(data.lsajtj);
            var value = new Array();
            value = data.ajtjs.split(";"); //分号
            init_tyyw3(value[0], value[1], value[2]);
            init_tyyw4(data.ywajtj);
            init_tyyw_ajsltj(data.ajsltj);
            var ajbltj = eval(data.ajbltj);
            init_tyyw1(ajbltj);
        },
        error: function (data) {

        }
    });
}

function init_tyyw_ajtj(result) {
    var data = result == "[]" ? null : eval('(' + result + ')');
    var wsjajsl = data != null ? (data[0].slajsl - data[0].sjajsl) : 0;
    if (data != null && data[0].slajsl != 0) {
        $("#div_a1").html("<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX(1,0,true, 17,0)\" href='javascript:void(0)'>" + data[0].slajsl + "</a>");
    } else {
        $("#div_a1").html("<a class='quantity'>" + 0 + "</a>");
    }
    if (data != null && data[0].fpajsl != 0) {
        $("#div_a2").html("<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX(2,0,false, 4,1)\" href='javascript:void(0)'>" + data[0].fpajsl + "</a>");
    } else {
        $("#div_a2").html("<a class='quantity'>" + 0 + "</a>");
    }
    if (data != null && data[0].sjajsl != 0) {
        $("#div_a3").html("<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX(3,1,true, 18,0)\" href='javascript:void(0)'>" + data[0].sjajsl + "</a>");
    } else {
        $("#div_a3").html("<a class='quantity'>" + 0 + "</a>");
    }
    if (wsjajsl == 0) {
        //$("#div_a4").html("<a class='quantity'>" + data[0].wsjajsl + "</a>");
        $("#div_a4").html("<a class='quantity'>" + wsjajsl + "</a>");
    } else {
        $("#div_a4").html("<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX(4,0,false, 19,1)\" href='javascript:void(0)'>" + data[0].wsjajsl + "</a>");
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
}

function init_tyyw_ajsltj(result) {
    var data = result == "" ? [
                {
                    slajagsl: 0, slajkgsl: 0, slajsssl: 0, slajzjsl: 0, slajqtsl: 0,
                    fpajagsl: 0, fpajkgsl: 0, fpajsssl: 0, fpajzjsl: 0, fpajqtsl: 0,
                    sjajagsl: 0, sjajkgsl: 0, sjajsssl: 0, sjajzjsl: 0, sjajqtsl: 0,
                    wsjajagsl: 0, wsjajkgsl: 0, wsjajsssl: 0, wsjajzjsl: 0, wsjajqtsl: 0,
                }] : eval(result);
    var html1 = "<p><span title=\"案管\" class=\"ajlb_model\">案管：</span><span>" + (data[0].slajagsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(1,0,0,0,true, 0,'案管')\" href='javascript:void(0)'>" + data[0].slajagsl + "</a>" : data[0].slajagsl)
        + "</span></p><p><span title=\"控告\" class=\"ajlb_model\">控告：</span><span>" + (data[0].slajkgsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(1,1,0,0,true, 0,'控告')\" href='javascript:void(0)'>" + data[0].slajkgsl + "</a>" : data[0].slajkgsl)
        + "</span></p><p><span title=\"申诉\" class=\"ajlb_model\">申诉：</span><span>" + (data[0].slajsssl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(1,2,0,0,true, 0,'申诉')\" href='javascript:void(0)'>" + data[0].slajsssl + "</a>" : data[0].slajsssl)
        + "</span></p><p><span title=\"执检\" class=\"ajlb_model\">执检：</span><span>" + (data[0].slajzjsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(1,3,0,0,true, 0,'执检')\" href='javascript:void(0)'>" + data[0].slajzjsl + "</a>" : data[0].slajzjsl)
        + "</span></p><p><span title=\"其他\" class=\"ajlb_model\">其他：</span><span>" + (data[0].slajqtsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(1,4,0,0,true, 0,'其他')\" href='javascript:void(0)'>" + data[0].slajqtsl + "</a>" : data[0].slajqtsl)
        + "</span></p>";
    $("#span_a1").html(html1);
    var html2 = "<p><span title=\"案管\" class=\"ajlb_model\">案管：</span><span>" + (data[0].fpajagsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(2,0,1,0,false, 11,'案管')\" href='javascript:void(0)'>" + data[0].fpajagsl + "</a>" : data[0].fpajagsl)
        + "</span></p><p><span title=\"控告\" class=\"ajlb_model\">控告：</span><span>" + (data[0].fpajkgsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(2,1,1,0,false, 11,'控告')\" href='javascript:void(0)'>" + data[0].fpajkgsl + "</a>" : data[0].fpajkgsl)
        + "</span></p><p><span title=\"申诉\" class=\"ajlb_model\">申诉：</span><span>" + (data[0].fpajsssl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(2,2,1,0,false, 11,'申诉')\" href='javascript:void(0)'>" + data[0].fpajsssl + "</a>" : data[0].fpajsssl)
        + "</span></p><p><span title=\"执检\" class=\"ajlb_model\">执检：</span><span>" + (data[0].fpajzjsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(2,3,1,0,false, 11,'执检')\" href='javascript:void(0)'>" + data[0].fpajzjsl + "</a>" : data[0].fpajzjsl)
        + "</span></p><p><span title=\"其他\" class=\"ajlb_model\">其他：</span><span>" + (data[0].fpajqtsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(2,4,1,0,false, 11,'其他')\" href='javascript:void(0)'>" + data[0].fpajqtsl + "</a>" : data[0].fpajqtsl)
        + "</span></p>";
    $("#span_a2").html(html2);
    var html3 = "<p><span title=\"案管\" class=\"ajlb_model\">案管：</span><span>" + (data[0].sjajagsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(3,0,0,1,true, 0,'案管')\" href='javascript:void(0)'>" + data[0].sjajagsl + "</a>" : data[0].sjajagsl)
        + "</span></p><p><span title=\"控告\" class=\"ajlb_model\">控告：</span><span>" + (data[0].sjajkgsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(3,1,0,1,true, 0,'控告')\" href='javascript:void(0)'>" + data[0].sjajkgsl + "</a>" : data[0].sjajkgsl)
        + "</span></p><p><span title=\"申诉\" class=\"ajlb_model\">申诉：</span><span>" + (data[0].sjajsssl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(3,2,0,1,true, 0,'申诉')\" href='javascript:void(0)'>" + data[0].sjajsssl + "</a>" : data[0].sjajsssl)
        + "</span></p><p><span title=\"执检\" class=\"ajlb_model\">执检：</span><span>" + (data[0].sjajzjsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(3,3,0,1,true, 0,'执检')\" href='javascript:void(0)'>" + data[0].sjajzjsl + "</a>" : data[0].sjajzjsl)
        + "</span></p><p><span title=\"其他\" class=\"ajlb_model\">其他：</span><span>" + (data[0].sjajqtsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(3,4,0,1,true, 0,'其他')\" href='javascript:void(0)'>" + data[0].sjajqtsl + "</a>" : data[0].sjajqtsl)
        + "</span></p>";
    $("#span_a3").html(html3);
    var html4 = "<p><span title=\"案管\" class=\"ajlb_model\">案管：</span><span>" + (data[0].wsjajagsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(4,0,1,0,false, 11,'案管')\" href='javascript:void(0)'>" + data[0].wsjajagsl + "</a>" : data[0].wsjajagsl)
        + "</span></p><p><span title=\"控告\" class=\"ajlb_model\">控告：</span><span>" + (data[0].wsjajkgsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(4,1,1,0,false, 11,'控告')\" href='javascript:void(0)'>" + data[0].wsjajkgsl + "</a>" : data[0].wsjajkgsl)
        + "</span></p><p><span title=\"申诉\" class=\"ajlb_model\">申诉：</span><span>" + (data[0].wsjajsssl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(4,2,1,0,false, 11,'申诉')\" href='javascript:void(0)'>" + data[0].wsjajsssl + "</a>" : data[0].wsjajsssl)
        + "</span></p><p><span title=\"执检\" class=\"ajlb_model\">执检：</span><span>" + (data[0].wsjajzjsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(4,3,1,0,false, 11,'执检')\" href='javascript:void(0)'>" + data[0].wsjajzjsl + "</a>" : data[0].wsjajzjsl)
        + "</span></p><p><span title=\"其他\" class=\"ajlb_model\">其他：</span><span>" + (data[0].wsjajqtsl != 0 ? "<a class='quantity' style=\"text-decoration: none;\" onclick=\"getIndexAJXX2(4,4,1,0,false, 11,'其他')\" href='javascript:void(0)'>" + data[0].wsjajqtsl + "</a>" : data[0].wsjajqtsl)
        + "</span></p>";
    $("#span_a4").html(html4);
}

function init_tyyw1(data) {
    if (data == null || data == "[]" || data.length == 0) {
        data = [];
        data.push({ slajsl: 0, zbajsl: 0, ybajsl: 0, gdajsl: 0 });
    }

    var series = "[['受理'," + data[0].slajsl + "],['已办'," + data[0].ybajsl + "],['在办'," + data[0].zbajsl + "],['归档'," + data[0].gdajsl + "]]";
    $('#ajblhjt').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'column',
           backgroundColor: 'transparent'
            //backgroundColor: 'rgba(255,255,255,.3)',

        },

        credits: {
            enabled: false
        },
        legend: {
            align: 'right',
            //          verticalAlign: 'top',
            y: 60
        },
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: ['受理', '已办', '在办', '归档'],
            labels: {
                style: {
                   // color: '#00e1e1'
                }
            }
        },
        yAxis: {
            //gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#002146'
                }
            }
        },
         
        colors: ['#6f8aee', '#e27261', '#09acf4', '#44b350'],
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                 // dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color:'#0ff'
               // },
                events: {
                    click: function (e) {
                        var exportExcel = 0;
                        var name = '';
                        if (e.point.name == "受理") {
                            type = "0";
                            name = '受理';
                            exportExcel = 13;
                        } else if (e.point.name == "在办") {
                            type = "1";
                            name = '在办';
                            exportExcel = 14;
                        } else if (e.point.name == "已办") {
                            type = "2";
                            name = '已办';
                            exportExcel = 12;
                        } else if (e.point.name == "归档") {
                            type = "3";
                            name = '归档';
                            exportExcel = 15;
                        }

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX', '', '',
                            sjtype, rqlx, type, 0, '', startdate, enddate, 0, '', '', false, 0,
                            exportExcel, '案件办理合计图（件） -> ' + name);

                    }
                }
            }
        },
        series: [{
            colorByPoint: true,
            name: '案件数量',
            data: eval(series)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件办理合计图（件）',
            width: myWidth
        }
    });

    $('#xiaoer_tyyw_zzs4').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)',
            width:highchartsWidth
        },

        credits: {
            enabled: false
        },
        legend: {
            align: 'right',
            //          verticalAlign: 'top',
            y: 60
        },
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: ['受理', '已办', '在办', '归档'],
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        colors: ['#6f8aee', '#e27261', '#09acf4', '#44b350'],
        plotOptions: {
     
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                 //dataLabels: {
                   // enabled: true,
                   // allowOverlap: true,
                    //color:'#0ff'
               // },
                events: {
                    click: function (e) {
                        var exportExcel = 0;
                        var name = '';
                        if (e.point.name == "受理") {
                            type = "0";
                            name = '受理';
                            exportExcel = 13;
                        } else if (e.point.name == "在办") {
                            type = "1";
                            name = '在办';
                            exportExcel = 14;
                        } else if (e.point.name == "已办") {
                            type = "2";
                            name = '已办';
                            exportExcel = 12;
                        } else if (e.point.name == "归档") {
                            type = "3";
                            name = '归档';
                            exportExcel = 15;
                        }

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX', '', '',
                            sjtype, rqlx, type, 0, '', startdate, enddate, 0, '', '', false, 0,
                            exportExcel, '案件办理合计图（件） -> ' + name);

                    }
                }
            }
        },
       
       
        series: [{
            colorByPoint: true,
            name: '案件数量',
            data: eval(series)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件办理合计图（件）',
            width: myWidth
        }
    });

}

function init_tyyw2(result) {
    var data = result == "" ? [] : eval('(' + result + ')');
    var mc = "[";
    var series1 = "[";
    var series2 = "[";
    var series3 = "[";
    for (var i = 0; i < data.length; i++) {
        mc += "'" + data[i].yf + "'";
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

    $('#ajslt').highcharts({
        title: {
            text: '',
            floating: true,

        },
        chart: {
            backgroundColor: 'transparent'
            //backgroundColor: 'rgba(255,255,255,.3)'
        },
        credits: {
            enabled: false
        },
        colors: ['#0f72c6', '#21a2a1', '#dc604f'],
        legend: {
            data:['受理', '已办', '在办', '归档']
     
            //          verticalAlign: 'top',

           
        },
        plotOptions:{
            line: {
                events: {
                    click: function () {
                        alert("11111");
                    }
                }
            }
        },
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(mc),
           
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },
        
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '历史案件受理图（件）',
            width: myWidth
        },
        series: [
            {
                name: '受理',
                data: eval(series1)
            }, {
                name: '审结',
                data: eval(series2)
            }, {
                name: '归档',
                data: eval(series3)
            }
        ]
    });
    $('#xiaoer_tyyw_zzs3').highcharts({
        title: {
            text: '',
            floating: true,

        },
        chart: {
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)'
        },
        credits: {
            enabled: false
        },
        colors: ['#0f72c6', '#21a2a1', '#dc604f'],
        legend: {
            data: ['受理', '已办', '在办', '归档']
        },
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(mc),
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '历史案件受理图（件）',
            width: myWidth
        },
        series: [
            {
                name: '受理',
                data: eval(series1)
            }, {
                name: '审结',
                data: eval(series2)
            }, {
                name: '归档',
                data: eval(series3)
            }
        ]
    });

}

function init_tyyw3(categories, data1, data2) {
    data1 = eval('(' + data1 + ')');
    data2 = eval('(' + data2 + ')');
    var len = data1.length;

    $('#gyajsls').highcharts({
        title: {
            text: '',
            floating: true,
        },
        chart: {
            type: 'bar',
           backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)',
            height: len == 1 ? 180 : 800
        },
        credits: {
            enabled: false
        },
        colors: ['#1aa19d', '#138ddd'],
        xAxis: {
            tickWidth: 0,
            lineColor: '#002146',
            categories: eval('(' + categories + ')'),
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        var dwbm = e.point.category.substr(9, 6);
                        var exportExcel = 0;
                        var name = '';
                        if (e.point.series.name == "受理") {
                            type = '0';
                            name = '受理';
                        } else if (e.point.series.name == "审结") {
                            type = '1';
                            name = '审结';
                        }
                        onClickGetDWSLSJAJXX(dwbm, type, sjtype, rqlx, startdate, enddate, exportExcel, '各院案件受理、审结数（件） -> ' + name);
                    }
                }
            }
        },
        yAxis: {
            gridLineColor: '#507696',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
        },
        tooltip: {
            useHTML: true
        },
        legend: {
            itemStyle: {
               
                color: '#0389bc'
                
            }
        },
       
        series: [
            {
                name: '受理',
                data: data1

            },
            {
                name: '审结',
                data: data2
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各院案件受理、审结数（件）',
            width: myWidth
        }
    });
    $('#xiaoer_tyyw_zzs2').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)',
            width:highchartsWidth
        },
        credits: {
            enabled: false
        },
        colors: ['#1aa19d', '#138ddd'],
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval('(' + categories + ')'),
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                 // dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        var dwbm = e.point.category.substr(9, 6);
                        var exportExcel = 0;
                        var name = '';
                        if (e.point.series.name == "受理") {
                            type = '0';
                            name = '受理';
                        } else if (e.point.series.name == "审结") {
                            type = '1';
                            name = '审结';
                        }
                        onClickGetDWSLSJAJXX(dwbm, type, sjtype, rqlx, startdate, enddate, exportExcel, '各院案件受理、审结数（件） -> ' + name);
                    }
                }
            }
        },
        yAxis: {
            gridLineColor: '#4f7794',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
        },
        tooltip: {
            
        },

        legend: {
            enabled: false
        },
       
        series: [
            {
                name: '受理',
                data: data1

            },
            {
                name: '审结',
                data: data2
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各院案件受理、审结数（件）',
            width: myWidth
        }
    });
}

function init_tyyw4(data) {

    $('#ajsls').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'bar',
            backgroundColor: 'transparent'
            //backgroundColor: 'rgba(255,255,255,.3)'
        },
        credits: {
            enabled: false
        },
        colors: ['#19a09c'],
        //tooltip: {
            //useHTML: true,
            //backgroundColor: '#fff',
            //style:{
            
           // }
        //},
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: [],
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        plotOptions: {
            bar: {
                colorByPoint: true,
                cursor: 'pointer',
                 //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        ShowProgress();
                        ywmc = e.point.name;
                        $.post('/Handler/TYYW/TYYWHandler.ashx', { action: 'GetLBAJTJ', dwbm: dqdwbm, ywmc: ywmc, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
                            function (result) {
                                init_tyyw5(result);
                                CloseProgress();
                            }
                        );
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
      
        series: [{
            name: '受理数量',
            data: eval('(' + data + ')')

        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各业务案件受理数（件）',
            width: myWidth
        }
    });
    $('#xiaoer_tyyw_zzs1').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)',
            width:highchartsWidth
        },
        credits: {
            enabled: false
        },
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: [],
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        plotOptions: {
            bar: {
                colorByPoint: true,
                cursor: 'pointer',
                // dataLabels: {
                   // enabled: true,
                   // allowOverlap: true,
                   // color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        ywmc = e.point.name;
                        $.post('/Handler/TYYW/TYYWHandler.ashx', { action: 'GetLBAJTJ', dwbm: dqdwbm, ywmc: ywmc, rqlx: rqlx, startdate: startdate, enddate: enddate, sjtype: sjtype },
                            function (result) {
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
        colors: ["#19a09c"],
        series: [{
            name: '受理数量',
            data: eval('(' + data + ')')     
}],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各业务案件受理数（件）',
            width: myWidth
        }
    });
}

function click_aj2(ajlb, count, ajzt, title) {

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

    var startTime = $("#datebox_tyywzs_Start").datebox('getValue');
    var endTime = $("#datebox_tyywzs_End").datebox('getValue');
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
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' - ' + title, '');
}

function init_tyyw5(data) {
    data = eval('(' + data + ')');
    $('#xiaoer_tyyw_zzs5').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(255,255,255,.3)',
            width:highchartsWidth
        },

        title: {
            text: ''
        },
  
        subtitle: {
            text: ''
        },
        tooltip: {
            useHTML: true
        },
        
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(data.lbmc),
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#507897'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各类别案件受理数（件）',
            width: myWidth
        },
    
        plotOptions: {
            column: {
                colorByPoint: true,
                cursor: 'pointer',
                // dataLabels: {
                 //   enabled: true,
                 //   allowOverlap: true,
                  //  color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        ajlbmc = e.point.category;
                        var name = '';
                        if (e.currentTarget.innerHTML.indexOf("受理") != -1) {
                            type = "0";
                            name = "受理";
                        } else if (e.currentTarget.innerHTML.indexOf("在办") != -1) {
                            type = "1";
                            name = "在办";
                        } else if (e.currentTarget.innerHTML.indexOf("已办") != -1) {
                            type = "2";
                            name = "已办";
                        } else if (e.currentTarget.innerHTML.indexOf("归档") != -1) {
                            type = "3";
                            name = "归档";
                        }

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetLBAJXX', '', '',
                            sjtype, rqlx, type, 0, '', startdate, enddate, 0, ywmc, ajlbmc,
                            true, 0, 16, '各类别案件受理数（件） -> ' + ajlbmc + " -> " + name);
                    }
                }
            }
        },

        series: [
            {
                name: '受理',
                data: eval(data.slsl),
                colors: ['#6f8aee']
               
            }, {
                name: '已办',
                data: eval(data.bjsl),
                colors: ['#e27261']
               
            }, {
                name: '在办',
                data: eval(data.zbsl),
                colors: ['#09acf4']
               
            },{
                name: '归档',
                data: eval(data.gdsl),
                colors: ['#44b350']
               
            }
        ],
        colors: ['#6f8aee', '#e27261', '#09acf4', '#44b350'],
    });

    $("#tyywModal_zzs5").window('open');
}

//function show_map_panel(dwbm) {
//    if (dwbm != null) {
//        for (var i = 0; i < mapData.length; i++) {
//            if (mapData[i].dwbm == dwbm) {
//                var map = $('.date_but>.date_but_click').attr("changeAtrr") + "受理案件数量：" + mapData[i].slajsl + "</br>";
//                map += $('.date_but>.date_but_click').attr("changeAtrr") + "分配案件数量：" + mapData[i].fpajsl + "</br>";
//                map += $('.date_but>.date_but_click').attr("changeAtrr") + "审结案件数量：" + mapData[i].sjajsl + "</br>";
//                map += $('.date_but>.date_but_click').attr("changeAtrr") + "未审结案件数量：" + mapData[i].wsjajsl;

//                iframe_tyyw.window.show_value(map);
//                break;
//            }
//        }
//    } else {
//        var map = "无地图数据";
//        iframe_tyyw.window.show_value(map);
//    }
//}

function show_map(dwbm) {

    //ShowProgress(); // 显示进度条
    
    //$('#cb_tyywzs_dwbm').combotree('setValue', dqdwbm);
    /*
        * 版    本：1.0.2018.0123
        * 修 改 者：zp
        * 修改内容：当前选中单位dqdwbm与传入单位dwbm不同时，应优先使用传入单位
        * 修改日期：2018-01-17
    */
    $('#cb_tyywzs_dwbm').combotree('setValue', dwbm);
    if (dwbm == dqdwbm)
        document.getElementById("radio_tyywzs_sjtype").checked = false;
    else {
        document.getElementById("radio_tyywzs_sjtype").checked = true;
        dqdwbm = dwbm;
    }
    zx(1);
}

function getywajsl() {
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

function getIndexAJXX(type, showColumn, showTime, exportExcel, sendEmail) {
    var name = '';
    if (type == 1) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(0).find('p').eq(0).text();
    }
    else if (type == 2) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(1).find('p').eq(0).text();
    }
    else if (type == 3) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(2).find('p').eq(0).text();
    }
    else if (type == 4) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(3).find('p').eq(0).text();
    }
    this.type = type;
    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX1', '', '', sjtype, rqlx, type, 0, '', showTime ? startdate : '', showTime ? enddate : '', sendEmail, '', '', false, showColumn, exportExcel, name);
}

function getIndexAJXX2(type, childType, isShowSendMail, showColumn, showTime, exportExcel, title) {
    //    if (isShowSendMail == true) {
    //        document.getElementById('btnSendEmail').style.display = "inline-block";
    //    }
    this.type = type;
    var name = '';
    if (type == 1) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(0).find('p').eq(0).text();
    }
    else if (type == 2) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(1).find('p').eq(0).text();
    }
    else if (type == 3) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(2).find('p').eq(0).text();
    }
    else if (type == 4) {
        name = $(".map_top").find('div').eq(0).find('ul').eq(0).find('li').eq(3).find('p').eq(0).text();
    }

    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX2', '', '', sjtype, rqlx, type, childType, '', showTime ? startdate : '', showTime ? enddate : '', isShowSendMail, '', '', false, showColumn, exportExcel, name + " -> " + title);

}

function onClickAJXX(handlerUrl, bmsah, ajmc, sjtype, rqlx, index, childType, cbr, dateStart, dateEnd, sendEmail, ywmc, ajlbmc, disableDate, showColumn, exportExcel, title) {
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
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' | ' + title, '');
}

function onClickGetDWSLSJAJXX(dwbm, type, sjtype, rqlx, dateStart, dateEnd, exportExcel, title) {
    var handlerUrl = '/Handler/TYYW/TYYWHandler.ashx?action=GetAJSLSJ_AJXX';
    if (dwbm == dqdwbm)
        sjtype = 1;
    var queryData = {
        bmsah: '',
        ajmc: '',
        dwbm: dwbm,
        rqlx: rqlx,
        sjtype: sjtype,
        type: type,
        childType: childType,
        cbr: '',
        disableDate: '',
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        ywmc: '',
        ajlbmc: '',
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' | ' + title, '');
}

/**
 * 日期空间，格式：YYYYMM
 * 
 * @param jObj
 *            jquery对象
 * @param dVal
 *            默认值
 * @returns
 */
function dateboxForMonth(objid) {
    var Obj = $('#'+ objid);
    Obj.datebox({    
            onShowPanel : function() {// 显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层    
                span.trigger('click'); // 触发click事件弹出月份层    
                if (!tds)    
                    setTimeout(function() {// 延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔    
                        tds = p.find('div.calendar-menu-month-inner td');    
                        tds.click(function(e) {    
                            e.stopPropagation(); // 禁止冒泡执行easyui给月份绑定的事件    
                            var year = /\d{4}/.exec(span.html())[0]// 得到年份    
                            , month = parseInt($(this).attr('abbr'), 10) + 1; // 月份    
                            Obj.datebox('hidePanel')// 隐藏日期对象    
                            .datebox('setValue', year + '-' + month); // 设置日期的值    
                        });    
                    }, 0);    
            },    
            parser : function(s) {// 配置parser，返回选择的日期    
                if (!s)    
                    return new Date();    
                var arr = s.split('-');    
                return new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);    
            },    
            formatter : function(d) {    
                var month = d.getMonth();  
                if(month<10){  
                    month = '0' + month;  
                }  
                if (d.getMonth() == 0) {    
                    return d.getFullYear()-1 + '-' + 12;    
                } else {    
                    return d.getFullYear() + '-' + month;    
                }    
            }// 配置formatter，只返回年月    
        });    
        var p = Obj.datebox('panel'), // 日期选择对象    
        tds = false, // 日期选择对象中月份    
        span = p.find('span.calendar-text'); // 显示月份层的触发控件  
}

// 获取月份的最后一天
function getlastday(year,month)      
{      
 var new_year = year;    //取当前地年份      
 var new_month = month++;//取下一个月地第一天，方便计算（最后一天不固定）      
 if(month>12)            //如果当前大于12月，则年份转到下一年      
 {      
  new_month -=12;        //月份减      
  new_year++;            //年份增      
 }      
 var new_date = new Date(new_year,new_month,1);                //取当年当月中地第一天  
 return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期      
}  