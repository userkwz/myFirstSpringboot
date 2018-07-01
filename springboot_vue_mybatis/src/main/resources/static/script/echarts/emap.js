//@ sourceURL=emap.js

//var clickCityName;
var option = null;
var myChart;
var dataList;
var parm = new UrlSearch();
var dwbm;
//1统一业务助手-受理分析、2电子卷宗分析助手、3案件公开分析助手
var dataType;
var rqlx;
var dateName;
var minNumber = 0;
var maxNumber = 10;
//url参数解析
function UrlSearch() {
    var name, value;
    var str = location.href;
    var num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");

    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}

window.onload = function() {
    //获取地址栏中的dwbm
    dwbm = parm.dwbm;
    if (dwbm == null) {
        return;
    }

    dataType = parm.dataType;
    rqlx = parm.rqlx;
    var sjtype = parm.sjtype;
    dateName = rqlx == 4 ? '本年' : rqlx == 3 ? '本季' ? rqlx == 2 ? '本月' ? rqlx == 1 ? '今日' : '' : '' : '' : '' : '';
    
    var dateStart = parm.dateStart;
    var dateEnd = parm.dateEnd;
    if (dateStart != "") {
        dateName = "";
    }
    var selectedDwbm = parm.selectedDwbm;
    if (dataType == 1 && rqlx != "" && sjtype != "") {
        //统一业务助手-受理分析
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: '', rqlx: rqlx,startdate: dateStart, enddate:dateEnd, sjtype: sjtype },
            url: "/Handler/TYYW/TYYWHandler.ashx?action=GetAJTJ",
            success: function(result) {
                result = result == "" ? "[]" : result;
                var data = eval('(' + result + ')');
                dataList = data;
                for (var i = 0; i < dataList.length; i++) {
                    var slajsl = dataList[i].slajsl = parseInt(dataList[i].slajsl);
                    if (minNumber > slajsl) {
                        minNumber = slajsl;
                    }
                    if (maxNumber < slajsl) {
                        maxNumber = slajsl;
                    }
                }
                if (parent != null && parent.mapLoadBackCall1 != null) {
                    parent.mapLoadBackCall1();
                }
                loadMap();
            },
            error: function(data) {

            }
        });
    }else if (dataType == 2) {
        //电子卷宗分析助手
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: selectedDwbm, dateStart: dateStart, dateEnd: dateEnd },
            url: "/Handler/DZJZ/DZJZHandler.ashx?action=Query_Dzjz_tjdata_all",
            success: function(result) {
                result = result == "" ? "[]" : result;
                var data = eval('(' + result + ')');
                dataList = data;
                for (var i = 0; i < dataList.length; i++) {
                    var yzzs = parseInt(dataList[i].yzzs);
                    if (minNumber > yzzs) {
                        minNumber = yzzs;
                    }
                    if (maxNumber < yzzs) {
                        maxNumber = yzzs;
                    }
                }
                if (parent != null && parent.mapLoadBackCall2 != null) {
                    parent.mapLoadBackCall2();
                }
                loadMap();
            },
            error: function(data) {

            }
        });
    } 
    else if (dataType == 3) {
        //案件信息公开
        $.ajax({
            type: "post",
            async: true,
            data: { dwbm: selectedDwbm, dateStart: dateStart, dateEnd: dateEnd },
            url: "/Handler/agxe/agxeHandler.ashx?action=Query_Ajxxgk_map",
            success: function(result) {
                result = result == "" ? "[]" : result;
                var data = eval('(' + result + ')');
                dataList = data;
                for (var i = 0; i < dataList.length; i++) {
                    var xxsl = parseInt(dataList[i].xxsl);
                    if (minNumber > xxsl) {
                        minNumber = xxsl;
                    }
                    if (maxNumber < xxsl) {
                        maxNumber = xxsl;
                    }
                }
                if (parent != null && parent.mapLoadBackCall != null) {
                    parent.mapLoadBackCall();
                }
                loadMap();
            },
            error: function(data) {

            }
        });
        loadMap();
    }
    else {
        dataList = eval('([])');
        loadMap();
    }
}

function randomValue() {
    return Math.round(Math.random() * 18);
}

var star = [];
function loadMap() {

    var cdata = null;
    var parentCityCode = '';

    if (dwbm.substr(2, 2) != "00") {
        parentCityCode = dwbm.substr(0, 2) + '0000';
        cdata = getCity(cityData, parentCityCode);
    }
    if (dwbm.substr(4, 2) != "00") {
        parentCityCode = dwbm.substr(0, 4) + '00';
        cdata = getCity(cdata != null ? cdata.children : cityData, parentCityCode);
        cdata = getCity(cdata != null ? cdata.children : cityData, dwbm);
    } else {
        cdata = getCity(cdata != null ? cdata.children : cityData, dwbm);
    }

    if (cdata == null) {
        return;
    }

    myChart = echarts.init(document.getElementById("main"));
    //默认右键返回最顶级
    document.getElementById('main').oncontextmenu = function (e) {
        if (e.button == 2) {
            option.geo.map = cdata.name;
            option.title.text = cdata.name;
            option.title.subtext = '';
            option.series[0].data = star;
            option.series[1].data = setData(cdata.children);
            myChart.setOption(option, true);
            //                    console.log('右');
        } else if (e.button == 0) {
            //                    console.log('中')
        } else if (e.button == 1) {
            //                    console.log('左')
        }
        return false;
    }

    //若找到对应单位，则读取区域坐标的json文件
    $.getJSON(cdata.jsonFile, function (data) {

        echarts.registerMap(cdata.name, data);

        //点击
        myChart.off('click');
        myChart.on("click", function (param) {
            if (parent != null && parent.show_map != null) {
                parent.show_map(param.data.cityCode);
            }
        });

        //双击默认进入下一级
        myChart.on("dblclick", function (param) {

            setChild(myChart, param, cdata, option);
        });

        //重写重置按钮事件
        myChart.on("restore", function (param) {
            option.geo.map = cdata.name;
            option.title.text = cdata.name;
            option.title.subtext = '';
            option.series[0].data = star;
            option.series[1].data = setData(cdata.children);
            myChart.setOption(option, true);
        });

        //省会坐标点
        var geoCoordMap = {
            '省院机关': cdata.point
        };
        //覆盖物信息
        if (dwbm.substr(2, 4) == "0000") {
            star = [
                {
                    name: '省院机关',
                    value: cdata.point.concat(randomValue()),
                    cityCode: cdata.cityCode
                }
            ];
        }

        function setData(data) {
            var res = [];
            if (data == null)
                return res;
            var val;
            var i;
            if (dataList != null && dataList.length > 0) {
                for (i = 0; i < data.length; i++) {
                    for (var j = 0; j < dataList.length; j++) {
                        if (data[i].cityCode == dataList[j].dwbm) {
                            val = {
                                name: data[i].name,
                                cityCode: data[i].cityCode,
                                jsonFile: data[i].jsonFile,
                            };
                            if (dataType == 1) {
                                val.slajsl = dataList[j].slajsl != null ? parseInt(dataList[j].slajsl) : 0;
                                val.fpajsl = dataList[j].fpajsl != null ? parseInt(dataList[j].fpajsl) : 0;
                                val.sjajsl = dataList[j].sjajsl != null ? parseInt(dataList[j].sjajsl) : 0;
                                val.wsjajsl = dataList[j].wsjajsl != null ? parseInt(dataList[j].wsjajsl) : 0;
                                val.value = val.slajsl;
                            } else if (dataType == 2) {
                                val.yzzs = dataList[j].yzzs != null ? parseInt(dataList[j].yzzs) : 0;
                                val.wzzs = dataList[j].wzzs != null ? parseInt(dataList[j].wzzs) : 0;
                                val.zs = dataList[j].zs != null ? parseInt(dataList[j].zs) : 0;
                                val.zzl = dataList[j].zzl != null ? parseFloat(dataList[j].zzl) : 0;
                                val.lsdcs = dataList[j].lsdcs != null ? parseInt(dataList[j].lsdcs) : 0;
                                val.value = val.yzzs;
                            }else if (dataType == 3) {
                                val.xxsl = dataList[j].xxsl != null ? parseInt(dataList[j].xxsl) : 0;
                                val.ygkws = dataList[j].ygkws != null ? parseInt(dataList[j].ygkws) : 0;
                                val.ygk = dataList[j].ygk != null ? parseInt(dataList[j].ygk) : 0;
                                val.wgk = dataList[j].wgk != null ? parseFloat(dataList[j].wgk) : 0;
                                
                                val.value = val.xxsl;
                            } else {
                                val.value = randomValue();
                            }
                            res.push(val);
                            break;
                        }
                    }
                }
            } else {
                for (i = 0; i < data.length; i++) {
                    res.push({
                        name: data[i].name,
                        cityCode: data[i].cityCode,
                        jsonFile: data[i].jsonFile,
                    });
                }
            }
            return res;
        };
        if (cdata.children == undefined) {
            cdata.children = [];
            cdata.children.push(cdata);
        }
        option = {
            title: {//左上角的标题
                text: cdata.name,
                subtext: '',
                textStyle:{
                    color:'#07b1f9'
                }
            },
            toolbox: {//将重置按钮修改为返回按钮，作用为范围至最顶级(地址中的dwbm)
                show: true,
                feature: {
                    restore: {
                        show: true,
                        icon: "image://../../images/back.png",
                        title: '返回'
                    }
                }
            },
            itemStyle: {
                color: '#30c0e3'
            },
            tooltip: {//鼠标移动到区域内显示的信息
                formatter: function (params) {
                    if (params.name == '省院机关') {
                        return params.name;
                    }
                    else if (dataType == 1 && dataList.length > 0) {
                        return params.name +
                            '<br>' + dateName + '受理案件数：' + (params.data.slajsl != null ? params.data.slajsl : 0) +
                            '<br>往年未结案件数：' + (params.data.fpajsl != null ? params.data.fpajsl : 0) +
                            '<br>' + dateName + '审结案件数：' + (params.data.sjajsl != null ? params.data.sjajsl : 0) +
                            '<br>本年未结案件数：' + (params.data.wsjajsl != null ? params.data.wsjajsl : 0);
                    }else if (dataType == 2 && dataList.length > 0) {
                        return params.name +
                            '<br>应制作案件(件)：' + (params.data.zs != null ? params.data.zs : 0) +
                            '<br>已制作案件(件)：' + (params.data.yzzs != null ? params.data.yzzs : 0) +
                            '<br>未制作案件(件)：' + (params.data.wzzs != null ? params.data.wzzs : 0) +
                            '<br>制作率(%)：' + (params.data.zzl != null ? params.data.zzl : 0)+
                            '<br>自决定案件（件）：' + (params.data.lsdcs != null ? params.data.lsdcs : 0);
                    }else if (dataType == 3 && dataList.length > 0) {
                        return params.name +
                            '<br>案件程序性信息（件）：' + (params.data.xxsl != null ? params.data.xxsl : 0) +
                            '<br>应公开法律文书（份）：' + (params.data.ygkws != null ? params.data.ygkws : 0) +
                            '<br>法律文书已公开（份）：' + (params.data.ygk != null ? params.data.ygk : 0) +
                            '<br>法律文书未公开（份）：' + (params.data.wgk != null ? params.data.wgk : 0)+
                            '<br>公开率（%）：' + (params.data.ygkws != 0 ? (params.data.ygk*100/(params.data.ygkws)).toFixed(2)+'%' : '--%');
                    }
                    else {
                        return params.name;
                    }
                }
            },
            visualMap: {//根据数据多少显示区域颜色
                min: minNumber,
                max: maxNumber,
                left: 'left',
                top: 'bottom',
                show: false,
                text: ['Low', 'High'],
                seriesIndex: [1],
                inRange: {
                    color: [
                    //'#FEFFB4',
                    //'#D0F3DE',
                    //'#FCD8BB',
                    //'#E5CCE7',
                    //'#F6D3B8',
                    //'#D0F3DE',
                    //'#E5CCE7'
                         '#7edefb',
                         '#52d0f4',
                         '#0bc5f8',
                         '#0bc5f8',
                         '#159bdf'
                       
                     ]
                },
                calculable: true
            },
            geo: {
                map: cdata.name,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis: {
                        areaColor: null,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            series: [{//省会坐标点覆盖物
                type: 'scatter',
                coordinateSystem: 'geo',
                data: star,
                symbolSize: 20,
                symbol: 'image://../../images/star.png',
                symbolRotate: 35,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false,
                    },
                    emphasis: {
                        show: true
                    }
                    
                },
                itemStyle: {
                    normal: {
                        color: '#F48e50'
                    }
                }
            }, {//区域数据显示
                name: 'categoryA',
                type: 'map',
                geoIndex: 0,

                data: setData(cdata.children)

            }]
        };
        myChart.setOption(option, true);
    });
}

function getCity(cityData, dwbm) {
    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].cityCode == dwbm) {
            return cityData[i];
        }
    }
    return null;
}

function getCityCode(data, name, selectedCityName) {
    var city = null;

    if (selectedCityName == data.name) {
        //上级为顶级
        for (var i = 0; i < data.children.length; i++) {
            if (data.children[i].name == name) {
                city = data.children[i];
                break;
            }
        }
    } else {
        //上级不为顶级
        for (var i = 0; i < data.children.length; i++) {
            if (data.children[i].name == selectedCityName) {
                city = data.children[i];
                for (var j = 0; j < city.children.length; j++) {
                    if (city.children[j].name == name) {
                        city = city.children[j];
                        break;
                    }
                }
                break;
            }
        }
    }

    if (city == null) {
        return null;
    }
    else {
        return city.cityCode;
    }
}

//双击进入下一级方法
function setChild(myChart, param, data, option) {
    var city = {};
    if (param.name != data.name) {
        if (param.data.cityCode.substr(2,4) == "0000") {
            //上级为顶级
            for (var i = 0; i < data.children.length; i++) {
                if (data.children[i].name == name) {
                    city = data.children[i];
                    break;
                }
            }
            option.series[0].data = star;
        } else {
            //上级不为顶级
            for (var i = 0; i < data.children.length; i++) {
                if (data.children[i].name == param.name) {
                    city = data.children[i];
                    if (city.children != undefined) {
                        for (var j = 0; j < city.children.length; j++) {
                            if (city.children[j].name == name) {
                                city = city.children[j];
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            option.series[0].data = [];
        }

        $.getJSON(param.data.jsonFile, function (data) {
            option.geo.map = param.name;
            option.title.text = param.name;
            option.title.subtext = '';
            option.series[1].data = city.children == null ? [param.data] : setData(city.children);
            echarts.registerMap(param.name, data);
            myChart.setOption(option, true);
        });
    } else {
        option.geo.map = param.name;
        option.title.text = param.name;
        option.title.subtext = '';
        myChart.setOption(option, true);
    }
}

function setData(data) {
    var res = [];
    if (data == null)
        return res;
    if (dataList != null && dataList.length > 0) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < dataList.length; j++) {
                if (data[i].cityCode == dataList[j].dwbm) {
                    var val = {
                        name: data[i].name,
                        cityCode: data[i].cityCode,
                        jsonFile: data[i].jsonFile,
                    };
                    if (dataType == 1) {
                        val.slajsl = dataList[j].slajsl != null ? parseInt(dataList[j].slajsl) : 0;
                        val.fpajsl = dataList[j].fpajsl != null ? parseInt(dataList[j].fpajsl) : 0;
                        val.sjajsl = dataList[j].sjajsl != null ? parseInt(dataList[j].sjajsl) : 0;
                        val.wsjajsl = dataList[j].wsjajsl != null ? parseInt(dataList[j].wsjajsl) : 0;
                        val.value = val.slajsl;
                    } else if (dataType == 2) {
                        val.yzzs = dataList[j].yzzs != null ? parseInt(dataList[j].yzzs) : 0;
                        val.wzzs = dataList[j].wzzs != null ? parseInt(dataList[j].wzzs) : 0;
                        val.zs = dataList[j].zs != null ? parseInt(dataList[j].zs) : 0;
                        val.zzl = dataList[j].zzl != null ? parseFloat(dataList[j].zzl) : 0;
                        val.lsdcs = dataList[j].lsdcs != null ? parseInt(dataList[j].lsdcs) : 0;
                        val.value = val.yzzs;
                    } else if (dataType == 3) {
                        val.xxsl = dataList[j].xxsl != null ? parseInt(dataList[j].xxsl) : 0;
                        val.ygkws = dataList[j].ygkws != null ? parseInt(dataList[j].ygkws) : 0;
                        val.ygk = dataList[j].ygk != null ? parseInt(dataList[j].ygk) : 0;
                        val.wgk = dataList[j].wgk != null ? parseFloat(dataList[j].wgk) : 0;
                        val.value = val.xxsl;
                    } else {
                        val.value = randomValue();
                    }
                    res.push(val);
                    break;
                }
            }
        }
    }
    else {
        for (i = 0; i < data.length; i++) {
            res.push({
                name: data[i].name,
                cityCode: data[i].cityCode,
                jsonFile: data[i].jsonFile,
            });
        }
    }
    return res;
}