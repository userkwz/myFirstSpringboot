//@ sourceURL=ajxxgk.js
var dwbm = '';
var dateStart = '';
var dateEnd = '';
var query = '';
var name = '';
var gklx;
var type;
var childType;
var v_sjtype;
var initCount = 0;
var wsgkData;
$(function () {
    //$('#dateStart_ajgkfx').datebox('setValue', getStartDate());
    //$('#dateEnd_ajgkfx').datebox('setValue', getEndDate());

    var user = frameObject.GetUserInfo();
    AddOperationLog('案件公开分析助手');
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
    $('#btn_ajgkfx_Search').click(function () {
        v_dwbm = $("#cboDWBM").combotree("getValue");
        click_ajxxgk(index);
    });

    // 单位编码ComboTree初始化
    $('#cboDWBM').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree&dwbm=' + user.UnitCode,
        onLoadSuccess: function () {
            $('#cboDWBM').combotree('setValue', user.UnitCode);
            v_dwbm = user.UnitCode;
            //页面初始化
            click_ajxxgk(0);
        },
        onSelect: function (node) {
            if (node.id == '000000') {
                $('#ckbDWBM ').attr("checked", false);
                $("#ckbDWBM").attr("disabled", "disabled");
            } else {
                $("#ckbDWBM").removeAttr("disabled");
            }
        },
        onLoadError: function (data) {
            //alert("Error:" + data.responseText);
        }
    });
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    
    var map = "../../View/Map/Index.html?dwbm=" + user.UnitCode + "&dataType=3&dateStart=" + dateStart + "&dateEnd=" + dateEnd + "&selectedDwbm=" + unitCode + "&key=" + key;
    document.getElementById("iframe2").src = map;

    $('#ajxxgkModal_qk').window('close');
    $('#ajxxgkModal_bl').window('close');
    $('#ajxxgkModal_jdxx').window('close');
});


function tabUpdate(type) {
    init_ajxxgk(type, wsgkData);
    init_ajxxgk_bl(type, wsgkData); //比例
}

function click_ajxxgk(type,loadMap) {
    initCount = 0;
    var time = new Date();

    dwbm = $("#cboDWBM").combotree("getValue");
    //处理本级单位
    if (document.getElementById("ckbDWBM").checked == false) {
        dwbm = "B" + dwbm;
    }

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    dateEnd = yeare + "-" + monthe + "-"+(new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日

    if (dateStart == "") {
        dateStart = getStartDate();
    }
    if (dateEnd == "") {
        dateEnd = getEndDate();
    }

    //设置标题
    var tmp = years + "-" + months + "至" + yeare + "-" + monthe;
    document.getElementById("div_tit1").innerHTML = tmp + "法律文书公开情况（件）";
    document.getElementById("div_tit2").innerHTML = tmp + "法律文书公开比例（%）";
    document.getElementById("div_tit3").innerHTML = tmp + "案件辩护人、诉讼代理人接待信息（次）";
   
    var queryData = { t: time.getMilliseconds(), index: type, dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };


    $.ajax({
        type: "post",
        async: true,
        data: queryData,
        url: "/Handler/agxe/agxeHandler.ashx?action=GetAJGKSYTJ",
        success: function (result) {
            var data = eval('(' + result + ')');
            init_tj(data.gktj);
            wsgkData = data.wsgk;
            init_wsgk(data.wsgk);
            inti_ajxxgk_jdxx(data.jdxx);
            if (loadMap != false) {
                var map = "../../View/Map/Index.html?dwbm=" + dwbm.replace('B', '') + "&dataType=3&dateStart=" + dateStart + "&dateEnd=" + dateEnd + "&selectedDwbm=" + dwbm.replace('B', '') + "&key=" + key;
                document.getElementById("iframe2").src = map;
            }
            var qssygk = wsgkData.QSSYGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xskssygk = wsgkData.XSKSSYGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var bqsjdsygk = wsgkData.BQSJDSYGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xsssfcjdsygk = wsgkData.XSSSFCJDSYGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var html1 = "<p><span title=\"起诉书：\" class=\"ajlb_model\">起诉书：</span><span>" + (qssygk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(1,1,'已公开法律文书(份) -> 起诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + qssygk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事抗诉书：\" class=\"ajlb_model\">刑事抗诉书：</span><span>" + (xskssygk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(2,1,'已公开法律文书(份) -> 刑事抗诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xskssygk + "</a>" : 0)
                + "</span></p><p><span title=\"不起诉决定书：\" class=\"ajlb_model\">不起诉决定书：</span><span>" + (bqsjdsygk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(0,1,'已公开法律文书(份) -> 不起诉决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + bqsjdsygk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事申诉复查决定书：\" class=\"ajlb_model\">刑事申诉复查决定书：</span><span>" + (xsssfcjdsygk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(3,1,'已公开法律文书(份) -> 刑事申诉复查决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xsssfcjdsygk + "</a>" : 0)
                + "</span></p><p>";
            $("#ygk_wslb").html(html1);

            var qsswgk = wsgkData.QSSWGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xsksswgk = wsgkData.XSKSSWGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var bqsjdswgk = wsgkData.BQSJDSWGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xsssfcjdswgk = wsgkData.XSSSFCJDSWGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var html2 = "<p><span title=\"起诉书：\" class=\"ajlb_model\">起诉书：</span><span>" + (qsswgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(1,2,'未公开法律文书(份) -> 起诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + qsswgk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事抗诉书：\" class=\"ajlb_model\">刑事抗诉书：</span><span>" + (xsksswgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(2,2,'未公开法律文书(份) -> 刑事抗诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xsksswgk + "</a>" : 0)
                + "</span></p><p><span title=\"不起诉决定书：\" class=\"ajlb_model\">不起诉决定书：</span><span>" + (bqsjdswgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(0,2,'未公开法律文书(份) -> 不起诉决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + bqsjdswgk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事申诉复查决定书：\" class=\"ajlb_model\">刑事申诉复查决定书：</span><span>" + (xsssfcjdswgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(3,2,'未公开法律文书(份) -> 刑事申诉复查决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xsssfcjdswgk + "</a>" : 0)
                + "</span></p><p>";
            $("#wgk_wslb").html(html2);

            var qssgk = wsgkData.QSSGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xskssgk = wsgkData.XSKSSGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var bqsjdsgk = wsgkData.BQSJDSGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var xsssfcjdsgk = wsgkData.XSSSFCJDSGK.reduceRight(function (prev, cur, index, array) {
                return prev + cur;
            }, 0);
            var html3 = "<p><span title=\"起诉书：\" class=\"ajlb_model\">起诉书：</span><span>" + (qssgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(1,0,'应公开法律文书(份) -> 起诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + qssgk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事抗诉书：\" class=\"ajlb_model\">刑事抗诉书：</span><span>" + (xskssgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(2,0,'应公开法律文书(份) -> 刑事抗诉书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xskssgk + "</a>" : 0)
                + "</span></p><p><span title=\"不起诉决定书：\" class=\"ajlb_model\">不起诉决定书：</span><span>" + (bqsjdsgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(0,0,'应公开法律文书(份) -> 不起诉决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + bqsjdsgk + "</a>" : 0)
                + "</span></p><p><span title=\"刑事申诉复查决定书：\" class=\"ajlb_model\">刑事申诉复查决定书：</span><span>" + (xsssfcjdsgk != 0 ? "<a class='quantity' onclick=\"onClickWSLB(3,0,'应公开法律文书(份) -> 刑事申诉复查决定书')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + xsssfcjdsgk + "</a>" : 0)
                + "</span></p><p>";
            $("#gk_wslb").html(html3);
        },
        error: function (data) {

        }
    });
}
function onClickWSLB(index, gklx, title) {
    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
    var exportExcel = 0;
    v_dwbm = $("#cboDWBM").combotree("getValue");
    if (gklx == '=') exportExcel = 30;
    else exportExcel = 31;
    onClickAJXX2('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_aj1', 0, 0, dateStart, dateEnd, '', gklx, index, exportExcel, 6, title);
}

function init_tj(result) {
    var value = result; //分号

    $("#div_ajcxxxx").html("<p class='quantity'>" + (value.XXSL != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(0,0,26,'程序性信息(件)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.XXSL + "</a>") : value.XXSL) + "</p>");
    $("#div_flwsgk").html("<p class='quantity'>" + (value.GKWS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(1,0,27,'应公开法律文书(份)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.GKWS + "</a>") : value.GKWS) + "</p>");
    $("#div_flwsygk").html("<p class='quantity'>" + (value.YGKWS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(2,0,28,'已公开法律文书(份)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.YGKWS + "</a>") : value.YGKWS) + "</p>");
    $("#div_flwswgk").html("<p class='quantity'>" + (value.WGKWS != 0 ? ("<a class='quantity' onclick=\"onClickAJXX1(3,0,28,'未公开法律文书(份)')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.WGKWS + "</a>") : value.WGKWS) + "</p>");
    $("#div_flwsgkl").html("<p class='quantity'>" + (value.GKWS != 0 ? (value.YGKWS * 100 / (value.GKWS)).toFixed(2) + '%' : '--%') + "</p>");
}

function init_wsgk(result) {
    var value = result == "" ? { MC: [], YGK: [], WGK: [] } : result;
    init_ajxxgk(index, value);
    init_ajxxgk_bl(index, value); //比例
}

function init_cxxxxlb() {
    //等待其他数据加载完毕之后再加载比较费时的自定义类别案件
    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd },
        url: "/Handler/agxe/agxeHandler.ashx?action=GetAJXXGKTJ_LB",
        success: function (result) {
            //CloseProgress(); // 如果提交成功则隐藏进度条

            var list = eval('(' + result + ')'); //分号
            //var html1 = "<p><span title=\"审查逮捕：\" class=\"ajlb_model\">审查逮捕：</span><span>" + (value.SCDBSL != 0 ? "<a class='quantity' onclick=\"onClickAJXX1(0,1)\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.SCDBSL + "</a>" : value.SCDBSL)
            //    + "</span></p><p><span title=\"审查起诉：\" class=\"ajlb_model\">审查起诉：</span><span>" + (value.SCQSSL != 0 ? "<a class='quantity' onclick=\"onClickAJXX1(0,2)\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.SCQSSL + "</a>" : value.SCQSSL)
            //    + "</span></p><p><span title=\"其他阶段：\" class=\"ajlb_model\">其他阶段：</span><span>" + (value.QTSL != 0 ? "<a class='quantity' onclick=\"onClickAJXX1(0,3)\" href='javascript:void(0)' style=\"text-decoration: none;\">" + value.QTSL + "</a>" : value.QTSL)
            //    + "</span></p><p>";
            var html1 = '',html2 = '';

            for (var i = 0; i < list.length; i++) {
                var j = i + 1;
                if (i == 2 || i == 3) {
                    html2 += "<p><span title=\"" + list[i].mc + "：\" class=\"ajlb_model\">" + list[i].mc + "：</span><span>" +
                        (list[i].sl != 0 ?
                            "<a class='quantity' onclick=\"onClickAJXX1(0," + j + ",0,'程序性信息(件) -> " + list[i].mc + "')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + list[i].sl + "</a>" :
                            list[i].sl)
                        + "</span>";
                } else {
                    html1 += "<p><span title=\"" + list[i].mc + "：\" class=\"ajlb_model\">" + list[i].mc + "：</span><span>" +
                        (list[i].sl != 0 ?
                            "<a class='quantity' onclick=\"onClickAJXX1(0," + j + ",0,'程序性信息(件) -> " + list[i].mc + "')\" href='javascript:void(0)' style=\"text-decoration: none;\">" + list[i].sl + "</a>" :
                            list[i].sl)
                        + "</span>";
                }
            }

            $("#span_v1").html(html2+html1);
        },
        error: function (data) {

        }
    });
}

function init_ajxxgk(index, data) {
    var ygkVal;
    var wgkVal;
    var subCategry;
    switch (index) {
    case 1:
        ygkVal = data.QSSYGK;
        wgkVal = data.QSSWGK;
        subCategry = "起诉书公开";
        break;
    case 2:
        ygkVal = data.XSKSSYGK;
        wgkVal = data.XSKSSWGK;
        subCategry = "刑事抗诉书公开";
        break;
    case 0:
        ygkVal = data.BQSJDSYGK;
        wgkVal = data.BQSJDSWGK;
        subCategry = "不起诉决定书公开";
        break;
    case 3:
        ygkVal = data.XSSSFCJDSYGK;
        wgkVal = data.XSSSFCJDSWGK;
        subCategry = "刑事申诉复查决定书公开";
        break;
    }
    var chart = {
        type: 'column',
        backgroundColor: 'transparent'
        //backgroundColor: '#08143C'
    };
    if (tabNumber == 1) {
        var width = document.getElementById('ajxxgk_bl').clientWidth;
        var height = document.getElementById('ajxxgk_bl').clientHeight;
        chart.width = width;
        chart.height = height;
    }
    $('#ajxxgk_' + index).highcharts({
        chart: chart,
        legend: {
            itemStyle: {
                color: '#0389bc'
            }
        },
        title: {
            floating: true,
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
            lineColor: '#a6d1ec',
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#507694'
                }
            }
        },
        yAxis: {
            gridLineColor: '#a6d1ec',
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
                borderWidth: 0,
                cursor: 'pointer',
                borderWidth: 0,
                //dataLabels: {
                    //enabled: true,
                   // allowOverlap: true,
                   // color: '#0ff'
                //},
                events: {
                    click: function (e) {
                        var id = e.point.category.substr(9, 6);
                        var stype = e.point.series.name;
                        v_dwbm = id;
                        var exportExcel = 0;
						v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        if (stype == '已公开数') {
                            v_gklx = "1";
                            exportExcel = 30;
                        }
                        else {
                            v_gklx = "2";
                            exportExcel = 31;
                        }
                        var name = e.point.category.substr(16, 2);
                        if (name == '本院' || name == '省院' || name == '市院') {
							v_sjtype = '1';
                        }
						
                        gklx = v_gklx;
//                        //处理市一级的重复情况 2017年5月12日10:39:44
//                        var fdwbm = $("#cboDWBM").combotree("getValue");
//                        if (fdwbm == dwbm) {
//                            gklx = "Y" + gklx;
//                        }
//                        else {
//                            gklx = "N" + gklx;
//                        }
                        query = 'Query_Ajxxgk_aj1';

                        click_aj(exportExcel, "法律文书公开情况（件）-> " + subCategry + " -> " + stype);
                    }
                }
            }
        },
        series: [{
            name: '已公开数',
            color: '#09acf4',
            data: eval(ygkVal)
             
        },
        {
            name: '未公开数',
            color: '#e27261',
            data: eval(wgkVal)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '法律文书公开情况（件）',
            width: myWidth
        }
    });
    $('#ajxxgk_index').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width: highchartsWidth
        },
        title: {
            floating: true,
            text: ''
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
                    color: '#507694'
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
                borderWidth: 0,
                cursor: 'pointer',
                borderWidth: 0,
                //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                   // color: '#0ff'
                //},
                events: {
                    click: function (e) {
                        var id = e.point.category.substr(9, 6);
                        var stype = e.point.series.name;
                        v_dwbm = id;
                        var exportExcel = 0;
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        if (stype == '已公开数') {
                            v_gklx = "1";
                            exportExcel = 30;
                        }
                        else {
                            v_gklx = "2";
                            exportExcel = 31;
                        }
                        var name = e.point.category.substr(16, 2);
                        if (name == '本院' || name == '省院' || name == '市院') {
                            v_sjtype = '1';
                        }

                        gklx = v_gklx;
//                        //处理市一级的重复情况 2017年5月12日10:39:44
//                        var fdwbm = $("#cboDWBM").combotree("getValue");
//                        if (fdwbm == dwbm) {
//                            gklx = "Y" + gklx;
//                        }
//                        else {
//                            gklx = "N" + gklx;
//                        }
                        query = 'Query_Ajxxgk_aj1';
                        click_aj(exportExcel, "法律文书公开情况（件）-> " + stype);
                    }
                }
            }
        },
        series: [{
            name: '已公开数',
            color: '#09acf4',
            data: eval(ygkVal)
        },
        {
            name: '未公开数',
            color: '#e27261',
            data: eval(wgkVal)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '法律文书公开情况（件）',
            width: myWidth
        }
    });
}

function init_ajxxgk_bl(index, data) {
    var bl;
    var pj;
    switch (index) {
        case 0:
            bl = data.BQSJDSBL;
            pj = data.BQSJDSPJ;
            break;
        case 1:
            bl = data.QSSBL;
            pj = data.QSSPJ;
            break;
        case 2:
            bl = data.XSKSSBL;
            pj = data.XSKSSPJ;
            break;
        case 3:
            bl = data.XSSSFCJDSBL;
            pj = data.XSSSFCJDSPJ;
            break;
    }
    var chart = {
        backgroundColor: 'transparent'
        //backgroundColor: '#08143C'
    };
    if (tabNumber == 0) {
        var width = document.getElementById('ajxxgk_' + this.index).clientWidth;
        var height = document.getElementById('ajxxgk_' + this.index).clientHeight;
        chart.width = width;
        chart.height = height;
    }

    $('#ajxxgk_bl').highcharts({
        chart: chart,
        title: {
            floating: true,
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
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#507694'
                }
            }
        },
        yAxis: {
            gridLineColor: '#a6d1ec',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: '#0389bc'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        credits: {
            enabled: false
        },
        legend: {
            itemStyle: {
                color:'#0389bc'
            }
        },
        series: [
            {
                name: '比例',
                color: '#138ddd',
                data: eval(bl),
                marker: {
                    symbol: 'circle'
                }
            }, {
                name: '平均率',
                color: '#32b2ae',
                data: eval(pj),
                marker: {
                    symbol: 'circle'
                }
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '法律文书公开比例（%）',
            width: myWidth
        }
    });
    $('#ajxxgk_bl1').highcharts({
        chart: {
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width: highchartsWidth
        },
        title: {
            floating: true,
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
            categories: eval(data.MC),
            labels: {
                style: {
                    color: '#507694'
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
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        credits: {
            enabled: false
        },
        legend: {
            itemStyle: {
                color:'#0389bc'
            }
        },
        series: [
            {
                name: '比例',
                color: '#138ddd',
                data: eval(bl),
                marker: {
                    symbol: 'circle'
                }
            }, {
                name: '平均率',
                color: '#32b2ae',
                data: eval(pj),
                marker: {
                    symbol: 'circle'
                }
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '法律文书公开比例（%）',
            width: myWidth
        }
    });
}

function inti_ajxxgk_jdxx(data) {
    $('#ajxxgk_jdxx').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C'
        },
        title: {
            text: '',
            floating: true
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
            categories: eval(data.mc),
            labels: {
                style: {
                    color: '#507694'
                }
            }
        },
        yAxis: {
            gridLineColor: '#a6d1ec',
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
                cursor: 'pointer',
                borderWidth: 0,
                //dataLabels: {
                    //enabled: true,
                    //allowOverlap: true,
                    //color: '#0ff'
                //},
                events: {
                    click: function(e) {
                        name = e.point.category;
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        v_dwbm = $("#cboDWBM").combotree("getValue");
                        query = 'Query_Ajxxgk_gkjdxxtj_ajxx';
                        click_aj("","");
                    }
                }
            }
        },
        series: [
            {
                name: '接待信息',
                colorByPoint: true,
                data: eval(data.sl)
            }
        ],
        colors: ["#44b350", "#9572cf", "#09acf4", "#84c365", "#32b2ae", "#e27261", "#138ddd"],
        legend: {
            enabled:false,
            itemStyle: {
                color: '#0389bc'
            }
        },
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件辩护人、诉讼代理人接待信息（次）',
            width: myWidth
        }
    });
    $('#ajxxgk_jdxx1').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            //backgroundColor: '#08143C',
            width: highchartsWidth
        },
        title: {
            text: '',
            floating: true
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
            categories: eval(data.mc),
            labels: {
                style: {
                    color: '#0389bc'
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
                cursor: 'pointer',
                borderWidth: 0,
                //dataLabels: {
                   // enabled: true,
                  //  allowOverlap: true,
                   // color: '#0ff'
                //},
                events: {
                    click: function (e) {
                        name = e.point.category;
                        v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
                        v_dwbm = $("#cboDWBM").combotree("getValue");
                        query = 'Query_Ajxxgk_gkjdxxtj_ajxx';
                        click_aj("", "");
                    }
                }
            }
        },
        series: [
            {
                name: '接待信息',
                colorByPoint: true,
                data: eval(data.sl)
            }
        ],
        colors: ["#44b350", "#9572cf", "#09acf4", "#84c365", "#32b2ae", "#e27261", "#138ddd"],
        legend: {
            enabled:false,
            itemStyle: {
                color:'#0389bc'
            }
        },
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '案件辩护人、诉讼代理人接待信息（次）',
            width: myWidth
        }
    });
}

function show_map_panel(dwbm) {
    if (dwbm != null) {
        var time = new Date();
        var years = $("#cmbYearS").combobox("getValue");
        var months = $("#cmbMonthS").combobox("getValue");
        var yeare = $("#cmbYearE").combobox("getValue");
        var monthe = $("#cmbMonthE").combobox("getValue");
        var dateStart = years + "-" + months + "-01";
        var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
        var dateEnd = yeare + "-" + monthe + "-" + (new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日
//        var dateStart = $('#dateStart_ajgkfx').datebox('getValue');
//        var dateEnd = $('#dateEnd_ajgkfx').datebox('getValue');
        var queryData = { action: 'Query_Ajxxgk_map', t: time.getMilliseconds(), dwbm: dwbm, dateStart: dateStart, dateEnd: dateEnd };


        //表格
        $.post('/Handler/agxe/agxeHandler.ashx', queryData,
        function (result) {
            var value = eval('(' + result + ')');

            var map = "";

            map += "案件程序性信息：" + (value.length > 0 ? value[0].xxsl : 0) + "</br>";
            map += "辩护与代理预约：" + (value.length > 0 ? value[0].yysl : 0) + "</br>";
            map += "法律文书" + "</br>";
            map += "已公开数量：" + (value.length > 0 ? value[0].ygkwssl : 0) + "</br>";
            map += "办结案件数：" + (value.length > 0 ? value[0].bjajs : 0) + "</br>";
            map += "占办结案件百分比：" + (value.length > 0 ? value[0].bl : 0) + "</br>";

            iframe2.window.show_value(map);
        }
    );
    } else {
        var map = "无地图数据";
        iframe2.window.show_value(map);
    }
}

function show_map(dwbm) {

    //地图与界面数据进行联动
    if (dwbm != undefined) {
        $('#cboDWBM').combotree('setValue', dwbm);
        if (dwbm == unitCode)
            document.getElementById("ckbDWBM").checked = false;
        else {
            document.getElementById("ckbDWBM").checked = true;
        }
        click_ajxxgk(0,false);
    }

}

function mapLoadBackCall() {
    init_cxxxxlb();
}

function ajwsgkqk() {
    if (tabNumber == 0)
        $('#ajxxgkModal_qk').window('open');
    else {
        $('#ajxxgkModal_bl').window('open');
    }
}
function jdxx() {
    $('#ajxxgkModal_jdxx').window('open');
}

var v_dwbm = "";
var v_gklx = "";
function click_aj(exportExcel,title) {
    if (query == 'Query_Ajxxgk_aj1') {
//        $('#div_aj').window('open');
        reloadCaseInfo(exportExcel,title);
    }
    else if (query == 'Query_Ajxxgk_gkjdxxtj_ajxx') {
//        $('#div_aj').window('open');
        getAJXX();
    }
    else if (query == 'Query_Ajxxgk_ajgktj_ajxx') {
        onClickAJXX1(this.type, this.childType);
    }
}

function reloadCaseInfo(exportExcel,title) {

    var years = $("#cmbYearS").combobox("getValue");
    var months = $("#cmbMonthS").combobox("getValue");
    var yeare = $("#cmbYearE").combobox("getValue");
    var monthe = $("#cmbMonthE").combobox("getValue");
    var dateStart = years + "-" + months + "-01";
    var newdate = new Date(yeare, monthe, 1);                //取当年当月中的第一天          
    var dateEnd = yeare + "-" + monthe + "-"+(new Date(newdate.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日


    onClickAJXX2('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_aj1', 0, 0, dateStart, dateEnd, '', gklx, index, exportExcel, 6, title);
}

function getAJXX() {
	v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
	onClickAJXX2('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_gkjdxxtj_ajxx', 0, 0, dateStart, dateEnd, name, '', 0, 29, 4, "案件辩护人、诉讼代理人接待信息（次）-> " + name);
}


function onClickAJXX(index, childType, exportExcel, showColumn, title) {
	v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
	onClickAJXX2('/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_ajgktj_ajxx', index, childType, dateStart, dateEnd, '', '', 0, exportExcel, showColumn, title);
}

function onClickAJXX1(index, childType, exportExcel, title) {
    this.type = index;
    this.childType = childType;
    v_dwbm = $("#cboDWBM").combotree("getValue");
    var showColumn = 0;
    if (index == 2 || index == 3) showColumn = 6;
    onClickAJXX(index, childType, exportExcel, showColumn, title);
}

function onClickAJXX2(handlerUrl, type, childType, dateStart, dateEnd, lxmc, gklx, index, exportExcel, showColumn, title) {
    var time = new Date();
	if(v_sjtype == null)
	{
		v_sjtype = document.getElementById("ckbDWBM").checked ? "2" : "1";
	}
    var queryData = {
        t: time.getMilliseconds(),
        bmsah: '',
        ajmc: '',
        dwbm: v_dwbm,
        type: type,
        sjtype: v_sjtype,
        childType: childType,
        dateStart:  dateStart ,
        dateEnd:  dateEnd ,
        lxmc: lxmc,
        gklx: gklx,
        index: index,
        sendEmail: 0, //是否显示发送邮件按钮
        exportExcel: exportExcel,
        selectedUrl: selectedUrl,
        showColumn: showColumn
    };
    var jsonStr = JSON.stringify(queryData);
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, ' | ' + title, '');
}

var tabNumber = 0;
var index = 1;
$('#div_tit1').click(function () {
    $('#div_tit2').removeClass('tit_bag');
    tabNumber = 0;
    //    $(".tab_ajgjfx>div").attr("id", "ajxxgk_" + index);
    document.getElementById('ajxxgk_' + index).style.display = 'block';
    document.getElementById('ajxxgk_bl').style.display = 'none';
    //tabUpdate(index);
    $(this).addClass('tit_bag');
});
$('#div_tit2').click(function () {
    $('#div_tit1').removeClass('tit_bag');
    tabNumber = 1;
    //    $(".tab_ajgjfx>div").attr("id", "ajxxgk_bl");
    document.getElementById('ajxxgk_' + index).style.display = 'none';
    document.getElementById('ajxxgk_bl').style.display = 'block';
    //tabUpdate(index);
    $(this).addClass('tit_bag');
});
$('.chart_con p>.col_tab1').click(function () {
    $('.col_cilck').removeClass('col_cilck');
    //if (tabNumber == 0)
        $("#ajxxgk_" + index).attr("id", "ajxxgk_1");
    index = 1;
    tabUpdate(index);
    $(this).addClass('col_cilck');
});
$('.chart_con p>.col_tab2').click(function () {
    $('.col_cilck').removeClass('col_cilck');
    //if (tabNumber == 0)
        $("#ajxxgk_" + index).attr("id", "ajxxgk_2");
    index = 2;
    tabUpdate(index);
    $(this).addClass('col_cilck');
});
$('.chart_con p>.col_tab3').click(function () {
    $('.col_cilck').removeClass('col_cilck');
    //if (tabNumber == 0)
        $("#ajxxgk_" + index).attr("id", "ajxxgk_0");
    index = 0;
    tabUpdate(index);
    $(this).addClass('col_cilck');
});
$('.chart_con p>.col_tab4').click(function () {
    $('.col_cilck').removeClass('col_cilck');
    //if (tabNumber == 0)
        $("#ajxxgk_" + index).attr("id", "ajxxgk_3");
    index = 3;
    tabUpdate(index);
    $(this).addClass('col_cilck');
});