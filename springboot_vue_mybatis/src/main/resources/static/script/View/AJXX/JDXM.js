$(document).ready(function () {
    $('.trys').treegrid({
        url: 'treegrid_data1.json',
        method: 'get',
        fit: true,
        fitColumns: true,
        border: false,
        singleSelect: false,
        rownumbers: false,
        idField: 'id',
        treeField: 'name',
        columns: [[
                { title: '选择', field: '', checkbox: true},
                { title: '监督项目', field: 'name', width: 180},
                { field: '依据条款', title: 'Persons', width: 60 }
            ]]
    });
    $('.table_jdxm tr:even').addClass('even');
    $('.table_jdxm tr:odd').addClass('odd');
});