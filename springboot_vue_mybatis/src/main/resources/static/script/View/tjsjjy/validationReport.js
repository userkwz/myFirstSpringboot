//@ sourceURL=validationReport.js

var tablestart = [];
var baogao = true;
var KStime = '';
var JStime = '';
var YWData = [];
var adate = new Date();
var d = adate.getFullYear()+"-"+(adate.getMonth())+"-"+1;
var f = adate.getFullYear()+"-"+(adate.getMonth()+1)+"-"+adate.getDate();
KStime = d;
JStime = f;

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

$(function () {
    //日期设置格式
    //设置部门
    //$("#DDBMBM").combotree({
    //    method: 'get',
    //    lines: true,
    //    url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode
    //})
    $('#validationBeginTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            KStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    $('#validationEndTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            JStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    $('#validationBeginTime').datebox('setValue', d);
    $('#validationEndTime').datebox('setValue', f);
    // 单位编码ComboTree初始化
    $('#validationDW').combotree({
        method: 'get',
        lines: true,
        url: '/Handler/agxe/agxeHandler.ashx?action=GetDwbmTree1&dwbm=' + unitCode,
        onLoadSuccess: function () {
            $('#validationDW').combotree('setValue', unitCode);
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
        servicePrx.getRuleInfo().then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        console.log(_z_Data);
        $('#XZGZ').html(function () {
            var YW = '<option value="">全部</option>';
            for (var i = 0; i < _z_Data.length; i++) {
                YW += '<option value="' + _z_Data[i].ID + '">' + _z_Data[i].MC + '</option>';
            }
            return YW;
        });
    }

    iceGetData(function (servicePrx) {
        servicePrx.getYWList().then(z_databack2);
    });
    function z_databack2(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        console.log(_z_Data);
        YWData = _z_Data;
        $('#YWLB').html(function () {
            var YW = '<option value="">全部</option>';
            for (var i = 0; i < _z_Data.length; i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
    }

    iceGetData(function (servicePrx) {
        servicePrx.latestValidateReport(key, unitCode, '', '', '', '', '', '', KStime, JStime, null).then(z_databack);
    });
    function z_databack(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);
        $('#YWLB').css('display', 'none');
        $('.YWLB').css('display', 'none');
        ZXBGtableData(_z_Data);
    }

});

function showemail(ywmc){
    var tree = $('#validationDW').combotree('tree');
    var url = tree.tree('getSelected');
    // var DWMC = frameObject.GetUserInfo();
    frameObject.OpenDialogWeb(2,
        baseUrl + sendMailUrl +
        '?key=' + key +
        '&dwbm=' + unitCode +
        '&cbdwmc=' + url.text +
        '&ywmc='+ ywmc +
        '&sendMail=5' ,
        '','','发送邮件',''
    );
}

//最新报告表格数据
function ZXBGtableData(_z_Data){
    $('#ywdiv').html(function(){
        var d = '';
        for(var i=0;i<_z_Data.length;i++){
            var object=[];
            for(var o in _z_Data[i]) object.push(o);
            for(var h=0;h<object.length;h++){
                var a = '';
                var b = '';
                var c = '';
                tablestart.push({});
                var fun = "table"+h;
                // <span onclick="exportTable('+YWData[h].YWBM+')" style="font-size: 14px;color: #000;float: right;text-decoration: underline;cursor: pointer">输出Excel</span>
                a = '<div class="validationReport-yw"><div onclick="showywTable('+h+')"><span style="margin-left: 50px">'+object[h]+'('+_z_Data[i][object[h]].length+')'+'</span><i class="more-icon more-icon'+h+'"></i>' +
                    //'<img title="发送邮件" style="float: right;margin-top: 9px;cursor: pointer" onclick="showemail(\'' + object[h] + '\')" src="images/tjsjjy/email.png">' +
                    '</div>' +
                    '<div class="validationReport-yw-table"><table border="0" cellpadding="0" cellspacing="0" id="table'+h+'" style="table-layout: fixed;line-height: initial;"><thead><tr>' +
                    '<td>部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td>规则名称</td><td>规则内容</td><td>审核状态</td></tr></thead><tbody>';
                for(var p=0;p<_z_Data[i][object[h]].length;p++){
                    if(_z_Data[i][object[h]][p].SHZT == '拒绝'){
                        b += '<tr class="redTd"><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                            '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
							'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                    }else if(_z_Data[i][object[h]][p].SHZT == '同意'){
                        b += '<tr class="greenTd"><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                            '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
							'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                    }else{
					//
                        b += '<tr><td class="cursor"  onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                            '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
							'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                    }
                }
                c = '</tbody></table></div></div>';
                d += a+b+c;
            }
        }
        return d;
    });
}
//历史报告表格数据
function LSBGtableData(_z_Data){
    $('#lsbgtr').html(function(){
        var b = '';
        for(var i=0;i<_z_Data.length;i++){
            var object=[];
            for(var o in _z_Data[i]) object.push(o);
            for(var h=0;h<object.length;h++){
                for(var p=0;p<_z_Data[i][object[h]].length;p++){
                    if(_z_Data[i][object[h]][p].SHZT == '拒绝'){
                        b += '<tr class="redTd"><td>'+object[h]+'</td><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                            '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
                            '<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                    }else{
                        b += '<tr><td>'+object[h]+'</td><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                            '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
                            '<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
                            '<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                    }
                }
            }
        }
        return b;
    });
}

function change(v){
    if(v == 0){
        baogao = true;
        //最新
        $('#YWLB').css('display','none');
        $('.YWLB').css('display','none');
        $('#ywdiv').css('display','block');
        $('#new').addClass('reportavtive');
        $('#old').removeClass('reportavtive');
        $('#lsbg').css('display','none');
        $('#luz').css('display','none');
        $('#xsgd').css('display','none');
        $('#search').css('display','none');
        $('#search1').css('display','none');
        $('#sendEmail').css('display', 'none');
        var tree = $('#validationDW').combotree('tree');
        var node = tree.tree('getSelected');
        if(!node) node = '';
        var id = !!node.id?node.id:unitCode;
        iceGetData(function (servicePrx) {
            servicePrx.latestValidateReport(key,id,'',XZGZ,SHZT,BMSAH,AJMC,CBR,KStime,JStime,null).then(z_databack);
        });
        function z_databack(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            console.log(_z_Data);
            var d = '';
            $('#ywdiv').html(function(){
                for(var i=0;i<_z_Data.length;i++){
                    var object=[];
                    for(var o in _z_Data[i]) object.push(o);
                    for(var h=0;h<object.length;h++){
                        var a = '';
                        var b = '';
                        var c = '';
                        tablestart.push({});
                        var fun = "table"+h;
                        // <span onclick="exportTable('+YWData[h].YWBM+')" style="font-size: 14px;color: #000;float: right;text-decoration: underline;cursor: pointer">输出Excel</span>
                        a = '<div class="validationReport-yw"><div onclick="showywTable('+h+')"><span style="margin-left: 50px">'+object[h]+'('+_z_Data[i][object[h]].length+')'+'</span><i class="more-icon more-icon'+h+'"></i>' +
                            //'<img title="发送邮件" style="float: right;margin-top: 9px;cursor: pointer" onclick="showemail(\'' + object[h] + '\')" src="images/tjsjjy/email.png">' +
                            '</div>' +
                            '<div class="validationReport-yw-table"><table border="0" cellpadding="0" cellspacing="0" id="table'+h+'" style="table-layout: fixed;line-height: initial;"><thead><tr>' +
                            '<td>部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td>规则名称</td><td>规则内容</td><td>审核状态</td></tr></thead><tbody>';
                        for(var p=0;p<_z_Data[i][object[h]].length;p++){
                            if(_z_Data[i][object[h]][p].SHZT == '拒绝'){
                                b += '<tr class="redTd"><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }if(_z_Data[i][object[h]][p].SHZT == '同意'){
                                b += '<tr class="greenTd"><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }else{
                                b += '<tr><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }
                        }
                        c = '</tbody></table></div></div>';
                        d += a+b+c;
                    }
                }
                return d;
            });
        }
    }
    else{
        baogao = false;
        //历史
        $('#YWLB').css('display','inline-block');
        $('.YWLB').css('display','inline-block');
        $('#ywdiv').css('display','none');
        $('#new').removeClass('reportavtive');
        $('#old').addClass('reportavtive');
        $('#lsbg').css('display','block');
        $('#luz').css('display','block');
        $('#xsgd').css('display','block');
        $('#search').css('display','inline-block');
        $('#search1').css('display', 'inline-block');
        $('#sendEmail').css('display', 'inline-block');
        var tree = $('#validationDW').combotree('tree');
        var node = tree.tree('getSelected');
        if(!node) node = '';
        var id = !!node.id?node.id:unitCode;
        iceGetData(function (servicePrx) {
          servicePrx.latestValidateReport(key,id,YWLB,XZGZ,SHZT,BMSAH,AJMC,CBR,KStime,JStime,null).then(z_databack2);
        });
        function z_databack2(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            console.log(_z_Data);
            $('#lsbgtr').html(function(){
                var b = '';
                for(var i=0;i<_z_Data.length;i++){
                    var object=[];
                    for(var o in _z_Data[i]) object.push(o);
                    for(var h=0;h<object.length;h++){
                        for(var p=0;p<_z_Data[i][object[h]].length;p++){
                            if(_z_Data[i][object[h]][p].SHZT == '拒绝') {
                                b += '<tr class="redTd"><td title="'+object[h]+'">'+object[h]+'</td><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }else if(_z_Data[i][object[h]][p].SHZT == '同意') {
                                b += '<tr class="greenTd"><td title="'+object[h]+'">'+object[h]+'</td><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }else{
                                b += '<tr><td title="'+object[h]+'">'+object[h]+'</td><td class="cursor" onclick="loadiframe(\''+_z_Data[i][object[h]][p].BMSAH+'\',\''+_z_Data[i][object[h]][p].CQRQ+'\')" title="'+_z_Data[i][object[h]][p].BMSAH+'">'+_z_Data[i][object[h]][p].BMSAH+'</td>' +
                                    '<td title="'+_z_Data[i][object[h]][p].AJMC+'">'+_z_Data[i][object[h]][p].AJMC+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'">'+(_z_Data[i][object[h]][p].XYRXM?_z_Data[i][object[h]][p].XYRXM:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'">'+(_z_Data[i][object[h]][p].BMMC?_z_Data[i][object[h]][p].BMMC:"")+'</td>' +
                                    '<td title="'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'">'+(_z_Data[i][object[h]][p].CBR?_z_Data[i][object[h]][p].CBR:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'">'+(_z_Data[i][object[h]][p].RULENAME?_z_Data[i][object[h]][p].RULENAME:"")+'</td>' +
									'<td title="'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'">'+(_z_Data[i][object[h]][p].NR?_z_Data[i][object[h]][p].NR:"")+'</td>'+
									'<td title="'+_z_Data[i][object[h]][p].SHZT+'">'+_z_Data[i][object[h]][p].SHZT+'</td></tr>';
                            }
                        }
                    }
                }
                return b;
            });
        }
    }
}

function showywTable(v){
    if(!tablestart[v].start){
        $('.validationReport-yw-table')[v].style.display = 'block';
        $('.more-icon'+v).css('background-image','url("../images/tjsjjy/gengduo.png")');
        tablestart[v].start = true;
    }else{
        $('.validationReport-yw-table')[v].style.display = 'none';
        $('.more-icon' + v).css('background-image', 'url("../images/tjsjjy/gengduo1.png")');
        tablestart[v].start = false;
    }
}
var YWLB = '';
var XZGZ = '';
var SHZT = '';
var BMSAH = '';
var AJMC = '';
var CBR = '';
function search(){
    YWLB = $('#YWLB').val();
    XZGZ = $('#XZGZ').val();
    SHZT = $('#SHZT').val();
    BMSAH = $('#BMSAH').val();
    AJMC = $('#AJMC').val();
    CBR = $('#CBR').val();
    var tree = $('#validationDW').combotree('tree');
    var node = tree.tree('getSelected');
    if(!node) node = '';
    var id = !!node.id?node.id:unitCode;
    if($('#seachAll')[0].checked){
        iceGetData(function (servicePrx) {
            servicePrx.latestValidateReportPuls(key,id,YWLB,XZGZ,SHZT,BMSAH,AJMC,CBR,KStime,JStime,null).then(z_databack3);
        });
        function z_databack3(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            console.log(_z_Data);
            if(baogao){
                ZXBGtableData(_z_Data);
            }else{
                LSBGtableData(_z_Data);
            }
        }
    }else{
        iceGetData(function (servicePrx) {
            servicePrx.latestValidateReport(key,id,YWLB,XZGZ,SHZT,BMSAH,AJMC,CBR,KStime,JStime,null).then(z_databack3);
        });
        function z_databack3(_z_Data) {
            _z_Data = JSON.parse(_z_Data);
            if(baogao){
                ZXBGtableData(_z_Data);
            }else{
                LSBGtableData(_z_Data);
            }
        }
    }
}
//显示更多
function ShowMore(){
    $('#lsbg').css('height','auto');
}

function exportTableExcel(YWBM){
    var tree = $('#validationDW').combotree('tree');
    var node = tree.tree('getSelected');
    if(!node) node = '';
    var id = !!node.id?node.id:unitCode;

    var date = new Date();
    var name = id+'校验报告'+date.getFullYear()+''+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+'.xls';

    iceGetData(function (servicePrx) {
        servicePrx.exportReport(key,id,YWLB,XZGZ,SHZT,BMSAH,AJMC,CBR,KStime,JStime,iispath+'//sjjybg//'+name,null).then(z_databack3);
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
function exportTableWord(){
	var tree = $('#validationDW').combotree('tree');
	var node = tree.tree('getSelected');
	if(!node) node = '';
	var id = !!node.id?node.id:unitCode;
    var date = new Date();
	var path2 = id+'案卡规则分析报告'+date.getFullYear()+''+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+'.docx';
	iceGetData(function (servicePrx) {
        servicePrx.exportWord(key,id,path1,iispath+'//sjjybg//'+path2,KStime,JStime,null).then(z_databack);
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
