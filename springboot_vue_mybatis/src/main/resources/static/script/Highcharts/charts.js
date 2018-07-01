var colors = ['#ff9000', '#90BF18', '#EDCA4E'];
Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
	return {
		radialGradient: {
			cx: 0,
			cy: -0.4,
			r: 4
		},
		stops: [
			[1, color],
			[2, Highcharts.Color(color).brighten(14).get('rgb')] // darken   
		]
	};
});

function line(id) {
	$(id).highcharts({
		title: {
			text: '',
			floating: true,

		},
		chart: {
			backgroundColor: 'transparent'
		},
		credits: {
			enabled: false
		},
		legend: {
			align: 'right',
			//          verticalAlign: 'top',
			y: 60
		},
		xAxis: {
			tickWidth: 0,
			lineColor: '002146',
			categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		series: [{
			name: '东京',
			color: 'red',
			data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
			marker: {
				symbol: 'circle'
			}
		}, {
			name: '纽约',
			data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
			marker: {
				symbol: 'circle'
			}
		}, {
			name: '柏林',
			data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
			marker: {
				symbol: 'circle'
			}
		}]
	});
}

function bar(id,data) {

	$(id).highcharts({
		title: {
			text: '',
			floating: true,
		},
		chart: {
			type: 'bar',
			backgroundColor: 'transparent'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			tickWidth: 0,
			lineColor: '002146',
			categories: ['非洲', '美洲', '亚洲', '欧洲', '大洋洲', '大洋洲', '大洋洲', '大洋洲'],
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
			},
		},
		tooltip: {
			valueSuffix: ' 百万'
		},

		legend: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		series: data
	});
}
function column(id){
	$(id).highcharts({
		title: {
			text: '',
			floating: true,
	
		},
		chart: {
			type: 'column',
			backgroundColor: 'transparent'
		},
		
		credits: {
			enabled: false
		},
		legend: {
			align: 'right',
			//          verticalAlign: 'top',
			y: 60
		},
		xAxis: {
			tickWidth: 0,
			lineColor: '002146',
			categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: '东京',
			colorByPoint: true,
			data: [49.9, 71.5, 106.4, 129.2, 144.0]
		}]
	});
}
