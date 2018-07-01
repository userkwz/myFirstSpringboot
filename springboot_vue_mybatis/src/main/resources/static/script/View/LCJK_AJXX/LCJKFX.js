$(function () {
    var url = new UrlSearch();
    var date = new Date();
    AddOperationLog('流程监控-监控分析');
    $.ajax({
        type: "post",
        async: true,
        url: "/Handler/AJXX/AJXXHandler.ashx?action=Query_Lcjkfx_jd",
        success: function (result) {
            var value = result == "" ? { "YF": [], "ZS": [], "SM": [],"KT":[]} : eval('(' + result + ')');

            init_ljckfx_ZZT('', value); //按月份统计监督数量柱状图
            init_ljckfx_ZXT('', value); //按月份统计监督数量折线图
        },
        error: function (data) {

        }
    });

    $.ajax({
        type:"post",
        async:true,
        url: "/Handler/AJXX/AJXXHandler.ashx?action=Query_Lcjkfx_YW",
        success: function (result) {
            var value = result == "" ? { "YWMC": [], "SL": []} : eval('(' + result + ')');
            init_ljckfx_PieYW('', value); //按月份统计监督数量柱状图
        },
        error: function (data) {

        }
    });

    $.ajax({
        type: "post",
        async: true,
        url: "/Handler/AJXX/AJXXHandler.ashx?action=Query_Lcjkfx_AJLB",
        success: function (result) {
            var value = result == "" ? { "YWMC": [], "SL": []} : eval('(' + result + ')');
            init_ljckfx_PieAJLB('', value); //按月份统计监督数量柱状图
        },
        error: function (data) {

        }
    });
});

function init_ljckfx_ZZT(title, data) {
    $('#xiaoer_lcjkfx_div1').highcharts({
        chart: {
            type: 'column',
            backgroundColor: '#08143C'
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
            categories: eval(data.YF),
              lineColor: '002146',
            labels: {
                style: {
                    color: '#00e1e1'
                }
            }
        },
        yAxis: {
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
                events: {
                    click: function(e) {

                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: '总数',
                color: 'blue',
                data: eval(data.ZS),
                 dataLabels: {
                    enabled: true,
                    useHTML: true,
                    color: '#07b1f9'
                }
            }, {
                name: '口头',
                color: 'yellow',
                data: eval(data.KT),
                 dataLabels: {
                    enabled: true,
                    useHTML: true,
                    color: '#07b1f9'
                }
            }, {
                name: '书面',
                color: 'red',
                data: eval(data.SM),
                 dataLabels: {
                    enabled: true,
                    useHTML: true,
                    color: '#07b1f9'
                }
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '按月份统计监督数量柱状图',
            width: 1200
        }
    });

};

function init_ljckfx_ZXT(title, data) {
    $('#xiaoer_lcjkfx_div2').highcharts({
        chart: {
            backgroundColor:'#08143C'
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
            categories: eval(data.YF),
            labels: {
                style: {
                    color: '#00e1e1'
                }
            }
        },
        yAxis: {
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
                events: {
                    click: function(e) {

                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: '总数',
                color: 'blue',
                data: eval(data.ZS)
            }, {
                name: '口头',
                color: 'yellow',
                data: eval(data.KT)
            }, {
                name: '书面',
                color: 'red',
                data: eval(data.SM)
               
            }
        ],
        exporting: {
            url: '/Handler/common.ashx?action=UpdateBmp',
            filename: '按月份统计监督柱数量折线图',
            width: 1200
        }
    });
}


function init_ljckfx_PieYW(title, data) {
    var myChart = echarts.init(document.getElementById('xiaoer_lcjkfx_div3'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            useHTML:true
        },
        calculable: true,
        series: [
				{
				    name: '数据来源',
				    type: 'pie',
				    radius: ['50%', '70%'],
				    itemStyle: {
				        normal: {
				            label: {
				                show: true,
				                textStyle: {
				                    color: '#00e1e1'
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
				    data: data
				}
			],
    };
    // 为echarts对象加载数据
    myChart.setOption(option);
};

function init_ljckfx_PieAJLB(title, data) {
    var myChart = echarts.init(document.getElementById('xiaoer_lcjkfx_div4'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            useHTML:true
        },
        calculable: true,
        series: [
            {
                name: '数据来源',
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#00e1e1'
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
                data: data
            }
        ],
    };
// 为echarts对象加载数据
    myChart.setOption(option);
};
