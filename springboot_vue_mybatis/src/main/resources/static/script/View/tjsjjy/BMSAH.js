//@ sourceURL=BMSAH.js
function pageData(data) {
    $('#page').pagination({
        total: data.total,
        pageSize: data.pageSize,
        pageNumber: data.pageNumber,
        layout: ['first', 'prev', 'manual', 'next', 'last'],
        displayMsg: '',
        onSelectPage: function(pageNumber) {
            var url = data.url;
            var DWBM = data.DWBM;
            var date = data.date;
            var index = data.index;
            var type = data.type;
            var islowdw = data.islowdw == null ? false : data.islowdw;
            iceGetData(function(servicePrx) {
                servicePrx.getAJList(key, DWBM, date, islowdw, type, data.pageSize, pageNumber).then(z_databack222);
            });

            function z_databack222(_z_Data) {
                _z_Data = JSON.parse(_z_Data);
                if (_z_Data && _z_Data.data && _z_Data.data.length > 0) {
                    var a = {
                        url: key,
                        DWBM: selectDwbm,
                        date: date,
                        type: type,
                        index: 0,
                        pageNumber: pageNumber,
                        pageSize: data.pageSize,
                        total: _z_Data.total,
                        islowdw: islowdw
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
    });
}

function loadiframe(BMSAH, date, LRDATA, showType, Year, Month, BBJB, dwbm, BBID, SHGX, Type) {
    if (showType == null) {
        showType = 0;
    }
    var nr = '';
    if (!!date == true) {
        iceGetData(function (servicePrx) {
            servicePrx.getCaseAkrule(key, BMSAH, date).then(z_databack);
        });

        function z_databack(_z_Data1) {
            nr = _z_Data1;
            openCase(BMSAH, nr == '' ? showType : 2, nr);
            //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + nr + '';
        }
    } else if (LRDATA) {
        if (Type) {
            iceGetData(function (servicePrx) {
                servicePrx.getAuditBpCase('', Year, Month, BBJB, dwbm, BBID, SHGX, BMSAH, Type).then(z_databack1);
            });

            function z_databack1(_z_Data5) {
                LRDATA = _z_Data5;
                openCase(BMSAH, 2, LRDATA);
                //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + LRDATA + '';
            }
        } else {
            openCase(BMSAH, 2, LRDATA);
            //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + LRDATA + '';
        }
    } else {
        openCase(BMSAH, showType);
        //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '';
    }
//    $('#modal').window('open');
//    $('#modal').panel({
//        href: 'View/tjsjjy/BMSAH.html',
//        onLoad: function () {
//            if (!!date == true) {
//                iceGetData(function (servicePrx) {
//                    servicePrx.getCaseAkrule({ dwbm: unitCode, uid: userId }, BMSAH, date).then(z_databack);
//                });

//                function z_databack(_z_Data1) {
//                    nr = _z_Data1;
//                    openCase(BMSAH, showType, nr);
//                    //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + nr + '';
//                }
//            } else if (LRDATA) {
//                if (Type) {
//                    iceGetData(function (servicePrx) {
//                        servicePrx.getAuditBpCase('', Year, Month, BBJB, dwbm, BBID, SHGX, BMSAH, Type).then(z_databack1);
//                    });

//                    function z_databack1(_z_Data5) {
//                        LRDATA = _z_Data5;
//                        openCase(BMSAH, showType, LRDATA);
//                        //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + LRDATA + '';
//                    }
//                } else {
//                    openCase(BMSAH, showType, LRDATA);
//                    //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + LRDATA + '';
//                }
//            } else {
//                openCase(BMSAH, showType);
//                //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '';
//            }
//        }
//    });
//    $('#BMSAHulDiv').css('display', 'none');
//    $('#iframe').css('width', '99%');
}

function loadiframe1(page, BMSAH, type, _z_Data, date, nr, showType, showDialog) {
    if (showType == null) {
        showType = 0;
    }
    $('#modal').window('open');
    $('#modal').panel({
        href: 'View/tjsjjy/BMSAH.html',
        onLoad: function () {
            if (!type) {
                if (showDialog) {
                    openCase(BMSAH, showType, nr);
                } else {
                    document.getElementById('iframe').src = 'View/BL/BL_AJPC_EASYUI/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + nr + '';
                }
                var a = '';
                $('#BMSAHul').html(function () {
                    for (var i = 0; i < _z_Data.length; i++) {
                        if (i == 0) {
                            a += '<li onclick="loadiframe2(\'' + _z_Data[i].BMSAH + '\',' + type + ',\'' + date + '\')">' + _z_Data[i].BMSAH + '</li>';
                        } else {
                            a += '<li onclick="loadiframe2(\'' + _z_Data[i].BMSAH + '\',' + type + ',\'' + date + '\')">' + _z_Data[i].BMSAH + '</li>';
                        }
                    }
                    return a;
                });
            } else {
                if (showDialog) {
                    openCase(BMSAH, showType);
                } else {
                    document.getElementById('iframe').src = 'View/BL/BL_AJPC_EASYUI/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '';
                }
                //openCase(BMSAH, showType);
                //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '';
                var a = '';
                $('#BMSAHul').html(function () {
                    for (var i = 0; i < _z_Data.length; i++) {
                        if (i == 0) {
                            a += '<li onclick="loadiframe2(\'' + _z_Data[i].BMSAH + '\',' + type + ')">' + _z_Data[i].BMSAH + '</li>';
                        } else {
                            a += '<li onclick="loadiframe2(\'' + _z_Data[i].BMSAH + '\',' + type + ')">' + _z_Data[i].BMSAH + '</li>';
                        }
                    }
                    return a;
                });
            }
            $('#BMSAHul>li').eq(0).addClass('activeli');
            $('#BMSAHul>li').click(function () {
                $(this).addClass('activeli');
                $('#BMSAHul>li').not(this).removeClass('activeli');
            });
            $('#BMSAHulDiv').css('display', 'block');
            $('#iframe').css('width', '85%');
            pageData(page);
        }
    });
}

function loadiframe2(BMSAH, type, date, showType, showDialog) {
    if (showType == null) {
        showType = 0;
    }
    if (showDialog == null) {
        showDialog = false;
    }
    var nr = '';
    if (type) {
        if (showDialog) {
            openCase(BMSAH);
        } else {
            document.getElementById('iframe').src = 'View/BL/BL_AJPC_EASYUI/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '';
        }
        //openCase(BMSAH);
        //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '';
    } else {
        iceGetData(function (servicePrx) {
            servicePrx.getCaseAkrule(key, BMSAH, date).then(z_databack);
        });
        function z_databack(_z_Data1) {
            nr = _z_Data1;
            if (showDialog) {
                openCase(BMSAH, showType, nr);
            } else {
                document.getElementById('iframe').src = 'View/BL/BL_AJPC_EASYUI/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + nr + '';
            }
            //openCase(BMSAH, showType, nr);
            //document.getElementById('iframe').src = 'View/BL/BL_AJPC/GaInfo1.htm?key=' + key + '&bmsah=' + BMSAH + '&showType=' + showType + '&nr=' + nr + '';
        }
    }
}