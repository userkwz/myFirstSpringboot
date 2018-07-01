//@ sourceURL=unitAnalysis.js
var KStime = '';
var JStime = '';
var selectDwbm = unitCode;

//默认时间和单位
function moren() {
    $('#modal').window('close');
    //今天时间
    var adate = new Date();
    var d = adate.getFullYear()+"-"+(adate.getMonth())+"-"+01;
    KStime = d;
    //日期设置格式
    $('#unitBeginTime').datebox({
        currentText:'今天',
        closeText:'关闭',
        onSelect: function(date){
            KStime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            var yw = $('#yw2').val();
            yw = (yw!=''? yw : '');
            xjdwzzt(yw);
        }
    });
    $('#unitBeginTime').datebox("setValue", d);

    var f = adate.getFullYear()+"-"+(adate.getMonth()+1)+"-"+adate.getDate();
    JStime = f;
    $('#unitEndTime').datebox({
        currentText:'今天',
        closeText:'关闭',
        onSelect: function(date){
            JStime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            var yw = $('#yw2').val();
            yw = (yw!=''? yw : '');
            xjdwzzt(yw);
        }
    });
    $('#unitEndTime').datebox("setValue", f);
    
    iceGetData(function (servicePrx) {
        servicePrx.getYWList().then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);

        $('#yw1').html(function () {
            var YW = '<option value="">全部</option>';
            for(var i=0;i<_z_Data.length;i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
        $('#yw2').html(function () {
            var YW = '<option value="">全部</option>';
            for(var i=0;i<_z_Data.length;i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
        $('#yw3').html(function () {
            var YW = '<option value="">全部</option>';
            for(var i=0;i<_z_Data.length;i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
    }
}
function dqdwzzt(){
    var yw = $('#yw1').val();
    fxdqdw(yw);
}
function dqxjdwzzt(){
    var yw = $('#yw2').val();
    xjdwzzt(yw);
}
//分析当前单位
function fxdqdw(yw){
    iceGetData(function (servicePrx) {
        servicePrx.analyseCurrentDw(key, selectDwbm, yw, '', null).then(z_databack);
    });
    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var categories = [];
        var seriesdata = [];
        for(var i=0;i<_z_Data.length;i++){
            categories.push(_z_Data[i].DATE);
            seriesdata.push(_z_Data[i].WTCS);
        }
        iceGetData(function (servicePrx) {
            servicePrx.getCurrentDwInfo(selectDwbm).then(z_databack2);
        });
        function z_databack2(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            $('#DWMCtext').text(_z_Data[0].DWMC);
            var hbsy_zzt = Highcharts.chart('hbsy_zzt', {
                chart: {
                    type: 'column',
                    backgroundColor:'transparent'
                },
                colors:['#1AA19D'],
                title: {
                    text: ' '
                },
                tooltip: {
                    useHTML: true
                },
                subtitle: {
                    // text: '请点击按钮查看坐标轴变化'
                },
                xAxis: {
                    categories: categories,
					//labels:{
						//style:{
							//color:'#00e1e1'
						//}
					//}
                },
                yAxis: {
                    labels: {
                        x: -15
                    },
                    title: {
                        text: ''
                    },
                    allowDecimals: false //是否允许刻度有小数点
                },
                series: [{
                    name: _z_Data[0].DWMC,
                    // data: [231,121,123,123,234,56,112,23,56,87,213,345,56],
                    data:seriesdata,
				//dataLabels:{
					//enabled:true,
					//useHTML:true,
					//color:'#07b1f9'
				//},
                    cursor:'pointer',
                    point: {
                        events: {
                            click: function (v) {
                                var date = v.point.category.replace("号","");
                                date = date.replace("月","-");
                                date = date.replace("年","-");
                                var date2 = new Date();
                                date = date2.getFullYear() + "-" + date;
                                iceGetData(function (servicePrx) {
                                    servicePrx.latestValidateReport(key, selectDwbm, yw, '', '', '', '', '', date, date).then(z_databack2);
                                });
                                function z_databack2(_z_Data) {
                                    _z_Data = JSON.parse(_z_Data);
                                    //console.log(_z_Data);
                                    var array = [];
                                    for(var a in _z_Data[0]) {
                                        array.push(a);
                                    }
                                    $('#modal').window('open');
                                    $('#modal').panel({ href: 'View/tjsjjy/AJXXXX.html',
                                        onLoad:function(){
											$('#backType').attr("value","2");

                                            $('#lsbgtr').html(function() {
                                                var b = '';
                                                _z_Data = _z_Data[0];
                                                var a = '<thead> <tr><td width="50px">序号</td><td width="235px">部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td width="20%">规则名称</td><td width="25%">规则内容</td><td>审核状态</td> </tr> </thead> <tbody>';
                                                for (var q = 0; q < array.length; q++) {
                                                    for (var i = 0; i < _z_Data[array[q]].length; i++) {
                                                        b += '<tr>' +
                                                            '<td title="' + (i + 1) + '">' + (i + 1) + '</td>' +
                                                            '<td class="cursor" onclick="loadiframe(\'' + _z_Data[array[q]][i].BMSAH + '\',\'' + _z_Data[array[q]][i].CQRQ + '\')" title="' + _z_Data[array[q]][i].BMSAH + '">' + _z_Data[array[q]][i].BMSAH + '</td>' +
                                                            '<td title="' + _z_Data[array[q]][i].AJMC + '">' + _z_Data[array[q]][i].AJMC + '</td>' +
                                                            '<td title="' + (_z_Data[array[q]][i].XYRXM ? _z_Data[array[q]][i].XYRXM : "") + '">' + (_z_Data[array[q]][i].XYRXM ? _z_Data[array[q]][i].XYRXM : "") + '</td>' +
                                                            '<td title="' + (_z_Data[array[q]][i].BMMC ? _z_Data[array[q]][i].BMMC : "") + '">' + (_z_Data[array[q]][i].BMMC ? _z_Data[array[q]][i].BMMC : "") + '</td>' +
                                                            '<td title="' + (_z_Data[array[q]][i].CBR ? _z_Data[array[q]][i].CBR : "") + '">' + (_z_Data[array[q]][i].CBR ? _z_Data[array[q]][i].CBR : "") + '</td>' +
                                                            '<td title="' + _z_Data[array[q]][i].RULENAME + '">' + _z_Data[array[q]][i].RULENAME + '</td>' +
                                                            '<td title="' + _z_Data[array[q]][i].NR + '">' + _z_Data[array[q]][i].NR + '</td>' +
                                                            '<td title="' + _z_Data[array[q]][i].SHZT + '">' + _z_Data[array[q]][i].SHZT + '</td>' +
                                                            '</tr>';
                                                    }
                                                }
                                                var c = '</tbody>';
                                                b = a + b + c;
                                                return b;
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        // Make the labels less space demanding on mobile
                        chartOptions: {
                            xAxis: {
                                labels: {
                                    formatter: function () {
                                        return this.value.replace('月', '');
                                    }
                                }
                            },
                            yAxis: {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -2
                                },
                                title: {
                                    text: ''
                                }
                            }
                        }
                    }]
                },
                exporting: {
                    url: '/Handler/common.ashx?action=UpdateBmp',
                    filename: '数据传递情况',
                    width: 1200
                }
            });
        }
    }
}
//下级单位柱状图
function xjdwzzt(yw){
    iceGetData(function (servicePrx) {
        servicePrx.analyseLowDw(key, selectDwbm, yw, KStime, JStime, null).then(z_databack2);
    });
    function z_databack2(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var xjydwbm = _z_Data;
        var categories = [];
        var seriesdata = [];
        var DWBMid = [];
        for(var i=0;i<_z_Data.length;i++){
            categories.push(_z_Data[i].DWMC);
            seriesdata.push(_z_Data[i].WTCS);
            DWBMid.push(_z_Data[i].DWBM);
        }
        var xjdw_zzt = Highcharts.chart('xjdw_zzt', {
            chart: {
                type: 'column',
                backgroundColor:'transparent'
            },
            colors:['#138CDD'],
            title: {
                text: ' '
            },
            subtitle: {
                // text: '请点击按钮查看坐标轴变化'
            },
            tooltip: {
                useHTML: true
            },
            xAxis: {
                categories: categories,
                labels:{
                    useHTML:true,
                    formatter:function () {
                        var i;
                        var value = this.value;
                        categories.forEach(function(v,index){
                            if(v === value){
                                i = index;
                            }
                        });
                        var dwbm = DWBMid[i];
                        return '<a style="text-decoration: none;color: #606060" href="javascript:show(\''+dwbm+'\')">'+value+'</a>';
                    },
					//style:{
							//color:'#00e1e1'
						//}
			
                },
					
            },
            yAxis: {
                labels: {
                    x: -15
                },
                title: {
                    text: ''
                },
                allowDecimals: false //是否允许刻度有小数点
            },
            series: [{
                name: '下级单位违反违规数量',
                data:seriesdata,
				//dataLabels:{
					//enabled:true,
					//useHTML:true,
					//color:'#07b1f9'
				//},
                cursor:'pointer',
                // data: [212,345,54,678,786,563,234,423,345,123,435,542,123,462],
                point: {
                    events: {
                        click: function (v) {
                            var dwmc = v.point.category;
                            var dwbm;
                            xjydwbm.forEach(function(v){
                                if(v.DWMC == dwmc){
                                    dwbm = v.DWBM;
                                }
                            });
                            iceGetData(function (servicePrx) {
                                servicePrx.latestValidateReport(key,dwbm,yw,'','','','','',KStime,JStime).then(z_databack2);
                            });
                            function z_databack2(_z_Data) {
                                _z_Data = JSON.parse(_z_Data);
                                //console.log(_z_Data);
                                var array = [];
                                for(var a in _z_Data[0]) {
                                    array.push(a);
                                }
                                $('#modal').window('open');
                                $('#modal').panel({ href: 'View/tjsjjy/AJXXXX.html',
                                    onLoad:function() {
                                        $('#lsbgtr').html(function() {
                                            $('#backType').attr("value", "2");
                                            var b = '';
                                            _z_Data = _z_Data[0];
                                            for (var q = 0; q < array.length; q++) {
                                                var a = '<thead> <tr><td width="50px">序号</td><td width="235px">部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td width="20%">规则名称</td><td width="25%">规则内容</td><td>审核状态</td> </tr> </thead> <tbody>';
                                                for (var i = 0; i < _z_Data[array[q]].length; i++) {
                                                    b += '<tr>' +
                                                        '<td title="' + (i + 1) + '">' + (i + 1) + '</td>' +
                                                        '<td class="cursor" onclick="loadiframe(\'' + _z_Data[array[q]][i].BMSAH + '\',\'' + _z_Data[array[q]][i].CQRQ + '\')" title="' + _z_Data[array[q]][i].BMSAH + '">' + _z_Data[array[q]][i].BMSAH + '</td>' +
                                                        '<td title="' + _z_Data[array[q]][i].AJMC + '">' + _z_Data[array[q]][i].AJMC + '</td>' +
                                                        '<td title="' + (_z_Data[array[q]][i].XYRXM ? _z_Data[array[q]][i].XYRXM : "") + '">' + (_z_Data[array[q]][i].XYRXM ? _z_Data[array[q]][i].XYRXM : "") + '</td>' +
                                                        '<td title="' + (_z_Data[array[q]][i].BMMC ? _z_Data[array[q]][i].BMMC : "") + '">' + (_z_Data[array[q]][i].BMMC ? _z_Data[array[q]][i].BMMC : "") + '</td>' +
                                                        '<td title="' + (_z_Data[array[q]][i].CBR ? _z_Data[array[q]][i].CBR : "") + '">' + (_z_Data[array[q]][i].CBR ? _z_Data[array[q]][i].CBR : "") + '</td>' +
                                                        '<td title="' + _z_Data[array[q]][i].RULENAME + '">' + _z_Data[array[q]][i].RULENAME + '</td>' +
                                                        '<td title="' + _z_Data[array[q]][i].NR + '">' + _z_Data[array[q]][i].NR + '</td>' +
                                                        '<td title="' + _z_Data[array[q]][i].SHZT + '">' + _z_Data[array[q]][i].SHZT + '</td>' +
                                                        '</tr>';
                                                }
                                                var c = '</tbody>';
                                            }
                                            b = a + b + c;
                                            return b;
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    // Make the labels less space demanding on mobile
                    chartOptions: {
                        xAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value.replace('月', '');
                                }
                            }
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -2
                            },
                            title: {
                                text: ''
                            }
                        }
                    }
                }]
            },
            exporting: {
                url: '/Handler/common.ashx?action=UpdateBmp',
                filename: '下级院数据传递情况',
                width: 1200
            }
        });
    }
}
//颜色渐变
function ysjb() {
    if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i) == "7.") {
        alert("IE 7.0");
    } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.") {
        alert("IE 8.0");
    } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9.") {
        var colors = ['#F59656', '#90BF18', '#EDCA4E'];
        Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
            return {
                radialGradient: {
                    cx: 0,
                    cy: -0.8,
                    r: 2.3
                },
                stops: [
                    [0, color],
                    [2, Highcharts.Color(color).brighten(14).get('rgb')] // darken
                ]
            };
        });
    } else if (navigator.appName == "Microsoft Internet Explorer") {
        alert("IE 6.0");
    } else {
        var colors = ['#03afea', '#90BF18', '#EDCA4E'];
        Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
            return {
                radialGradient: {
                    cx: 0,
                    cy: -0.8,
                    r: 5.3
                },
                stops: [
                    [0, color],
                    [2, Highcharts.Color(color).brighten(14).get('rgb')] // darken
                ]
            };
        });
    }
}
//初始化
function init(){
    //分析当前单位
    fxdqdw('');
    //下级单位柱状图
    xjdwzzt('');
    //默认时间和单位
    moren();
    //颜色渐变
    ysjb();
}
$(function () {
    init();
});

var newdwbm = [];
//点击下级院单位弹出页面
function show(dwbm) {
    newdwbm.push(dwbm);
    selectDwbm = dwbm;
    $('#fanhui').css('display', 'block');
    if (selectDwbm == unitCode) {
        $('#fanhui').css('display','none');
    }
    init();
}
function fanhui() {
    selectDwbm = newdwbm.length > 1 ? newdwbm[newdwbm.length - 2] : unitCode;
    newdwbm.pop();
    if (selectDwbm == unitCode) {
        $('#fanhui').css('display', 'none');
    }
    init();
}