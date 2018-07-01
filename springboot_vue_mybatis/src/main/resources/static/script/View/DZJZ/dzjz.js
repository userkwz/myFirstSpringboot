//@ sourceURL=dzjz.js
var v_type;
var v_ajlb = "";
var query = "";
var v_zzlx;
var v_lbbm = "";

var v_dwbm;
var v_count;
var v_sjtype;
var tabIndex = 0;
$(function () {
    var user = frameObject.GetUserInfo();
    //var url = new UrlSearch();
    var date = new Date();
    var yearList = getYearList();
    var monthList = getMonthList();
    $('#cmbYearS').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearE').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthS').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbMonthE').combobox({
        data: monthList,
        valueField: 'id',
        textField: 'text'

    });
    $('#cmbYearS').combobox('select', date.getFullYear());
    $('#cmbMonthS').combobox('select', 1);
    $('#cmbYearE').combobox('select', date.getFullYear());
    $('#cmbMonthE').combobox('select', date.getMonth() + 1);

    //查询
    $('#btn_dzjzfx_Search').click(function () {
        initCount = 0;
        click_dzjz_zzs(2, true);
        return false;
    });

    // 单位编码ComboTree初始化
    $('#cboDWBM').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cboDWBM').combotree('setValue', user.UnitCode);
            click_dzjz_zzs(2, true); //初始调用
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#ckbDWBM').attr("checked", false);
                $("#ckbDWBM").attr("disabled", "disabled");
            } else {
                $("#ckbDWBM").removeAttr("disabled");
            }
        },
        onLoadError: function (data) {
            //alert("Error:" + data.responseText);
        }
    });

    AddOperationLog('电子卷宗分析助手');
    $('#dzjzModal_zzs1').window('close');
    $('#dzjzModal_zzs2').window('close');
    $('#dzjzModal_zzs3').window('close');

    $('#div_tit1').click(function () {
        tabIndex = 0;
        $('#div_tit2').removeClass('tit_bag');
        //        $(".chart_con>div").attr("id", "xiaoer_dzjz_zzs");
        document.getElementById('xiaoer_dzjz_zzs').style.display = 'block';
        document.getElementById('xiaoer_dzjz_zzl').style.display = 'none';
        //click_dzjz_zzs(2);
        $(this).addClass('tit_bag');
    });
    $('#div_tit2').click(function () {
        tabIndex = 1;
        $('#div_tit1').removeClass('tit_bag');
        //        $(".chart_con>div").attr("id", "xiaoer_dzjz_zzl");
        document.getElementById('xiaoer_dzjz_zzs').style.display = 'none';
        document.getElementById('xiaoer_dzjz_zzl').style.display = 'block';
        //click_dzjz_zzs(2);
        $(this).addClass('tit_bag');
    });

});

//电子卷宗制作数
function click_dzjz_zzs(type, isupdate) {
    var time = new Date();

    v_dwbm = $("#cboDWBM").combotree("getValue");
    var dwbm = v_dwbm;
    //处理本级单位
    if (document.getElementById("ckbDWBM").checked == false) {
        v_dwbm = "B" + v_dwbm;
    }

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var dateEnd = (monthe == 12 ? parseInt(yeare) + 1 : yeare) + "-" + (monthe == 12 ? 1 : (parseInt(monthe) + 1)) + "-01";

    if (isupdate) {
        var map = "../../View/Map/Index.html?dwbm=" + dwbm + "&dataType=2&dateStart=" + dateStart + "&dateEnd=" + dateEnd + "&selectedDwbm=" + unitCode + "&key=" + key;
        document.getElementById("iframe1").src = map;
    }

    //设置标题
    var tmp = years + "-" + months + "至" + yeare + "-" + monthe;
    document.getElementById("div_tit1").innerHTML = tmp + "电子卷宗制作数（件）";
    document.getElementById("div_tit2").innerHTML = tmp + "电子卷宗制作率（%）";
    document.getElementById("div_tit3").innerHTML = tmp + "不同案件类别制作数（件）";

    var queryData = { t: time.getMilliseconds(), dwbm: v_dwbm, dateStart: dateStart, dateEnd: dateEnd, type: '0', sjtype: '2' };

    if (type == 2) {
        //ShowProgress(); // 显示进度条
    }

    $.ajax({
        type: "get",
        async: true,
        data: queryData,
        url: "/Handler/DZJZ/DZJZHandler.ashx?action=GetDzjzSYTJ",
        success: function (result) {
            var data = eval('(' + result + ')');
            init_tj(data.tj);
            init_zzs(data.zzs);
            init_ajlb(data.ajlb);
            init_zdyajlb(queryData);
        },
        error: function (data) {
            CloseProgress();
            alert("error！");
        }
    });

}

function loadQuery() {
    var time = new Date();
    v_dwbm = $("#cboDWBM").combotree("getValue");
    //处理本级单位
    if (document.getElementById("ckbDWBM").checked == false) {
        v_dwbm = "B" + v_dwbm;
    }

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var dateEnd = (monthe == 12 ? parseInt(yeare) + 1 : yeare) + "-" + (monthe == 12 ? 1 : (parseInt(monthe) + 1)) + "-01";

    var queryData = { t: time.getMilliseconds(), dwbm: v_dwbm, dateStart: dateStart, dateEnd: dateEnd, type: '0', sjtype: '2' };
    return queryData;
}

function mapLoadBackCall2() {
    init_zdyajlb(loadQuery());
}

function init_tj(result) {
    var value = result == "" || result.length == 0 ? { YZZS: 0, WZZS: 0, ZS: 0, ZZL: 0, LSDCS: 0 } : result[0];

    $("#div_yzzaj").html("<p class='quantity'>" + (value.YZZS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(0,'',24,'已制作案件(件)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.YZZS + "</a>") : value.YZZS) + "</p>");
    $("#div_wzzs").html("<p class='quantity'>" + (value.WZZS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(1,'',3,'未制作案件(件)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.WZZS + "</a>") : value.WZZS) + "</p>");
    $("#div_yzzajs").html("<p class='quantity'>" + (value.ZS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(2,'',23,'应制作案件(件)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.ZS + "</a>") : value.ZS) + "</p>");
    $("#div_zzl").html("<p class='quantity'>" + value.ZZL + "</p>");
    $("#div_lsyddcajs").html("<p class='quantity'>" + (value.LSDCS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(3,'',25,'自决定制作案件（" + value.LSDCS + "件）')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.LSDCS + "</a>") : value.LSDCS) + "</p>");
}

function init_zzs(result) {

    var value = result == "" ? { MC: [], YZZSL: [], WZZSL: [] } : result;

    init_dzjz_zzs(value); //已制作卷宗案件数
    init_dzjz_zzl(value); //制作率
}

function init_ajlb(result) {
    var value = result == "" ? { MC: [], YZZSL: [], WZZSL: [] } : result;
    init_dzjz_zzllb(value);

    var zsHtml = '';
    var yzzHtml = '';
    var wzzHtml = '';
    
    for (var i = 0; i < value.BM.length; i++) {
        var mc = value.MC[i].substr(21, value.MC[i].indexOf("'>")-21);
            zsHtml += "<p>" + value.MC[i] + "<span>" +
            (value.ZSL[i] != 0 ?
                "<a class='quantity' onclick=\"onClickAJXX1(2,'" + value.BM[i] + "',24,'" + mc + "')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.ZSL[i] + "</a>" :
                value.ZSL[i]) + "</span></p>";
            yzzHtml += "<p>" + value.MC[i] + "<span>" +
            (value.YZZSL[i] != 0 ?
                "<a class='quantity' onclick=\"onClickAJXX1(0,'" + value.BM[i] + "',24,'" + mc + "')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.YZZSL[i] + "</a>" :
                value.YZZSL[i]) + "</span></p>";
            wzzHtml += "<p>" + value.MC[i] + "<span>" +
            (value.WZZSL[i] != 0 ?
                "<a class='quantity' onclick=\"onClickAJXX1(1,'" + value.BM[i] + "',24,'" + mc + "')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.WZZSL[i] + "</a>" :
                value.WZZSL[i]) + "</span></p>";
    }
    //应制作悬浮窗
    $("#span_yzz").html(zsHtml);
    //已制作悬浮窗
    $("#span_v1").html(yzzHtml);
    //未制作悬浮窗
    $("#span_wzz").html(wzzHtml);
}

var initCount=0;
function init_zdyajlb(queryData) {
    //等待其他数据加载完毕之后再加载比较费时的自定义类别案件
    initCount++;
    if (initCount < 2) return;
    $.ajax({
        type: "post",
        async: true,
        data: queryData,
        url: "/Handler/DZJZ/DZJZHandler.ashx?action=Query_Dzjz_tjdata_zdyajlb",
        success: function (result) {
            if (result != "" && result != null) {
                var value = eval('(' + result + ')');
                var html = '';
                for (var i = 0; i < value.length; i++) {
                    html += "<p><span title=\"" + value[i].mc + "\" class=\"ajlb_model\">" + value[i].mc + "</span><span>" +
                    (value[i].sl != 0 ?
                        "<a class='quantity' onclick=\"onClickAJXX1(3,'" + value[i].bm + "',25,'')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value[i].sl + "</a>" :
                        value[i].sl) + "</span></p>";
                }
                $("#span_v2").html(html);
            }
        },
        error: function (data) {

        }
    });
}
function init_dzjz_zzs(data) {
    var width = document.getElementById('dzjz_chart_con').clientWidth;
    var height = document.getElementById('dzjz_chart_con').clientHeight;
    $('#xiaoer_dzjz_zzs').highcharts({
        chart: {
            width: width,
            height: height,
            type: 'column',
            backgroundColor: 'transparent'
            //backgroundColor: '#08143C'
        },
        title: {
            text: '',
            floating: true,
        },
        colors: ['#148ce2', '#1aa29e'],
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
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#4b6e8c'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                  //dataLabels: {
                   // enabled: true,
                   // allowOverlap: true,
                   // color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        v_dwbm = e.point.category.substr(9, 6);
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        var name = e.point.category.substr(16, 2);
                        if (name == '本院' || name == '省院' || name == '市院') {
                            v_dwbm = 'B' + v_dwbm;
                            v_sjtype = '1';
                        }

                        v_zzlx = e.point.series.name;
                        v_ajlb = "";
                        onClickAJXX(v_zzlx == "未制作数" ? 1 : 0, "电子卷宗制作数（件）-> " + v_zzlx);
                    }
                }
            }

        },
        series: [
            {
                name: '已制作数',
             
                data: eval(data.YZZSL)
            }, {
                name: '未制作数',
              
                data: eval(data.WZZSL)
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '电子卷宗制作数(件)',
            width: myWidth
        }
    });
    $('#xiaoer_dzjz_zzs1').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width:highchartsWidth
        },
        colors: ['#148ce2', '#1aa29e'],
        title: {
            text: '',
            floating: true
        },
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
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#4b6e8c'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                cursor: 'pointer',
                 // dataLabels: {
                   // enabled: true,
                    //allowOverlap: true,
                    //color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        v_dwbm = e.point.category.substr(9, 6);
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        var name = e.point.category.substr(16, 2);
                        if (name == '本院' || name == '省院' || name == '市院') {
                            v_dwbm = 'B' + v_dwbm;
                            v_sjtype = '1';
                        }

                        v_zzlx = e.point.series.name;
                        v_ajlb = "";
                        onClickAJXX(v_zzlx == "未制作数" ? 1 : 0, "电子卷宗制作数（件）-> " + v_zzlx);
                    }
                }
            }
        },
        series: [
            {
                name: '已制作数',
             
                data: eval(data.YZZSL)
            }, {
                name: '未制作数',
          
                data: eval(data.WZZSL)
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '电子卷宗制作数(件)',
            width: myWidth
        }
    });
}

function init_dzjz_zzl(data) {
    var width = document.getElementById('dzjz_chart_con').clientWidth;
    var height = document.getElementById('dzjz_chart_con').clientHeight;
    $('#xiaoer_dzjz_zzl').highcharts({
        chart: {
            width: width,
            height: height,
            backgroundColor: 'transparent'
            //backgroundColor: '#08143C'
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
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#537387'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#537387'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '制作率',
            color: '#0e72c7',
            data: eval(data.ZZL)
        },
        {
            name: '平均率',
            color: '#1fa49f',
            data: eval(data.PJ)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '电子卷宗制作率(%)',
            width: myWidth
        }
    });
    $('#xiaoer_dzjz_zzl1').highcharts({
        chart: {
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width:highchartsWidth
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
        tooltip: {
            useHTML: true
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#4b6e8c'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '制作率',
            color: '#0f74c6',
            data: eval(data.ZZL)
        },
        {
            name: '平均率',
            color: '#1fa19f',
            data: eval(data.PJ)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '电子卷宗制作率(%)',
            width: myWidth
        }
    });
}

function init_dzjz_zzllb(data) {
    var width = document.getElementById('dzjz_chart_con_bottom').clientWidth;
    var height = 600;
    $('#xiaoer_dzjz_zzllb').highcharts({
        chart: {
            type: 'bar',
           backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width: width,
            height: height
        },
        title: {
            text: '',
            floating: true
        },
        colors: ['#148ce2', '#1aa29e'],
        subtitle: {
            text: ''
        },
        tooltip: {
            useHTML: true
        },
        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        xAxis: {
            tickWidth: 0,
            lineColor: '002146',
            categories: eval(data.MC),
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#4b6e8c'
                },
                align: 'right'
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
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
                cursor: 'pointer',
                borderWidth: 0,
                 // dataLabels: {
                   // enabled: true,
                   // allowOverlap: true,
                   // color:'#0ff'
                //},
                events: {
                    click: function (e) {
                        var ajlb = e.point.category.substr(9, 4);
                        var name = e.point.category.substr(21, e.point.category.indexOf("'>")-21);
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        v_zzlx = e.point.series.name;
                        v_ajlb = ajlb;
                        v_dwbm = $("#cboDWBM").combotree("getValue");
                        //处理本级单位
                        if (document.getElementById("ckbDWBM").checked == false) {
                            v_dwbm = "B" + v_dwbm;
                            v_sjtype = "1";
                        }
                        onClickAJXX(v_zzlx == "未制作数" ? 1 : 0, "不同案件类别制作数（件） -> " + v_zzlx);
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '已制作数',
      
            data: eval(data.YZZSL)
            
        },
            {
                name: '未制作数',
               
                data: eval(data.WZZSL)
                
            }
        ],
        
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '不同案件类别制作数(件)',
            width: myWidth
        }
    });
    $('#xiaoer_dzjz_zzllb1').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width:highchartsWidth
        },
        title: {
            text: ''
        },
        colors: ['#148ce2', '#1aa29e'],
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
            categories: eval(data.MC),
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#537387'
                }
            }
        },
        yAxis: {
            gridLineColor: '#002146',
            min: 0,
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
                cursor: 'pointer',
                borderWidth: 0,
                 // dataLabels: {
                  //  enabled: true,
                   // allowOverlap: true,
                  //  color:'#0ff'
                //},

                events: {
                    click: function (e) {
                        var ajlb = e.point.category.substr(9, 4);
                        var name = e.point.category.substr(21, e.point.category.indexOf("'>")-21);
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        v_zzlx = e.point.series.name;
                        v_ajlb = ajlb;
                        v_dwbm = $("#cboDWBM").combotree("getValue");
                        //处理本级单位
                        if (document.getElementById("ckbDWBM").checked == false) {
                            v_dwbm = "B" + v_dwbm;
                            v_sjtype = "1";
                        }
                        onClickAJXX(v_zzlx == "未制作数" ? 1 : 0, "不同案件类别制作数（件）-> " + name + " -> " + v_zzlx);
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: '已制作数',
     
                data: eval(data.YZZSL)
            },
            {
                name: '未制作数',
             
                data: eval(data.WZZSL)
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '不同案件类别制作数(件)',
            width: myWidth
        }
    });
}

//function show_map_panel(dwbm) {
//    if (dwbm != null) {
//        var time = new Date();
//        var years = $("#cmbYearS").combobox("getValue");
//        var months = $("#cmbMonthS").combobox("getValue");
//        var yeare = $("#cmbYearE").combobox("getValue");
//        var monthe = $("#cmbMonthE").combobox("getValue");

//        var queryData = { action: 'Query_Dzjz_map', t: time.getMilliseconds(), dwbm: dwbm, years: years, yeare: yeare, months: months, monthe: monthe };


//        //表格
//        $.post('/Handler/DZJZ/DZJZHandler.ashx', queryData,
//            function(result) {

//                var value = new Array();
//                value = result.split(";"); //分号

//                var map = "";

//                map += "已制作案件" + "</br>";
//                map += "制作数量：" + value[0] + "</br>";
//                map += "卷数：" + value[1] + "</br>";
////            map += "文件页数：" + value[2] + "</br>";
////            map += "存储大小：" + value[3] + "</br>";
//                map += "应制作案件数：" + value[4] + "</br>";
//                map += "制作率：" + value[5] + "</br>";
//                map += "律师阅卷导出案件数：" + value[6] + "</br>";

//                iframe1.window.show_value(map);
//            }
//        );
//    } else {
//        var map = "无地图数据";
//        iframe1.window.show_value(map);
//    }
//}

function show_map(dwbm) {

    //地图与界面数据进行联动
    if (dwbm != undefined) {
        $('#cboDWBM').combotree('setValue', dwbm);
        v_dwbm = dwbm;
        if (dwbm == unitCode)
            document.getElementById("ckbDWBM").checked = false;
        else {
            document.getElementById("ckbDWBM").checked = true;
        }
        click_dzjz_zzs(1);
    }

    var p_dwbm = "";
    //处理本级单位
    if (document.getElementById("ckbDWBM").checked == false) {
        p_dwbm = "B" + dwbm;
    } else {
        p_dwbm = dwbm;
    }
    var time = new Date();
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");

    //    var queryData = { action: 'Query_Dzjz_map', t: time.getMilliseconds(), dwbm: p_dwbm, years: years, yeare: yeare, months: months, monthe: monthe };


    //    //表格
    //    $.post('/Handler/DZJZ/DZJZHandler.ashx', queryData,
    //        function (result) {

    //            var value = new Array();
    //            value = result.split(";"); //分号

    //            var map = "";

    //            map += "已制作案件" + "</br>";
    //            map += "制作数量：" + value[0] + "</br>";
    //            map += "卷数：" + value[1] + "</br>";
    ////            map += "文件页数：" + value[2] + "</br>";
    ////            map += "存储大小：" + value[3] + "</br>";
    //            map += "应制作案件数：" + value[4] + "</br>";
    //            map += "制作率：" + value[5] + "</br>";
    //            map += "律师阅卷导出案件数：" + value[6] + "</br>";

    //            iframe1.window.show_value(map);
    //        }
    //    );
}

function dzjzzzs() {
    if (tabIndex == 0) {
        $('#dzjzModal_zzs1').window('open');

    } else {
        $('#dzjzModal_zzs2').window('open');

    }
}

function btajlbzzs() {
    $('#dzjzModal_zzs3').window('open');

    //    $('#dzjzModal_zzs3>.easy_model_kuang').css({ width: "80%", height: "80%" });
    //    $('#dzjzModal_zzs3').show();
}
$('#dzjzModal_zzs3>.easy_model_kuang>.easy_model_kuang_top>.easy_model_kuang_top_title>.easy_model_gb').click(function () {
    $('#dzjzModal_zzs3').hide();
});

function onClickAJXX(pIndex, title) {
    this.v_type = pIndex;
    v_lbbm = '';
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");

    var dateStart = years + "-" + months + "-01";
    var dateEnd = (monthe == 12 ? parseInt(yeare) + 1 : yeare) + "-" + (monthe == 12 ? 1 : (parseInt(monthe) + 1)) + "-01";

    onClickAJXX2('/Handler/DZJZ/DZJZHandler.ashx?action=Query_Dzjz_dzjztj_ajxx', pIndex, dateStart, dateEnd, v_ajlb, pIndex == 1 ? 3 : 24, title);
}

function onClickAJXX1(index, lbbm, exportExcel, title) {
    v_ajlb = '';
    v_lbbm = lbbm;
    v_dwbm = $("#cboDWBM").combotree("getValue");
    //处理本级单位
    //    if (document.getElementById("ckbDWBM").checked == false) {
    //        v_dwbm = "B" + v_dwbm;
    //    }
    v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
    this.v_type = index;

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");

    var dateStart = years + "-" + months + "-01";
    var dateEnd = (monthe == 12 ? parseInt(yeare) + 1 : yeare) + "-" + (monthe == 12 ? 1 : (parseInt(monthe) + 1)) + "-01";
    onClickAJXX2('/Handler/DZJZ/DZJZHandler.ashx?action=Query_Dzjz_dzjztj_ajxx', index, dateStart, dateEnd, v_ajlb, exportExcel, title);
}

function onClickAJXX2(handlerUrl, type, dateStart, dateEnd, ajlb, exportExcel, title) {
    var time = new Date();
    //var dwbm = $("#cboDWBM").combotree("getValue");
    var sendEmail = 0;
    if (type == 1)
        sendEmail = 3;
    if (v_sjtype == null) {
        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
    }
    //如果是二审抗诉案件或审判监督案件则查询此类案件的源案件类别
    var ajlbjh = '';
    if (v_lbbm == '0304'||ajlb=='0304') {
        v_lbbm = '';
        ajlb = '';
        ajlbjh = '(\'0304\',\'0311\',\'0325\',\'0326\')';
    }
    else if (v_lbbm == '0305'||ajlb=='0305') {
        v_lbbm = '';
        ajlb = '';
        ajlbjh = '(\'0305\',\'0901\',\'0903\',\'0913\')';
    }

    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: v_dwbm,
        type: type,
        sjtype: v_sjtype,
        dateStart: dateStart,
        dateEnd: dateEnd,
        sendEmail: sendEmail, //是否显示发送邮件按钮
        ajlb: ajlb,
        lbbm: v_lbbm,
        lbbmjh:ajlbjh,
        exportExcel: exportExcel,
        selectedUrl: selectedUrl
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' | ' + title, '');
}