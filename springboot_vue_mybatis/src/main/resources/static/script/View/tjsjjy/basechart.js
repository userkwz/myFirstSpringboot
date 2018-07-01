//@ sourceURL=basechart.js
var SHGX = '';
var Year = '';
var Month = '';
var BBJB = '';
var BBBM = '';
var LDATA = [];
var RDATA = [];
var BBID = '';
var dwbm = unitCode;
var baseTable = [];
var TOPMC = new Array();
$(function () {

    var yearList = getYearList();
    $('#Year').combobox({
        data: yearList,
        valueField: 'id',
        textField: 'text',
        onLoadSuccess: function() {
            var date = new Date();

            Year = date.getFullYear();
            Month = date.getMonth() + 1;

            $('#Year').combobox("select",Year);
            $('#Month').val(Month);
        },
    });

    BBJB = $('#BBJB').val();
    BBBM = $('#ZSCQAJID').val();

    var dw = unitCode;
    // 单位编码ComboTree初始化
    $('#basechartDW').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        onLoadSuccess: function () {
            $('#basechartDW').combotree('setValue', dw);
            //defaultValue("basechartDW", unitCode, unitName);
        },
        onSelect: function (node) {
            dwbm = node.id;
        },
        onLoadError: function (data) {
            //alert("Error:" + data.responseText);
        }
    });
    //报表数据
    iceGetData(function (servicePrx) {
        servicePrx.getReoprtTree().then(z_databack);
    });
    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        $('#ZSCQAJ').combobox({
            method: 'get',
            data: _z_Data,
            valueField: 'BM',
            textField: 'MC',
            multiple: true,
            formatter: function (row) {
                var opts = $(this).combobox('options');
                return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField];
            },
            onLoadSuccess: function (data) {
                baseTable = data;
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function (value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                });
            },
            onSelect: function (row) {
                var opts = $(this).combobox('options');
                var el = opts.finder.getEl(this, row[opts.valueField]);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            },
            onUnselect: function (row) {
                var opts = $(this).combobox('options');
                var el = opts.finder.getEl(this, row[opts.valueField]);
                el.find('input.combobox-checkbox')._propAttr('checked', false);
            }
        });
    }

    //报表数据
    //iceGetData(function (servicePrx) {
    //    servicePrx.getReoprtTree().then(z_databack);
    //});
    //function z_databack(_z_Data) {
    //    _z_Data = JSON.parse(_z_Data);
    //    $('#ZSCQAJ').combotree({
    //        data:_z_Data,
    //    valueField:'BM',    
    //    textField: 'MC',
    //        multiple:true
    //    });

    //        $('#ZSCQAJ').html(function () {
    //            var a = '<option value="">--请选择--</option>';
    //            var flag = true;
    //            _z_Data.forEach(function (v) {
    //                if (v.LB == 1) {
    //                    if (flag) {
    //                        a += '<option value="' + v.BM + '" name="' + v.REPID + '" selected>' + v.MC + '</option>';
    //                        flag = false;
    //                    } else {
    //                        a += '<option value="' + v.BM + '" name="' + v.REPID + '">' + v.MC + '</option>';
    //                    }
    //                }
    ////                $("#ZSCQAJ").combobox('setValues', a);
    //            });


    //        });

    //ZSCQAJChange();
    //WTGSHGXLB();
    //}


});

function ZSCQAJChange(){
    var bbbmList = $('#ZSCQAJ').combobox('getValues');
	BBBM = '';
	for (var i = 0; i < bbbmList.length; i++) {
        BBBM += bbbmList[i] + (i != bbbmList.length - 1 ? ',' : '');
    }
	
    var even = baseTable.find(function (item) { return item.BM == bbbmList[0]; });
    BBID = even.REPID;
    var jcbmc = $('#ZSCQAJ').combobox('getText');
    TOPMC = jcbmc.split(',');
//    var even1 = baseTable.find(function (item) { return item.REPID == value; });
//    even1.BM

}
//function treedata(array,data){
//    for(var i=0;i<data.length;i++){
//        array.push({});
//        array[i].id = data[i].DWBM;
//        array[i].text = data[i].DWMC;
//        if(data[i].NODE.length>0){
//            array[i].children = [];
//            treedata(array[i].children,data[i].NODE);
//        }
//    }
//}
//未通过审核关系列表
function WTGSHGXLB(){
    iceGetData(function (servicePrx) {
        //servicePrx.getAuditInfo(key, dwbm, BBBM, BBJB, Year, Month, null).then(z_databack1);
        servicePrx.getBatchAuditInfo(key, dwbm, BBBM, BBJB, Year, Month, null).then(z_databack1);
    });
    function z_databack1(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var b = ''
        $(function () {
            var a = '';
            var tablehead = '';
            var tablebody = '';
            var c = '</tbody></table>';
            var flag = true;
            var i = '0';

            $.each(_z_Data, function(name, value) {
                //                console.log(name)
                //                console.log(value)
                tablehead = '<div class="tablehead" style="width:100% height:20px;line-height:20px;color:#00C0FF;font-size:14px;margin-top:5px;margin-bottom:5px">' + TOPMC[i] + '</div>'
                tablebody = ' <table border="0" cellpadding="0" cellspacing="0" class="tablebody"><thead><tr><td>序号</td><td>审核关系</td></tr></thead><tbody id="SHGXtable' + name + '"></tbody>'
                a = '';
                for (var j = 0; j < value.length; j++) {
                    a += '<tr id="SHGXLB' + j + '"><td>' + (j + 1) + '</td><td style="cursor:pointer;" onclick="SHGXfun(\'' + name + '\',\'' + value[j].AUDITEXP + '\',' + j + ')">' + value[j].AUDITEXP + '</td></tr>'

                }

                b += tablehead + tablebody + a + c;
                i++;
            });

            $("#SHGXtable").html(b);
            //            for(var i=0;i<_z_Data.length;i++){
            //                if(_z_Data[i].AUDITEXP.indexOf('[')>-1 && _z_Data[i].AUDITEXP.indexOf(']')>-1){
            //                    if(flag){SHGX = _z_Data[i].AUDITEXP;flag = false;}
            //                    a += '<tr id="SHGXLB'+i+'"><td>'+(i+1)+'</td><td style="cursor: pointer;" onclick="SHGXfun(\''+_z_Data[i].AUDITEXP+'\','+i+')">'+_z_Data[i].AUDITEXP+'</td></tr>'
            //                }else {
            //                    a += '<tr><td>' + (i + 1) + '</td><td>' + _z_Data[i].AUDITEXP + '</td></tr>';
            //                }
            //            }
            //            return a;
        });
        $('#SHGXLB1').addClass('active');
        //获取审核结果
        iceGetData(function (servicePrx) {
            servicePrx.parseAudit(key,SHGX,BBBM,null).then(z_databack2);
        });
        function z_databack2(_z_Data) {
            $('#SHGXspan').html(SHGX);
            if(_z_Data == '[]'){
                $('#SHGXP').html('');
            }else{
                $('#SHGXP').html(_z_Data);
            }
        }
        iceGetData(function (servicePrx) {
            servicePrx.getCaseConstrant(key,Year,Month,BBJB,dwbm,BBID,SHGX).then(z_databack3);
        });
        function z_databack3(_z_Data){
            var LRdata = JSON.parse(_z_Data);
            FCAJ(LRdata);
        }
    }
}
//涉案关系
function SHGXfun(name,v,index){
    SHGX = (v?v:'');

    var even = baseTable.find(function (item) { return item.BM == name; });
	if(even == null){
		return;
	}
    BBID = even.REPID;
	
    $('#SHGXspan').html(v);
    //获取审核结果
    iceGetData(function (servicePrx) {
        servicePrx.parseAudit(key,SHGX,name,null).then(z_databack2);
    });
    function z_databack2(_z_Data){
        if(_z_Data == '[]'){
            $('#SHGXP').html('');
        }else{
            $('#SHGXP').html(_z_Data);
        }
    }
    $('#SHGXtable').children('tr').removeClass('active');
    $('#SHGXLB'+index).addClass('active');
    iceGetData(function (servicePrx) {
        servicePrx.getCaseConstrant(key, Year, Month, BBJB, dwbm, BBID, SHGX).then(z_databack3);
    });
    function z_databack3(_z_Data){
        var LRdata = JSON.parse(_z_Data);
        FCAJ(LRdata);
    }
}
//获取反差案件
function FCAJ(LRdata){
    //获取反差案件
    iceGetData(function (servicePrx) {
        servicePrx.getAuditCase(key, Year, Month, BBJB, dwbm, BBID, SHGX).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var aaa = '';
        if(_z_Data.length>0){
            LDATA = JSON.stringify(_z_Data[0].LDATA);
            RDATA = JSON.stringify(_z_Data[0].RDATA);
            $('#leftTableNum').html('('+_z_Data[0].LDATA.length+')');
            $('#rightTableNum').html('('+_z_Data[0].RDATA.length+')');
            $('#LDATA').html(function(){
                var a='';
               // LRdata[0].RDATA = "12312312312313";
                if(LRdata){
                    _z_Data[0].LDATA.forEach(function(v){
                        a += '<tr><td class="cursor" onclick="loadiframe(\''+v.BMSAH+'\',\''+aaa+'\',\''+LRdata[0].RDATA+'\',\'2\',\''+Year+'\',\''+Month+'\',\''+BBJB+'\',\''+dwbm+'\',\''+BBID+'\',\''+SHGX+'\',\'0\')">'+v.BMSAH+'</td><td>'+v.AJMC+'</td><td>'+v.XYRBH+'</td></tr>'
                    });
                }else{
                    _z_Data[0].LDATA.forEach(function(v) {
                        a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>';
                    });
                }
                return a;
            });
            $('#RDATA').html(function(){
                var a='';
               // LRdata[0].LDATA = "12312312312313";
                if(LRdata) {
                    _z_Data[0].RDATA.forEach(function (v) {
                        a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\',\''+aaa+'\',\'' + LRdata[0].LDATA + '\',\'2\',\''+Year+'\',\''+Month+'\',\''+BBJB+'\',\''+dwbm+'\',\''+BBID+'\',\''+SHGX+'\',\'1\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>'
                    });
                }else{
                    _z_Data[0].RDATA.forEach(function (v) {
                        a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>';
                    });
                }
                return a;
            });
        }else{
            $('#LDATA').html('');
            $('#RDATA').html('');
        }
    }
}

function suoyou(){
    iceGetData(function (servicePrx) {
        servicePrx.getCaseConstrant(key, Year, Month, BBJB, dwbm, BBID, SHGX).then(z_databack3);
    });
    function z_databack3(_z_Data){
        var LRdata = JSON.parse(_z_Data);
        FCAJ(LRdata);
    }
}
function chayi(){
    iceGetData(function (servicePrx) {
        servicePrx.getCaseConstrant(key, Year, Month, BBJB, dwbm, BBID, SHGX).then(z_databack3);
    });
    function z_databack3(_z_Data){
        var LRdata = JSON.parse(_z_Data);
        CYWJ(LRdata);
    }
}

function CYWJ(LRdata){
    iceGetData(function (servicePrx) {
        servicePrx.compareDifference(key,LDATA,RDATA).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        var aaa = '';
        LDATA = JSON.stringify(_z_Data[0].LDATA);
        RDATA = JSON.stringify(_z_Data[0].RDATA);
        $('#leftTableNum').html('('+_z_Data[0].LDATA.length+')');
        $('#rightTableNum').html('('+_z_Data[0].RDATA.length+')');
        $('#LDATA').html(function(){
            var a='';
            if(LRdata){
                _z_Data[0].LDATA.forEach(function(v){
                    a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\',\'' + aaa + '\',\'' + LRdata[0].RDATA + '\',\'2\',\'' + Year + '\',\'' + Month + '\',\'' + BBJB + '\',\'' + dwbm + '\',\'' + BBID + '\',\'' + SHGX + '\',\'0\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>'
                });
            }else{
                _z_Data[0].LDATA.forEach(function(v) {
                    a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>';
                });
            }
            return a;
        });
        $('#RDATA').html(function(){
            var a='';
            if(LRdata) {
                _z_Data[0].RDATA.forEach(function (v) {
                    a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\',\'' + aaa + '\',\'' + LRdata[0].LDATA + '\',\'2\',\'' + Year + '\',\'' + Month + '\',\'' + BBJB + '\',\'' + dwbm + '\',\'' + BBID + '\',\'' + SHGX + '\',\'1\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>'
                });
            }else{
                _z_Data[0].RDATA.forEach(function (v) {
                    a += '<tr><td class="cursor" onclick="loadiframe(\'' + v.BMSAH + '\')">' + v.BMSAH + '</td><td>' + v.AJMC + '</td><td>' + v.XYRBH + '</td></tr>';
                });
            }
            return a;
        });
    }
}
function checkData(){
    Year = $('#Year').combobox('getValue');
    Month = $('#Month').val();
    ZSCQAJChange();
    var tree = $('#basechartDW').combotree('tree');
    treenode = tree.tree('getSelected');
    dwbm = treenode.id;
    WTGSHGXLB();
    SHGXfun();
}

//导出Excel
function daochuExcel(){
    var date = new Date();
    var name = dwbm+'校验报告'+date.getFullYear()+''+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+'.xls';
    iceGetData(function (servicePrx) {
        servicePrx.exportAduitCase('',Year,Month,BBJB,dwbm,BBID,SHGX,LDATA,RDATA,iispath+'//sjjybg//'+name).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        if(_z_Data){
            alert('输出成功！');
            frameObject.DownFiles("http://"+ip+':'+port+"/sjjybg/"+name+"");
        }else{
            alert('输出失败！');
        }
    }
}
//$("#ZSCQAJ").combobox({
//    valueField:'id',    

//})