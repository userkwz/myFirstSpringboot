
$(function () {
    init_table()
    $("#excel").click(function () {
        var array = new Array();
        var clumns = $("#table").datagrid("options").columns;
        var header='[';
        for(var i=0;i<clumns[0].length;i++){
            header+=clumns[0][i].title+',';
            array.push(clumns[0][i].field);
        }
        var totalData = $("#table").datagrid("getRows");
        var objData = new Array();
        for(var i=0;i<totalData.length;i++){
            var data = totalData[i];
            var rowData = "*";
            for(var j=0;j<array.length;j++){
                rowData += ","+data[array[j]]
            }
            objData[i] = rowData;
        }
        var obj = new Object();
        obj.filename='部门筛选表';
        obj.header = header.substr(0,header.length-1)+']';
        obj.data=objData;

        $.ajax({
            type: 'post',
            url: getRootPath()+'/common/exportExcel',
            data: {
                json: JSON.stringify(obj)
            },
            dataType: "json",
            success: function (result) {
                alert("导出成功")
            }
        });
    })
})
function init_table() {
   $("#table").datagrid({
       border:0,
       fit:true,
       fitColumns: true,
       data:[{BMSAH:"wwg",AJMC:"fdfdsf"},{BMSAH:"wwg",AJMC:"fdfdsf"},{BMSAH:"wwg",AJMC:"fdfdsf"}],
       singleSelect: true,
       rownumbers: true,
       columns:[[
           {field:'BMSAH',title:'部门受案号',width:160 },
           {field:'AJMC',title:'案件名称',width:160}
       ]]
   })
}
