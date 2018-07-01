/**
 * Created by vv_vv on 2017/3/26.
 */

//@ sourceURL=AJXXXX.js
var KStime = '';
var JStime = '';
var state = 0;
$(function () {
    var url = new UrlSearch();
    state = url.state == null ? 0 : url.state;

    //日期设置格式
    $('#ajxxBeginTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            KStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + 01;
        }
    });
    $('#ajxxEndTime').datebox({
        currentText: '今天',
        closeText: '关闭',
        onSelect: function (date) {
            JStime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });
    iceGetData(function (servicePrx) {
        servicePrx.getYWList().then(z_databack2);
    });
    function z_databack2(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);

        $('#ajxxYWLB').html(function () {
            var YW = '<option value="">全部</option>';
            for (var i = 0; i < _z_Data.length; i++) {
                YW += '<option value="' + _z_Data[i].YWBM + '">' + _z_Data[i].YWMC + '</option>';
            }
            return YW;
        });
    }

    iceGetData(function (servicePrx) {
        servicePrx.getRuleInfo().then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);
        $('#ajxxXZGZ').html(function () {
            var YW = '<option value="">全部</option>';
            for (var i = 0; i < _z_Data.length; i++) {
                YW += '<option value="' + _z_Data[i].ID + '">' + _z_Data[i].MC + '</option>';
            }
            return YW;
        });
    }
});
function ajxxSearch() {
    var ajxxYWLB = $('#ajxxYWLB').val();
    var ajxxXZGZ = $('#ajxxXZGZ').val();
    var ajxxSHZT = $('#ajxxSHZT').val();
    var BMSAH = $('#BMSAH').val();
    var AJMC = $('#AJMC').val();
    var CBR = $('#CBR').val();

    iceGetData(function (servicePrx) {
        //servicePrx.latestValidateReport1("", unitCode, ajxxYWLB, ajxxXZGZ, ajxxSHZT, BMSAH, AJMC, CBR, KStime, JStime, null).then(z_databack3);
        servicePrx.getCaseList("", unitCode, ajxxYWLB, ajxxXZGZ, ajxxSHZT, BMSAH, AJMC, CBR, KStime, JStime, state, null).then(z_databack3);
    });
    function z_databack3(_z_Data) {
        _z_Data = JSON.parse(_z_Data);
        //console.log(_z_Data);

        $('#lsbgtr').html(function () {
            var a = '<thead> <tr><td width="50px">序号</td><td>部门名称</td><td width="235px">部门受案号</td><td>案件名称</td><td>嫌疑人姓名</td><td>承办部门</td><td>承办人</td><td width="20%">规则名称</td><td width="25%">规则内容</td><td>审核状态</td> </tr> </thead> <tbody>';
            var b = '';
            for (var i = 0; i < _z_Data.length; i++) {
                b += '<tr>' +
                    '<td title="' + (i + 1) + '">' + (i + 1) + '</td>' +
                    '<td title="' + _z_Data[i].DWMC + '">' + _z_Data[i].DWMC + '</td><td class="cursor" onclick="loadiframe(\'' + _z_Data[i].BMSAH + '\')" title="' + _z_Data[i].BMSAH + '">' + _z_Data[i].BMSAH + '</td>' +
                    '<td title="' + _z_Data[i].AJMC + '">' + _z_Data[i].AJMC + '</td><td title="' + _z_Data[i].XYRXM + '">' + _z_Data[i].XYRXM + '</td>' +
                    '<td title="' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '">' + (_z_Data[i].BMMC ? _z_Data[i].BMMC : "") + '</td>' +
                    '<td title="' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '">' + (_z_Data[i].CBR ? _z_Data[i].CBR : "") + '</td>' +
                    '<td title="' + _z_Data[i].RULENAME + '">' + _z_Data[i].RULENAME + '</td><td title="' + _z_Data[i].NR + '">' + _z_Data[i].NR + '</td>' +
                    '<td title="' + _z_Data[i].SHZT + '">' + _z_Data[i].SHZT + '</td></tr>';
            }
            var c = '</tbody>';
            b = a + b + c;
            return b;
        });

    }
}

//function backLastHtml() {
//    if ($('#backType').val() == "1") {
//        $('#con_href').panel({href:'View/tjsjjy/questionAnalysis.html'});
//    }
//    else {
//        $('#con_href').panel({ href: 'View/tjsjjy/unitAnalysis.html' });
//    }
//}