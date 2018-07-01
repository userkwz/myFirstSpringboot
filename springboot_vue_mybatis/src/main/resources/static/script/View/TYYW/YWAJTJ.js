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
//var mapData;
$(document).ready(function () {
    if (!CheckBrowser()) {
        return;
    }
    $('#tyywModal_zzs1').window('close');

    dqdwbm = unitCode;
    zx();
});

function zx(t) {

    if (t != 1) {
        //ShowProgress(); // 显示进度条
    }

    //表格
    //sjtype = $('#cbType').combobox('getValue', '');

    if (isTest) {
        var dateBegin = new Date();
    }
    $.ajax({
        type: "post",
        async: true,
        data: { dwbm: '370000', rqlx: '4', startdate: '', enddate: '', sjtype: '2' },
        url: "/Handler/TYYW/TYYWHandler.ashx?action=GetYWAJTJ",
        success: function (result) {
            if (isTest) {
                var dateEnd = new Date();
                console.log('GetYWAJTJ1:' + (dateEnd.getTime() - dateBegin.getTime()));
            }
            init_tyyw4(result);
        },
        error: function (data) {

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
            //backgroundColor: 'transparent'
            backgroundColor: '#08143C'
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
        plotOptions: {
            bar: {
                colorByPoint: true,
                cursor: 'pointer',
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
            data: eval(data)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各业务案件受理数（件）',
            width: 1200
        }
    });
    $('#xiaoer_tyyw_zzs1').highcharts({
        title: {
            text: '',
            floating: true
        },
        chart: {
            type: 'bar',
            //backgroundColor: 'transparent'
            backgroundColor: '#08143C'
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
        plotOptions: {
            bar: {
                colorByPoint: true,
                cursor: 'pointer',
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
        series: [{
            name: '受理数量',
            data: eval(data)
        }],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '各业务案件受理数（件）',
            width: 1200
        }
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
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}


function show_map(dwbm) {
    //ShowProgress(); // 显示进度条
    dqdwbm = dwbm;
    $('#cb_tyywzs_dwbm').combotree('setValue', dqdwbm);
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
    this.type = type;
    onClickAJXX('/Handler/TYYW/TYYWHandler.ashx?action=GetAJXX1', '', '', sjtype, rqlx, type, 0, '', showTime ? startdate : '', showTime ? enddate : '', sendEmail, '', '', false, showColumn, exportExcel);
}

function getIndexAJXX2(type, childType, isShowSendMail, showColumn, showTime, exportExcel) {
    //    if (isShowSendMail == true) {
    //        document.getElementById('btnSendEmail').style.display = "inline-block";
    //    }
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

function onClickGetDWSLSJAJXX(dwbm, type, sjtype, rqlx, dateStart, dateEnd, exportExcel) {
    var handlerUrl = '/Handler/TYYW/TYYWHandler.ashx?action=GetAJSLSJ_AJXX';
    if (dwbm == unitCode)
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
    frameObject.OpenDialogWeb(0, baseUrl + caseListUrl, handlerUrl, jsonStr, '', '');
}