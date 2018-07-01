//@ sourceURL= ajxxpz.js
var data;
var outdata;
var v_col = 0;
var Tyyw_Bmsah;
var akname;

$(document).ready(function () {
        var url = new UrlSearch();
        Tyyw_Bmsah = url.bmsah;
        akname = url.akname;
    showInfo();
});

function showInfo() {
    akname = $('#gaxx_akxh').val();
   
//    $.ajax({
//        url: "http://192.168.1.59/WebService.asmx/getCases",
//                    type: "post",
//                    contentType: "application/json;charset=utf-8",
//                    dataType: "json",
//                    data: "{'cbdw_bm':'370000','zhxgsj':'2015/12/18 19:28:01'}",
//                    success: function(result) {
//                        alert(result.d);
//                    },
//                    error: function(e) {
//                        alert(e.responseText);
//                    }
//                });
    $.post('/Handler/BL/GAXXHandler.ashx?action=' + escape("GetAJJBXX") + '&bmsah=' + Tyyw_Bmsah + '&akname=' + akname,
                function (result) {
                    try {
                        var carddata = eval(result);
                        outdata = carddata[0].OutTabList;

                        for (var k = 0; k < outdata.length; k++) {
                            $("#" + outdata[k].Name + "ajTitle").remove();
                            //外层Tab
                            $("#gaxx_aj_tt").tabs('close', outdata[k].Title);

                            $("#gaxx_aj_tt").tabs('add', { id: outdata[k].Name, title: outdata[k].Title, closable: false });

                            //标题
                            var title = $("<div></div>");
                            title.addClass("gaxx_title");
                            title.attr("align", "center");
                            title.attr("id", outdata[k].Name + "ajTitle");
                            title.append(outdata[k].Title);

                            $("#" + outdata[k].Name).append(title);

                            var outContent;

                            if (outdata[k].SFFY) {
                                outContent = '<div id="' + outdata[k].Name + 'pp" class="easyui-pagination" style="margin-left:320px;"  data-options="showPageList: false,showRefresh: false,displayMsg:\' \'"></div>';
                            } else {
                                outContent = '';
                            }

                            $("#" + outdata[k].Name).append(outContent);

                            if (outdata[k].OutPageList.length > 0) {
                                data = outdata[k].OutPageList[0].TabList;

                                CreateInnerTab(data, k);
                            }
                        }

                        $('#gaxx_aj_tt').tabs('select', 0);

                        RegistEvent();

                        if (typeof (window.parent.CloseThisProgress) == "function") {
                            window.parent.CloseThisProgress();
                        }
                        else if (typeof (window.CloseThisProgress) == "function") {
                            window.CloseThisProgress();
                        }
                    } catch (e) {
                        if (typeof (window.parent.CloseThisProgress) == "function") {
                            window.parent.CloseThisProgress();
                        }
                        else if (typeof (window.CloseThisProgress) == "function") {
                            window.CloseThisProgress();
                        }
                    }
                });

}

//修改表格内容
function EditTable(da1, table, v_col) {
    for (var i = 0; i < da1.length; i++) {
        if (i == 0 || v_col >= 2) {
            v_col = 0;
            var row = $("<tr></tr>");
            table.append(row);
        }
        var td = $("<td></td>");
        td.addClass("dv-label");
        td.attr("style", "width:120px");
        td.append(da1[i].XSMC);

        var td2 = $("<td></td>");
        td2.addClass("dv-text");
        td2.attr("colspan", da1[i].COLS);
        td2.append(da1[i].VALUE);

        v_col = Number(v_col) + Number(da1[i].COLS);
        row.append(td);
        row.append(td2);
    }
}
//创建内部Tab页
function CreateInnerTab(da, index) {
    var content;

    for (var j = 0; j < da.length; j++) {

        if (da[j].SFFY) {
            content = '<div id="' + da[j].TabId + 'pp" class="easyui-pagination" style="margin-top:20px;margin-left:290px;"  data-options="showPageList: false,showRefresh: false,displayMsg:\' \'"></div>';
        }
        else {
            content = '';
        }

        var table = $("<table align=\"center\" border=\"0\"  cellpadding=\"5\"></table>")
        table.attr("id", da[j].TabId + "aj");
        table.addClass("dv-table");

        //内层Tab
        var InnerTab = $("<div></div>");
        InnerTab.attr("id", outdata[index].Name + "_InnerTab");

        $("#" + outdata[index].Name).append(InnerTab);

        $("#" + outdata[index].Name + "_InnerTab").tabs({
            tabPosition: "left",
            height: 600
        });

        $("#" + outdata[index].Name + "_InnerTab").tabs('close', da[j].TabName);
        $("#" + outdata[index].Name + "_InnerTab").tabs('add',
                            {
                                id: da[j].TabId,
                                title: da[j].TabName,
                                closable: false
                            });
        if (da[j].PageList.length > 0) {
            var da1 = da[j].PageList[0].FieldList;
            EditTable(da1, table, v_col);
            $("#" + da[j].TabId).append(table);
            $("#" + da[j].TabId).append(content);
        }
    }

    $("#" + outdata[index].Name + "_InnerTab").tabs('select', 0);
}
//修改内部Tab页内容
function EditInnerTabContent() {
    for (var s = 0; s < data.length; s++) {
        if (data[s].SFFY) {
            var dataCount=0;

            if (data[s].ISCZSJ) {
                dataCount=data[s].PageList.length * 10
            }
            else {
                dataCount = 0;
            }
            $("#" + data[s].TabId + "pp").pagination({
                total: dataCount,
                onSelectPage: function (pageNumber, pageSize) {
                    var outtab = $("#gaxx_aj_tt").tabs('getSelected');
                    var outindex = $("#gaxx_aj_tt").tabs('getTabIndex', outtab);
                    var tab = $("#" + outdata[outindex].Name + "_InnerTab").tabs('getSelected');
                    var index = $("#" + outdata[outindex].Name + "_InnerTab").tabs('getTabIndex', tab);
                    var da1 = data[index].PageList[pageNumber - 1].FieldList;
                    $("#" + data[index].TabId + "aj tr").remove();
                    var table = $("#" + data[index].TabId + "aj");

                    EditTable(da1, table, v_col);

                }
            });

        }
    }
}
function RegistEvent() {
    for (var l = 0; l < outdata.length; l++) {
        if (outdata[l].SFFY) {
            $("#" + outdata[l].Name + "pp").pagination({
                total: outdata[l].OutPageList.length * 10,
                onSelectPage: function (pageNumber, pageSize) {
                    var outtab = $("#gaxx_aj_tt").tabs('getSelected');
                    var outindex = $("#gaxx_aj_tt").tabs('getTabIndex', outtab);
                    var da = outdata[outindex].OutPageList[pageNumber - 1].TabList;
                    CreateInnerTab(da, outindex);
                    EditInnerTabContent();
                }
            });
        }
    }

    EditInnerTabContent();
}


