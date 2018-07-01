
//@ sourceURL=pie.js
var zhhhsj = '';
var XJYSJCD = [];
var selectDwbm = unitCode;
$(function () {
	init();
});
function init(){
	$.fn.combotree.defaults.editable = true;
	$.extend($.fn.combotree.defaults.keyHandler,{
		up:function(){
			console.log('up');
		},
		down:function(){
			console.log('down');
		},
		enter:function(){
			console.log('enter');
		},
		query:function(q){
			var t = $(this).combotree('tree');
			var nodes = t.tree('getChildren');
			for(var i=0; i<nodes.length; i++){
				var node = nodes[i];
				if (node.text.indexOf(q) >= 0){
					$(node.target).show();
				} else {
					$(node.target).hide();
				}
			}
			var opts = $(this).combotree('options');
			if (!opts.hasSetEvents){
				opts.hasSetEvents = true;
				var onShowPanel = opts.onShowPanel;
				opts.onShowPanel = function(){
					var nodes = t.tree('getChildren');
					for(var i=0; i<nodes.length; i++){
						$(nodes[i].target).show();
					}
					onShowPanel.call(this);
				};
				$(this).combo('options').onShowPanel = opts.onShowPanel;
			}
		}
	});

    //跑马灯
    getMarquee();
	//饼图
	btpie();
	//柱状图
	zzt();
	//下级院数据传递情况柱状图
	xjysjcdqkzzt();
	//颜色渐变
	ysjb();
	//头部
	heade();
	//各业务传递情况
	gywcdqk();
}
//ICE封装
function iceGetData(callback) {
	Ice.Promise.try(
		function () {
			var iceData = new Ice.InitializationData();
			iceData.properties = Ice.createProperties();
			iceData.properties.setProperty("Ice.MessageSizeMax","102400");
			iceData.properties.setProperty("Ice.Default.Locator", "BigDataAppServer/Locator:ws -h "+ip+" -p 12001");
			communicator = Ice.initialize(iceData);
			var proxy = communicator.stringToProxy("DataValidataService");
		    return TJRH.CASSPASS.IDataValidateServicePrx.checkedCast(proxy).then(
		        function(servicePrx) {
		            callback(servicePrx);
		        }
		    );
		})
		.finally(function () {
			if (communicator) {
				//console.log("communicator.destroy()");
			}
		})
		.exception(function (ex) {
				console.log("error");
			}
		);
}

function getMarquee() {
    iceGetData(function(servicePrx) {
        servicePrx.getWTGAJInfo(key, unitCode).then(z_databack);
    });

    function z_databack(_z_Data) {
        var dataList = eval('(' + _z_Data + ')');
        var html = '';
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            html += (i + 1) + ". 部门受案号：<a class='quantity' onclick=\"openCase('" + data.BMSAH + "', 2, '" + encodeURI(data.NR) +
                "');\" href='javascript:void(0)'> " + data.BMSAH + "</a> 问题：" + data.NR + " 抽取时间：" + data.CQRQ + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        $("#tjMarquee").html(html);
    }
}

//饼图
function btpie() {
    iceGetData(function(servicePrx) {
        servicePrx.getExtracteCaseInfo(key, selectDwbm, null).then(z_databack);
    });

    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var TGL, WTGL;
        $('#tit_ajzl_span').html(_z_Data[0].AJZL);
        TGL = _z_Data[0].AJTGL;
        WTGL = _z_Data[0].AJWTGL;

        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById('container'));

        var option = {
            backgroundColor: '#rgba(255,255,255,.3)',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                useHTML: true
            },

            legend: {
                orient: 'vertical',
                x: 'left',
                y: 'bottom',

                data: ['违反规范数量' + '(' + WTGL + ')', '通过数量' + '(' + TGL + ')'],

//                //textStyle: {
//                //    color: '#0389bc'
//                //}
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
                    radius: ['0', '70%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
									color:'#666666'
                                }
                            },
                            labelLine: {
                                show: true,
                                lineStyle: {
                                    color: '#06a3e1'
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    },
                    data: [
                        { value: WTGL, name: '违反规范数量' + '(' + WTGL + ')', selected: true },
                        { value: TGL, name: '通过数量' + '(' + TGL + ')', selected: true }
                    ]
                }
            ],
            color: [ '#E27161','#33B1AE']
        };
        // 为echarts对象加载数据
        myChart.setOption(option);

        myChart.on("click", function(param) {
            if (param.dataIndex == 0) {
            //违反规范数量
                bmsahData1(null, 2, true);
            }
            else if (param.dataIndex == 1) {
            //通过数量
                bmsahData1(null, 1, true);
            }
            //console.log(param);
        });
    }
}

//柱状图
function zzt() {
	iceGetData(function (servicePrx) {
		servicePrx.getRecentCasePassInfo(key,selectDwbm,null).then(z_databack);
	});

	function z_databack(_z_Data) {
		_z_Data = JSON.parse(_z_Data);
		var categories = [];
		var categoriesdata = [];
		var Wcategoriesdata = [];
		_z_Data.forEach(function(v,index){
			if(index == 0){
				zhhhsj = v.DATE;
			}
			categories.push(v.DATE);
			categoriesdata.push(v.AJZL);
			Wcategoriesdata.push(v.WTGS);
		});
		var chart = Highcharts.chart('containe', {

			chart: {
				type: 'column',
				backgroundColor:'rgbA(255,255,255,0.5)'
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
				tickWidth: 0,
				//lineColor: '002146',
				categories: categories,

				labels:{
					useHTML:true,
					//style:{
					//	color:'#00e1e1'
					//},
					formatter:function () {
						var i;
						var value = this.value;
						categories.forEach(function(v,index){
							if(v === value){
								i = index;
							}
						});
						var dwbm = categories[i];
						return '<a style="text-decoration: none;color: #0389bc" href="javascript:DateShowXjysj(\''+dwbm+'\')">'+this.value+'</a>';
					}

				}
			},
			yAxis: {
				//gridLineColor: '#002146',
				labels: {
					x: -15,
					//style: {
					//	color: '#0389bc'
					//}
				},
				title: {
					text: ''
				},

				allowDecimals: false //是否允许刻度有小数点
			},
			plotOptions:{
				column:{
					//dataLabels:{
						//enabled:true,
						//allowOverlap:true,
						//color:'#0ff'
					//}
				}
			},
			series: [{
				name: '<span style="color:#0389bc;">案件传递情况</span>',
				data: categoriesdata,
				point: {
					events: {
						click: function (v) {
							bmsahData1(v.point.category,4,true);
						}
					}
				},
				
				cursor:'pointer',
			},{
				name: '<span style="color:#0389bc;">未通过数量</span>',
				data: Wcategoriesdata,
				point: {
					events: {
						click: function (v) {
							bmsahData1(v.point.category,2,true);
						}
					}
				},
				cursor:'pointer'
			}],
            colors:['#1AA19D', '#138CDD'],
			responsive: {
				rules: [{
					condition: {
					width: myWidth
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
			    width: myWidth
			}
		});
	}
}
//下级院数据传递情况柱状图
function xjysjcdqkzzt() {
	iceGetData(function (servicePrx) {
		servicePrx.getLowDwCasePassInfo(key,selectDwbm,null).then(z_databack);
	});
	function z_databack(_z_Data) {
		_z_Data = JSON.parse(_z_Data);
		var categories = [];
		var categoriesdata = [];
		var Wcategoriesdata = [];
		var DWBMid = [];
		XJYSJCD = _z_Data;
		_z_Data.forEach(function(v){
//			categories.push(v.DWMC);
			categories.push('<span id='+ v.DWBM +'>'+v.DWMC+'</span>');
			DWBMid.push(v.DWBM);
			categoriesdata.push(v.AJZL);
			Wcategoriesdata.push(v.WTGS);
		});
		var chart = Highcharts.chart('xjysjcdqk', {
			chart: {
				type: 'column',
			backgroundColor: 'rgba(255,255,255,0.5)'
			},
			title: {
				text: ' '
			},
			data: {
				columns: DWBMid
			},
			subtitle: {
				// text: '请点击按钮查看坐标轴变化'
			},
			tooltip: {
			    useHTML: true
			},
			xAxis: {
				categories: categories,
			//lineColor: '002146',
				labels:{
				//style: {
				//	color: '#0389bc'
				//},
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
						var dwmc = categories[i];
						return '<a style="text-decoration: none;color: #0389bc" href="javascript:show(\''+dwbm+'\')">'+this.value+'</a>';
					}
				}
			},
			yAxis: {
			//gridLineColor: '#002146',
				labels: {
					x: -15,
				//style: {
				//	color: '#0389bc'
				//}
				},
				title: {
					text: ''
				},
				allowDecimals: false //是否允许刻度有小数点
			},
			plotOptions:{
				column:{
					
					//dataLabels:{
						//enabled:true,
						//allowOverlap:true,
						//color:'#0ff'
					//}
				}
			},
			series: [{
				name: '<span style="color:#0389bc;">案件传递情况</span>',
				data: categoriesdata,
				
				point: {
					events: {
						click: function (e) {
                            var date = $('#index_date').text();
                            var dwbm = e.point.category.substr(9, 6);
							bmsahData1(date,4,false,dwbm);
						}
					}
				},
				cursor:'pointer'
			},{
				name: '<span style="color:#0389bc;">未通过数量</span>',
				data: Wcategoriesdata,
				point: {
					events: {
						click: function (e) {
                            var date = $('#index_date').text();
                            var dwbm = e.point.category.substr(9, 6);
							bmsahData1(date,2,false,dwbm);
						}
					}
				},
				cursor:'pointer'
			}],
			colors:['#138CDD','#E27161'],
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
	// chart.on(function (v) {
	// 	console.log(v);
	// })
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
		var colors = ['#03afea', 'red', '#EDCA4E'];
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
//头部
function heade() {
    iceGetData(function(servicePrx) {
        servicePrx.getPassInfo(key, selectDwbm, null).then(z_databack);
    });

    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        if (_z_Data.length > 0) {
//        bmsahData(v.point.category,0);

            $('#tit_sjcd').text(_z_Data[0].NR);
            //最后审核时间
            $('#index_date').text(_z_Data[0].CQDATE);
            //最后通过数量
//			$('#index_TGnumber').text(_z_Data[0].AJZL);
            if (_z_Data[0].AJZL == 0) {
                $('#index_TGnumber').text(0);
            } else {
                $('#index_TGnumber').html('<a style="text-decoration: none;color: #0389bc" href="javascript:bmsahData1(\'' + _z_Data[0].CQDATE + '\',4,true)">' + _z_Data[0].AJZL + '</a>');
            }
            //最后未通过数量
//			$('#index_WTGnumber').text(_z_Data[0].SHWTG);
            if (_z_Data[0].SHWTG == 0) {
                $('#index_WTGnumber').text(0);
            } else {
                $('#index_WTGnumber').html('<a style="text-decoration: none;color: #0389bc" href="javascript:bmsahData1(\'' + _z_Data[0].CQDATE + '\',2,true)">' + _z_Data[0].SHWTG + '</a>');
            }
            //最后通过率
            $('#index_TGpercent').text(_z_Data[0].CQTGL);
            //问题总量
            //$('#index_WTnumber').text(_z_Data[0].WTZL);
            if (_z_Data[0].WTZL == null || _z_Data[0].WTZL == 0) {
                $('#index_WTnumber').text(0);
            } else {
                $('#index_WTnumber').html('<a style="text-decoration: none;color: #0389bc" href="javascript:bmsahData1(\'' + _z_Data[0].CQDATE + '\',3,true)">' + _z_Data[0].WTZL + '</a>');
            }
        } else {
            $('#tit_sjcd').text('');
            //最后审核时间
            $('#index_date').text('');
            //最后通过数量
            $('#index_TGnumber').text('');
            //最后未通过数量
            $('#index_WTGnumber').text('');
            //最后通过率
            $('#index_TGpercent').text('');
            //问题总量
            $('#index_WTnumber').text('');
        }
    }
}

//各业务传递情况
function gywcdqk(){
	iceGetData(function (servicePrx) {
		servicePrx.getYWCaseInfo(key,selectDwbm,null).then(z_databack);
	});
	function z_databack(_z_Data) {
		_z_Data = JSON.parse(_z_Data);
		var a = '';
		$('#sy_ywcd').html(function(){
			for(var i=0;i<_z_Data.length;i++){
				a += '<li><span>'+_z_Data[i].YWMC+'</span><div class="ywcd_jdt"><div class="ywcd_jd" style="width: '+_z_Data[i].TGL+'" title="通过案件数量">'+_z_Data[i].TGVALUE+'</div></div>' +
					'<span class="ywcd_sz" title="违反规范案件数量('+_z_Data[i].WTGVALUE+')">'+(_z_Data[i].WTGVALUE>=10000?Math.round(_z_Data[i].WTGVALUE/10000)+'w':_z_Data[i].WTGVALUE)+'</span><span class="ywcd_bfb" title="通过率">'+_z_Data[i].TGL+'</span></li>'
			}
			return a;
		});
	}
}

function bmsahData(date, type) {
    iceGetData(function(servicePrx) {
        servicePrx.getCaseByDate(key, selectDwbm, date, type, 1, null).then(z_databack);
    });

    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        iceGetData(function(servicePrx) {
            servicePrx.getCasePageByDate(key, selectDwbm, date, type, null).then(z_databackpage);
        });

        function z_databackpage(page) {
            if (_z_Data && _z_Data.length > 0) {
                var a = {
                    url: key,
                    DWBM: selectDwbm,
                    date: date,
                    type: type,
                    index: 0,
                    pageNumber: 1,
                    pageSize: 30,
                    total: _z_Data.total
                };
                if (type == 0) {
                    loadiframe1(a, _z_Data[0].BMSAH, true, _z_Data);
                } else {
                    iceGetData(function(servicePrx) {
                        servicePrx.getCaseAkrule(key, _z_Data[0].BMSAH, date).then(z_databack);
                    });

                    function z_databack(_z_Data1) {
                        nr = _z_Data1;
                        loadiframe1(a, _z_Data[0].BMSAH, false, _z_Data, date, nr);
                    }
                }
            }
        }
    }
}

function xjysjcdData(index, type) {
    iceGetData(function(servicePrx) {
        if (index == 0) {
            servicePrx.getCaseByDate(key, XJYSJCD[index].DWBM, zhhhsj, type, 1, null).then(z_databack);
        } else {
            servicePrx.getCaseByDate1(key, XJYSJCD[index].DWBM, zhhhsj, type, 1, null).then(z_databack1);
        }
    });

    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        iceGetData(function(servicePrx) {
            servicePrx.getCasePageByDate(key, XJYSJCD[index].DWBM, zhhhsj, type, null).then(z_databackpage);
        });

        function z_databackpage(page) {
            if (_z_Data && _z_Data.length > 0) {
                var a = {
                    url: key,
                    DWBM: XJYSJCD[index].DWBM,
                    date: zhhhsj,
                    type: type,
                    index: index,
                    pageNumber: 1,
                    pageSize: 30,
                    total: _z_Data.total
                };
                if (type == 0) {
                    loadiframe1(a, _z_Data[0].BMSAH, true, _z_Data);
                } else {
                    iceGetData(function(servicePrx) {
                        servicePrx.getCaseAkrule(key, _z_Data[0].BMSAH, zhhhsj).then(z_databack);
                    });

                    function z_databack(_z_Data1) {
                        nr = _z_Data1;
                        loadiframe1(a, _z_Data[0].BMSAH, false, _z_Data, zhhhsj, nr);
                    }
                }
            }
        }
    }

    function z_databack1(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        iceGetData(function(servicePrx) {
            servicePrx.getCasePageByDate1(key, XJYSJCD[index].DWBM, zhhhsj, type, null).then(z_databackpage);
        });

        function z_databackpage(page) {
            if (_z_Data && _z_Data.length > 0) {
                var a = {
                    url: key,
                    DWBM: XJYSJCD[index].DWBM,
                    date: zhhhsj,
                    type: type,
                    index: index,
                    pageNumber: 1,
                    pageSize: 30,
                    total: _z_Data.total
                };
                if (type == 0) {
                    loadiframe1(a, _z_Data[0].BMSAH, true, _z_Data);
                } else {
                    iceGetData(function(servicePrx) {
                        servicePrx.getCaseAkrule(key, _z_Data[0].BMSAH, zhhhsj).then(z_databack);
                    });

                    function z_databack(_z_Data1) {
                        nr = _z_Data1;
                        loadiframe1(a, _z_Data[0].BMSAH, false, _z_Data, zhhhsj, nr);
                    }
                }
            }
        }
    }
}

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
function fanhui(){
    selectDwbm = newdwbm.length > 1 ? newdwbm[newdwbm.length - 2] : unitCode;
    newdwbm.pop();
    if (selectDwbm == unitCode) {
        $('#fanhui').css('display','none');
    }
    init();
}

function DateShowXjysj(dwbm){
	console.log(dwbm);
}

function bmsahData1(date, type, islowdw, dwbm) {
    dwbm = dwbm == null ? selectDwbm : dwbm;
    iceGetData(function(servicePrx) {
        servicePrx.getAJList(key, dwbm, date, islowdw, type, 30, 1).then(z_databack);
    });

    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        if (_z_Data && _z_Data.data && _z_Data.data.length > 0) {
            var a = {
                url: key,
                DWBM: dwbm,
                date: date,
                type: type,
                index: 0,
                pageNumber: 1,
                pageSize: 30,
                total: _z_Data.total,
                islowdw :islowdw
            };
            if (type == 0) {
                loadiframe1(a, _z_Data.data[0].BMSAH, true, _z_Data.data);
            } else {
                iceGetData(function(servicePrx) {
                    servicePrx.getCaseAkrule(key, _z_Data.data[0].BMSAH, date).then(z_databack1);
                });

                function z_databack1(_z_Data1) {
                    var nr = _z_Data1;
                    loadiframe1(a, _z_Data.data[0].BMSAH, false, _z_Data.data, date, nr);
                }
            }
        }
    }
}