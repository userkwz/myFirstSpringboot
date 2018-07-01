//@ sourceURL=questionAnalyse.js

var wtaj = [];
// 基于准备好的dom，初始化echarts图表
var option;
var KStime = '';
var JStime = '';
var all;

//今天时间
var adate = new Date();
var d = adate.getFullYear() + "-" + (adate.getMonth()) + "-" + 01;
KStime = d;

$(function () {

    $('#modal').window('close');
    //日期设置格式
    $('#questionBeginTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            KStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    $('#questionBeginTime').datebox("setValue", d);
    var f = adate.getFullYear() + "-" + (adate.getMonth() + 1) + "-" + adate.getDate();
    JStime = f;
    $('#questionEndTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            JStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    $('#questionEndTime').datebox("setValue", f);
    // 单位编码ComboTree初始化
    $('#questionDW').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        onLoadSuccess: function () {
            $('#questionDW').combotree('setValue', unitCode);
        },
        onSelect: function (node) {
            //            if (node.id == '000000') {
            //                $('#ckbDWBM').attr("checked", false);
            //                $("#ckbDWBM").attr("disabled", "disabled");
            //            } else {
            //                $("#ckbDWBM").removeAttr("disabled");
            //            }
        },
        onLoadError: function (data) {
            //alert("Error:" + data.responseText);
        }
    });

    iceGetData(function (servicePrx) {
        servicePrx.getDWGZChooseStatisticalPuls(key, unitCode, '', '', KStime, JStime, 1, null).then(z_databack);
    });
    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        wtaj = _z_Data;
        //console.log(_z_Data);
        var a = '';
        $('#questiontable').html(function () {
            for (var i = 0; i < _z_Data.length; i++) {
                if (i < 7) {
                    a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" checked="checked" type="checkbox" onchange="getmyChart()"></td>' +
                        '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td>' + _z_Data[i].AKBM + '</td><td>' + _z_Data[i].SL + '</td></tr>'
                } else {
                    a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" type="checkbox" onchange="getmyChart()"></td>' +
                        '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
                }
            }
            return a;
        });

        if (_z_Data.length < 7) {
            $('#allcheck').each(function () {
                this.checked = true;
                all = true;
            });
        } else {
            all = false;
        }
        var legenddata = [];
        var seriesdata = [];
        for (var i = 0; i < _z_Data.length && i < 7; i++) {
            legenddata.push(_z_Data[i].GZMC);
            seriesdata.push({ "name": _z_Data[i].GZMC, "value": _z_Data[i].SL, 'ID': _z_Data[i].ID });
        }
        option = {
            backgroundColor: 'rgba(255,255,255,.3)',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                useHTML: true
            },
            legend: {
                orient: "vertical",
                x: 'left',
                y: '80%',
                data: legenddata,
                color: 'red',
                textStyle: {
                    fontSize: 14,
                    color: '#56768b'
                }
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['50%', '40%'],
                    radius: ['0', '40%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#4d6f88',
                                    fontSize: 14
                                }
                            },
                            labelLine: {
                                show: true,
                                lineStyle: {
                                    color: '#4d6f88'
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    },
                    data: seriesdata
                }
            ],
            color: ['#44b251', '#9673d1', '#08aaf3', '#86c366', '#33b1ae', '#e27161', '#138cdd']
        };
        // 为echarts对象加载数据
        $('#questionAnalyse').remove();
        $('.questionAnalyse_right_fxtb').append('<div style="width: 100%;height: 100%" id="questionAnalyse"></div>');
        var myChart = echarts.init(document.getElementById('questionAnalyse'));
        myChart.setOption(option);
        myChart.on('click', function (param) {
            var YWLB = $('#YWLB').val();
            var tree = $('#questionDW').combotree('tree');
            var node = tree.tree('getSelected');
            if (!node) node = '';
            var id = !!node.id ? node.id : unitCode;
            var isLocal = document.getElementById("ckbDWBM").checked ? 1 : 0;
            iceGetData(function (servicePrx) {
                //servicePrx.latestValidateReport1("", id, YWLB, param.data.ID, '', '', '', '', KStime, JStime, null).then(z_databack);
                servicePrx.getCaseList("", id, YWLB, param.data.ID, '', '', '', '', KStime, JStime, isLocal, null).then(z_databack);
            });
            function z_databack(_z_Data) {
                _z_Data = JSON.parse(_z_Data);
                //console.log(_z_Data);
                $('#modal').window('open');
                $('#modal').panel({
                    href: 'View/tjsjjy/AJXXXX.html?state=' + isLocal,
                    onLoad: function () {
                        $('#backType').attr("value", "1");
                        $('#lsbgtr').html(function () {
                            var a = '<thead> <tr><td width="50px">序号</td><td>单位名称</td><td width="235px">部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td width="20%">规则名称</td><td width="25%">规则内容</td><td>审核状态</td> </tr> </thead> <tbody>';
                            var b = '';
                            for (var i = 0; i < _z_Data.length; i++) {
                                b += '<tr>' +
                                    '<td title="' + (i + 1) + '">' + (i + 1) + '</td>' +
                                    '<td title="' + _z_Data[i].DWMC + '">' + _z_Data[i].DWMC + '</td>' +
                                    '<td class="cursor" onclick="loadiframe(\'' + _z_Data[i].BMSAH + '\',\'' + _z_Data[i].CQRQ + '\')" title="' + _z_Data[i].BMSAH + '">' + _z_Data[i].BMSAH + '</td>' +
                                    '<td title="' + _z_Data[i].AJMC + '">' + _z_Data[i].AJMC + '</td>' +
                                    '<td title="' + (_z_Data[i].XYRXM ? _z_Data[i].XYRXM : "") + '">' + (_z_Data[i].XYRXM ? _z_Data[i].XYRXM : "") + '</td>' +
                                    '<td title="' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '">' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '</td>' +
                                    '<td title="' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '">' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '</td>' +
                                    '<td title="' + _z_Data[i].RULENAME + '">' + _z_Data[i].RULENAME + '</td>' +
                                    '<td title="' + _z_Data[i].NR + '">' + _z_Data[i].NR + '</td>' +
                                    '<td title="' + _z_Data[i].SHZT + '">' + _z_Data[i].SHZT + '</td>' +
                                    '</tr>';
                            }
                            var c = '';
                            b = a + b + c;
                            return b;
                        });
                    }
                });
            }
        });
        getdetail(0);
    }

    iceGetData(function (servicePrx) {
        servicePrx.getYWList().then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);

        $('#YWLB').html(function () {
            var YW = '<option value="">全部</option>';
            for (var i = 0; i < _z_Data.length; i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
    }
});

$('#allcheck').click(function () {
    if (!all) {
        $('.chkItem').each(function () {
            this.checked = true;
        });
        getmyChart();
    } else {
        $('.chkItem').each(function () {
            this.checked = false;
        });
        getmyChart();
    }
    all = !all;
});

function getdetail(i) {
    var yxsm = "";
    if (wtaj.length > 0) {
        yxsm += '<p>' + wtaj[i].GZNR + '</p>';
    } else {
        yxsm = "";
    }
    $('#zb_zbsm_body').html(yxsm);
}

function getmyChart(v) {
    var legenddata = [];
    var seriesdata = [];
    for (var i = 0; i < wtaj.length; i++) {
        if ($('#tablecheck' + i).is(':checked')) {
            legenddata.push(wtaj[i].GZMC);
            seriesdata.push({ "name": wtaj[i].GZMC, "value": wtaj[i].SL, 'ID': wtaj[i].ID });
        } else {
            // if(){
            $('#allcheck').each(function () {
                this.checked = false;
            });
            // }
        }
    }
    option.legend.data = [];
    option.series[0].data = [];
    option.legend.data = legenddata;
    option.series[0].data = seriesdata;

    $('#questionAnalyse').remove();
    $('.questionAnalyse_right_fxtb').append('<div style="width: 100%;height: 100%" id="questionAnalyse"></div>');
    var myChart = echarts.init(document.getElementById('questionAnalyse'));
    myChart.setOption(option);
    myChart.on('click', function (param) {
        var YWLB = $('#YWLB').val();
        var tree = $('#questionDW').combotree('tree');
        var node = tree.tree('getSelected');
        if (!node) node = '';
        var id = !!node.id ? node.id : unitCode;
        var isLocal = document.getElementById("ckbDWBM").checked ? 1 : 0;
        iceGetData(function (servicePrx) {
            //servicePrx.latestValidateReport1("", id, YWLB, param.data.ID, '', '', '', '', KStime, JStime, null).then(z_databack);
            servicePrx.getCaseList("", id, YWLB, param.data.ID, '', '', '', '', KStime, JStime, isLocal, null).then(z_databack);
        });
        function z_databack(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            //console.log(_z_Data);
            $('#modal').window('open');
            $('#modal').panel({
                href: 'View/tjsjjy/AJXXXX.html?state=' + isLocal,
                onLoad: function () {
                    $('#backType').attr("value", "1");
                    $('#lsbgtr').html(function () {
                        var a = '<thead> <tr><td width="50px">序号</td><td>单位名称</td><td width="235px">部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td width="20%">规则名称</td><td width="25%">规则内容</td><td>审核状态</td> </tr> </thead> <tbody>';
                        var b = '';
                        for (var i = 0; i < _z_Data.length; i++) {
                            b += '<tr>' +
                                '<td title="' + (i + 1) + '">' + (i + 1) + '</td>' +
                                '<td title="' + _z_Data[i].DWMC + '">' + _z_Data[i].DWMC + '</td>' +
                                '<td class="cursor" onclick="loadiframe(\'' + _z_Data[i].BMSAH + '\',\'' + _z_Data[i].CQRQ + '\')" title="' + _z_Data[i].BMSAH + '">' + _z_Data[i].BMSAH + '</td>' +
                                '<td title="' + _z_Data[i].AJMC + '">' + _z_Data[i].AJMC + '</td>' +
                                '<td title="' + (_z_Data[i].XYRXM ? _z_Data[i].XYRXM : "") + '">' + (_z_Data[i].XYRXM ? _z_Data[i].XYRXM : "") + '</td>' +
                                '<td title="' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '">' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '</td>' +
                                '<td title="' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '">' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '</td>' +
                                '<td title="' + _z_Data[i].RULENAME + '">' + _z_Data[i].RULENAME + '</td>' +
                                '<td title="' + _z_Data[i].NR + '">' + _z_Data[i].NR + '</td>' +
                                '<td title="' + _z_Data[i].SHZT + '">' + _z_Data[i].SHZT + '</td>' +
                                '</tr>';
                        }
                        var c = '';
                        b = a + b + c;
                        return b;
                    });
                }
            });
        }
    });
}

function treedata(array, data) {
    for (var i = 0; i < data.length; i++) {
        array.push({});
        array[i].id = data[i].DWBM;
        array[i].text = data[i].DWMC;
        if (data[i].NODE.length > 0) {
            array[i].children = [];
            treedata(array[i].children, data[i].NODE);
        }
    }
}

function search() {
    var YWLB = $('#YWLB').val();
    var tree = $('#questionDW').combotree('tree');
    var node = tree.tree('getSelected');
    var isLocal = document.getElementById("ckbDWBM").checked ? 1 : 0;
    iceGetData(function (servicePrx) {
        servicePrx.getDWGZChooseStatisticalPuls(key, node.id, YWLB, '', KStime, JStime, isLocal, null).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);
        wtaj = _z_Data;
        var a = '';
        $('#questiontable').html(function () {
            for (var i = 0; i < _z_Data.length; i++) {
                if (i < 7) {
                    a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" checked="checked" type="checkbox" onchange="getmyChart()"></td>' +
                        '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
                } else {
                    a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" type="checkbox" onchange="getmyChart()"></td>' +
                        '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
                }
            }
            return a;
        });
        if (_z_Data.length < 7) {
            $('#allcheck').each(function () {
                this.checked = true;
                all = true;
            });
        } else {
            all = false;
        }
        getdetail(0);
        getmyChart();
    }
}

function top10() {
    shengxu();
    for (var i = 0; i < ($('.chkItem').length < 10 ? $('.chkItem').length : 10) ; i++) {
        $('.chkItem').eq(i)[0].checked = true;
    }
    getmyChart();
}

function jiangxu() {
    var _z_Data = wtaj;
    for (var i = 0; i < _z_Data.length - 1; i++) {
        for (var j = 0; j < _z_Data.length - 1 - i; j++) {
            var v1 = _z_Data[j].SL;
            var v2 = _z_Data[j + 1].SL;
            if (v1 > v2) {
                var temp = _z_Data[j];
                _z_Data[j] = _z_Data[j + 1];
                _z_Data[j + 1] = temp;
            }
        }
    }
    var a = '';
    $('#questiontable').html(function () {
        for (var i = 0; i < _z_Data.length; i++) {
            if (i < 7) {
                a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" checked="checked" type="checkbox" onchange="getmyChart()"></td>' +
                    '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
            } else {
                a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" type="checkbox" onchange="getmyChart()"></td>' +
                    '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
            }
        }
        return a;
    });
}

function shengxu() {
    var _z_Data = wtaj;
    for (var i = 0; i < _z_Data.length - 1; i++) {
        for (var j = 0; j < _z_Data.length - 1 - i; j++) {
            var v1 = _z_Data[j].SL;
            var v2 = _z_Data[j + 1].SL;
            if (v1 < v2) {
                var temp = _z_Data[j];
                _z_Data[j] = _z_Data[j + 1];
                _z_Data[j + 1] = temp;
            }
        }
    }
    var a = '';
    $('#questiontable').html(function () {
        for (var i = 0; i < _z_Data.length; i++) {
            if (i < 7) {
                a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" checked="checked" type="checkbox" onchange="getmyChart()"></td>' +
                    '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
            } else {
                a += '<tr onclick="getdetail(' + i + ')"><td><input id="tablecheck' + i + '" class="chkItem" type="checkbox" onchange="getmyChart()"></td>' +
                    '<td title="' + _z_Data[i].GZMC + '">' + _z_Data[i].GZMC + '</td><td title="' + _z_Data[i].AKBM + '">' + _z_Data[i].AKBM + '</td><td title="' + _z_Data[i].SL + '">' + _z_Data[i].SL + '</td></tr>'
            }
        }
        return a;
    });
}


