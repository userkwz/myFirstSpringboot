//@ sourceURL=operationAnalysis.js
var categories = [];
var categoriesdata = [];
var treenode;
var URLdwbm;

function treedata(array,data){
    for(var i=0;i<data.length;i++){
        array.push({});
        array[i].id = data[i].DWBM;
        array[i].text = data[i].DWMC;
        if(data[i].NODE.length>0){
            array[i].children = [];
            treedata(array[i].children,data[i].NODE);
        }
    }
}
var KStime = '';
var JStime = '';
var YWArray = [];
$(function () {
    //今天时间
    var adate = new Date();
    var d = adate.getFullYear() + "-" + (adate.getMonth()) + "-" + '01';
    KStime = d;
    //日期设置格式
    $('#operationBeginTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            KStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    var f = adate.getFullYear() + "-" + (adate.getMonth() + 1) + "-" + adate.getDate();
    JStime = f;
    $('#operationEndTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            JStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    // 单位编码ComboTree初始化
    $('#operationDW').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        onLoadSuccess: function () {
            $('#operationDW').combotree('setValue', unitCode);

            $('#operationBeginTime').datebox("setValue", KStime);
            $('#operationEndTime').datebox("setValue", JStime);
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
	treenode = '';
	init();
});
function treeasda(){
    var tree = $('#operationDW').combotree('tree');
        treenode = tree.tree('getSelected');
        treenode = treenode.id;
        init(treenode);
}
function init(treenode) {
    if(!!treenode){
        URLdwbm = treenode;
    }else{
        URLdwbm = unitCode;
    }
    var operationAnalysis1 = Highcharts.chart('operationAnalysis1', {
        chart: {
            type: 'column'
        },
        title: {
            text: ' '
        },
        subtitle: {
            // text: '请点击按钮查看坐标轴变化'
        },
        xAxis: {
            categories: []
        },
        tooltip: {
            useHTML: true
        },
        yAxis: {
            labels: {
                x: -15
            },
            title: {
                text: ''
            }
        },
        series: [{
            name: '下级单位案件未通过数',
            data: [],
            point: {
                events: {
                    click: function (v) {
                        console.log(v);
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
            filename: 'MyPng',
            width: 1200
        }
    });

	iceGetData(function (servicePrx) {
        servicePrx.getYwFenXi(key,URLdwbm,KStime,JStime,null).then(z_databack1);
    });
    function z_databack1(_z_Data1) {
        _z_Data1 = JSON.parse(_z_Data1);
		//console.log(_z_Data1);
		var data = '';
		_z_Data1.forEach(function(v,index){
            YWArray.push({index:index,data:v});
            if(index == 0){
                data += '<li id="ul-list'+index+'" class="active" onclick="AJLBtable('+index+')"><span>' + v.YWMC + '</span>'+
				'<div><span>案件总数:' + v.AJZS + '</span><span>通过率:' + v.TGL + '</span>'+
				'<span>未通过数:' + v.WTGS + '</span></div></li>';
            }else{
                data += '<li id="ul-list'+index+'" onclick="AJLBtable('+index+')"><span>' + v.YWMC + '</span>'+
				'<div><span>案件总数:' + v.AJZS + '</span><span>通过率:' + v.TGL + '</span>'+
				'<span>未通过数:' + v.WTGS + '</span></div></li>';
            }
		});
        $('#operation-list').html(data);
		AJLBtable(0);
		Change(0);
	}
	
    /* iceGetData(function (servicePrx) {
        servicePrx.getYWList().then(z_databack2);
    });
    function z_databack2(_z_Data2) {
        var data = '';
        _z_Data2 = JSON.parse(_z_Data2);
        _z_Data2.forEach(function (v,index) {
            YWArray.push({index:index,data:v});
            if(index == 0){
                data += '<li id="ul-list'+index+'" class="active" onclick="AJLBtable('+index+')"><span>'+v.YWMC+'</span></li>';
            }else{
                data += '<li id="ul-list'+index+'" onclick="AJLBtable('+index+')"><span>'+v.YWMC+'</span></li>';
            }
        });
        $('#operation-list').html(data);

        YWArray.forEach(function(v,index){
            // if(v.index == index){
            //     ywbm = v.data.YWBM;
            //     ywmc = v.data.YWMC;
            // }
            iceGetData(function (servicePrx) {
                servicePrx.analyseYW(url, URLdwbm, v.data.YWBM, KStime, JStime, null).then(z_databack3);
            });
            function z_databack3(_z_Data) {
                _z_Data = JSON.parse(_z_Data);
                $('#ul-list'+index).html(function(){
                    return '<span>' + v.data.YWMC + '</span><div><span>案件总数:' + _z_Data[0].AJZS + '</span><span>通过率:' + _z_Data[0].TGL + '</span><span>未通过数:' + _z_Data[0].WTS + '</span></div>';
                });
            }
            AJLBtable(0);
            Change(0);
        });
    } */
}
var JQAJxx = [];
var ywbm="",ywmc="";
function AJLBtable(index){
    //业务
	urldwbm = treenode ? treenode : unitCode;
    YWArray.forEach(function(v){
        if(v.index == index){
            ywbm = v.data.YWBM;
            ywmc = v.data.YWMC;
        }
    });
    iceGetData(function (servicePrx) {
        servicePrx.getAJLB(key, urldwbm, ywbm, KStime, JStime, null).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        $('#operation-list').children('li').removeClass('active');
        $('#ul-list'+index).addClass('active');

        $('#AJLBtable').html(function(){
            var a = '';
            _z_Data.forEach(function(v,index){
                JQAJxx.push({index:index,data:v});
                a += '<tr id="AJLBtable'+index+'" onclick="JQAJXX('+index+')"><td>'+v.AJLBMC+'</td><td>'+v.VAL+'</td></tr>';
            });
            return a;
        });
        $('#AJLBtable0').addClass('active');
        JQAJXX(0);
        categories=[];
        categoriesdata=[];
        _z_Data[0].LDW.forEach(function(v){
            categories.push(v.DWMC);
            categoriesdata.push(v.WTS);
        });
        var chart = Highcharts.chart('operationAnalysis1', {
            chart: {
                type: 'column'
            },
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
                categories: categories
            },
            yAxis: {
                labels: {
                    x: -15
                },
                title: {
                    text: ''
                }
            },
            series: [{
                name: '下级单位案件未通过数',
                data: categoriesdata,
                point: {
                    events: {
                        click: function (v) {

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
            }
        });
        Caroursel.init($('.caroursel'));
    }
}
var ajmc;
function JQAJXX(index){
    var urldwbm = treenode ? treenode : unitCode;

    JQAJxx.forEach(function(v){
        if(v.index == index){
            ajmc = v.data.AJLBMC;
        }
    });

    $('#AJLBtable').children('tr').removeClass('active');
    $('#AJLBtable'+index).addClass('active');

    iceGetData(function (servicePrx) {
        servicePrx.getCaseInfoByAjlb(key, urldwbm, ywbm,ajmc, KStime, JStime, null).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        $('#JTAJXXtable').html(function() {
            var a = '';
            _z_Data.forEach(function(_z_Data, i) {
                if (_z_Data.SHZT == '拒绝') {
				a += '<tr class="redTd"><td class="cursor" onclick="loadiframe(\''+_z_Data.BMSAH+'\',\''+_z_Data.CQRQ+'\')" title="'+_z_Data.BMSAH+'">'+_z_Data.BMSAH+'</td><td title="'+_z_Data.AJMC+'">'+_z_Data.AJMC+'</td>' +
                        '<td title="' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '">' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '</td>' +
                        '<td title="' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '">' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '</td>' +
                        '<td title="' + (_z_Data.CBR ? _z_Data.CBR : "") + '">' + (_z_Data.CBR ? _z_Data.CBR : "") + '</td>' +
                        '<td title="' + _z_Data.RULENAME + '">' + _z_Data.RULENAME + '</td><td title="' + _z_Data.SHZT + '">' + _z_Data.SHZT + '</td><td title="' + _z_Data.CQRQ + '">' + _z_Data.CQRQ + '</td>' +
                    '</tr>'
                } else if (_z_Data.SHZT == '同意') {
                    a += '<tr class="greenTd"><td class="cursor" onclick="loadiframe(\'' + _z_Data.BMSAH + '\',\'' + _z_Data.CQRQ + '\')" title="' + _z_Data.BMSAH + '">' + _z_Data.BMSAH + '</td><td title="' + _z_Data.AJMC + '">' + _z_Data.AJMC + '</td>' +
                        '<td title="' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '">' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '</td>' +
                        '<td title="' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '">' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '</td>' +
                        '<td title="' + (_z_Data.CBR ? _z_Data.CBR : "") + '">' + (_z_Data.CBR ? _z_Data.CBR : "") + '</td>' +
                        '<td title="' + _z_Data.RULENAME + '">' + _z_Data.RULENAME + '</td><td title="' + _z_Data.SHZT + '">' + _z_Data.SHZT + '</td><td title="' + _z_Data.CQRQ + '">' + _z_Data.CQRQ + '</td>' +
                    '</tr>'
                } else {
                    a += '<tr><td class="cursor" onclick="loadiframe(\'' + _z_Data.BMSAH + '\',\'' + _z_Data.CQRQ + '\')" title="' + _z_Data.BMSAH + '">' + _z_Data.BMSAH + '</td><td title="' + _z_Data.AJMC + '">' + _z_Data.AJMC + '</td>' +
                        '<td title="' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '">' + (_z_Data.XYRXM ? _z_Data.XYRXM : "") + '</td>' +
                        '<td title="' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '">' + (_z_Data.BMMC ? _z_Data.BMMC : "") + '</td>' +
                        '<td title="' + (_z_Data.CBR ? _z_Data.CBR : "") + '">' + (_z_Data.CBR ? _z_Data.CBR : "") + '</td>' +
                        '<td title="' + _z_Data.RULENAME + '">' + _z_Data.RULENAME + '</td><td title="' + _z_Data.SHZT + '">' + _z_Data.SHZT + '</td><td title="' + _z_Data.CQRQ + '">' + _z_Data.CQRQ + '</td>' +
                    '</tr>'
                }
            });
            return a;
        });
    }
}

function xiaoxi(BMSAH,CBR,CQRQ){
    iceGetData(function (servicePrx) {
        servicePrx.getCaseAkrule(key,BMSAH,CQRQ).then(z_databack);
    });
    function z_databack(_z_Data1) {
        nr = _z_Data1;
        if(!!CBR && CBR != 'null'){
            $('.rmodel').css('display','block');
            $('#modal-body').html('是否发送整改信息给检察官'+CBR+'?');
        }else{
            $('.rmodel').css('display','block');
            $('#modal-body').html('是否发送给案管受理员?');
        }
        $('#queding').on('click',function(){
            var xx = frameObject.AddMessage(BMSAH,nr);
            modalclose();
            $('.rmodel1').css('display','block');
            $('#modal-body1').html(xx?'消息发送成功!':'消息发送失败!');
        })
    }
}

function modalclose(){
    $('.rmodel').css('display','none');
}
function modalclose1(){
    $('.rmodel1').css('display','none');
}

function Change(v){
    if(v == 0){
        $('#operationAnalysis1').css('display','none');
        $('#operationAnalysis0').css('display','block');
        $('#XJdwheade').removeClass('operationavtive');
        $('#JTajxxheade').addClass('operationavtive');
        var chart = Highcharts.chart('operationAnalysis1', {
            chart: {
                type: 'column'
            },
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
                categories: categories
            },
            yAxis: {
                labels: {
                    x: -15
                },
                title: {
                    text: ''
                }
            },
            series: [{
                name: '下级单位案件未通过数',
                data: categoriesdata,
                point: {
                    events: {
                        click: function (v) {

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
            }
        });
    }else{
        $('#operationAnalysis0').css('display','none');
        $('#operationAnalysis1').css('display','block');
        $('#XJdwheade').addClass('operationavtive');
        $('#JTajxxheade').removeClass('operationavtive');
    }
}


////颜色渐变
//$(function() {
//    if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i) == "7.") {
//        alert("IE 7.0");
//    } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.") {
//        alert("IE 8.0");
//    } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9.") {
//        var colors = ['#F59656', '#90BF18', '#EDCA4E'];
//        Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
//            return {
//                radialGradient: {
//                    cx: 0,
//                    cy: -0.8,
//                    r: 2.3
//                },
//                stops: [
//                    [0, color],
//                    [2, Highcharts.Color(color).brighten(14).get('rgb')] // darken
//                ]
//            };
//        });
//    } else if (navigator.appName == "Microsoft Internet Explorer") {
//        alert("IE 6.0");
//    } else {
//        var colors = ['#03afea', '#90BF18', '#EDCA4E'];
//        Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
//            return {
//                radialGradient: {
//                    cx: 0,
//                    cy: -0.8,
//                    r: 5.3
//                },
//                stops: [
//                    [0, color],
//                    [2, Highcharts.Color(color).brighten(14).get('rgb')] // darken
//                ]
//            };
//        });
//    }
//});
function exportTableWord(){
	var tree = $('#validationDW').combotree('tree');
	var node = tree.tree('getSelected');
	if(!node) node = '';
	var id = !!node.id?node.id:unitCode;
    var date = new Date();
	var path2 = id+'案卡规则分析报告'+date.getFullYear()+''+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+'.docx';
	iceGetData(function (servicePrx) {
        servicePrx.exportWord(key,id,path1,iispath+'//sjjybg//'+path2,null).then(z_databack);
    });
    function z_databack(_z_Data) {
	if(_z_Data){
            alert('输出成功！');
			frameObject.DownFiles("http://"+ip+':'+port+"/sjjybg/"+path2+"");
        }else{
            alert('输出失败！');
        }
	}
}
