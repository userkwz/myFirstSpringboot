//@ sourceURL=TYYWLYST.js
var rqlx = "4";
var ywbm;
var ywmc;
var dwbm;
var dwmc;
var lbmc;
var bmbm;
var gh;
var ajzt;
var dwlist;
var startdate = "";
var enddate = "";
var procName = "";
var type;
var showType;
$(function () {
    $('#tyywywfxModal1').window('close');
    $('#tyywywfxModal2').window('close');
    $('#tyywywfxModal3').window('close');
    var user = frameObject.GetUserInfo();
    dwbm = user.UnitCode;
    AddOperationLog('统一业务助手-业务分析');
    $('.date_but div').click(function () {
        $('.date_but .date_but_click').removeClass("date_but_click");
        $(this).addClass("date_but_click");
        rqlx = $(this).attr("value");
        startdate = "";
        enddate = "";
        loadData();
    });
    // 单位编码ComboTree初始化
    $('#cb_tyywywfx_dwbm').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + dwbm,
        onLoadSuccess: function () {
            $('#cb_tyywywfx_dwbm').combotree('setValue', dwbm);
            LoadYWLBList();
        },
        onSelect: function (node) {
            dwbm = node.id;
            LoadYWLBList();
        },
        onLoadError: function (data) {
            alert("Error:" + data.responseText);
        }
    });

    $("#btnSearch_tyywywfx").click(function () {
        startdate = $("#dateStart_tyywywfx").datebox('getValue');
        enddate = $("#dateEnd_tyywywfx").datebox('getValue');
        if (startdate == "" || enddate == "") {
            alert("请选择时间范围！");
            return;
        }
        $(".date_but_click").removeClass("date_but_click");
        rqlx = "";
        loadData();
    });
});

function reload() {
    if (procName == "GetSASJAJXX") {
        var queryData = { action: procName, dwbm: dwbm, ywbm: ywbm, ajlbmc: lbmc, bmsah: $("#txt_case_sabmsah").val(), ajmc: $("#txt_case_saajmc").val(), rqlx: rqlx, startdate: startdate, enddate: enddate, type: type };
        $('#dg_saaj').datagrid({
            queryParams: queryData,
            url: '/Handler/TYYW/TYYWHandler.ashx',
            loadMsg: '数据加载中，请稍候...'
        });
    } else if (procName == "GetRYAJXX") {
        var queryData = { action: procName, dwbm: dwbm, ywbm: ywbm, bmbm: bmbm, gh: gh, ajzt: ajzt, bmsah: $("#txt_case_bmsah").val(), ajmc: $("#txt_case_ajmc").val(), rqlx: rqlx, startdate: startdate, enddate: enddate };
        $('#dg_ybaj').datagrid({
            queryParams: queryData,
            url: '/Handler/TYYW/TYYWHandler.ashx',
            loadMsg: '数据加载中，请稍候...'
        });
    } else {
        var queryData = { action: procName, dwbm: dwbm, ywbm: ywbm, ajlbmc: lbmc, bmsah: $("#txt_case_bmsah").val(), ajmc: $("#txt_case_ajmc").val(), rqlx: rqlx, startdate: startdate, enddate: enddate };
        $('#dg_ybaj').datagrid({
            queryParams: queryData,
            url: '/Handler/TYYW/TYYWHandler.ashx',
            loadMsg: '数据加载中，请稍候...'
        });
    }
}

function loadData() {

    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dwbm, ywbm: ywbm, rqlx: rqlx, startdate: startdate, enddate: enddate },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetTXFX",
        success: function (result) {
            var data = eval('(' + result + ')');
            LoadAJLBTJList(data.ajlbtj);
            LoadSLQSTJList(data.slqstj);
            LoadRYAJTJList(data.ryajtj);
            LoadSASJTJList(data.sasjtj);
        },
        error: function (data) {

        }
    });
}

function LoadYWLBList() {
    $.ajax({
        type: "post",
        async: true,
        data: {},
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetYWLB",
        success: function (result) {
            var data = eval('(' + result + ')');
            var strHtml = "";
            var jdb = '';
            var j = 0;
            var ss = '';
            var ft = '';
            var ftywbm = '';
            var fd = '';
            var fdywbm = '';
            for (var i = 0; i < data.length; i++) {
                var xsyw = data[i].ywmc;
                if (xsyw == '监督办') {
                    jdb = eval(data[i]);
                    continue;
                }
                if (i == 1) {
                    ywmc = data[i].ywmc + "业务";
                }

                if (data[i].ywbm != "98" && data[i].ywbm != "99") {
                    xsyw = data[i].ywmc + "业务";
                }
                if (data[i].ywbm == '09' || data[i].ywbm == '08') {
                    if (data[i].ywbm == '09') {
                        fd = xsyw;
                        fdywbm = data[i].ywbm;
                    } else if (data[i].ywbm == '08') {
                        ft = xsyw;
                        ftywbm = data[i].ywbm;
                    } else {
                    }
                    ss = "-1";
                    if (ss != '' && ft != '' && fd != '') {
                        strHtml += "<div class=\"tyywzs_home_big_left_fl\"  value=\"-1\">";
                        strHtml += "<div class=\"ksyw\"></div>";
                        strHtml += "<div class=\"ywsize\">控申业务</div>";
                        strHtml += "<div class=\"drop_down\"></div>";
                        strHtml += "<div class=\"ul_li\">";
                        strHtml += "<ul value = " + ftywbm + " style='cursor:pointer'><li>" + ft + "</li></ul>";
                        strHtml += "<ul value = " + fdywbm + " style='cursor:pointer'><li>" + fd + "</li></ul>";
                        strHtml += "</div></div>";
                    }
                } else {
                    if (j == 0) {
                        strHtml += "<div class=\"tyywzs_home_big_left_fl ywfl_click\" value=\"" + data[i].ywbm + "\" style='cursor:pointer'><div class=\"zcyw\"></div><div class=\"ywsize\"style=\"\">" + xsyw + "</div></div>";

                        ywbm = data[i].ywbm;
                        j++;
                    } else {
                        strHtml += "<div class=\"tyywzs_home_big_left_fl\" value=\"" + data[i].ywbm + "\" style='cursor:pointer'><div class=\"zcyw\"></div><div class=\"ywsize\">" + xsyw + "</div></div>";
                    }
                }
            }
            strHtml += "<div class=\"tyywzs_home_big_left_fl\" value=\"" + jdb.ywbm + "\" style='cursor:pointer'><div class=\"zcyw\"></div><div class=\"ywsize\">" + jdb.ywmc + "业务</div></div>";


            document.getElementById("ywDiv").innerHTML = strHtml;
            $('.tyywzs_home_big_left_fl').click(function () {
                $('.ywfl_click').removeClass("ywfl_click");
                $(this).addClass("ywfl_click");
              
                if ($(this).attr("value") != "-1") {
                    $(".ul_li").slideUp();
                    ywbm = $(this).attr("value");
                    ywmc = $(this).find(".ywsize").text();
                    loadData();
                }
                else {
                    $(".ul_li").slideDown();
                }
            });
            $('.ul_li>ul').click(function () {
                $('.li_xl_click').removeClass("li_xl_click");
                $(this).addClass("li_xl_click");

                ywbm = $(this).attr("value");
                ywmc = $(this).find('li').text();
                loadData();
            });
            loadData();
//$(".drop_down").click(function () {
              //  $(this).siblings(".ul_li").toggle();
            //});
           // $(".drop_down").click(function () {
               // var thisstyle = $(this).siblings(".ul_li").css('display');
               // if (thisstyle == 'none') {
               //     $(this).siblings(".ul_li").slideDown();
               // }
                //else {
                   // $(this).siblings(".ul_li").slideUp();
               // }
           // });
            //            $(".tyywzs_home_big_left_fl").mouseover(function() {
            //                $(this).children(".ywsize").css("color", "#0FF");
            //                $(this).siblings().children(".ywsize").css("color", "#0395d0");
            //            });
            //$(".tyywzs_home_big_left_fl").click(function () {
            //    $(this).children(".ywsize").css("color", "#FF9000");
            //    $(this).siblings().children(".ywsize").css("color", "#0395d0");
            //});
        },
        error: function (data) {

        }
    });
}

var ryajtjData;

function LoadRYAJTJList(result) {
    ryajtjData = eval('(' + result + ')');
    document.getElementById("bmTabs").innerHTML = "";
    var bmmc = '';
    for (var i = 0; i < ryajtjData.length; i++) {
        if (bmmc == "" || bmmc != ryajtjData[i].bmmc) {
            bmmc = ryajtjData[i].bmmc;
        }
        if (i > 0 && i + 1 < ryajtjData.length) {
            if (bmmc != ryajtjData[i + 1].bmmc) {
                document.getElementById("bmTabs").innerHTML += "<li>" + ryajtjData[i].bmmc + "</li>";
            }
        } else if (i + 1 == ryajtjData.length) {
            document.getElementById("bmTabs").innerHTML += "<li>" + ryajtjData[i].bmmc + "</li>";
        }
    }
    $("#bmTabs>li:first-child").addClass("tyywzs_home_uldiv_click");
    var selectBMMC = $("#bmTabs>li:first-child").text();
    initRYSLList(selectBMMC);
    $("#bmTabs>li").click(function() {
        $('.tyywzs_home_uldiv_click').removeClass("tyywzs_home_uldiv_click");
        $(this).addClass("tyywzs_home_uldiv_click");
        var bmmc = $(this).text();
        initRYSLList(bmmc);
    });
}

function initRYSLList(bmmc) {
    var ryslHtml = "<table cellpadding=\"0\" cellspacing=\"0\" class=\"tba_top\"><tr class=\"tabe_tr1\"><td>检察官</td><td>在办</td><td>办结</td><td>归档数</td></tr>";
    for (i = 0; i < ryajtjData.length; i++) {
        if (bmmc != ryajtjData[i].bmmc) {
            continue;
        }

        ryslHtml += "<tr class=\"tabe_tr\"><td>" + ryajtjData[i].rymc + "</td>";

        if (ryajtjData[i].zbajsl > 0) {
            ryslHtml += "<td><a href=\"javascript:getRYAJXX('" + ryajtjData[i].gh + "','" + ryajtjData[i].bmbm + "','" + ryajtjData[i].bmmc + "','1','在办')\">" + ryajtjData[i].zbajsl + "</a></td>";
        } else {
            ryslHtml += "<td>" + ryajtjData[i].zbajsl + "</td>";
        }
        if (ryajtjData[i].bjajsl > 0) {
            ryslHtml += "<td><a href=\"javascript:getRYAJXX('" + ryajtjData[i].gh + "','" + ryajtjData[i].bmbm + "','" + ryajtjData[i].bmmc + "','2','办结')\">" + ryajtjData[i].bjajsl + "</a></td>";
        } else {
            ryslHtml += "<td>" + ryajtjData[i].bjajsl + "</td>";
        }
        if (ryajtjData[i].gdajsl > 0) {
            ryslHtml += "<td><a href=\"javascript:getRYAJXX('" + ryajtjData[i].gh + "','" + ryajtjData[i].bmbm + "','" + ryajtjData[i].bmmc + "','3','归档')\">" + ryajtjData[i].gdajsl + "</a></td></tr>";
        } else {
            ryslHtml += "<td>" + ryajtjData[i].gdajsl + "</td></tr>";
        }
    }
    ryslHtml += "</table>";
    document.getElementById("ryfpajList").innerHTML = ryslHtml;
}

function getRYAJXX(gh, bmbm, bmmc, ajzt, ztmc) {
    this.bmbm = bmbm;
    this.gh = gh;
    this.ajzt = ajzt;

    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetRYAJXX', '', '', 0, rqlx, ajzt, bmbm, gh, startdate, enddate, 0, ywbm, lbmc, 21, bmmc, ywmc + ' -> ' + bmmc + ' -> ' + ztmc);
}

function LoadAJLBTJList(result) {

    var data = eval('(' + result + ')');
    //绑定案件类别统计
    var mc = "[";
    var sl = "[";
    var tj = "[";
    for (var i = 0; i < data.length; i++) {
        mc += "'" + data[i].ajlbmc + "',";
        sl += data[i].tjsl + ",";
        tj += "{name:'" + data[i].ajlbmc + "', data :[" + data[i].tjsl + "], id:[" + data[i].ajlbbm + "]},";
    }
    if (mc.length > 1) {
        mc = mc.substring(0, mc.length - 1) + "]";
        sl = sl.substring(0, sl.length - 1) + "]";
        tj = tj.substring(0, tj.length - 1) + "]";
    } else {
        mc = "[]";
        sl = "[]";
        tj = "[]";
    }
    $('#tyyw_pie1').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent'
            //backgroundColor: '#08143C'

        },

        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        title: {
            text: '',
            floating: true
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '#A6D1EC',
            categories: [ywmc],
            labels: {
                style: {
                    color: '#606060'
                }
            }
        },
        tooltip: {
            useHTML: true
        },
        yAxis: {
            gridLineColor: '#A6D1EC',
            min: 0,
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                //dataLabels: {
                    //enabled: true,
                   // allowOverlap: true,
                    //color: '#0ff'
                //},
                events: {
                    click: function(e) {
                        lbmc = e.point.series.name;
                        procName = "GetAJLBAJXX";

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJLBAJXX', '', '', 0, rqlx, 0, '', '', startdate, enddate, 0, ywbm, lbmc, 20, '',  ywmc + ' -> ' + lbmc);
                    }
                }
            }
        },
        series: eval(tj),
        colors: ["#44b350", "#9572cf", "#09acf4", "#84c365", "#32b2ae", "#e27261", "#138ddd"],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件受理数（件）',
            width: myWidth
        }
    });
    $('#xiaoer_tyywywfx1').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent'
        },
        title: {
            text: '',
            floating: true
        },
        colors: ["#44b350", "#9572cf", "#09acf4", "#84c365", "#32b2ae", "#e27261", "#138ddd"],
        legend: {
            itemStyle: {
                color: '#0389bc'
            }
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
            categories: [ywmc],
            labels: {
                style: {
                    color: '#606060'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
            labels: {
                style: {
                    color: '#606060'
                }
            },
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color: '#0ff'
                //},
                events: {
                    click: function(e) {
                        lbmc = e.point.series.name;
                        procName = "GetAJLBAJXX";

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJLBAJXX', '', '', 0, rqlx, 0, '', '', startdate, enddate, 0, ywbm, lbmc, 20, '', ywmc + ' -> ' + lbmc);
                    }
                }
            }
        },
        series: eval(tj),
        
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件受理数（件）',
            width: myWidth
        }
    });
}

function LoadSLQSTJList(result) {

    var data = eval('(' + result + ')');

    //受理趋势
    $('#tyyw_pie2').highcharts({

        chart: {
            backgroundColor: 'transparent'
            //backgroundColor: '#08143C'
        },

        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '#00e1e1',
            categories: data[0].SJ,
            labels: {
                style: {
                    color: '#606060'
                }
            },
            crosshair: true
        },
        plotOptions: {
            //line: {
            //    dataLabels: {
            //        enabled: true
            //    },
            //    enableMouseTracking: false
            //}

        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        yAxis: {
        
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        series: eval(data),
        colors: ["#0c74c8", "#1ea29f", "#db6151", "#06abf3", "#597384"],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件类别受理趋势（件）',
            width: myWidth
        }
    });
    $('#xiaoer_tyywywfx2').highcharts({
        chart: {
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width: highchartsWidth
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },

        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '#A6D1EC',
            categories: data[0].SJ,
            labels: {
                style: {
                    color: '#00e1e1'
                }
            },
            crosshair: true
        },
        plotOptions: {
            //line: {
            //    dataLabels: {
            //        enabled: true
            //    },
            //    enableMouseTracking: false
            //}

        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
        series: eval(data),

        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件类别受理趋势（件）',
            width: myWidth
        }
    });
    var len = eval(data).length;
    for (var i = 5; i < len; i++) {
        $("#tyyw_pie2").highcharts().series[i].hide();
        $("#xiaoer_tyywywfx2").highcharts().series[i].hide();
    }
}

function LoadSASJTJList(result) {
    var data = eval('(' + result + ')');
    //绑定案件类别统计
    var sl1 = "[0]";
    var sl2 = "[0]";
    if (data.length > 0) {
        sl1 = "[" + data[0].sasl + "]";
        sl2 = "[" + data[0].sjsl + "]";
    }
    $('#tyyw_pie3').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent'
            //backgroundColor: '#08143C'
        },

        legend: {
            itemStyle: {
                color: '#0389bc'
            }
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
            categories: [ywmc],
            labels: {
                style: {
                   // color: '#7fa5c3'
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
                    //color: '#0389bc'
                }
            }
        },
        plotOptions: {
            //dataLabels: {
               // enabled: true,
                //allowOverlap: true,
                //color: '#0ff'
           // },
            column: {
                cursor: 'pointer',
                events: {
                    click: function(e) {
                        lbmc = e.point.series.name;
                        type = e.point.series.options.id;

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetSASJAJXX', '', '', 0, rqlx, 0, '', '', startdate, enddate, type, ywbm, lbmc, 22, '', ywmc + ' -> ' + lbmc);
                    }
                }
            }
        },
        series: [
            {
                name: '送案',
                data: eval(sl1),
                id: 1
            }, {
                name: '送卷',
                data: eval(sl2),
                id: 2
            }
        ],
        colors: ["#138ddd", "#32b2ae"],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '送案送卷分析（件）',
            width: myWidth
        }
    });
    $('#xiaoer_tyywywfx3').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width:highchartsWidth
        },

        legend: {
            itemStyle: {
                color: '#0389bc'
            }
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
            categories: [ywmc],
            labels: {
                style: {
                    color: '#002146'
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
            dataLabels: {
                enabled: true,
                allowOverlap: true,
                color: '#0ff'
            },
            column: {
                cursor: 'pointer',
                //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                   // color: '#0ff'
               // },
                events: {
                    click: function(e) {
                        lbmc = e.point.series.name;
                        type = e.point.series.options.id;

                        onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetSASJAJXX', '', '', 0, rqlx, 0, '', '', startdate, enddate, type, ywbm, lbmc, 22, '', ywmc + ' -> ' + lbmc);
                    }
                }
            }
        },
        series: [
            {
                name: '送案',
                data: eval(sl1),
                id: 1
            }, {
                name: '送卷',
                data: eval(sl2),
                id: 2
            }
        ],
        colors: ["#138ddd", "#32b2ae"],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '送案送卷分析（件）',
            width: myWidth
        }
    });
}

function tyywywfxModal1Open() {
    $('#tyywywfxModal1').window('open');
}
function tyywywfxModal2Open() {
    $('#tyywywfxModal2').window('open');
}
function tyywywfxModal3Open() {
    $('#tyywywfxModal3').window('open');
}

function onClickAJXX(handlerUrl, bmsah, ajmc, sjtype, rqlx, ajzt, bmbm, gh, dateStart, dateEnd, type, ywbm, ajlbmc, exportExcel, bmmc, title) {
    var time = new Date();
    var dwbm = this.dwbm;

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: bmsah,
        ajmc: ajmc,
        dwbm: dwbm,
        rqlx: rqlx,
        sjtype: sjtype,
        type: type,
        ajzt: ajzt,
        bmbm: bmbm,
        bmmc: bmmc,
        gh: gh,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: 0, //是否显示发送邮件按钮
        ywbm: ywbm,
        ajlbmc: ajlbmc,
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' | ' + title, '');
}